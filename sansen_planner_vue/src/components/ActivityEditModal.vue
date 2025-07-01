<template>
  <div class="modal-overlay" :class="{ 'mobile': isMobile }" @click="handleBackdropClick">
    <div class="modal-content" :class="{ 'mobile': isMobile }" @click.stop>
      <button class="modal-close" @click="$emit('close')">×</button>
      <h3>编辑活动</h3>
      
      <form @submit.prevent="saveActivity">
        <div class="form-group">
          <label for="activity-name">活动名称</label>
          <input 
            id="activity-name"
            v-model="activityData.name" 
            type="text" 
            :placeholder="activityNamePlaceholder"
            required
            ref="nameInput"
          >
        </div>
        
        <div class="form-group">
          <label for="activity-location">活动地点</label>
          <input 
            id="activity-location"
            v-model="activityData.location" 
            type="text" 
            :placeholder="activityLocationPlaceholder"
          >
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn btn-primary">
            保存
          </button>
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { useDevice } from '@/utils/device'
import { getActivityNamePlaceholder, getActivityLocationPlaceholder } from '@/utils/placeholders'
import type { Activity } from '@/types/planner'

interface Props {
  activity: Activity
  autoEdit?: boolean
}

interface Emits {
  (e: 'save', activity: Activity): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  autoEdit: false
})
const emit = defineEmits<Emits>()

// 设备检测
const { isMobile } = useDevice()

// 响应式数据
const nameInput = ref<HTMLInputElement>()

// 动态placeholder计算属性
const activityNamePlaceholder = computed(() => getActivityNamePlaceholder())
const activityLocationPlaceholder = computed(() => getActivityLocationPlaceholder())
const activityData = reactive({
  id: props.activity.id,
  name: props.activity.name,
  location: props.activity.location
})

// 方法
const handleBackdropClick = () => {
  emit('close')
}

const saveActivity = () => {
  // 回退逻辑：如果名称为空，设置默认名称
  const finalName = activityData.name.trim() || '新活动'

  const activityToSave: Activity = {
    id: activityData.id,
    name: finalName,
    location: activityData.location.trim()
  }

  emit('save', activityToSave)
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    nameInput.value?.focus()
    nameInput.value?.select()
  })
})
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
  max-width: 400px;
  width: 90vw;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f8f9fa;
  color: #495057;
}

h3 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #2d3748;
  font-size: 20px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95vw;
    padding: 16px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

/* 移动端全屏优化 */
.modal-overlay.mobile {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  padding: 0;
  align-items: flex-start;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.modal-content.mobile {
  width: 100vw;
  height: 100vh;
  max-height: none;
  margin: 0;
  border-radius: 0;
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
}

.modal-content.mobile .modal-close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1001;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 44px;
  height: 44px;
  font-size: 20px;
}

.modal-content.mobile h3 {
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
  padding: 1.5rem 1rem 1rem 1rem;
  margin: 0 -1.5rem 1rem -1.5rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 1.25rem;
}

.modal-content.mobile .modal-actions {
  position: sticky;
  bottom: 0;
  background: white;
  margin: 1rem -1.5rem 0 -1.5rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  gap: 8px;
}

.modal-content.mobile .btn {
  min-height: 48px;
  font-size: 16px;
  border-radius: 8px;
  font-weight: 600;
  width: 100%;
}

.modal-content.mobile .form-group input {
  font-size: 16px; /* 防止iOS缩放 */
  min-height: 44px;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}
</style> 