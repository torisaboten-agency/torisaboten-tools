<template>
  <div class="team-card">
    <div class="team-card-header" @click="toggleExpanded">
      <div class="team-info">
        <input 
          v-if="editingName"
          v-model="editName"
          @blur="saveTeamName"
          @keyup.enter="saveTeamName"
          @click.stop
          class="team-name-input"
          ref="nameInput"
        />
        <div v-else class="team-name-container">
          <h4 
            @dblclick="startEditName"
            class="team-name"
            :title="'双击编辑团体名称'"
          >
            {{ team.name }}
          </h4>
          <button 
            @click.stop="startEditName" 
            class="edit-name-btn"
            title="编辑团体名称"
          >
            ✏️
          </button>
        </div>
      </div>
      
      <div class="team-actions">
        <button 
          @click.stop="toggleExpanded" 
          class="expand-btn"
          :class="{ expanded: isExpanded }"
        >
          {{ isExpanded ? '▲' : '▼' }}
        </button>
        <button @click.stop="deleteTeam" class="delete-btn">
          🗑️
        </button>
      </div>
    </div>
    
    <!-- 时间段简要显示 -->
    <div v-if="!isExpanded" class="time-summary">
      <div class="time-chips">
        <span 
          v-for="(slot, index) in team.liveSlots" 
          :key="'live-' + index"
          class="time-chip live"
        >
          🎤 {{ formatTimeDisplay(slot.start) }}-{{ formatTimeDisplay(slot.end) }}
          <span v-if="slot.location" class="location">@{{ slot.location }}</span>
        </span>
        <span 
          v-for="(slot, index) in team.tokutenSlots" 
          :key="'tokuten-' + index"
          class="time-chip tokuten"
        >
          🤝 {{ formatTimeDisplay(slot.start) }}-{{ formatTimeDisplay(slot.end) }}
          <span v-if="slot.location" class="location">@{{ slot.location }}</span>
        </span>
        <!-- 未配置时段提示 -->
        <span 
          v-if="team.liveSlots.length === 0 && team.tokutenSlots.length === 0"
          class="time-chip no-slots"
        >
          ⚠️ 未配置时段
        </span>
      </div>
    </div>
    
    <!-- 展开的编辑区域 -->
    <div v-if="isExpanded" class="team-edit-area">
      <!-- Live演出时间段 -->
      <div class="time-section">
        <h5>🎤 Live演出时间段</h5>
        <div class="time-slots">
          <div 
            v-for="(slot, index) in extendedLiveSlots" 
            :key="'live-edit-' + index"
            class="time-slot-editor"
          >
            <div class="time-inputs-row">
              <span class="slot-label">Live {{ index + 1 }}:</span>
              
              <div class="time-line">
                <span class="time-prefix">从</span>
                <select 
                  v-model="slot.startDay" 
                  class="day-select"
                >
                  <option value="same">当日</option>
                  <option value="next">次日</option>
                </select>
                <input 
                  v-model="slot.startTime"
                  type="time" 
                  class="time-input"
                />
              </div>
              
              <div class="time-line">
                <span class="time-prefix">到</span>
                <select 
                  v-model="slot.endDay" 
                  class="day-select"
                >
                  <option value="same">当日</option>
                  <option value="next">次日</option>
                </select>
                <input 
                  v-model="slot.endTime"
                  type="time" 
                  class="time-input"
                />
              </div>
              
              <button 
                @click="removeTimeSlot('live', index)"
                class="remove-btn"
              >
                🗑️
              </button>
            </div>
            
            <div class="location-row">
              <label class="location-label">
                <input 
                  v-model="slot.locationEnabled"
                  type="checkbox"
                />
                指定地点
              </label>
              <input 
                v-if="slot.locationEnabled"
                v-model="slot.location"
                type="text"
                placeholder="Live地点"
                class="location-input"
              />
            </div>
          </div>
        </div>
        <button @click="addLiveSlot" class="add-slot-btn">
          + 添加Live时段
        </button>
      </div>
      
      <!-- 特典会时间段 -->
      <div class="time-section">
        <h5>🤝 特典会时间段</h5>
        <div class="time-slots">
          <div 
            v-for="(slot, index) in extendedTokutenSlots" 
            :key="'tokuten-edit-' + index"
            class="time-slot-editor"
          >
            <div class="time-inputs-row">
              <span class="slot-label">特典 {{ index + 1 }}:</span>
              
              <div class="time-line">
                <span class="time-prefix">从</span>
                <select 
                  v-model="slot.startDay" 
                  class="day-select"
                >
                  <option value="same">当日</option>
                  <option value="next">次日</option>
                </select>
                <input 
                  v-model="slot.startTime"
                  type="time" 
                  class="time-input"
                />
              </div>
              
              <div class="time-line">
                <span class="time-prefix">到</span>
                <select 
                  v-model="slot.endDay" 
                  class="day-select"
                >
                  <option value="same">当日</option>
                  <option value="next">次日</option>
                </select>
                <input 
                  v-model="slot.endTime"
                  type="time" 
                  class="time-input"
                />
              </div>
              
              <button 
                @click="removeTimeSlot('tokuten', index)"
                class="remove-btn"
              >
                🗑️
              </button>
            </div>
            
            <div class="location-row">
              <label class="location-label">
                <input 
                  v-model="slot.locationEnabled"
                  type="checkbox"
                />
                指定地点
              </label>
              <input 
                v-if="slot.locationEnabled"
                v-model="slot.location"
                type="text"
                placeholder="特典地点"
                class="location-input"
              />
            </div>
          </div>
        </div>
        <button @click="addTokutenSlot" class="add-slot-btn">
          + 添加特典时段
        </button>
      </div>

      <!-- 保存/取消按钮 -->
      <div class="edit-actions">
        <button @click="saveChanges" class="save-btn">
          ✓ 保存修改
        </button>
        <button @click="cancelChanges" class="cancel-btn">
          ✕ 取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { Team, Planner } from '@/types/planner'
