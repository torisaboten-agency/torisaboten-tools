<template>
  <div class="lottery-card card">
    <div class="card-header">
      <div class="lottery-info">
        <h3 class="lottery-name">{{ lottery.name }}</h3>
        <div class="lottery-meta">
          <span class="lottery-type">
            {{ lottery.type === 'ichiban' ? '🎯 一番赏' : '🎲 概率抽奖' }}
          </span>
          <span class="lottery-date">
            {{ formatDate(lottery.createdAt) }}
          </span>
        </div>
      </div>
      <div class="lottery-status">
        <span v-if="lottery.isCompleted" class="status-badge completed">
          ✅ 已完成
        </span>
        <span v-else class="status-badge active">
          🎯 进行中
        </span>
      </div>
    </div>

    <div class="card-body">
      <div class="lottery-stats">
        <div class="stat-item">
          <span class="stat-label">总奖品数</span>
          <span class="stat-value">{{ totalPrizes }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">已抽次数</span>
          <span class="stat-value">{{ totalDraws }}</span>
        </div>
        <div v-if="lottery.type === 'ichiban'" class="stat-item">
          <span class="stat-label">当前箱数</span>
          <span class="stat-value">{{ lottery.currentBox }}</span>
        </div>
      </div>

      <div class="prize-preview">
        <h4>奖项预览</h4>
        <div class="prize-list">
          <div
            v-for="prize in displayPrizes"
            :key="prize.id"
            class="prize-item"
          >
            <span class="prize-level">{{ prize.level }}</span>
            <span class="prize-description">{{ prize.description }}</span>
            <span v-if="lottery.type === 'ichiban'" class="prize-count">
              {{ prize.count }}个
            </span>
            <span v-else class="prize-probability">
              {{ prize.probability }}%
            </span>
          </div>
        </div>
        <div v-if="lottery.prizes.length > 3" class="more-prizes">
          还有 {{ lottery.prizes.length - 3 }} 个奖项...
        </div>
      </div>
    </div>

    <div class="card-footer">
      <div class="action-buttons">
        <button @click="$emit('view', lottery)" class="btn btn-primary btn-small">
          🎯 开始抽奖
        </button>
        <button @click="$emit('edit', lottery)" class="btn btn-outline btn-small">
          ⚙️ 编辑配置
        </button>
        <button @click="$emit('delete', lottery)" class="btn btn-danger btn-small">
          🗑️ 删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Lottery } from '@/types/lottery'

defineProps<{
  lottery: Lottery
}>()

defineEmits<{
  view: [lottery: Lottery]
  edit: [lottery: Lottery]
  delete: [lottery: Lottery]
}>()

const lottery = defineProps<{ lottery: Lottery }>().lottery

const totalPrizes = computed(() => {
  if (lottery.type === 'ichiban') {
    return lottery.prizes
      .filter(p => !p.isLastPrize)
      .reduce((sum, prize) => sum + (prize.originalCount || prize.count || 0), 0)
  } else {
    return lottery.prizes.length
  }
})

const totalDraws = computed(() => {
  return lottery.history.reduce((sum, record) => sum + record.drawCount, 0)
})

const displayPrizes = computed(() => {
  return lottery.prizes.slice(0, 3).filter(p => !p.isLastPrize)
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.lottery-card {
  transition: all 0.3s ease;
}

.lottery-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.lottery-info {
  flex: 1;
}

.lottery-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #374151;
  line-height: 1.4;
}

.lottery-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.lottery-type {
  font-weight: 600;
  color: #667eea;
}

.lottery-status {
  flex-shrink: 0;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.active {
  background: #dbeafe;
  color: #1e40af;
}

.lottery-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
}

.prize-preview h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: #374151;
}

.prize-list {
  space-y: 0.5rem;
}

.prize-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.prize-level {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #667eea;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.prize-description {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prize-count,
.prize-probability {
  flex-shrink: 0;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.more-prizes {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .lottery-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .lottery-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-buttons {
    justify-content: center;
  }
}
</style> 