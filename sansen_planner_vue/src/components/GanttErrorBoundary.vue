<template>
  <div class="gantt-error-boundary">
    <!-- 错误状态显示 -->
    <div v-if="hasError" class="gantt-error">
      <div class="error-icon">⚠️</div>
      <h3>甘特图渲染出错</h3>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-details" v-if="showDetails">
        <p><strong>错误详情：</strong></p>
        <pre>{{ errorStack }}</pre>
      </div>
      <div class="error-actions">
        <button @click="retry" class="retry-btn">🔄 重试</button>
        <button @click="toggleDetails" class="details-btn">
          {{ showDetails ? '隐藏详情' : '显示详情' }}
        </button>
      </div>
      
      <!-- 错误时的甘特图替代内容 -->
      <div class="fallback-gantt">
        <div class="fallback-header">
          <h4>📊 备用时间表</h4>
          <p>以下是您的团体时间安排列表：</p>
        </div>
        <div class="fallback-content">
          <slot name="fallback" />
        </div>
      </div>
    </div>
    
    <!-- 正常状态：渲染子组件 -->
    <div v-else class="gantt-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, nextTick } from 'vue'

// 错误状态管理
const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')
const showDetails = ref(false)
const retryCount = ref(0)

// 定义emit事件
const emit = defineEmits<{
  retry: []
  error: [error: Error]
}>()

// 捕获子组件和渲染过程中的错误
onErrorCaptured((error: Error, instance, errorInfo) => {
  console.error('🚨 甘特图错误边界捕获到错误:', {
    error,
    instance,
    errorInfo,
    retryCount: retryCount.value
  })
  
  hasError.value = true
  errorMessage.value = getErrorMessage(error)
  errorStack.value = error.stack || error.toString()
  
  // 通知父组件发生了错误
  emit('error', error)
  
  // 阻止错误继续向上冒泡，避免整个应用崩溃
  return false
})

// 生成用户友好的错误信息
const getErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase()
  
  if (message.includes('insertbefore') || message.includes('nextsibling')) {
    return '甘特图DOM渲染冲突，这通常是临时问题，请点击重试。'
  } else if (message.includes('cannot read properties of null')) {
    return '甘特图容器初始化失败，请检查数据完整性后重试。'
  } else if (message.includes('canvas')) {
    return '图片导出功能暂时不可用，但甘特图显示正常。'
  } else if (message.includes('network') || message.includes('fetch')) {
    return '网络连接问题导致资源加载失败，请检查网络后重试。'
  } else {
    return '甘特图渲染遇到意外问题，请尝试重试或刷新页面。'
  }
}

// 重试功能
const retry = async () => {
  console.log('🔄 用户触发甘特图重试')
  
  retryCount.value++
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  showDetails.value = false
  
  // 通知父组件进行重试
  emit('retry')
  
  // 等待下一个tick，确保DOM更新
  await nextTick()
  
  // 如果重试次数过多，提供额外提示
  if (retryCount.value >= 3) {
    console.warn('⚠️ 甘特图重试次数过多，可能存在持续性问题')
  }
}

// 切换错误详情显示
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

// 重置错误状态（供父组件调用）
const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  showDetails.value = false
  retryCount.value = 0
}

// 暴露方法给父组件
defineExpose({
  resetError,
  hasError: () => hasError.value,
  retryCount: () => retryCount.value
})
</script>

<style scoped>
.gantt-error-boundary {
  width: 100%;
  min-height: 400px;
}

.gantt-content {
  width: 100%;
  height: 100%;
}

.gantt-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.gantt-error h3 {
  margin: 0 0 1rem 0;
  color: #dc2626;
  font-size: 1.25rem;
  font-weight: 600;
}

.error-message {
  margin: 0 0 1.5rem 0;
  color: #7f1d1d;
  font-size: 1rem;
  line-height: 1.5;
  max-width: 500px;
}

.error-details {
  margin: 1rem 0;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  text-align: left;
  max-width: 600px;
  width: 100%;
}

.error-details pre {
  margin: 0.5rem 0 0 0;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #374151;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.retry-btn, .details-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn {
  background: #dc2626;
  color: white;
}

.retry-btn:hover {
  background: #b91c1c;
}

.details-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.details-btn:hover {
  background: #e5e7eb;
}

.fallback-gantt {
  width: 100%;
  max-width: 800px;
  margin-top: 2rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-align: left;
}

.fallback-header {
  margin-bottom: 1rem;
  text-align: center;
}

.fallback-header h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 1.1rem;
}

.fallback-header p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.fallback-content {
  color: #374151;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gantt-error {
    padding: 1rem;
    min-height: 300px;
  }
  
  .error-icon {
    font-size: 2.5rem;
  }
  
  .gantt-error h3 {
    font-size: 1.1rem;
  }
  
  .error-message {
    font-size: 0.9rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .retry-btn, .details-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .fallback-gantt {
    padding: 1rem;
  }
}
</style> 