import { usePlannerStore } from '@/stores/planner'

interface ExtendedTimeSlot {
  startDay: 'same' | 'next'
  startTime: string
  endDay: 'same' | 'next'
  endTime: string
  locationEnabled: boolean
  location?: string
  start: string // 用于存储到原始数据结构
  end: string
}

interface Props {
  team: Team
  planner: Planner
  autoEdit?: boolean
}

interface Emits {
  (e: 'update', teamId: string, updates: Partial<Team>): void
  (e: 'delete', teamId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  autoEdit: false
})
const emit = defineEmits<Emits>()
const store = usePlannerStore()

// 响应式状态
const isExpanded = ref(false)
const editingName = ref(false)
const editName = ref('')
const nameInput = ref<HTMLInputElement>()

// 使用ref而不是reactive来避免DOM操作问题
const extendedLiveSlots = ref<ExtendedTimeSlot[]>([])
const extendedTokutenSlots = ref<ExtendedTimeSlot[]>([])
const originalLiveSlots = ref<ExtendedTimeSlot[]>([])
const originalTokutenSlots = ref<ExtendedTimeSlot[]>([])

// 时间格式化函数
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

const formatTimeDisplay = (timeStr: string): string => {
  const [hours] = timeStr.split(':').map(Number)
  if (hours >= 24) {
    const parsed = parseFormattedTime(timeStr)
    return `次日${parsed.time}`
  }
  return timeStr
}

// 时间校验函数
const validateTimeSlot = (slot: ExtendedTimeSlot): boolean => {
  const startTime = formatTimeWithDay(slot.startTime, slot.startDay)
  const endTime = formatTimeWithDay(slot.endTime, slot.endDay)
  return store.validateTimeRange(startTime, endTime)
}

// 初始化扩展时间段数据
const initExtendedSlots = () => {
  try {
    // 安全地初始化Live时间段
    const newLiveSlots: ExtendedTimeSlot[] = []
    if (props.team.liveSlots && Array.isArray(props.team.liveSlots)) {
      props.team.liveSlots.forEach(slot => {
        if (slot && slot.start && slot.end) {
          const startParsed = parseFormattedTime(slot.start)
          const endParsed = parseFormattedTime(slot.end)
          
          newLiveSlots.push({
            startDay: startParsed.day,
            startTime: startParsed.time,
            endDay: endParsed.day,
            endTime: endParsed.time,
            locationEnabled: !!slot.location,
            location: slot.location,
            start: slot.start,
            end: slot.end
          })
        }
      })
    }
    extendedLiveSlots.value = newLiveSlots
    
    // 安全地初始化特典时间段
    const newTokutenSlots: ExtendedTimeSlot[] = []
    if (props.team.tokutenSlots && Array.isArray(props.team.tokutenSlots)) {
      props.team.tokutenSlots.forEach(slot => {
        if (slot && slot.start && slot.end) {
          const startParsed = parseFormattedTime(slot.start)
          const endParsed = parseFormattedTime(slot.end)
          
          newTokutenSlots.push({
            startDay: startParsed.day,
            startTime: startParsed.time,
            endDay: endParsed.day,
            endTime: endParsed.time,
            locationEnabled: !!slot.location,
            location: slot.location,
            start: slot.start,
            end: slot.end
          })
        }
      })
    }
    extendedTokutenSlots.value = newTokutenSlots
  } catch (error) {
    console.error('初始化时间段数据失败:', error)
    extendedLiveSlots.value = []
    extendedTokutenSlots.value = []
  }
}

