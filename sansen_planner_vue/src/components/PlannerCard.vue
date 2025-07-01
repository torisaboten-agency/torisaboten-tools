<template>
  <div class="planner-card card">
    <div class="card-header">
      <div class="planner-info">
        <h3 class="planner-name">
          {{ planner.name || '未命名规划' }}
        </h3>
        <div class="planner-meta">
          <span class="type-badge" :class="typeBadgeClass">
            {{ typeLabel }}
          </span>
          <span v-if="planner.date" class="date">
            {{ formatDate(planner.date) }}
          </span>
        </div>
      </div>
    </div>

    <div class="card-body">
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">{{ planner.groups.length }}</div>
          <div class="stat-label">团体</div>
        </div>
        <div v-if="planner.type === 'multiple'" class="stat-item">
          <div class="stat-value">{{ planner.activities.length }}</div>
          <div class="stat-label">活动</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ totalSlots }}</div>
          <div class="stat-label">时间段</div>
        </div>
      </div>

      <div class="update-time">
        最后更新：{{ formatUpdateTime(planner.updatedAt) }}
      </div>
    </div>

    <div class="card-footer">
      <div class="actions">
        <button @click="$emit('view', planner.id)" class="btn btn-primary btn-small">
          📋 查看详情
        </button>
        <button @click="$emit('delete', planner.id)" class="btn btn-danger btn-small">
          🗑️ 删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Planner } from '@/types/planner'

interface Props {
  planner: Planner
}

const props = defineProps<Props>()
defineEmits<{
  view: [id: string]
  delete: [id: string]
}>()

const typeLabel = computed(() => {
  return props.planner.type === 'single' ? '单一活动' : '多活动'
})

const typeBadgeClass = computed(() => {
  return props.planner.type === 'single' ? 'single' : 'multiple'
})

const totalSlots = computed(() => {
  return props.planner.groups.reduce((total, group) => {
    return total + group.liveSlots.length + group.tokutenSlots.length
  }, 0)
})

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function formatUpdateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  } catch {
    return '未知'
  }
}
</script>

<style scoped>
.planner-card {
  transition: all 0.2s ease;
}

.planner-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.planner-info {
  flex: 1;
}

.planner-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.planner-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.type-badge.single {
  background: #dbeafe;
  color: #1e40af;
}

.type-badge.multiple {
  background: #d1fae5;
  color: #059669;
}

.date {
  color: #6b7280;
  font-size: 0.875rem;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.update-time {
  color: #9ca3af;
  font-size: 0.75rem;
  text-align: right;
}

.actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.actions .btn {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .planner-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style> 