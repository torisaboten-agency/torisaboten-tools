<template>
  <div class="home">
    <header class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>🎯 一番赏抽奖工具</h1>
            <p class="subtitle">现代化的线下抽奖助手，支持一番赏和概率抽奖</p>
          </div>
          <div class="header-actions">
            <router-link to="/docs" class="btn btn-outline">
              📖 使用文档
            </router-link>
            <router-link to="/config" class="btn btn-primary">
              ✨ 创建新抽奖
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="container">
      <!-- 功能区域 -->
      <div class="action-section">
        <div class="search-filter-panel">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="🔍 搜索抽奖名称..."
            >
          </div>
          
          <div class="filter-tabs">
            <button
              v-for="filter in filterOptions"
              :key="filter.key"
              @click="activeFilter = filter.key"
              class="filter-tab"
              :class="{ active: activeFilter === filter.key }"
            >
              {{ filter.icon }} {{ filter.label }}
            </button>
          </div>
        </div>

        <div class="data-management">
          <button @click="showImportModal = true" class="btn btn-outline">
            📥 导入数据
          </button>
          <button @click="exportData" class="btn btn-outline" :disabled="lotteryStore.lotteries.length === 0">
            📤 导出数据
          </button>
          <button @click="clearAllData" class="btn btn-danger" :disabled="lotteryStore.lotteries.length === 0">
            🗑️ 清空所有
          </button>
        </div>
      </div>

      <!-- 抽奖列表 -->
      <div class="lottery-grid">
        <div v-if="filteredLotteries.length === 0" class="empty-state">
          <div v-if="lotteryStore.lotteries.length === 0" class="empty-content">
            <div class="empty-icon">🎯</div>
            <h3>还没有创建任何抽奖</h3>
            <p>开始创建你的第一个抽奖吧！支持一番赏和概率抽奖两种模式。</p>
            <router-link to="/config" class="btn btn-primary btn-large">
              ✨ 创建第一个抽奖
            </router-link>
          </div>
          
          <div v-else class="empty-content">
            <div class="empty-icon">🔍</div>
            <h3>没有找到符合条件的抽奖</h3>
            <p>尝试调整搜索关键词或筛选条件</p>
            <button @click="clearFilters" class="btn btn-outline">
              清除筛选
            </button>
          </div>
        </div>

        <LotteryCard
          v-for="lottery in filteredLotteries"
          :key="lottery.id"
          :lottery="lottery"
          @view="viewLottery"
          @edit="editLottery"
          @delete="deleteLottery"
        />
      </div>

      <!-- 统计信息 -->
      <div v-if="lotteryStore.lotteries.length > 0" class="stats-section">
        <div class="stats-card">
          <div class="stat-item">
            <span class="stat-number">{{ lotteryStore.lotteries.length }}</span>
            <span class="stat-label">总抽奖数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalDrawsCount }}</span>
            <span class="stat-label">总抽奖次数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ ichibanCount }}</span>
            <span class="stat-label">一番赏抽奖</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ probabilityCount }}</span>
            <span class="stat-label">概率抽奖</span>
          </div>
        </div>
      </div>

      <!-- 公益提示 -->
      <div class="callout-section">
        <div class="callout callout-info">
          <div class="callout-icon">💡</div>
          <div class="callout-content">
            <h4>温馨提示</h4>
            <p>本工具完全免费且开源，所有数据存储在本地浏览器中，确保隐私安全。建议定期导出数据作为备份。</p>
          </div>
        </div>

        <div class="callout callout-warning" v-if="isWeChat">
          <div class="callout-icon">⚠️</div>
          <div class="callout-content">
            <h4>微信环境提醒</h4>
            <p>检测到您在微信中使用本工具。由于微信限制，文件下载功能可能无法正常使用。建议点击右上角菜单选择"在浏览器中打开"以获得完整功能。</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 导入数据模态框 -->
    <div v-if="showImportModal" class="modal-overlay" @click="showImportModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>📥 导入抽奖数据</h3>
          <button @click="showImportModal = false" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="import-area">
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              @change="handleFileSelect"
              class="file-input"
            >
            
            <div class="upload-zone" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
              <div class="upload-icon">📁</div>
              <p class="upload-text">点击选择文件或拖拽文件到此处</p>
              <small class="upload-hint">仅支持JSON格式的抽奖快照文件</small>
            </div>
            
            <div v-if="importPreview" class="import-preview">
              <h4>导入预览</h4>
              <div class="preview-stats">
                <div class="preview-item">
                  <span class="preview-label">将导入抽奖数量：</span>
                  <span class="preview-value">{{ importPreview.length }}个</span>
                </div>
              </div>
              
              <div class="preview-list">
                <div v-for="lottery in importPreview" :key="lottery.id" class="preview-lottery">
                  <span class="lottery-name">{{ lottery.name }}</span>
                  <span class="lottery-type">{{ lottery.type === 'ichiban' ? '一番赏' : '概率抽奖' }}</span>
                  <span class="lottery-date">{{ formatDate(lottery.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showImportModal = false" class="btn btn-secondary">
            取消
          </button>
          <button 
            @click="confirmImport" 
            class="btn btn-primary"
            :disabled="!importPreview"
          >
            确认导入
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLotteryStore } from '@/stores/lottery'
import LotteryCard from '@/components/LotteryCard.vue'
import type { Lottery } from '@/types/lottery'

const router = useRouter()
const lotteryStore = useLotteryStore()

// 响应式数据
const searchQuery = ref('')
const activeFilter = ref('all')
const showImportModal = ref(false)
const fileInput = ref<HTMLInputElement>()
const importPreview = ref<Lottery[] | null>(null)

// 筛选选项
const filterOptions = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'ichiban', label: '一番赏', icon: '🎲' },
  { key: 'probability', label: '概率抽奖', icon: '🎰' },
  { key: 'active', label: '进行中', icon: '🔥' },
  { key: 'completed', label: '已完成', icon: '✅' }
]

