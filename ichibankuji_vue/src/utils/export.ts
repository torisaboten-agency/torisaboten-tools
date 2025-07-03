import type { Lottery, LotterySnapshot } from '@/types/lottery'

/**
 * 数据导出工具类
 */
export class ExportManager {
  /**
   * 导出抽奖快照为JSON文件
   */
  static exportSnapshot(lotteries: Lottery[]): void {
    const snapshot: LotterySnapshot = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      lotteries
    }

    const dataStr = JSON.stringify(snapshot, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `ichibankuji_snapshot_${timestamp}.json`
    
    this.downloadBlob(blob, filename)
  }

  /**
   * 导出单个抽奖的记录为CSV文件
   */
  static exportLotteryCSV(lottery: Lottery): void {
    const csvData = this.generateCSVData(lottery)
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const safeName = lottery.name.replace(/[^\w\u4e00-\u9fa5]/g, '_')
    const filename = `${safeName}_抽奖记录_${timestamp}.csv`
    
    this.downloadBlob(blob, filename)
  }

  /**
   * 生成CSV数据
   */
  private static generateCSVData(lottery: Lottery): string {
    const lines: string[] = []
    
    // 添加CSV头部信息
    lines.push('# Torisaboten 线下抽奖小助手 - 抽奖记录导出')
    lines.push(`# 抽奖名称: ${lottery.name}`)
    lines.push(`# 抽奖类型: ${lottery.type === 'ichiban' ? '一番赏' : '概率抽奖'}`)
    lines.push(`# 导出时间: ${new Date().toLocaleString('zh-CN')}`)
    lines.push('')
    
    // 添加统计信息
    const totalDraws = lottery.history.reduce((sum, record) => sum + record.drawCount, 0)
    const totalResults = lottery.history.reduce((sum, record) => sum + record.results.length, 0)
    
    lines.push('# 统计信息')
    lines.push(`# 总抽奖次数: ${totalDraws}`)
    lines.push(`# 总获奖数量: ${totalResults}`)
    lines.push('')

    // CSV表头
    if (lottery.type === 'ichiban') {
      lines.push('抽奖时间,抽奖者ID,箱子编号,奖项等级,奖项描述,是否LAST赏')
    } else {
      lines.push('抽奖时间,抽奖者ID,奖项等级,奖项描述,奖项概率(%)')
    }

    // 数据行
    lottery.history.forEach(record => {
      record.results.forEach(result => {
        const timestamp = new Date(result.timestamp).toLocaleString('zh-CN')
        const escapedDescription = this.escapeCSVField(result.prize.description)
        
        if (lottery.type === 'ichiban') {
          const isLast = result.prize.isLastPrize ? 'LAST赏' : '普通'
          lines.push(`${timestamp},${record.drawerId},${record.boxNumber || 1},${result.prize.level},${escapedDescription},${isLast}`)
        } else {
          lines.push(`${timestamp},${record.drawerId},${result.prize.level},${escapedDescription},${result.prize.probability || 0}`)
        }
      })
    })

    return lines.join('\n')
  }

  /**
   * 转义CSV字段中的特殊字符
   */
  private static escapeCSVField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`
    }
    return field
  }

  /**
   * 下载Blob数据为文件
   */
  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 清理URL对象
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  /**
   * 检查是否支持文件下载（微信环境检测）
   */
  static isDownloadSupported(): boolean {
    // 检查是否在微信内置浏览器中
    const ua = navigator.userAgent.toLowerCase()
    const isWeChat = ua.includes('micromessenger')
    
    // 微信环境下下载功能受限
    if (isWeChat) {
      return false
    }

    // 检查浏览器是否支持下载
    return !!(document.createElement('a').download !== undefined)
  }

  /**
   * 显示下载不支持的提示
   */
  static showDownloadUnsupportedWarning(): void {
    const ua = navigator.userAgent.toLowerCase()
    const isWeChat = ua.includes('micromessenger')
    
    if (isWeChat) {
      alert('检测到您在微信环境中，由于微信的安全限制，无法直接下载文件。\n\n建议：\n1. 点击右上角"···"菜单\n2. 选择"在浏览器打开"\n3. 然后重试下载功能')
    } else {
      alert('您的浏览器不支持文件下载功能，请升级到更新版本的浏览器。')
    }
  }
} 