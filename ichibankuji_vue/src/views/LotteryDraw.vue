<template>
  <div class="lottery-draw">
    <header class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>🎯 {{ currentLottery?.name || '抽奖进行中' }}</h1>
          <div class="header-actions">
            <router-link :to="`/config/${id}`" class="btn btn-outline">
              ⚙️ 返回配置
            </router-link>
            <router-link to="/" class="btn btn-secondary">
              🏠 返回列表
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="container" v-if="currentLottery">
      <div class="draw-layout">
        <!-- 左侧：抽奖信息和控制面板 -->
        <div class="draw-info-panel">
          <!-- 当前状态信息 -->
          <div class="status-info card">
            <div class="card-header">
              <h3>📊 当前状态</h3>
            </div>
            <div class="card-body">
              <div class="status-grid">
                <div v-if="currentLottery.type === 'ichiban'" class="status-item">
                  <span class="status-label">当前箱数</span>
                  <span class="status-value">第 {{ currentLottery.currentBox }} 箱</span>
                </div>
                <div class="status-item">
                  <span class="status-label">抽奖类型</span>
                  <span class="status-value">
                    {{ currentLottery.type === 'ichiban' ? '一番赏' : '概率抽奖' }}
                  </span>
                </div>
                <div v-if="currentStats" class="status-item">
                  <span class="status-label">总抽奖次数</span>
                  <span class="status-value">{{ currentStats.totalDraws }}</span>
                </div>
                <div v-if="currentLottery.type === 'ichiban' && currentStats" class="status-item">
                  <span class="status-label">本箱剩余</span>
                  <span class="status-value">{{ currentStats.remainingCount }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 剩余奖项 -->
          <div class="remaining-prizes card">
            <div class="card-header">
              <h3>🎁 {{ currentLottery.type === 'ichiban' ? '剩余奖项' : '奖项列表' }}</h3>
            </div>
            <div class="card-body">
              <div v-if="currentStats && currentStats.remainingPrizes.length > 0" class="prizes-list">
                <div
                  v-for="prize in currentStats.remainingPrizes"
                  :key="prize.id"
                  class="prize-item"
                  :class="{ 'out-of-stock': prize.count === 0 }"
                >
                  <span class="prize-level">{{ prize.level }}</span>
                  <span class="prize-description">{{ prize.description }}</span>
                  <span v-if="currentLottery.type === 'ichiban'" class="prize-count">
                    {{ prize.count }}个
                  </span>
                  <span v-else class="prize-probability">
                    {{ prize.probability }}%
                  </span>
                </div>
              </div>
              <div v-else class="empty-prizes">
                <div class="empty-icon">🎉</div>
                <p>{{ currentLottery.type === 'ichiban' ? '当前箱子已抽完！' : '暂无奖项' }}</p>
              </div>
            </div>
          </div>

          <!-- 抽奖控制面板 -->
          <div class="draw-controls card">
            <div class="card-header">
              <h3>🎲 抽奖控制</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleDraw" class="draw-form">
                <div class="form-group">
                  <label class="form-label" for="drawer-id">抽奖者ID：</label>
                  <input
                    id="drawer-id"
                    v-model="drawerId"
                    type="text"
                    class="form-input"
                    placeholder="可留空，默认为匿名OTA"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label" for="draw-count">抽奖次数：</label>
                  <div class="number-input-group">
                    <button
                      type="button"
                      @click="adjustDrawCount(-1)"
                      class="number-btn"
                      :disabled="drawCount <= 1"
                    >
                      −
                    </button>
                    <input
                      id="draw-count"
                      v-model.number="drawCount"
                      type="number"
                      class="form-input"
                      min="1"
                      :max="maxDrawCount"
                    >
                    <button
                      type="button"
                      @click="adjustDrawCount(1)"
                      class="number-btn"
                      :disabled="drawCount >= maxDrawCount"
                    >
                      +
                    </button>
                    <button
                      v-if="currentLottery.type === 'ichiban' && currentStats"
                      type="button"
                      @click="setDrawCountToAll"
                      class="all-btn"
                      :disabled="currentStats.remainingCount === 0"
                    >
                      ALL
                    </button>
                  </div>
                </div>

                <div class="draw-buttons">
                  <button
                    type="submit"
                    class="btn btn-primary btn-large"
                    :disabled="!canDraw"
                  >
                    🎲 {{ isDrawing ? '抽奖中...' : '开始抽奖' }}
                  </button>
                  
                  <button
                    v-if="isCurrentLotteryCompleted"
                    type="button"
                    @click="restartLottery"
                    class="btn btn-success btn-large"
                  >
                    🔄 再来一次
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- 右侧：抽奖历史和操作 -->
        <div class="draw-history-panel">
          <!-- 操作按钮 -->
          <div class="actions-panel card">
            <div class="card-header">
              <h3>🛠️ 操作</h3>
            </div>
            <div class="card-body">
              <div class="action-buttons">
                <button
                  @click="revokeLatest"
                  class="btn btn-outline"
                  :disabled="!canRevoke"
                >
                  ↩️ 撤销最近抽奖
                </button>
                <button
                  @click="resetLottery"
                  class="btn btn-outline"
                >
                  🔄 重置抽奖
                </button>
                <button
                  @click="exportCSV"
                  class="btn btn-outline"
                  :disabled="currentLottery.history.length === 0"
                >
                  📊 导出记录
                </button>
              </div>
            </div>
          </div>

          <!-- 抽奖历史 -->
          <div class="history-panel card">
            <div class="card-header">
              <h3>📋 抽奖历史</h3>
            </div>
            <div class="card-body">
              <div v-if="currentLottery.history.length > 0" class="history-list">
                <div
                  v-for="record in currentLottery.history.slice().reverse()"
                  :key="record.id"
                  class="history-item"
                >
                  <div class="history-header">
                    <span class="history-time">
                      {{ formatDateTime(record.timestamp) }}
                    </span>
                    <span class="history-drawer">
                      {{ record.drawerId || '匿名OTA' }}
                    </span>
                    <span v-if="currentLottery.type === 'ichiban'" class="history-box">
                      第{{ record.boxNumber }}箱
                    </span>
                  </div>
                  <div class="history-results">
                    <div
                      v-for="result in record.results"
                      :key="result.id"
                      class="result-item"
                      :class="{ 'last-prize': result.prize.isLastPrize }"
                    >
                      <span class="result-level">{{ result.prize.level }}</span>
                      <span class="result-description">{{ result.prize.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-history">
                <div class="empty-icon">📝</div>
                <p>还没有抽奖记录</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 抽奖结果模态框 -->
    <DrawResultModal
      v-if="showResultModal"
      :results="lastDrawResults"
      @close="showResultModal = false"
    />

    <!-- Loading状态 -->
    <div v-else class="loading-state">
      <div class="container">
        <div class="empty-state">
          <div class="empty-icon">⚠️</div>
          <h3>抽奖不存在</h3>
          <p>请检查链接是否正确，或返回主页重新选择抽奖。</p>
          <router-link to="/" class="btn btn-primary">返回主页</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLotteryStore } from '@/stores/lottery'
import DrawResultModal from '@/components/DrawResultModal.vue'

const router = useRouter()
const lotteryStore = useLotteryStore()

// Props
const props = defineProps<{
  id: string
}>()

// 响应式数据
const drawerId = ref('')
const drawCount = ref(1)
const showResultModal = ref(false)

// 计算属性
const { currentLottery, currentStats, isCurrentLotteryCompleted, isDrawing, lastDrawResults } = lotteryStore

const maxDrawCount = computed(() => {
  if (!currentLottery || currentLottery.type === 'probability') {
    return 10 // 概率抽奖最多10次
  }
  return currentStats?.remainingCount || 1
})

const canDraw = computed(() => {
  if (isDrawing || !currentLottery) return false
  
  if (currentLottery.type === 'ichiban') {
    return (currentStats?.remainingCount || 0) > 0
  }
  
  return true // 概率抽奖总是可以抽
})

const canRevoke = computed(() => {
  return currentLottery && currentLottery.history.length > 0
})

// 方法
const adjustDrawCount = (delta: number): void => {
  const newCount = drawCount.value + delta
  if (newCount >= 1 && newCount <= maxDrawCount.value) {
    drawCount.value = newCount
  }
}

const setDrawCountToAll = (): void => {
  if (currentStats) {
    drawCount.value = currentStats.remainingCount
  }
}

const handleDraw = async (): Promise<void> => {
  try {
    const results = await lotteryStore.performDraw(
      drawCount.value,
      drawerId.value || '匿名OTA'
    )
    
    if (results.length > 0) {
      showResultModal.value = true
    }
    
    // 重置抽奖次数
    drawCount.value = 1
  } catch (error) {
    alert(`抽奖失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

const revokeLatest = (): void => {
  if (confirm('确定要撤销最近的抽奖记录吗？')) {
    const success = lotteryStore.revokeLatestDraw()
    if (success) {
      alert('撤销成功！')
    } else {
      alert('撤销失败，没有可撤销的记录。')
    }
  }
}

const resetLottery = (): void => {
  if (confirm('确定要重置抽奖吗？这将清空所有抽奖记录但保留配置。')) {
    lotteryStore.resetLottery()
    alert('重置成功！')
  }
}

const restartLottery = (): void => {
  if (confirm('确定要重新开始抽奖吗？这将保留历史记录但重置当前状态。')) {
    lotteryStore.restartLottery()
    alert('重新开始成功！')
  }
}

const exportCSV = (): void => {
  try {
    lotteryStore.exportCurrentLotteryCSV()
  } catch (error) {
    alert(`导出失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 监听抽奖结果变化
watch(lastDrawResults, (newResults) => {
  if (newResults.length > 0) {
    // 可以在这里添加音效或动画
  }
})

// 初始化
onMounted(async () => {
  try {
    console.log('🚀 LotteryDraw页面开始初始化，目标ID:', props.id)
    
    // 先确保加载了所有抽奖数据
    lotteryStore.loadLotteries()
    
    // 增加短暂延迟，确保数据完全加载
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // 然后尝试加载特定抽奖
    const success = lotteryStore.loadLottery(props.id)
    if (!success) {
      console.log('❌ 抽奖加载失败，尝试重新加载数据...')
      
      // 再次尝试重新加载数据
      lotteryStore.loadLotteries()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const retrySuccess = lotteryStore.loadLottery(props.id)
      if (!retrySuccess) {
        alert('抽奖不存在或已被删除，将返回主页')
        router.push('/')
      } else {
        console.log('✅ 重试成功，抽奖已加载')
      }
    } else {
      console.log('✅ 抽奖加载成功')
    }
  } catch (error) {
    console.error('初始化失败:', error)
    alert('页面初始化失败，将返回主页')
    router.push('/')
  }
})

// 监听路由参数变化
watch(() => props.id, async (newId) => {
  if (newId) {
    console.log('🔄 检测到路由参数变化，重新加载抽奖:', newId)
    
    // 重新加载数据
    lotteryStore.loadLotteries()
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const success = lotteryStore.loadLottery(newId)
    if (!success) {
      alert('抽奖不存在或已被删除，将返回主页')
      router.push('/')
    }
  }
})
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.draw-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.draw-info-panel,
.draw-history-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.status-item {
  text-align: center;
}

.status-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.status-value {
  display: block;
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
}

.prizes-list {
  max-height: 300px;
  overflow-y: auto;
}

.prize-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}

.prize-item.out-of-stock {
  opacity: 0.5;
  background: #f1f5f9;
}

.prize-level {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #667eea;
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
}

.prize-description {
  flex: 1;
  color: #374151;
}

.prize-count,
.prize-probability {
  flex-shrink: 0;
  font-weight: 600;
  color: #6b7280;
}

.number-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.number-btn,
.all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.number-btn:hover:not(:disabled),
.all-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.number-btn:disabled,
.all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.all-btn {
  width: auto;
  padding: 0 0.75rem;
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.draw-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: white;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.history-results {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 4px;
}

.result-item.last-prize {
  background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
  font-weight: 600;
}

.result-level {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #667eea;
  color: white;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.result-item.last-prize .result-level {
  background: #d97706;
}

.result-description {
  flex: 1;
  font-size: 0.875rem;
}

.empty-prizes,
.empty-history {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

@media (max-width: 1024px) {
  .draw-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .status-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style> 