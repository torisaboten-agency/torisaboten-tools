import type { Lottery, LotterySnapshot } from '@/types/lottery'

/**
 * 本地存储工具类
 */
export class StorageManager {
  private static readonly STORAGE_KEY = 'ichibankuji_lotteries'
  private static readonly VERSION = '1.0.0'

  /**
   * 加载所有抽奖数据
   */
  static loadLotteries(): Lottery[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) {
        return []
      }

      const parsed = JSON.parse(data)
      
      // 版本兼容性处理
      if (Array.isArray(parsed)) {
        // 旧版本格式直接返回
        return parsed
      } else if (parsed.version && parsed.lotteries) {
        // 新版本格式
        return parsed.lotteries
      }

      return []
    } catch (error) {
      console.error('加载抽奖数据失败:', error)
      return []
    }
  }

  /**
   * 保存所有抽奖数据
   */
  static saveLotteries(lotteries: Lottery[]): void {
    try {
      const snapshot: LotterySnapshot = {
        version: this.VERSION,
        exportedAt: new Date().toISOString(),
        lotteries
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(snapshot))
    } catch (error) {
      console.error('保存抽奖数据失败:', error)
      throw new Error('保存失败，请检查浏览器存储限制')
    }
  }

  /**
   * 清空所有数据
   */
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  /**
   * 导入快照数据
   */
  static importSnapshot(snapshotData: string): Lottery[] {
    try {
      const parsed = JSON.parse(snapshotData)
      
      // 检查数据格式
      if (Array.isArray(parsed)) {
        // 旧版本格式
        return parsed
      } else if (parsed.version && parsed.lotteries) {
        // 新版本格式
        return parsed.lotteries
      } else {
        throw new Error('无效的快照格式')
      }
    } catch (error) {
      console.error('导入快照失败:', error)
      throw new Error('快照格式无效或数据损坏')
    }
  }

  /**
   * 检查存储空间使用情况
   */
  static getStorageUsage(): { used: number; available: number; percentage: number } {
    let used = 0
    let available = 0
    
    try {
      // 计算当前使用的存储空间
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length
        }
      }

      // 尝试估算可用空间（这是一个近似值）
      const testKey = '_test_storage_limit'
      let testSize = 1024 * 1024 // 1MB
      
      while (testSize > 0) {
        try {
          localStorage.setItem(testKey, 'x'.repeat(testSize))
          localStorage.removeItem(testKey)
          available = testSize
          break
        } catch {
          testSize = Math.floor(testSize * 0.8)
        }
      }

      const total = used + available
      const percentage = total > 0 ? Math.round((used / total) * 100) : 0

      return { used, available, percentage }
    } catch (error) {
      console.error('获取存储使用情况失败:', error)
      return { used: 0, available: 0, percentage: 0 }
    }
  }
} 