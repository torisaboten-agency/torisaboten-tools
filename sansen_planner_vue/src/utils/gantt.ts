import type { GanttTeamData, GanttTimeRange } from '@/types/planner'
import { getToolUrl, getToolSignature } from './url'
import { preloadLocalQRCode } from './qrcode'
import { isIPad, getDeviceType } from './device'
import logoSrc from '@/assets/logo.png'

export interface GanttOptions {
  width: number
  height: number
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
  colors: {
    live: string
    tokuten: string
    background: string
    text: string
    grid: string
    teamSeparator: string
  }
}

interface TimeBar {
  startMinutes: number
  duration: number
  label: string
  location?: string
  type: 'live' | 'tokuten'
}

/**
 * 绘制甘特图到容器
 */
export function drawGanttChart(
  container: HTMLElement,
  teamData: GanttTeamData[],
  timeRange: GanttTimeRange
): void {
  console.log('🎨 开始渲染甘特图...')
  console.log('📦 容器:', container)
  console.log('📊 团体数据:', teamData)
  console.log('⏰ 时间范围:', timeRange)
  console.log('📏 容器尺寸:', {
    width: container.clientWidth,
    height: container.clientHeight,
    offsetWidth: container.offsetWidth,
    offsetHeight: container.offsetHeight
  })
  
  if (!container) {
    console.error('❌ 甘特图容器为null')
    return
  }
  
  if (teamData.length === 0) {
    console.log('❌ 团体数据为空，显示空状态')
    container.innerHTML = '<div class="empty-gantt"><div class="empty-icon">📊</div><h3>暂无数据</h3><p>添加团体和时间安排后，甘特图将在这里显示</p></div>'
    return
  }
  
  console.log('✅ 开始生成甘特图HTML...')
  const ganttHTML = renderHtmlGanttChart(teamData, timeRange)
  console.log('📝 生成的HTML长度:', ganttHTML.length)
  console.log('📝 HTML内容预览:', ganttHTML.substring(0, 200) + '...')
  
  container.innerHTML = ganttHTML
  console.log('✅ 甘特图HTML已插入容器')
  
  // 检查插入后的实际内容
  setTimeout(() => {
    const actualContent = container.querySelector('.gantt-chart-content')
    if (actualContent) {
      console.log('✅ 甘特图内容已正确插入，实际尺寸:', {
        width: actualContent.clientWidth,
        height: actualContent.clientHeight
      })
    } else {
      console.error('❌ 甘特图内容未找到')
    }
  }, 100)
  
  // 绑定工具提示事件
  bindTooltipEvents(container)
  console.log('🎯 工具提示事件已绑定')
  
  // 添加移动端触摸拖动支持
  addTouchDragSupport(container)
  console.log('�� 移动端触摸拖动支持已添加')
}

/**
 * 渲染HTML甘特图
 */
function renderHtmlGanttChart(teamData: GanttTeamData[], timeRange: GanttTimeRange): string {
  const totalMinutes = timeRange.end - timeRange.start
  
  // 改进的像素比例计算，特别优化iPad体验
  const screenWidth = window.innerWidth || 800
  const deviceType = getDeviceType()
  const iPadDetected = isIPad()
  
  let minWidthBase: number
  let pixelsPerMinute: number
  
  if (deviceType === 'mobile' || screenWidth <= 768) {
    // 手机端：紧凑布局
    minWidthBase = 400
    pixelsPerMinute = Math.max(1.0, minWidthBase / totalMinutes)
  } else if (iPadDetected || deviceType === 'tablet') {
    // iPad/平板端：平衡的布局
    minWidthBase = Math.min(600, screenWidth * 0.8) // 动态调整，不超过屏幕宽度的80%
    pixelsPerMinute = Math.max(1.2, minWidthBase / totalMinutes)
  } else {
    // 桌面端：宽松布局
    minWidthBase = 800
    pixelsPerMinute = Math.max(1.5, minWidthBase / totalMinutes)
  }
  
  console.log('📱 设备和甘特图信息:', {
    screenWidth,
    deviceType,
    iPadDetected,
    minWidthBase,
    pixelsPerMinute,
    totalMinutes,
    calculatedWidth: totalMinutes * pixelsPerMinute
  })

  let html = `
    <div class="gantt-chart-content">
      ${renderGanttHeader(timeRange, pixelsPerMinute)}
      ${renderGanttBody(teamData, timeRange, pixelsPerMinute)}
    </div>
    <div id="gantt-tooltip" class="gantt-tooltip"></div>
  `

  return html
}

