<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>🎉 抽奖结果</h2>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      
      <div class="modal-body">
        <div class="results-container">
          <div
            v-for="(result, index) in results"
            :key="result.id"
            class="result-card"
            :class="{ 'last-prize': result.prize.isLastPrize }"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="result-icon">
              {{ result.prize.isLastPrize ? '👑' : '🎁' }}
            </div>
            <div class="result-content">
              <div class="result-level">
                {{ result.prize.level }}
              </div>
              <div class="result-description">
                {{ result.prize.description }}
              </div>
              <div v-if="result.prize.isLastPrize" class="last-prize-badge">
                ✨ LAST赏 ✨
              </div>
            </div>
          </div>
        </div>
        
        <!-- 结果统计 -->
        <div class="results-summary">
          <div class="summary-item">
            <span class="summary-label">抽中数量：</span>
            <span class="summary-value">{{ results.length }}</span>
          </div>
          <div v-if="hasLastPrize" class="summary-item special">
            <span class="summary-label">🎊 恭喜获得LAST赏！</span>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn btn-primary btn-large">
          🎯 继续抽奖
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PrizeResult } from '@/types/lottery'

const props = defineProps<{
  results: PrizeResult[]
}>()

defineEmits<{
  close: []
}>()

const hasLastPrize = computed(() => {
  return props.results.some(result => result.prize.isLastPrize)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalEnter 0.3s ease-out;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 0 2rem;
}

.modal-header h2 {
  margin: 0;
  color: #374151;
  font-size: 1.75rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 2rem;
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.result-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  animation: resultEnter 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes resultEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-card.last-prize {
  background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
  border-color: #f59e0b;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
  animation: lastPrizeEnter 0.8s ease-out forwards;
}

@keyframes lastPrizeEnter {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  50% {
    transform: translateY(-10px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.result-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  text-align: left;
}

.result-level {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
}

.result-card.last-prize .result-level {
  color: #92400e;
}

.result-description {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.4;
}

.result-card.last-prize .result-description {
  color: #78350f;
}

.last-prize-badge {
  display: inline-block;
  background: #d97706;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.5rem;
  animation: badgePulse 2s infinite;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.results-summary {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item.special {
  justify-content: center;
  color: #d97706;
  font-weight: 700;
  font-size: 1.125rem;
  animation: specialPulse 1.5s ease-in-out infinite;
}

@keyframes specialPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.summary-label {
  color: #374151;
  font-weight: 600;
}

.summary-value {
  color: #1e40af;
  font-weight: 700;
  font-size: 1.125rem;
}

.modal-footer {
  padding: 0 2rem 2rem 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-height: 90vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .result-card {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .result-icon {
    font-size: 2.5rem;
  }
}

/* 添加一些额外的动画效果 */
.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.result-card.last-prize:hover {
  box-shadow: 0 8px 30px rgba(245, 158, 11, 0.4);
}
</style> 