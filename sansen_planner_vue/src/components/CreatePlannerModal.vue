<template>
  <div class="modal-overlay" @click="handleBackdropClick">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="$emit('close')">×</button>
      
      <div class="modal-header">
        <h3>创建新的参战规划</h3>
      </div>
      
      <div class="modal-body">
        <div class="planner-type-selection">
          <h4>选择规划类型：</h4>
          <div class="type-options">
            <div 
              class="type-option" 
              :class="{ selected: selectedType === 'single' }"
              @click="selectType('single')"
            >
              <div class="type-icon">🎯</div>
              <div class="type-info">
                <div class="type-title">单一活动</div>
                <div class="type-desc">针对一个活动的参战规划<br>适用于单场演唱会、握手会等</div>
              </div>
            </div>
            <div 
              class="type-option" 
              :class="{ selected: selectedType === 'multiple' }"
              @click="selectType('multiple')"
            >
              <div class="type-icon">🗓️</div>
              <div class="type-info">
                <div class="type-title">多个活动</div>
                <div class="type-desc">包含多个活动的复合规划<br>适用于偶像节、巡回演出等</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  close: []
  create: [type: 'single' | 'multiple', data: any]
}>()

const selectedType = ref<'single' | 'multiple' | ''>('')

// 表单数据（仅保留时区用于自动检测）
const formData = ref({
  timezone: 'Asia/Shanghai'
})

const selectType = (type: 'single' | 'multiple') => {
  selectedType.value = type
  
  // 延迟创建规划器，给用户看到选中效果
  setTimeout(() => {
    createPlanner()
    emit('close')
  }, 300)
}

const createPlanner = () => {
  if (!selectedType.value) return
  
  const plannerData: any = {
    type: selectedType.value,
    date: new Date().toISOString().split('T')[0], // 默认今天
    timezone: formData.value.timezone // 保留时区自动检测
  }
  
  if (selectedType.value === 'single') {
    plannerData.name = '新活动规划'
    plannerData.activityName = ''
    plannerData.location = ''
  } else {
    plannerData.name = '新规划器'
  }
  
  emit('create', selectedType.value, plannerData)
}

// 生命周期
onMounted(() => {
  // 检测用户时区
  try {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (userTimezone) {
      // 如果是常见的亚洲时区，自动设置
      if (userTimezone.includes('Shanghai') || userTimezone.includes('Beijing')) {
        formData.value.timezone = 'Asia/Shanghai'
      } else if (userTimezone.includes('Tokyo')) {
        formData.value.timezone = 'Asia/Tokyo'
      } else if (userTimezone.includes('Seoul')) {
        formData.value.timezone = 'Asia/Seoul'
      } else if (userTimezone.includes('Taipei')) {
        formData.value.timezone = 'Asia/Taipei'
      } else if (userTimezone.includes('Hong_Kong')) {
        formData.value.timezone = 'Asia/Hong_Kong'
      }
    }
  } catch (error) {
    console.log('无法检测时区，使用默认值')
  }
})

// 方法
const handleBackdropClick = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  width: 85vw;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #9ca3af;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-header {
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 700;
}

.modal-body {
  /* Add any necessary styles for the modal body */
}

.planner-type-selection {
  margin-bottom: 32px;
}

.planner-type-selection h4 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.type-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.type-option {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fafbfc;
}

.type-option:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.type-option.selected {
  border-color: #667eea;
  background: #f0f4ff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.type-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.type-info {
  text-align: left;
}

.type-title {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.type-desc {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  display: block;
  margin-top: 6px;
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.4;
}

.step-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95vw;
    max-width: none;
    padding: 16px;
    border-radius: 6px;
    max-height: 85vh; /* 确保手机端能完整显示 */
  }
  
  .modal-header h3 {
    font-size: 18px;
  }
  
  .planner-type-selection h4 {
    font-size: 14px;
  }
  
  .type-options {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .type-option {
    padding: 12px;
    flex-direction: row;
    text-align: left;
  }
  
  .type-icon {
    font-size: 24px;
  }
  
  .type-title {
    font-size: 14px;
  }
  
  .type-desc {
    font-size: 11px;
  }
}
</style> 