/**
 * 渲染甘特图头部（时间轴）
 */
function renderGanttHeader(timeRange: GanttTimeRange, pixelsPerMinute: number): string {
  const totalMinutes = timeRange.end - timeRange.start
  const totalWidth = totalMinutes * pixelsPerMinute

  let timeMarks = ''
  
  // 根据时间范围决定时间标记的间隔，与原版保持一致
  let interval = 60 // 默认1小时间隔
  if (totalMinutes <= 4 * 60) {
    interval = 30 // 4小时内用30分钟间隔
  } else if (totalMinutes <= 12 * 60) {
    interval = 60 // 12小时内用1小时间隔
  } else {
    interval = 120 // 12小时以上用2小时间隔
  }

  // 生成时间标记，使用百分比定位（与原版一致）
  for (let minutes = Math.ceil(timeRange.start / interval) * interval; 
       minutes <= timeRange.end; 
       minutes += interval) {
    const position = ((minutes - timeRange.start) / totalMinutes) * 100
    const timeLabel = minutesToTime(minutes)
    
    timeMarks += `
      <div class="gantt-time-mark" style="left: ${position}%;">
        ${timeLabel}
      </div>
    `
  }

  return `
    <div class="gantt-header">
      <div class="gantt-left-panel">团体</div>
      <div class="gantt-time-header" style="min-width: ${totalWidth}px;">
        ${timeMarks}
      </div>
    </div>
  `
}

/**
 * 渲染甘特图主体
 */
function renderGanttBody(teamData: GanttTeamData[], timeRange: GanttTimeRange, pixelsPerMinute: number): string {
  const totalMinutes = timeRange.end - timeRange.start
  const totalWidth = totalMinutes * pixelsPerMinute

  // 按活动分组
  const groupedData = groupTeamsByActivity(teamData)
  
  let bodyHTML = '<div class="gantt-body">'

  Object.entries(groupedData).forEach(([activityId, teams]) => {
    const activity = teams[0]?.activity
    
    // 活动头部（仅多活动模式）
    if (activityId !== 'single-activity' && activity) {
      bodyHTML += `
        <div class="gantt-row gantt-activity-header">
          <div class="gantt-left-panel">${activity.name}</div>
          <div class="gantt-timeline" style="width: ${totalWidth}px; background: #e3f2fd;">
            <div class="activity-location-text">${activity.location || ''}</div>
          </div>
        </div>
      `
    }

    // 团体行
    teams.forEach(teamData => {
      const timeBars = generateTimeBars(teamData, timeRange.start, pixelsPerMinute)
      
      bodyHTML += `
        <div class="gantt-row">
          <div class="gantt-left-panel">${teamData.team.name}</div>
          <div class="gantt-timeline" style="width: ${totalWidth}px;">
            ${timeBars}
          </div>
        </div>
      `
    })
  })

  bodyHTML += '</div>'
  return bodyHTML
}

/**
 * 生成时间条HTML
 */