// 方法
const toggleExpanded = () => {
  if (!isExpanded.value) {
    // 展开：初始化并备份数据
    initExtendedSlots()
    originalLiveSlots.value = JSON.parse(JSON.stringify(extendedLiveSlots.value))
    originalTokutenSlots.value = JSON.parse(JSON.stringify(extendedTokutenSlots.value))
  }
  isExpanded.value = !isExpanded.value
}

const startEditName = () => {
  editingName.value = true
  editName.value = props.team.name
  nextTick(() => {
    nameInput.value?.focus()
    nameInput.value?.select()
  })
}

const saveTeamName = () => {
  if (editName.value.trim() && editName.value !== props.team.name) {
    emit('update', props.team.id, { name: editName.value.trim() })
  }
  editingName.value = false
}

const removeTimeSlot = (type: 'live' | 'tokuten', index: number) => {
  if (type === 'live') {
    extendedLiveSlots.value = extendedLiveSlots.value.filter((_, i) => i !== index)
  } else {
    extendedTokutenSlots.value = extendedTokutenSlots.value.filter((_, i) => i !== index)
  }
}

const addLiveSlot = () => {
  const newSlot: ExtendedTimeSlot = {
    startDay: 'same',
    startTime: '14:00',
    endDay: 'same',
    endTime: '15:00',
    locationEnabled: false,
    location: undefined,
    start: '14:00',
    end: '15:00'
  }
  extendedLiveSlots.value = [...extendedLiveSlots.value, newSlot]
}

const addTokutenSlot = () => {
  const newSlot: ExtendedTimeSlot = {
    startDay: 'same',
    startTime: '15:30',
    endDay: 'same',
    endTime: '17:00',
    locationEnabled: false,
    location: undefined,
    start: '15:30',
    end: '17:00'
  }
  extendedTokutenSlots.value = [...extendedTokutenSlots.value, newSlot]
}

const saveChanges = () => {
  try {
    // 校验所有时间段
    for (const slot of extendedLiveSlots.value) {
      if (!validateTimeSlot(slot)) {
        alert(`Live时间段 ${slot.startTime}-${slot.endTime} 的结束时间必须晚于开始时间！`)
        return
      }
    }
    
    for (const slot of extendedTokutenSlots.value) {
      if (!validateTimeSlot(slot)) {
        alert(`特典时间段 ${slot.startTime}-${slot.endTime} 的结束时间必须晚于开始时间！`)
        return
      }
    }
    
    // 更新所有时间段
    const updatedLiveSlots = extendedLiveSlots.value.map(slot => {
      const formattedStart = formatTimeWithDay(slot.startTime, slot.startDay)
      const formattedEnd = formatTimeWithDay(slot.endTime, slot.endDay)
      
      return {
        start: formattedStart,
        end: formattedEnd,
        location: slot.locationEnabled ? slot.location : undefined
      }
    })

    const updatedTokutenSlots = extendedTokutenSlots.value.map(slot => {
      const formattedStart = formatTimeWithDay(slot.startTime, slot.startDay)
      const formattedEnd = formatTimeWithDay(slot.endTime, slot.endDay)
      
      return {
        start: formattedStart,
        end: formattedEnd,
        location: slot.locationEnabled ? slot.location : undefined
      }
    })

    // 发送更新事件
    emit('update', props.team.id, {
      liveSlots: updatedLiveSlots,
      tokutenSlots: updatedTokutenSlots
    })

    // 收起编辑区域
    isExpanded.value = false
  } catch (error) {
    console.error('保存团体修改失败:', error)
  }
}

const cancelChanges = () => {
  try {
    // 恢复原始数据
    extendedLiveSlots.value = JSON.parse(JSON.stringify(originalLiveSlots.value))
    extendedTokutenSlots.value = JSON.parse(JSON.stringify(originalTokutenSlots.value))
    
    // 收起编辑区域
    isExpanded.value = false
  } catch (error) {
    console.error('取消团体修改失败:', error)
    isExpanded.value = false
  }
}

const deleteTeam = () => {
  if (confirm(`确定要删除团体"${props.team.name}"吗？`)) {
    emit('delete', props.team.id)
  }
}

