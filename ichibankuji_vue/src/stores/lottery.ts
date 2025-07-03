import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Lottery, LotteryConfig, DrawRecord, Prize, PrizeResult, LotteryStats } from '@/types/lottery'
import { LotteryEngine } from '@/utils/lottery-engine'
import { StorageManager } from '@/utils/storage'
import { ExportManager } from '@/utils/export'

export const useLotteryStore = defineStore('lottery', () => {
  // 状态
  const lotteries = ref<Lottery[]>([])
  const currentLottery = ref<Lottery | null>(null)
  const isDrawing = ref(false)
  const lastDrawResults = ref<PrizeResult[]>([])

  // 计算属性
  const currentStats = computed((): LotteryStats | null => {
    if (!currentLottery.value) return null

    const lottery = currentLottery.value
    const totalDraws = lottery.history.reduce((sum: number, record: DrawRecord) => sum + record.drawCount, 0)
    const remainingPrizes = LotteryEngine.getAvailablePrizes(lottery)
    const remainingCount = remainingPrizes.reduce((sum: number, prize: Prize) => sum + (prize.count || 0), 0)
    const completedBoxes = lottery.currentBox - 1
    const totalPrizeCount = lottery.prizes
      .filter((p: Prize) => !p.isLastPrize)
      .reduce((sum: number, prize: Prize) => sum + (prize.originalCount || prize.count || 0), 0)

    return {
      totalDraws,
      remainingPrizes,
      remainingCount,
      completedBoxes,
      totalPrizeCount
    }
  })

  const isCurrentLotteryCompleted = computed(() => {
    if (!currentLottery.value) return false
    return LotteryEngine.isLotteryCompleted(currentLottery.value)
  })

  const canMoveToNextBox = computed(() => {
    if (!currentLottery.value) return false
    return LotteryEngine.shouldMoveToNextBox(currentLottery.value)
  })

  // 操作方法
  const loadLotteries = (): void => {
    try {
      console.log('🔄 开始加载抽奖数据...')
      lotteries.value = StorageManager.loadLotteries()
      console.log('📊 抽奖数据加载完成，总数:', lotteries.value.length)
      console.log('📋 抽奖列表:', lotteries.value.map(l => ({ id: l.id, name: l.name })))
    } catch (error) {
      console.error('加载抽奖列表失败:', error)
      lotteries.value = []
    }
  }

  const saveLotteries = (): void => {
    try {
      StorageManager.saveLotteries(lotteries.value)
    } catch (error) {
      console.error('保存抽奖列表失败:', error)
      throw new Error('保存失败，请检查浏览器存储限制')
    }
  }

  const createLottery = (config: LotteryConfig): string => {
    const lotteryId = generateUUID()
    const now = new Date().toISOString()

    const processedPrizes = config.prizes.map((prize: Prize) => ({
      ...prize,
      id: prize.id || generateUUID(),
      originalCount: prize.count
    }))

    // 如果包含LAST赏，添加LAST赏奖项
    if (config.includeLastPrize && config.type === 'ichiban') {
      const lastPrizeName = config.lastPrizeName || 'LAST赏'
      processedPrizes.push({
        id: generateUUID(),
        level: lastPrizeName,
        description: `${lastPrizeName} - 每箱最后的惊喜大奖！`,
        isLastPrize: true,
        count: 1,
        originalCount: 1
      })
    }

    const lottery: Lottery = {
      id: lotteryId,
      name: config.name,
      type: config.type,
      totalBoxes: config.totalBoxes,
      includeLastPrize: config.includeLastPrize,
      lastPrizeName: config.lastPrizeName || 'LAST赏',
      prizes: processedPrizes,
      history: [],
      currentBox: 1,
      isCompleted: false,
      createdAt: now,
      updatedAt: now
    }

    lotteries.value.push(lottery)
    saveLotteries()
    
    console.log('🎯 抽奖创建成功:', { id: lotteryId, name: config.name })
    console.log('📦 抽奖已保存到数组，总数:', lotteries.value.length)
    
    return lotteryId
  }

  const loadLottery = (id: string): boolean => {
    console.log('🔍 正在加载抽奖:', id)
    console.log('📋 当前抽奖列表:', lotteries.value.map(l => ({ id: l.id, name: l.name })))
    
    const lottery = lotteries.value.find((l: Lottery) => l.id === id)
    if (lottery) {
      console.log('✅ 抽奖加载成功:', lottery.name)
      currentLottery.value = { ...lottery }
      return true
    }
    console.log('❌ 抽奖不存在，ID:', id)
    return false
  }

  const updateLottery = (updates: Partial<Lottery>): void => {
    if (!currentLottery.value) return

    Object.assign(currentLottery.value, updates, {
      updatedAt: new Date().toISOString()
    })

    // 更新原数组中的数据
    const index = lotteries.value.findIndex((l: Lottery) => l.id === currentLottery.value!.id)
    if (index >= 0) {
      lotteries.value[index] = { ...currentLottery.value }
      saveLotteries()
    }
  }

  const performDraw = async (count: number, drawerId: string = '匿名OTA'): Promise<PrizeResult[]> => {
    if (!currentLottery.value || isDrawing.value) {
      throw new Error('当前无有效抽奖或正在进行抽奖')
    }

    isDrawing.value = true
    lastDrawResults.value = []

    try {
      let results: PrizeResult[]

      if (currentLottery.value.type === 'ichiban') {
        results = LotteryEngine.performIchibanDraw(currentLottery.value, count, drawerId)
      } else {
        results = LotteryEngine.performProbabilityDraw(currentLottery.value, count, drawerId)
      }

      // 创建抽奖记录
      const record: DrawRecord = {
        id: generateUUID(),
        drawerId,
        drawCount: count,
        timestamp: new Date().toISOString(),
        results,
        boxNumber: currentLottery.value.currentBox
      }

      // 更新抽奖历史
      currentLottery.value.history.push(record)

      // 检查是否需要切换到下一箱
      if (LotteryEngine.shouldMoveToNextBox(currentLottery.value)) {
        moveToNextBox()
      }

      // 更新完成状态
      currentLottery.value.isCompleted = LotteryEngine.isLotteryCompleted(currentLottery.value)

      updateLottery({})
      lastDrawResults.value = results

      return results
    } catch (error) {
      console.error('抽奖执行失败:', error)
      throw error
    } finally {
      isDrawing.value = false
    }
  }

  const moveToNextBox = (): void => {
    if (!currentLottery.value) return

    currentLottery.value.currentBox++
    
    // 重置奖品数量为原始配置（除了LAST赏）
    currentLottery.value.prizes = currentLottery.value.prizes.map((prize: Prize) => ({
      ...prize,
      count: prize.isLastPrize ? prize.count : (prize.originalCount || prize.count)
    }))
  }

  const revokeLatestDraw = (): boolean => {
    if (!currentLottery.value || currentLottery.value.history.length === 0) {
      return false
    }

    const lastRecord = currentLottery.value.history[currentLottery.value.history.length - 1]
    
    // 检查是否跨箱撤销
    const wasLastRecordInCurrentBox = lastRecord.boxNumber === currentLottery.value.currentBox
    
    // 移除最后一条记录
    currentLottery.value.history.pop()

    // 如果撤销的是其他箱子的记录，需要回退箱子状态
    if (!wasLastRecordInCurrentBox && lastRecord.boxNumber) {
      handleBoxRollback(lastRecord.boxNumber)
    }

    // 重新计算完成状态
    currentLottery.value.isCompleted = LotteryEngine.isLotteryCompleted(currentLottery.value)

    updateLottery({})
    return true
  }

  const handleBoxRollback = (targetBox: number): void => {
    if (!currentLottery.value) return

    // 回退到目标箱子
    currentLottery.value.currentBox = targetBox

    // 重新计算该箱子的奖品状态
    const boxRecords = currentLottery.value.history.filter((record: DrawRecord) => 
      record.boxNumber === targetBox
    )

    // 从原始状态开始重新计算
    currentLottery.value.prizes = currentLottery.value.prizes.map((prize: Prize) => {
      if (prize.isLastPrize) return prize

      let consumed = 0
      boxRecords.forEach((record: DrawRecord) => {
        record.results.forEach((result: PrizeResult) => {
          if (result.prize.id === prize.id && !result.prize.isLastPrize) {
            consumed++
          }
        })
      })

      return {
        ...prize,
        count: Math.max(0, (prize.originalCount || 0) - consumed)
      }
    })
  }

  const resetLottery = (): void => {
    if (!currentLottery.value) return

    // 清空历史记录
    currentLottery.value.history = []
    currentLottery.value.currentBox = 1
    currentLottery.value.isCompleted = false

    // 重置奖品数量
    currentLottery.value.prizes = currentLottery.value.prizes.map((prize: Prize) => ({
      ...prize,
      count: prize.originalCount || prize.count
    }))

    updateLottery({})
  }

  const restartLottery = (): void => {
    if (!currentLottery.value) return

    // 保留历史记录，重置当前状态
    currentLottery.value.currentBox = 1
    currentLottery.value.isCompleted = false

    // 重置奖品数量
    currentLottery.value.prizes = currentLottery.value.prizes.map((prize: Prize) => ({
      ...prize,
      count: prize.originalCount || prize.count
    }))

    updateLottery({})
  }

  const deleteLottery = (id: string): void => {
    const index = lotteries.value.findIndex((l: Lottery) => l.id === id)
    if (index >= 0) {
      lotteries.value.splice(index, 1)
      saveLotteries()

      // 如果删除的是当前抽奖，清空当前状态
      if (currentLottery.value?.id === id) {
        currentLottery.value = null
      }
    }
  }

  const clearAllLotteries = (): void => {
    lotteries.value = []
    currentLottery.value = null
    StorageManager.clearAll()
  }

  const exportSnapshot = (): void => {
    try {
      if (!ExportManager.isDownloadSupported()) {
        ExportManager.showDownloadUnsupportedWarning()
        return
      }
      ExportManager.exportSnapshot(lotteries.value)
    } catch (error) {
      console.error('导出快照失败:', error)
      throw new Error('导出失败，请重试')
    }
  }

  const exportCurrentLotteryCSV = (): void => {
    if (!currentLottery.value) {
      throw new Error('当前没有加载任何抽奖')
    }

    try {
      if (!ExportManager.isDownloadSupported()) {
        ExportManager.showDownloadUnsupportedWarning()
        return
      }
      ExportManager.exportLotteryCSV(currentLottery.value)
    } catch (error) {
      console.error('导出CSV失败:', error)
      throw new Error('导出失败，请重试')
    }
  }

  const importSnapshot = (fileContent: string): void => {
    try {
      const importedLotteries = StorageManager.importSnapshot(fileContent)
      
      // 合并到现有抽奖列表（避免ID冲突）
      importedLotteries.forEach((lottery: Lottery) => {
        const existingIndex = lotteries.value.findIndex((l: Lottery) => l.id === lottery.id)
        if (existingIndex >= 0) {
          // 如果ID重复，生成新ID
          lottery.id = generateUUID()
        }
        lotteries.value.push(lottery)
      })

      saveLotteries()
    } catch (error) {
      console.error('导入快照失败:', error)
      throw error
    }
  }

  const updateDrawerId = (recordId: string, newDrawerId: string): void => {
    if (!currentLottery.value) return

    const record = currentLottery.value.history.find((r: DrawRecord) => r.id === recordId)
    if (record) {
      record.drawerId = newDrawerId
      updateLottery({})
    }
  }

  // 工具函数
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  return {
    // 状态
    lotteries,
    currentLottery,
    isDrawing,
    lastDrawResults,
    
    // 计算属性
    currentStats,
    isCurrentLotteryCompleted,
    canMoveToNextBox,
    
    // 操作方法
    loadLotteries,
    saveLotteries,
    createLottery,
    loadLottery,
    updateLottery,
    performDraw,
    moveToNextBox,
    revokeLatestDraw,
    resetLottery,
    restartLottery,
    deleteLottery,
    clearAllLotteries,
    exportSnapshot,
    exportCurrentLotteryCSV,
    importSnapshot,
    updateDrawerId
  }
}) 