function generateTimeBars(teamData: GanttTeamData, startMinutes: number, pixelsPerMinute: number): string {
  const allBars: TimeBar[] = [
    ...teamData.liveBars.map(bar => ({ ...bar, type: 'live' as const })),
    ...teamData.tokutenBars.map(bar => ({ ...bar, type: 'tokuten' as const }))
  ]

  // 检查重叠并调整位置
  const { hasOverlap, adjustedBars } = checkTimeOverlap(allBars)

  let barsHTML = ''
  adjustedBars.forEach(bar => {
    const left = (bar.startMinutes - startMinutes) * pixelsPerMinute
    const width = bar.duration * pixelsPerMinute
    let widthPercent = (bar.duration / ((startMinutes + 1440) - startMinutes)) * 100
    
    // 确保最小宽度
    const minWidth = 3
    if (widthPercent < minWidth) {
      widthPercent = minWidth
    }
    
    // 根据是否有重叠调整样式
    const heightClass = hasOverlap ? 'has-overlap' : ''
    const topOffset = hasOverlap && bar.type === 'tokuten' ? 'tokuten-overlap' : ''
    
    // 按原版逻辑确定显示文字，特典时间大于1小时都显示
    let displayText = ''
    const hasLocation = bar.location && bar.location.trim()
    const duration = bar.duration
    const startTime = minutesToTime(bar.startMinutes)
    const endTime = minutesToTime(bar.startMinutes + bar.duration)
    const timeText = `${startTime}-${endTime}`
    
    // 新的显示逻辑：特典时间大于60分钟或宽度足够时显示时间
    if (widthPercent > 15 || (bar.type === 'tokuten' && duration > 60)) {
      // 宽度足够或特典时间大于1小时：显示时间范围
      displayText = timeText
    } else if (widthPercent > 8) {
      // 中等宽度：只显示开始时间
      displayText = startTime
    } else {
      // 宽度太小：留空，通过颜色和tooltip区分
      displayText = ''
    }
    
    // 如果有地点且宽度足够，准备双行显示
    let locationHTML = ''
    if (hasLocation && widthPercent > 12) {
      locationHTML = `<div style="font-size: 9px; line-height: 1.1; margin-top: 2px; color: #4a5568;">@${bar.location}</div>`
    }
    
    // 生成tooltip文字
    const tooltipText = hasLocation ? 
      `${bar.type === 'live' ? 'Live演出' : '特典会'}: ${timeText} (${duration}分钟) @${bar.location}` :
      `${bar.type === 'live' ? 'Live演出' : '特典会'}: ${timeText} (${duration}分钟)`

    barsHTML += `
      <div 
        class="gantt-time-bar ${bar.type} ${heightClass} ${topOffset}"
        style="left: ${left}px; width: ${Math.max(width, 20)}px; height: 36px; line-height: 1; min-width: 20px;"
        data-tooltip="${tooltipText}"
        data-type="${bar.type}"
        data-duration="${duration}"
      >
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
          ${displayText}
          ${locationHTML}
        </div>
      </div>
    `
  })

  return barsHTML
}

/**
 * 检查时间重叠
 */
function checkTimeOverlap(bars: TimeBar[]): { hasOverlap: boolean; adjustedBars: TimeBar[] } {
  const liveSlots = bars.filter(bar => bar.type === 'live')
  const tokutenSlots = bars.filter(bar => bar.type === 'tokuten')
  
  let hasOverlap = false

  // 检查Live内部重叠
  for (let i = 0; i < liveSlots.length; i++) {
    for (let j = i + 1; j < liveSlots.length; j++) {
      const bar1 = liveSlots[i]
      const bar2 = liveSlots[j]
      
      if (bar1.startMinutes < bar2.startMinutes + bar2.duration && 
          bar2.startMinutes < bar1.startMinutes + bar1.duration) {
        hasOverlap = true
        break
      }
    }
    if (hasOverlap) break
  }

  // 检查特典内部重叠
  if (!hasOverlap) {
    for (let i = 0; i < tokutenSlots.length; i++) {
      for (let j = i + 1; j < tokutenSlots.length; j++) {
        const bar1 = tokutenSlots[i]
        const bar2 = tokutenSlots[j]
        
        if (bar1.startMinutes < bar2.startMinutes + bar2.duration && 
            bar2.startMinutes < bar1.startMinutes + bar1.duration) {
          hasOverlap = true
          break
        }
      }
      if (hasOverlap) break
    }
  }

  // 检查Live和特典之间的重叠
  if (!hasOverlap) {
    for (const liveBar of liveSlots) {
      for (const tokutenBar of tokutenSlots) {
        if (liveBar.startMinutes < tokutenBar.startMinutes + tokutenBar.duration && 
            tokutenBar.startMinutes < liveBar.startMinutes + liveBar.duration) {
          hasOverlap = true
          break
        }
      }
      if (hasOverlap) break
    }
  }

  return { hasOverlap, adjustedBars: bars }
}

/**
 * 按活动分组团体数据
 */
function groupTeamsByActivity(teamData: GanttTeamData[]): Record<string, GanttTeamData[]> {
  const groups: Record<string, GanttTeamData[]> = {}
  
  teamData.forEach(data => {
    const activityId = data.team.activityId || 'single-activity'
    if (!groups[activityId]) {
      groups[activityId] = []
    }
    groups[activityId].push(data)
  })
  
  return groups
}

/**
 * 分钟数转时间字符串
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours >= 24) {
    const nextDayHours = hours - 24
    return `次日${nextDayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * 绑定工具提示事件
 */
