import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Planner, Team, Activity, GanttTeamData, GanttTimeRange, TimeSlot } from '@/types/planner'

export const usePlannerStore = defineStore('planner', () => {
  // 状态
  const planners = ref<Planner[]>([])
  const currentPlanner = ref<Planner | null>(null)
  
  // 计算属性
  const currentTeams = computed(() => currentPlanner.value?.groups || [])
  const currentActivities = computed(() => currentPlanner.value?.activities || [])
  
  // 甘特图数据计算
  const ganttData = computed((): GanttTeamData[] => {
    console.log('🔍 计算甘特图数据...')
    
    if (!currentPlanner.value) {
      console.log('❌ 当前规划器为空')
      return []
    }
    
    console.log('📊 当前规划器:', {
      id: currentPlanner.value.id,
      name: currentPlanner.value.name,
      type: currentPlanner.value.type,
      groupsCount: currentPlanner.value.groups.length
    })
    
    const result = currentPlanner.value.groups.map((team: Team, index: number) => {
      console.log(`👥 处理团体 ${index + 1}:`, {
        id: team.id,
        name: team.name,
        activityId: team.activityId,
        liveSlots: team.liveSlots,
        tokutenSlots: team.tokutenSlots
      })
      
      const activity = currentPlanner.value?.activities.find((a: Activity) => a.id === team.activityId)
      console.log(`🎯 关联活动:`, activity)
      
      const liveBars = team.liveSlots.map((slot: TimeSlot) => {
        const startMinutes = timeToMinutes(slot.start)
        const endMinutes = timeToMinutes(slot.end)
        const duration = endMinutes - startMinutes
        
        console.log(`🎤 Live时间段:`, {
          start: slot.start,
          end: slot.end,
          startMinutes,
          endMinutes,
          duration,
          location: slot.location
        })
        
        return {
          startMinutes,
          duration,
          label: `${team.name} Live`,
          location: slot.location
        }
      })
      
      const tokutenBars = team.tokutenSlots.map((slot: TimeSlot) => {
        const startMinutes = timeToMinutes(slot.start)
        const endMinutes = timeToMinutes(slot.end)
        const duration = endMinutes - startMinutes
        
        console.log(`🤝 特典时间段:`, {
          start: slot.start,
          end: slot.end,
          startMinutes,
          endMinutes,
          duration,
          location: slot.location
        })
        
        return {
          startMinutes,
          duration,
          label: `${team.name} 特典`,
          location: slot.location
        }
      })
      
      return {
        team,
        activity,
        liveBars,
        tokutenBars
      }
    })
    
    console.log('✅ 甘特图数据计算完成:', result)
    return result
  })
  
  // 时间范围计算
  const timeRange = computed((): GanttTimeRange => {
    const allSlots = currentTeams.value.flatMap((team: Team) => 
      [...team.liveSlots, ...team.tokutenSlots]
    )
    
    if (allSlots.length === 0) {
      return { start: 8 * 60, end: 22 * 60 } // 默认8:00-22:00
    }
    
    const times = allSlots.flatMap((slot: TimeSlot) => [
      timeToMinutes(slot.start),
      timeToMinutes(slot.end)
    ])
    
    const minTime = Math.min(...times)
    const maxTime = Math.max(...times)
    
    // 添加一些边距
    return {
      start: Math.max(0, minTime - 30),
      end: Math.min(48 * 60, maxTime + 30) // 支持次日到早上8点（48小时制）
    }
  })
  
  // 操作方法
  const loadPlanners = (): void => {
    try {
      const data = localStorage.getItem('sansen_planners')
      planners.value = data ? JSON.parse(data) : []
    } catch (error) {
      console.error('加载规划器失败:', error)
      planners.value = []
    }
  }
  
  const savePlanners = (): void => {
    try {
      localStorage.setItem('sansen_planners', JSON.stringify(planners.value))
    } catch (error) {
      console.error('保存规划器失败:', error)
      throw new Error('保存失败，请检查浏览器存储限制')
    }
  }
  
  const createPlanner = (type: 'single' | 'multiple'): string => {
    const plannerId = 'planner_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    
    const planner: Planner = {
      id: plannerId,
      name: '',
      date: '',
      timezone: 'Asia/Shanghai',
      type,
      activities: [],
      groups: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    if (type === 'single') {
      planner.activityName = ''
      planner.location = ''
    }
    
    planners.value.push(planner)
    savePlanners()
    
    return plannerId
  }
  
  const loadPlanner = (id: string): boolean => {
    const planner = planners.value.find((p: Planner) => p.id === id)
    if (planner) {
      currentPlanner.value = planner
      
      // 向后兼容：如果规划器没有type字段，默认为single
      if (!planner.type) {
        planner.type = 'single'
        updatePlanner({})
      }
      
      return true
    }
    return false
  }
  
  const updatePlanner = (updates: Partial<Planner>): void => {
    if (!currentPlanner.value) return
    
    Object.assign(currentPlanner.value, updates, {
      updatedAt: new Date().toISOString()
    })
    
    // 单一活动模式下，同步活动名称和规划器名称
    if (currentPlanner.value.type === 'single' && updates.activityName) {
      currentPlanner.value.name = updates.activityName
    }
    
    // 更新planners数组中的对应项
    const index = planners.value.findIndex((p: Planner) => p.id === currentPlanner.value!.id)
    if (index >= 0) {
      planners.value[index] = currentPlanner.value
    }
    
    savePlanners()
  }
  
  const deletePlanner = (id: string): void => {
    planners.value = planners.value.filter((p: Planner) => p.id !== id)
    savePlanners()
  }
  
  const clearAllPlanners = (): void => {
    planners.value = []
    currentPlanner.value = null
    savePlanners()
  }
  
  const addActivity = (activity: Omit<Activity, 'id'>): Activity => {
    if (!currentPlanner.value) throw new Error('没有当前规划器')
    
    const newActivity: Activity = {
      ...activity,
      id: 'activity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }
    
    currentPlanner.value.activities.push(newActivity)
    updatePlanner({})
    
    return newActivity
  }
  
  const updateActivity = (activityId: string, updates: Partial<Activity>): void => {
    if (!currentPlanner.value) return
    
    const activity = currentPlanner.value.activities.find((a: Activity) => a.id === activityId)
    if (activity) {
      Object.assign(activity, updates)
      updatePlanner({})
    }
  }
  
  const deleteActivity = (activityId: string): void => {
    if (!currentPlanner.value) return
    
    // 删除活动
    currentPlanner.value.activities = currentPlanner.value.activities.filter((a: Activity) => a.id !== activityId)
    
    // 移除关联的团体
    currentPlanner.value.groups = currentPlanner.value.groups.filter((g: Team) => g.activityId !== activityId)
    
    updatePlanner({})
  }
  
  const addTeam = (team: Omit<Team, 'id'>): Team => {
    if (!currentPlanner.value) throw new Error('没有当前规划器')
    
    const newTeam: Team = {
      ...team,
      id: 'team_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }
    
    // 为单一活动模式设置默认的activityId
    if (currentPlanner.value.type === 'single') {
      newTeam.activityId = 'single-activity'
    } else if (currentPlanner.value.activities.length > 0 && !newTeam.activityId) {
      // 多活动模式下，如果没有指定activityId，默认关联第一个活动
      newTeam.activityId = currentPlanner.value.activities[0].id
    }
    
    currentPlanner.value.groups.push(newTeam)
    updatePlanner({})
    
    return newTeam
  }
  
  const updateTeam = (teamId: string, updates: Partial<Team>): void => {
    if (!currentPlanner.value) return
    
    const team = currentPlanner.value.groups.find((g: Team) => g.id === teamId)
    if (team) {
      Object.assign(team, updates)
      updatePlanner({})
    }
  }
  
  const deleteTeam = (teamId: string): void => {
    if (!currentPlanner.value) return
    
    currentPlanner.value.groups = currentPlanner.value.groups.filter((g: Team) => g.id !== teamId)
    updatePlanner({})
  }
  
  // 工具函数
  const formatTimeWithDay = (time: string, day: 'same' | 'next'): string => {
    if (day === 'next') {
      const [hours, minutes] = time.split(':').map(Number)
      const adjustedHours = hours + 24
      return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }
    return time
  }
  
  const parseFormattedTime = (formattedTime: string): { time: string; day: 'same' | 'next' } => {
    const [hours, minutes] = formattedTime.split(':').map(Number)
    if (hours >= 24) {
      return {
        time: `${(hours - 24).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        day: 'next'
      }
    }
    return {
      time: formattedTime,
      day: 'same'
    }
  }
  
  const validateTimeRange = (startTime: string, endTime: string): boolean => {
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)
    return startMinutes < endMinutes
  }
  
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }
  
  return {
    // 状态
    planners,
    currentPlanner,
    
    // 计算属性
    currentTeams,
    currentActivities,
    ganttData,
    timeRange,
    
    // 方法
    loadPlanners,
    savePlanners,
    createPlanner,
    loadPlanner,
    updatePlanner,
    deletePlanner,
    clearAllPlanners,
    addActivity,
    updateActivity,
    deleteActivity,
    addTeam,
    updateTeam,
    deleteTeam,
    
    // 工具函数
    formatTimeWithDay,
    parseFormattedTime,
    validateTimeRange,
    minutesToTime
  }
})

// 时间转换函数
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
} 