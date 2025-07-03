import type { Prize, PrizeResult, Lottery } from '@/types/lottery'

/**
 * 抽奖引擎 - 核心算法实现
 */
export class LotteryEngine {
  /**
   * 执行一番赏抽奖
   */
  static performIchibanDraw(lottery: Lottery, count: number, _drawerId: string): PrizeResult[] {
    const results: PrizeResult[] = []
    const availablePrizes = this.getAvailablePrizes(lottery)
    
    // 检查是否有足够的奖品
    const totalAvailable = availablePrizes.reduce((sum, prize) => sum + (prize.count || 0), 0)
    if (totalAvailable < count) {
      throw new Error(`当前箱子只剩余${totalAvailable}个奖品，无法抽取${count}个`)
    }
    
    for (let i = 0; i < count; i++) {
      const prize = this.drawSingleIchibanPrize(availablePrizes)
      if (prize) {
        const result: PrizeResult = {
          id: this.generateUUID(),
          prize: { ...prize },
          timestamp: new Date().toISOString()
        }
        results.push(result)
        
        // 减少对应奖品数量
        const targetPrize = availablePrizes.find(p => p.id === prize.id)
        if (targetPrize && targetPrize.count) {
          targetPrize.count--
        }
      }
    }
    
    // 检查是否触发LAST赏
    const remainingCount = availablePrizes.reduce((sum, prize) => sum + (prize.count || 0), 0)
    if (remainingCount === 0 && lottery.includeLastPrize) {
      const lastPrize = lottery.prizes.find(p => p.isLastPrize)
      if (lastPrize) {
        const lastResult: PrizeResult = {
          id: this.generateUUID(),
          prize: { ...lastPrize },
          timestamp: new Date().toISOString()
        }
        results.push(lastResult)
      }
    }
    
    return results
  }
  
  /**
   * 执行概率抽奖
   */
  static performProbabilityDraw(lottery: Lottery, count: number, _drawerId: string): PrizeResult[] {
    const results: PrizeResult[] = []
    
    for (let i = 0; i < count; i++) {
      const prize = this.drawSingleProbabilityPrize(lottery.prizes)
      if (prize) {
        const result: PrizeResult = {
          id: this.generateUUID(),
          prize: { ...prize },
          timestamp: new Date().toISOString()
        }
        results.push(result)
      }
    }
    
    return results
  }
  
  /**
   * 抽取单个一番赏奖品
   */
  private static drawSingleIchibanPrize(availablePrizes: Prize[]): Prize | null {
    // 过滤掉数量为0的奖品
    const validPrizes = availablePrizes.filter(prize => (prize.count || 0) > 0)
    
    if (validPrizes.length === 0) {
      return null
    }
    
    // 创建权重数组（每个奖品的数量就是其权重）
    const weightedPrizes: Prize[] = []
    validPrizes.forEach(prize => {
      for (let i = 0; i < (prize.count || 0); i++) {
        weightedPrizes.push(prize)
      }
    })
    
    // 随机选择
    const randomIndex = Math.floor(Math.random() * weightedPrizes.length)
    return weightedPrizes[randomIndex]
  }
  
  /**
   * 抽取单个概率奖品
   */
  private static drawSingleProbabilityPrize(prizes: Prize[]): Prize | null {
    const random = Math.random() * 100 // 0-100的随机数
    let cumulative = 0
    
    for (const prize of prizes) {
      cumulative += prize.probability || 0
      if (random <= cumulative) {
        return prize
      }
    }
    
    // 如果没有选中任何奖品（概率配置错误时的容错）
    return prizes[Math.floor(Math.random() * prizes.length)]
  }
  
  /**
   * 获取当前可用的奖品列表
   */
  static getAvailablePrizes(lottery: Lottery): Prize[] {
    const consumed = this.getConsumedPrizes(lottery)
    
    return lottery.prizes
      .filter(prize => !prize.isLastPrize) // 排除LAST赏
      .map(prize => {
        const consumedCount = consumed[prize.id] || 0
        const remainingCount = Math.max(0, (prize.count || 0) - consumedCount)
        
        return {
          ...prize,
          count: remainingCount
        }
      })
  }
  
  /**
   * 计算已消耗的奖品数量
   */
  static getConsumedPrizes(lottery: Lottery): Record<string, number> {
    const consumed: Record<string, number> = {}
    
    // 只计算当前箱子的消耗
    const currentBoxRecords = lottery.history.filter(record => 
      record.boxNumber === lottery.currentBox
    )
    
    currentBoxRecords.forEach(record => {
      record.results.forEach(result => {
        if (!result.prize.isLastPrize) {
          consumed[result.prize.id] = (consumed[result.prize.id] || 0) + 1
        }
      })
    })
    
    return consumed
  }
  
  /**
   * 检查抽奖是否完成
   */
  static isLotteryCompleted(lottery: Lottery): boolean {
    if (lottery.type === 'probability') {
      return false // 概率抽奖永远不会完成
    }
    
    // 一番赏模式：检查是否还有剩余奖品
    const availablePrizes = this.getAvailablePrizes(lottery)
    const totalRemaining = availablePrizes.reduce((sum, prize) => sum + (prize.count || 0), 0)
    
    return totalRemaining === 0
  }
  
  /**
   * 检查是否需要切换到下一箱
   */
  static shouldMoveToNextBox(lottery: Lottery): boolean {
    if (lottery.type === 'probability') {
      return false // 概率抽奖不需要切箱
    }
    
    return this.isLotteryCompleted(lottery) && 
           (lottery.totalBoxes === 0 || lottery.currentBox < lottery.totalBoxes)
  }
  
  /**
   * 生成UUID
   */
  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
} 