function bindTooltipEvents(container: HTMLElement): void {
  const tooltip = container.querySelector('#gantt-tooltip') as HTMLElement
  if (!tooltip) return

  // 获取甘特图容器的位置
  const ganttContainer = container.closest('.gantt-chart-container') as HTMLElement
  if (!ganttContainer) return
  
  const timeBars = container.querySelectorAll('.gantt-time-bar[data-tooltip]')
  
  timeBars.forEach(bar => {
    bar.addEventListener('mouseenter', (e) => {
      const target = e.target as HTMLElement
      const tooltipText = target.getAttribute('data-tooltip')
      
      if (tooltipText) {
        tooltip.textContent = tooltipText
        tooltip.classList.add('show')
        
        // 定位tooltip - 更贴近时间条
        const rect = target.getBoundingClientRect()
        const containerRect = ganttContainer.getBoundingClientRect()
        
        // 减少垂直偏移距离，让tooltip更贴近时间条
        tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`
        tooltip.style.top = `${rect.top - containerRect.top - 8}px` // 从-35改为-8
      }
    })
    
    bar.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show')
    })
  })
}

/**
 * 添加移动端触摸拖动支持
 */
function addTouchDragSupport(container: HTMLElement): void {
  const ganttContent = container.querySelector('.gantt-chart-content') as HTMLElement
  if (!ganttContent) return
  
  let isDragging = false
  let startX = 0
  let scrollLeft = 0
  
  // 鼠标事件（桌面端拖动支持）
  ganttContent.addEventListener('mousedown', (e) => {
    isDragging = true
    startX = e.pageX - ganttContent.offsetLeft
    scrollLeft = ganttContent.scrollLeft
    ganttContent.style.cursor = 'grabbing'
    e.preventDefault()
  })
  
  ganttContent.addEventListener('mouseleave', () => {
    isDragging = false
    ganttContent.style.cursor = 'grab'
  })
  
  ganttContent.addEventListener('mouseup', () => {
    isDragging = false
    ganttContent.style.cursor = 'grab'
  })
  
  ganttContent.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - ganttContent.offsetLeft
    const walk = (x - startX) * 2 // 增加拖动灵敏度
    ganttContent.scrollLeft = scrollLeft - walk
  })
  
  // 触摸事件（移动端拖动支持）
  ganttContent.addEventListener('touchstart', (e) => {
    isDragging = true
    startX = e.touches[0].pageX - ganttContent.offsetLeft
    scrollLeft = ganttContent.scrollLeft
  }, { passive: true })
  
  ganttContent.addEventListener('touchend', () => {
    isDragging = false
  }, { passive: true })
  
  ganttContent.addEventListener('touchmove', (e) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - ganttContent.offsetLeft
    const walk = (x - startX) * 1.5 // 移动端拖动灵敏度
    ganttContent.scrollLeft = scrollLeft - walk
  }, { passive: true })
}

/**
 * 导出甘特图为图片（含降级逻辑）
 */
export async function exportGanttAsImage(
  container: HTMLElement, 
  teamData: GanttTeamData[], 
  timeRange: GanttTimeRange,
  plannerName: string = '参战规划',
  plannerDate: string = ''
): Promise<void> {
  // 检查微信环境限制
  if (isWeChatBrowser()) {
    showAppWarningModal(`由于微信内置浏览器的限制，图片导出功能可能无法正常工作。<br>
      建议在外部浏览器中打开本页面以获得完整功能。<br><br>
      如需继续，您可以使用手机截图功能：<br>
      • iPhone：同时按住电源键+音量上键<br>
      • Android：同时按住电源键+音量下键`)
    return
  }

  try {
    // 创建canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('无法创建Canvas上下文')
    }

    // 设置canvas大小（增加底部脚注空间和顶部标题栏空间以及图例空间）
    const ganttRect = container.getBoundingClientRect()
    const headerHeight = 60 // 顶部标题栏高度
    const legendHeight = 40 // 图例区域高度
    const footerHeight = 80 // 脚注区域高度
    canvas.width = Math.max(1200, ganttRect.width)
    canvas.height = Math.max(600, ganttRect.height) + headerHeight + legendHeight + footerHeight

    // 填充白色背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制顶部标题栏（紫色渐变背景）
    const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    headerGradient.addColorStop(0, '#667eea')
    headerGradient.addColorStop(1, '#764ba2')
    
    ctx.fillStyle = headerGradient
    ctx.fillRect(0, 0, canvas.width, headerHeight)

    // 绘制标题文字（白色）
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${plannerName} - ${plannerDate}`, canvas.width / 2, headerHeight / 2 + 7)

    // 绘制图例
    drawLegend(ctx, canvas.width, headerHeight, legendHeight)

    // 重新绘制甘特图到canvas
    const ganttHeight = canvas.height - headerHeight - legendHeight - footerHeight
    drawGanttToCanvas(ctx, teamData, timeRange, canvas.width, headerHeight + legendHeight + 10, ganttHeight - 20)

    // 预加载二维码和logo
    const toolUrl = getToolUrl()
    
    try {
      const [qrImage, logoImage] = await Promise.all([
        preloadLocalQRCode(toolUrl, 60),
        loadLogoImage()
      ])
      
      // 绘制底部脚注条
      await drawFooter(ctx, canvas.width, canvas.height, footerHeight, qrImage, logoImage)
    } catch (error) {
      console.warn('图片资源加载失败，继续导出:', error)
      // 即使资源加载失败，也绘制脚注（不含图片）
      await drawFooter(ctx, canvas.width, canvas.height, footerHeight)
    }

    // 尝试多种下载方法
    await tryDownloadMethods(canvas, `${plannerName}_${plannerDate}.png`)

  } catch (error) {
    console.warn('Canvas导出失败：', error)
    showAppWarningModal('抱歉，您的浏览器不支持Canvas导出功能')
  }
}

/**
 * 绘制图例
 */
function drawLegend(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  startY: number,
  legendHeight: number
): void {
  const legendY = startY
  
  // 绘制图例背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, legendY, canvasWidth, legendHeight)
  
  // 绘制分隔线
  ctx.strokeStyle = '#e1e5e9'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, legendY + legendHeight)
  ctx.lineTo(canvasWidth, legendY + legendHeight)
  ctx.stroke()
  
  // 计算图例项的位置
  const legendItemHeight = 16
  const legendItemSpacing = 30
  const legendStartX = 30
  const legendCenterY = legendY + legendHeight / 2
  
  // Live演出图例
  ctx.fillStyle = '#A8D8B9'
  ctx.fillRect(legendStartX, legendCenterY - legendItemHeight / 2, legendItemHeight, legendItemHeight)
  ctx.strokeStyle = '#95C5A7'
  ctx.lineWidth = 1
  ctx.strokeRect(legendStartX, legendCenterY - legendItemHeight / 2, legendItemHeight, legendItemHeight)
  
  ctx.fillStyle = '#2d3748'
  ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Live演出', legendStartX + legendItemHeight + 8, legendCenterY + 5)
  
  // 特典会图例
  const tokutenX = legendStartX + legendItemHeight + 8 + ctx.measureText('Live演出').width + legendItemSpacing
  ctx.fillStyle = '#FEDFE1'
  ctx.fillRect(tokutenX, legendCenterY - legendItemHeight / 2, legendItemHeight, legendItemHeight)
  ctx.strokeStyle = '#FCC7CE'
  ctx.lineWidth = 1
  ctx.strokeRect(tokutenX, legendCenterY - legendItemHeight / 2, legendItemHeight, legendItemHeight)
  
  ctx.fillStyle = '#2d3748'
  ctx.fillText('特典会', tokutenX + legendItemHeight + 8, legendCenterY + 5)
}

/**
 * 加载logo图片
 */
function loadLogoImage(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    // 移除 crossOrigin 设置，因为logo是本地资源
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = logoSrc
  })
}