// 生命周期
onMounted(() => {
  editName.value = props.team.name
  
  // 如果需要自动编辑，进入编辑模式
  if (props.autoEdit) {
    nextTick(() => {
      // 对于新创建的团体（名称为空或默认值），自动展开配置时段
      if (!props.team.name || props.team.name === '新团体' || props.team.name.trim() === '') {
        // 初次创建：先展开配置区域，再进入名称编辑
        isExpanded.value = true
        initExtendedSlots()
        originalLiveSlots.value = JSON.parse(JSON.stringify(extendedLiveSlots.value))
        originalTokutenSlots.value = JSON.parse(JSON.stringify(extendedTokutenSlots.value))
        
        // 然后进入名称编辑
        setTimeout(() => {
      startEditName()
        }, 100)
      } else {
        // 普通编辑：只编辑名称，不展开
        startEditName()
      }
    })
  }
})

// 组件卸载时的清理
onBeforeUnmount(() => {
  extendedLiveSlots.value = []
  extendedTokutenSlots.value = []
  originalLiveSlots.value = []
  originalTokutenSlots.value = []
})
</script>

<style scoped>
.team-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.team-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.team-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f1f3f4;
  cursor: pointer;
  user-select: none;
  min-height: 60px;
}

.team-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  margin-right: 12px;
}

.team-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.team-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  cursor: pointer;
  min-width: 0;
  word-break: break-word;
  flex: 1;
}

.team-name-input {
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #667eea;
  border-radius: 4px;
  padding: 4px 8px;
  background: white;
  outline: none;
  width: 100%;
  min-width: 120px;
}

.team-name:hover {
  color: #667eea;
}

.team-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-name-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 16px;
  color: #6b7280;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 4px;
}

.edit-name-btn:hover {
  color: #667eea;
  background: #f3f4f6;
}

.team-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-btn, .delete-btn {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.expand-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.expand-btn.expanded {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.delete-btn {
  background: #f8f9fa !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 50% !important;
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 16px !important;
  padding: 0 !important;
  transition: all 0.2s ease !important;
}

.delete-btn:hover {
  background: #fee2e2 !important;
  border-color: #f87171 !important;
  transform: scale(1.05) !important;
  box-shadow: 0 2px 8px rgba(248, 113, 113, 0.3) !important;
}

.time-summary {
  padding: 0 16px 16px;
}

.time-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #2d3748;
}

.time-chip.live {
  background: #a8d8b9;
}

.time-chip.tokuten {
  background: #fedfe1;
}

.time-chip.no-slots {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px dashed #9ca3af;
  font-style: italic;
}

.time-chip .location {
  margin-left: 4px;
  color: #6b7280;
  font-size: 11px;
}

.team-edit-area {
  padding: 16px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.time-section {
  margin-bottom: 24px;
}

.time-section h5 {
  margin: 0 0 12px 0;
  color: #2d3748;
  font-size: 14px;
  font-weight: 600;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.time-slot-editor {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  position: relative;
}

.time-inputs-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  padding-right: 30px; /* 为右下角的删除按钮留出空间 */
}

.slot-label {
  font-weight: 500;
  color: #495057;
  min-width: 60px;
  flex-shrink: 0;
}

.time-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.time-prefix {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  min-width: 20px;
  flex-shrink: 0;
}

.day-select, .time-input {
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 13px;
  background: white;
  color: #495057;
  flex-shrink: 0;
}

.day-select {
  min-width: 60px;
}

.time-input {
  min-width: 80px;
  font-family: monospace;
}

.remove-btn {
  position: absolute !important;
  top: 8px !important;
  right: 8px !important;
  background: #f8f9fa !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 50% !important;
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 16px !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  color: #6b7280 !important;
  z-index: 10 !important;
  padding: 0 !important;
}

.remove-btn:hover {
  background: #fee2e2 !important;
  border-color: #f87171 !important;
  color: #ef4444 !important;
  transform: scale(1.05) !important;
  box-shadow: 0 2px 8px rgba(248, 113, 113, 0.3) !important;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6c757d;
  cursor: pointer;
}

.location-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 13px;
}

.add-slot-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #6c757d;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-slot-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  color: #495057;
}

.edit-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.save-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.save-btn:hover {
  background: #218838;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cancel-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .time-inputs-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding-right: 40px; /* 移动端为删除按钮留更多空间 */
  }
  
  .slot-label {
    min-width: auto;
    width: 100%;
  }
  
  .time-line {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  
  .time-prefix {
    min-width: 20px;
    font-size: 14px;
    flex-shrink: 0;
  }
  
  .day-select, .time-input {
    font-size: 14px;
    padding: 8px;
  }
  
  .location-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .location-input {
    width: 100%;
  }
}
</style> 