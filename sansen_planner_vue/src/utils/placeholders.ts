/**
 * 获取当前日期格式化字符串 (YYYY/MM/DD)
 */
export function getCurrentDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${year}/${month}/${day}`
}

/**
 * 从数组中随机选择一个元素
 */
export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * 获取规划器名称placeholder
 */
export function getPlannerNamePlaceholder(): string {
  return `例：${getCurrentDateString()}参战规划`
}

/**
 * 获取活动名称placeholder
 */
export function getActivityNamePlaceholder(): string {
  const activities = [
    '@ JAM EXPO 2025',
    'TIF2025', 
    'ROCK IN JAPAN FESTIVAL 2025'
  ]
  return `例：${getRandomItem(activities)}`
}

/**
 * 获取活动地点placeholder
 */
export function getActivityLocationPlaceholder(): string {
  const locations = [
    '国営ひたち海浜公園',
    '蘇我スポーツ公園',
    '横浜アリーナ',
    '万代南梦宫上海文化中心',
    'SUMMER SPLASH スタジアム'
  ]
  return `例：${getRandomItem(locations)}`
}

/**
 * 获取团体名称placeholder
 */
export function getTeamNamePlaceholder(): string {
  const teams = [
    '花与心事Affloret',
    '她蝶效应Psychelles'
  ]
  return `例：${getRandomItem(teams)}`
} 