/**
 * 绘制底部脚注条
 */
async function drawFooter(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  footerHeight: number,
  qrImage?: HTMLImageElement,
  logoImage?: HTMLImageElement
): Promise<void> {
  const footerY = canvasHeight - footerHeight
  
  // 绘制紫色渐变背景
  const gradient = ctx.createLinearGradient(0, footerY, canvasWidth, footerY)
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, footerY, canvasWidth, footerHeight)
  
  // 绘制工具署名文本
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px Arial, sans-serif'
  ctx.textAlign = 'left'
  
  const signature = getToolSignature()
  const toolUrl = getToolUrl()
  
  const textX = 20
  const textY = footerY + 25
  
  // 绘制署名
  ctx.fillText(signature, textX, textY)
  
  // 绘制URL（小字体）
  ctx.font = '14px Arial, sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.fillText(toolUrl, textX, textY + 25)
  
  // 计算右侧元素的位置
  const qrSize = 60
  const logoSize = 50
  const spacing = 15 // 元素间距
  const rightMargin = 10
  
  let currentX = canvasWidth - rightMargin
  
  // 绘制二维码（如果存在）
  if (qrImage) {
    const qrX = currentX - qrSize
    const qrY = footerY + 10
    
    // 绘制二维码白色背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4)
    
    // 绘制二维码
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)
    
    currentX = qrX - spacing
  }
  
  // 绘制Logo（如果存在）
  if (logoImage) {
    const logoX = currentX - logoSize
    const logoY = footerY + (footerHeight - logoSize) / 2
    
    // 直接绘制Logo（透明背景）
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)
  }
}

