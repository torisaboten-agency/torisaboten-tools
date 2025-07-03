// 奖项信息
export interface Prize {
  id: string
  level: string           // 奖项等级 (A赏、B赏、C赏等)
  description: string     // 奖项描述
  count?: number          // 一番赏模式：每箱数量
  probability?: number    // 概率模式：获奖概率(0-100)
  isLastPrize?: boolean   // 是否为LAST赏
  originalCount?: number  // 原始配置数量，用于重置
}

// 抽奖结果
export interface PrizeResult {
  id: string
  prize: Prize
  timestamp: string
}

// 抽奖记录
export interface DrawRecord {
  id: string
  drawerId: string        // 抽奖者ID
  drawCount: number       // 抽奖次数
  timestamp: string       // 抽奖时间
  results: PrizeResult[]  // 抽奖结果
  boxNumber?: number      // 一番赏模式：箱子编号
}

// 抽奖配置
export interface LotteryConfig {
  name: string
  type: 'ichiban' | 'probability'
  totalBoxes: number      // 总箱数，0表示无限
  includeLastPrize: boolean
  lastPrizeName: string   // LAST赏名称
  prizes: Prize[]
}

// 抽奖实例
export interface Lottery {
  id: string
  name: string
  type: 'ichiban' | 'probability'
  totalBoxes: number
  includeLastPrize: boolean
  lastPrizeName: string   // LAST赏名称
  prizes: Prize[]
  history: DrawRecord[]
  
  // 运行时状态
  currentBox: number      // 当前箱子编号
  isCompleted: boolean    // 是否已完成
  
  // 元数据
  createdAt: string
  updatedAt: string
}

// 抽奖统计信息
export interface LotteryStats {
  totalDraws: number
  remainingPrizes: Prize[]
  remainingCount: number
  completedBoxes: number
  totalPrizeCount: number
}

// 导出快照格式
export interface LotterySnapshot {
  version: string
  exportedAt: string
  lotteries: Lottery[]
}

// 抽奖结果显示组件的Props
export interface DrawResultProps {
  results: PrizeResult[]
  isVisible: boolean
}

// 抽奖历史编辑事件
export interface EditDrawerEvent {
  recordId: string
  newDrawerId: string
} 