// 计算属性
const filteredLotteries = computed(() => {
  let filtered = lotteryStore.lotteries

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(lottery => 
      lottery.name.toLowerCase().includes(query)
    )
  }

  // 类型过滤
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(lottery => {
      switch (activeFilter.value) {
        case 'ichiban':
          return lottery.type === 'ichiban'
        case 'probability':
          return lottery.type === 'probability'
        case 'active':
          return !lottery.isCompleted
        case 'completed':
          return lottery.isCompleted
        default:
          return true
      }
    })
  }

  // 按更新时间倒序排列
  return filtered.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
})

const totalDrawsCount = computed(() => {
  return lotteryStore.lotteries.reduce((total: number, lottery: Lottery) => {
    return total + lottery.history.reduce((sum: number, record) => sum + record.drawCount, 0)
  }, 0)
})

const ichibanCount = computed(() => {
  return lotteryStore.lotteries.filter((lottery: Lottery) => lottery.type === 'ichiban').length
})

const probabilityCount = computed(() => {
  return lotteryStore.lotteries.filter((lottery: Lottery) => lottery.type === 'probability').length
})

const isWeChat = computed(() => {
  return /MicroMessenger/i.test(navigator.userAgent)
})

// 方法
const viewLottery = (lottery: Lottery): void => {
  router.push(`/draw/${lottery.id}`)
}

const editLottery = (lottery: Lottery): void => {
  router.push(`/config/${lottery.id}`)
}

const deleteLottery = (lottery: Lottery): void => {
  if (confirm(`确定要删除抽奖"${lottery.name}"吗？此操作不可恢复。`)) {
    lotteryStore.deleteLottery(lottery.id)
  }
}

const exportData = (): void => {
  try {
    lotteryStore.exportSnapshot()
  } catch (error) {
    alert(`导出失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

const clearAllData = (): void => {
  if (confirm('确定要清空所有抽奖数据吗？此操作不可恢复，请确保已导出重要数据。')) {
    if (confirm('再次确认：这将删除所有抽奖配置和历史记录。')) {
      lotteryStore.clearAllLotteries()
      alert('已清空所有数据')
    }
  }
}

const clearFilters = (): void => {
  searchQuery.value = ''
  activeFilter.value = 'all'
}

const triggerFileInput = (): void => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processImportFile(file)
  }
}

const handleFileDrop = (event: DragEvent): void => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    processImportFile(file)
  }
}

const processImportFile = (file: File): void => {
  if (!file.name.toLowerCase().endsWith('.json')) {
    alert('只支持JSON格式的文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const data = JSON.parse(content)
      
      // 验证数据格式
      if (!Array.isArray(data)) {
        throw new Error('文件格式错误：应该是抽奖数组')
      }

      // 基础验证每个抽奖对象
      for (const lottery of data) {
        if (!lottery.id || !lottery.name || !lottery.type || !Array.isArray(lottery.prizes)) {
          throw new Error('文件格式错误：抽奖数据结构不完整')
        }
      }

      importPreview.value = data
    } catch (error) {
      alert(`文件解析失败：${error instanceof Error ? error.message : '文件格式错误'}`)
      importPreview.value = null
    }
  }
  
  reader.onerror = () => {
    alert('文件读取失败')
    importPreview.value = null
  }
  
  reader.readAsText(file)
}

const confirmImport = (): void => {
  if (!importPreview.value) return

  try {
    const content = JSON.stringify(importPreview.value)
    lotteryStore.importSnapshot(content)
    
    alert(`成功导入 ${importPreview.value.length} 个抽奖`)
    showImportModal.value = false
    importPreview.value = null
    
    // 清空文件输入
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    alert(`导入失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 初始化
onMounted(() => {
  lotteryStore.loadLotteries()
})
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.action-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.search-filter-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-box {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  background: #f3f4f6;
}

.filter-tab.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.data-management {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.lottery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-content h3 {
  color: #374151;
  margin-bottom: 0.75rem;
}

.empty-content p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.stats-section {
  margin-bottom: 3rem;
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.callout-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.callout {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.callout-info {
  background: #f0f9ff;
  border-left-color: #3b82f6;
}

.callout-warning {
  background: #fffbeb;
  border-left-color: #f59e0b;
}

.callout-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.callout-content h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.callout-content p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

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
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #374151;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
}

.file-input {
  display: none;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-zone:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.upload-text {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-weight: 500;
}

.upload-hint {
  color: #6b7280;
}

.import-preview {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
}

.import-preview h4 {
  margin: 0 0 1rem 0;
  color: #374151;
}

.preview-stats {
  margin-bottom: 1rem;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.preview-label {
  font-weight: 500;
  color: #6b7280;
}

.preview-value {
  font-weight: 600;
  color: #374151;
}

.preview-list {
  max-height: 200px;
  overflow-y: auto;
}

.preview-lottery {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.lottery-name {
  font-weight: 500;
  color: #374151;
  flex: 1;
}

.lottery-type {
  padding: 0.25rem 0.5rem;
  background: #667eea;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  margin: 0 0.5rem;
}

.lottery-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 1024px) {
  .action-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .data-management {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .data-management {
    flex-direction: column;
  }
  
  .lottery-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-card {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .modal-content {
    margin: 1rem;
    max-height: 90vh;
  }
}
</style> 