/**
 * 在Canvas上绘制甘特图
 */
function drawGanttToCanvas(
  ctx: CanvasRenderingContext2D,
  teamData: GanttTeamData[],
  timeRange: GanttTimeRange,
  canvasWidth: number,
  startY: number,
  maxHeight?: number
): void {
  if (teamData.length === 0) {
    return
  }

  const startMinutes = timeRange.start
  const endMinutes = timeRange.end
  const totalMinutes = endMinutes - startMinutes
  
  const leftPanelWidth = 160
  const chartWidth = canvasWidth - leftPanelWidth - 40
  const rowHeight = 56
  const availableHeight = maxHeight || (ctx.canvas.height - startY)
  
  let currentY = startY + 30
  
  // 绘制时间轴
  ctx.strokeStyle = '#dadce0'
  ctx.fillStyle = '#5f6368'
  ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'center'
  
  const interval = totalMinutes <= 120 ? 15 : totalMinutes <= 240 ? 30 : 60
  for (let minutes = Math.ceil(startMinutes / interval) * interval; 
       minutes <= endMinutes; 
       minutes += interval) {
    const xPos = leftPanelWidth + 20 + (minutes - startMinutes) / totalMinutes * chartWidth
    const timeStr = minutesToTime(minutes)
    
    ctx.beginPath()
    ctx.moveTo(xPos, startY + 20)
    ctx.lineTo(xPos, startY + 30)
    ctx.stroke()
    
    ctx.fillText(timeStr, xPos, startY + 15)
  }
  
  // 按活动分组
  const groupedData = groupTeamsByActivity(teamData)
  
  Object.entries(groupedData).forEach(([activityId, teams]) => {
    const activity = teams[0]?.activity
    
    // 检查是否超出可用高度
    if (currentY + rowHeight > startY + availableHeight) {
      return // 跳过超出范围的内容
    }
    
    // 活动头部（仅多活动模式）
    if (activityId !== 'single-activity' && activity) {
      // 活动标题背景
      ctx.fillStyle = '#e3f2fd'
      ctx.fillRect(0, currentY, canvasWidth, 40)
      
      // 活动标题边框
      ctx.strokeStyle = '#bbdefb'
      ctx.lineWidth = 1
      ctx.strokeRect(0, currentY, canvasWidth, 40)
   
      // 活动标题文字
      ctx.fillStyle = '#1565c0'
      ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'left'
      const activityTitle = activity.location ? 
        `${activity.name} @ ${activity.location}` : 
        activity.name
      ctx.fillText(activityTitle, 20, currentY + 25)
      
      currentY += 48
    }

    // 团体行
    teams.forEach(teamDataItem => {
      // 检查是否超出可用高度
      if (currentY + rowHeight > startY + availableHeight) {
        return // 跳过超出范围的内容
      }
      
      // 团体行背景
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, currentY, canvasWidth, rowHeight)
      
      // 行分隔线
      ctx.strokeStyle = '#f1f3f4'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, currentY + rowHeight)
      ctx.lineTo(canvasWidth, currentY + rowHeight)
      ctx.stroke()
      
      // 左侧面板背景
      ctx.fillStyle = '#fafbfc'
      ctx.fillRect(0, currentY, leftPanelWidth, rowHeight)
      
      // 左侧面板分隔线
      ctx.strokeStyle = '#e1e5e9'
      ctx.beginPath()
      ctx.moveTo(leftPanelWidth, currentY)
      ctx.lineTo(leftPanelWidth, currentY + rowHeight)
      ctx.stroke()
     
      // 团体名
      ctx.fillStyle = '#5f6368'
      ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(teamDataItem.team.name, leftPanelWidth - 20, currentY + rowHeight/2 + 5)
      
      // 检查时间重叠
      const allBars = [
        ...teamDataItem.liveBars.map(bar => ({ ...bar, type: 'live' as const })),
        ...teamDataItem.tokutenBars.map(bar => ({ ...bar, type: 'tokuten' as const }))
      ]
      const { hasOverlap } = checkTimeOverlap(allBars)
      
      // Live时间条
      teamDataItem.liveBars.forEach(bar => {
        const barX = leftPanelWidth + 20 + (bar.startMinutes - startMinutes) / totalMinutes * chartWidth
        const barWidth = Math.max(20, bar.duration / totalMinutes * chartWidth)
        const barY = hasOverlap ? currentY + 4 : currentY + 10
        const barHeight = hasOverlap ? 28 : 36
        
        // 绘制矩形
        ctx.fillStyle = '#A8D8B9'
        ctx.fillRect(barX, barY, barWidth, barHeight)
        
        // 边框
        ctx.strokeStyle = '#95C5A7'
        ctx.lineWidth = 1
        ctx.strokeRect(barX, barY, barWidth, barHeight)
        
        // 文字
        if (barWidth > 60) {
          ctx.fillStyle = '#2d3748'
          ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          ctx.textAlign = 'center'
          const startTime = minutesToTime(bar.startMinutes)
          const endTime = minutesToTime(bar.startMinutes + bar.duration)
          const textY = bar.location && barWidth > 80 ? barY + barHeight/2 - 4 : barY + barHeight/2 + 4
          ctx.fillText(`${startTime}-${endTime}`, barX + barWidth / 2, textY)
          
          if (bar.location && barWidth > 80) {
            ctx.fillStyle = '#4a5568'
            ctx.font = '500 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            ctx.fillText(`@${bar.location}`, barX + barWidth / 2, barY + barHeight/2 + 8)
          }
        }
      })
      
      // 特典时间条
      teamDataItem.tokutenBars.forEach(bar => {
        const barX = leftPanelWidth + 20 + (bar.startMinutes - startMinutes) / totalMinutes * chartWidth
        const barWidth = Math.max(20, bar.duration / totalMinutes * chartWidth)
        const barY = hasOverlap ? currentY + 36 : currentY + 10
        const barHeight = hasOverlap ? 28 : 36
        
        // 绘制矩形
        ctx.fillStyle = '#FEDFE1'
        ctx.fillRect(barX, barY, barWidth, barHeight)
        
        // 边框
        ctx.strokeStyle = '#FCC7CE'
        ctx.lineWidth = 1
        ctx.strokeRect(barX, barY, barWidth, barHeight)
        
        // 文字
        if (barWidth > 60) {
          ctx.fillStyle = '#2d3748'
          ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          ctx.textAlign = 'center'
          const startTime = minutesToTime(bar.startMinutes)
          const endTime = minutesToTime(bar.startMinutes + bar.duration)
          const textY = bar.location && barWidth > 80 ? barY + barHeight/2 - 4 : barY + barHeight/2 + 4
          ctx.fillText(`${startTime}-${endTime}`, barX + barWidth / 2, textY)
          
          if (bar.location && barWidth > 80) {
            ctx.fillStyle = '#4a5568'
            ctx.font = '500 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            ctx.fillText(`@${bar.location}`, barX + barWidth / 2, barY + barHeight/2 + 8)
          }
        }
      })
      
      currentY += rowHeight
    })
  })
}

