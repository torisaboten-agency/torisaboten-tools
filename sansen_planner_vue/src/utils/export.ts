import type { Planner } from '@/types/planner'
import { getToolSignature, getToolUrl } from './url'

// 检测微信环境
export function isWeChat(): boolean {
  return /MicroMessenger/i.test(navigator.userAgent)
}

// 显示微信限制提示
export function showWeChatLimitation(fileType: string = '文件'): void {
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    padding: 20px;
    box-sizing: border-box;
  `
  
  const content = document.createElement('div')
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  `
  
  content.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">🚫</div>
    <h3 style="margin: 0 0 1rem 0; color: #e53e3e;">微信环境限制</h3>
    <p style="margin: 0 0 1.5rem 0; color: #4a5568; line-height: 1.5;">
      由于微信内置浏览器的安全限制，无法下载${fileType}。<br>
      请在外部浏览器中打开本页面。
    </p>
    <div style="text-align: left; margin: 1rem 0; padding: 1rem; background: #f0fff4; border-radius: 8px; border-left: 4px solid #48bb78;">
      <div style="font-weight: 600; color: #22543d; margin-bottom: 0.5rem;">📱 如何在外部浏览器打开：</div>
      <div style="font-size: 0.9rem; color: #2d5016; line-height: 1.4;">
        1. 点击右上角"···"菜单<br>
        2. 选择"在浏览器打开"<br>
        3. 在外部浏览器中使用完整功能
      </div>
    </div>
    <button onclick="this.parentElement.parentElement.remove()" 
            style="background: #48bb78; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem;">
      我知道了
    </button>
  `
  
  modal.appendChild(content)
  document.body.appendChild(modal)
  
  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })
}

// 导出ICS日历文件
export function exportToICS(planner: Planner): void {
  if (isWeChat()) {
    showWeChatLimitation('ICS日历文件')
    return
  }

  if (!planner.groups || planner.groups.length === 0) {
    alert('没有可导出的团体数据')
    return
  }

  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Torisaboten//Sansen Planner Vue//CN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${planner.name || '参战规划'}
X-WR-TIMEZONE:${planner.timezone || 'Asia/Shanghai'}
X-WR-CALDESC:偶活参战规划小助手生成的日历
`

  const plannerDate = planner.date || new Date().toISOString().split('T')[0]

  planner.groups.forEach(team => {
    // Live演出事件
    team.liveSlots.forEach(slot => {
      const eventId = `live-${team.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const startDateTime = formatICSDateTime(plannerDate, slot.start)
      const endDateTime = formatICSDateTime(plannerDate, slot.end)
      
      let eventTitle = `${team.name} - Live`
      if (planner.type === 'single' && planner.activityName) {
        eventTitle += ` - ${planner.activityName}`
      } else if (planner.type === 'multiple' && team.activityId) {
        const activity = planner.activities.find(a => a.id === team.activityId)
        if (activity) {
          eventTitle += ` - ${activity.name}`
        }
      }
      
      let location = ''
      if (slot.location) {
        if (planner.type === 'single' && planner.location) {
          location = `${planner.location} - ${slot.location}`
        } else if (planner.type === 'multiple' && team.activityId) {
          const activity = planner.activities.find(a => a.id === team.activityId)
          if (activity && activity.location) {
            location = `${activity.location} - ${slot.location}`
          } else {
            location = slot.location
          }
        } else {
          location = slot.location
        }
      } else {
        if (planner.type === 'single' && planner.location) {
          location = planner.location
        } else if (planner.type === 'multiple' && team.activityId) {
          const activity = planner.activities.find(a => a.id === team.activityId)
          if (activity && activity.location) {
            location = activity.location
          }
        }
      }
      
      let description = `Live演出时间: ${slot.start} - ${slot.end}\\n团体: ${team.name}`
      if (location) {
        description += `\\n地点: ${location}`
      }
      description += `\\n\\n${getToolSignature()}\\n${getToolUrl()}`

      icsContent += `
BEGIN:VEVENT
UID:${eventId}
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:${eventTitle}
DESCRIPTION:${description}`

      if (location) {
        icsContent += `
LOCATION:${location}`
      }

      icsContent += `
CREATED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
LAST-MODIFIED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SEQUENCE:0
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT`
    })

    // 特典会事件
    team.tokutenSlots.forEach(slot => {
      const eventId = `tokuten-${team.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const startDateTime = formatICSDateTime(plannerDate, slot.start)
      const endDateTime = formatICSDateTime(plannerDate, slot.end)
      
      let eventTitle = `${team.name} - 特典`
      if (planner.type === 'single' && planner.activityName) {
        eventTitle += ` - ${planner.activityName}`
      } else if (planner.type === 'multiple' && team.activityId) {
        const activity = planner.activities.find(a => a.id === team.activityId)
        if (activity) {
          eventTitle += ` - ${activity.name}`
        }
      }
      
      let location = ''
      if (slot.location) {
        if (planner.type === 'single' && planner.location) {
          location = `${planner.location} - ${slot.location}`
        } else if (planner.type === 'multiple' && team.activityId) {
          const activity = planner.activities.find(a => a.id === team.activityId)
          if (activity && activity.location) {
            location = `${activity.location} - ${slot.location}`
          } else {
            location = slot.location
          }
        } else {
          location = slot.location
        }
      } else {
        if (planner.type === 'single' && planner.location) {
          location = planner.location
        } else if (planner.type === 'multiple' && team.activityId) {
          const activity = planner.activities.find(a => a.id === team.activityId)
          if (activity && activity.location) {
            location = activity.location
          }
        }
      }
      
      let description = `特典会时间: ${slot.start} - ${slot.end}\\n团体: ${team.name}`
      if (location) {
        description += `\\n地点: ${location}`
      }
      description += `\\n\\n${getToolSignature()}\\n${getToolUrl()}`

      icsContent += `
BEGIN:VEVENT
UID:${eventId}
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:${eventTitle}
DESCRIPTION:${description}`

      if (location) {
        icsContent += `
LOCATION:${location}`
      }

      icsContent += `
CREATED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
LAST-MODIFIED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SEQUENCE:0
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT`
    })
  })

  icsContent += '\nEND:VCALENDAR'

  // 下载ICS文件
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${planner.name || '参战规划'}_${planner.date || '未命名'}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

// 格式化ICS日期时间
function formatICSDateTime(date: string, time: string): string {
  const timeMinutes = timeToMinutes(time)
  const hours = Math.floor(timeMinutes / 60)
  const minutes = timeMinutes % 60
  
  let targetDate = new Date(date)
  
  if (hours >= 24) {
    targetDate.setDate(targetDate.getDate() + Math.floor(hours / 24))
    const actualHours = hours % 24
    targetDate.setHours(actualHours, minutes, 0, 0)
  } else {
    targetDate.setHours(hours, minutes, 0, 0)
  }
  
  return targetDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

// 时间转分钟数
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
} 