/**
 * 尝试多种下载方法
 */
async function tryDownloadMethods(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  // 方法1：尝试现代blob方式
  if (canvas.toBlob) {
    try {
      await new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob && tryBlobDownload(blob, filename)) {
            resolve()
          } else {
            reject(new Error('Blob下载失败'))
          }
        }, 'image/png')
      })
      return
    } catch (error) {
      console.warn('Blob方法失败：', error)
    }
  }
  
  // 方法2：尝试传统dataURL方式
  if (canvas.toDataURL) {
    try {
      const dataURL = canvas.toDataURL('image/png')
      if (tryDataURLDownload(dataURL, filename)) {
        return
      }
    } catch (error) {
      console.warn('DataURL方法失败：', error)
    }
  }
  
  // 方法3：显示图片让用户手动保存
  try {
    const dataURL = canvas.toDataURL('image/png')
    showImageModal(dataURL, '请长按下方图片选择"保存到相册"')
  } catch (error) {
    showAppWarningModal('抱歉，您的浏览器不支持图片导出功能。建议使用系统截图。')
  }
}

/**
 * 尝试Blob下载
 */
function tryBlobDownload(blob: Blob, filename: string): boolean {
  try {
    const link = document.createElement('a')
    const hasDownloadSupport = 'download' in link
    
    if (hasDownloadSupport && URL.createObjectURL) {
      const url = URL.createObjectURL(blob)
      link.href = url
      link.download = filename
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      return true
    }
    return false
  } catch (error) {
    console.warn('Blob下载异常：', error)
    return false
  }
}

/**
 * 尝试DataURL下载
 */
function tryDataURLDownload(dataURL: string, filename: string): boolean {
  try {
    const link = document.createElement('a')
    const hasDownloadSupport = 'download' in link
    
    if (hasDownloadSupport) {
      link.href = dataURL
      link.download = filename
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return true
    }
    return false
  } catch (error) {
    console.warn('DataURL下载异常：', error)
    return false
  }
}

/**
 * 检测是否为微信浏览器
 */
export function isWeChatBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('micromessenger')
}

/**
 * 在模态框中显示通用应用提示/警告
 */
export function showAppWarningModal(message: string, title: string = '提示'): void {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8); /* Slightly less dark for general warnings */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 20px;
    box-sizing: border-box;
  `
  
  const content = document.createElement('div')
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 90vw;
    max-height: 90vh;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    overflow-y: auto;
  `
  
  let innerHTML = `
    <div style="font-size: 1.8rem; margin-bottom: 1rem;">⚠️</div>
    <h3 style="margin: 0 0 1rem 0; color: #2d3748; font-size: 1.25rem;">${title}</h3>
    <p style="margin: 0 0 1.5rem 0; color: #4a5568; line-height: 1.6; font-size: 0.95rem;">
      ${message.replace(/\n/g, '<br>')}
    </p>
  `
  
  innerHTML += `
    <button onclick="this.closest('div[style*=position]').remove()" 
            style="background: #667eea; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer; margin-top: 1rem;">
      我知道了
    </button>
  `
  
  content.innerHTML = innerHTML
  modal.appendChild(content)
  document.body.appendChild(modal)
  
  // 点击模态框外部关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal)
    }
  })
}

/**
 * 在模态框中显示图片（最后的备用方案）
 */
function showImageModal(dataURL: string | null, message: string): void {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 20px;
    box-sizing: border-box;
  `
  
  const content = document.createElement('div')
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 90vw;
    max-height: 90vh;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    overflow-y: auto;
  `
  
  let innerHTML = `
    <div style="font-size: 2rem; margin-bottom: 1rem;">📱</div>
    <h3 style="margin: 0 0 1rem 0; color: #2d3748;">保存图片</h3>
    <p style="margin: 0 0 1.5rem 0; color: #4a5568; line-height: 1.5;">
      ${message}
    </p>
  `
  
  if (dataURL) {
    innerHTML += `
      <div style="margin: 1rem 0; max-width: 100%; overflow: hidden;">
        <img src="${dataURL}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
      </div>
      <p style="font-size: 0.875rem; color: #718096; margin: 1rem 0;">
        💡 长按上方图片，选择"保存到相册"或"下载图片"
      </p>
    `
  } else {
    innerHTML += `
      <div style="text-align: left; margin: 1rem 0; padding: 1rem; background: #f7fafc; border-radius: 8px; font-size: 0.9rem;">
        <strong>📱 建议使用截图：</strong><br>
        • iPhone：同时按住电源键+音量上键<br>
        • Android：同时按住电源键+音量下键<br>
        • 或使用浏览器的"截图"功能
      </div>
    `
  }
  
  innerHTML += `
    <button onclick="this.closest('div[style*=position]').remove()" 
            style="background: #667eea; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer; margin-top: 1rem;">
      关闭
    </button>
  `
  
  content.innerHTML = innerHTML
  modal.appendChild(content)
  document.body.appendChild(modal)
  
  // 点击模态框外部关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal)
    }
  })
} 