<template>
  <div class="home">
    <header class="hero">
      <div class="container">
        <h1>
          <img :src="logoSrc" alt="Logo" class="hero-logo">
          参战计划作成工具
        </h1>
        <p class="app-author">By Torisaboten</p>
      </div>
    </header>

    <main class="container">
      <div class="actions-bar">
        <div class="title-section">
          <h2>📋 我的参战计划</h2>
          <p v-if="plannerStore.planners.length === 0" class="empty-hint">
            还没有创建任何规划，点击右侧按钮开始创建吧！
          </p>
        </div>

        <div class="action-buttons">
          <button @click="tryShowCreateModal" class="btn btn-primary">
            ➕ 创建
          </button>
          <button 
            v-if="plannerStore.planners.length > 0"
            @click="clearAllPlanners" 
            class="btn btn-outline"
          >
            🗑️ 清空
          </button>
        </div>
      </div>

      <!-- 公益callout -->
      <div class="charity-callout">
        <div class="charity-content">
          <span class="charity-icon">🌸</span>
          <div class="charity-text">
            <p>关注春蕾计划，支持中国乡村女童的教育与可持续发展</p>
          </div>
          <div class="charity-buttons">
            <a href="https://www.cctf.org.cn/zt/cljh/" target="_blank" class="charity-link">项目官网</a>
            <a href="https://gongyi.qq.com/succor/detail.htm?id=5888" target="_blank" class="charity-link">腾讯公益</a>
          </div>
        </div>
      </div>

      <div v-if="plannerStore.planners.length > 0" class="planners-grid">
        <PlannerCard
          v-for="planner in plannerStore.planners"
          :key="planner.id"
          :planner="planner"
          @view="viewPlanner"
          @delete="deletePlanner"
        />
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>暂无规划</h3>
        <p>创建你的第一个参战规划吧！</p>
      </div>
    </main>

    <!-- 创建规划模态框 -->
    <CreatePlannerModal 
      v-if="showCreateModal" 
      @close="showCreateModal = false"
      @create="handleCreatePlanner"
    />
    
    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-links">
          <a href="/" class="footer-link">🏠 返回工具集首页</a>
          <router-link to="/docs" class="footer-link">📖 使用文档</router-link>
        </div>
        <p class="footer-text">© Torisaboten 2025</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlannerStore } from '@/stores/planner'
import PlannerCard from '@/components/PlannerCard.vue'
import CreatePlannerModal from '@/components/CreatePlannerModal.vue'
import { isWeChatBrowser } from '@/utils/gantt'
import logoSrc from '@/assets/logo.png'

const router = useRouter()
const plannerStore = usePlannerStore()
const showCreateModal = ref(false)

// 组件挂载时加载规划器列表
onMounted(() => {
  plannerStore.loadPlanners()
})

const viewPlanner = (plannerId: string) => {
  if (isWeChatBrowser()) {
    // 微信环境下查看规划需要确认
    if (confirm('检测到您在微信环境中，功能可能受限。\n\n建议在外部浏览器中打开以获得完整体验。\n\n是否仍要继续？')) {
      router.push(`/planner/${plannerId}`)
    }
  } else {
    router.push(`/planner/${plannerId}`)
  }
}

const deletePlanner = (plannerId: string) => {
  if (confirm('确定要删除这个规划吗？此操作无法撤销。')) {
    plannerStore.deletePlanner(plannerId)
  }
}

const tryShowCreateModal = () => {
  if (isWeChatBrowser()) {
    // 微信环境下创建规划需要确认
    if (confirm('检测到您在微信环境中，创建和编辑功能可能受限或无法保存数据。\n\n强烈建议在外部浏览器中打开本页面以获得完整功能。\n\n是否仍要继续创建？')) {
      showCreateModal.value = true
    }
  } else {
    showCreateModal.value = true
  }
}

const handleCreatePlanner = (type: 'single' | 'multiple', data: any) => {
  try {
    const plannerId = plannerStore.createPlanner(type)
    
    // 更新基本信息
    plannerStore.loadPlanner(plannerId)
    plannerStore.updatePlanner(data)
    
    showCreateModal.value = false
    
    // 跳转到详情页
    router.push(`/planner/${plannerId}`)
  } catch (error) {
    console.error('创建规划失败:', error)
    alert('创建规划失败，请重试')
  }
}

const clearAllPlanners = () => {
  if (confirm('确定要清空所有规划吗？此操作无法撤销。')) {
    plannerStore.clearAllPlanners()
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  margin-bottom: 3rem;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.hero-logo {
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
}

.hero .app-author {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.hero p {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.title-section h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-hint {
  color: #6b7280;
  font-size: 0.95rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.planners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 1rem;
  margin-bottom: 2rem;
}

/* 公益callout样式 */
.charity-callout {
  background: linear-gradient(135deg, #E8F5E8 0%, #F0F8F0 100%);
  border: 2px solid #98D982;
  border-radius: 12px;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 15px rgba(152, 217, 130, 0.2);
}

.charity-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.charity-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.charity-text {
  flex: 1;
  text-align: center;
}

.charity-text p {
  margin: 0;
  color: #2D5A2D;
  font-size: 1rem;
  font-weight: 600;
}

.charity-buttons {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.charity-link {
  background: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.charity-link:hover {
  background: #45A049;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    padding: 2rem 0;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .actions-bar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    justify-content: stretch;
  }
  
  .action-buttons .btn {
    flex: 1;
  }
  
  .planners-grid {
    grid-template-columns: 1fr;
  }
  
  .charity-callout {
    padding: 1rem;
  }
  
  .charity-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .charity-icon {
    font-size: 1.5rem;
  }
  
  .charity-text p {
    font-size: 0.9rem;
  }
  
  .charity-buttons {
    flex-direction: row;
    gap: 0.75rem;
  }
  
  .charity-link {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 1.75rem;
  }
  
  .title-section h2 {
    font-size: 1.5rem;
  }
}

/* 页脚样式 */
.app-footer {
  background: #2d3748;
  color: white;
  padding: 2rem 0;
  margin-top: 4rem;
  text-align: center;
}

.footer-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.footer-link {
  color: #e2e8f0;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.footer-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.footer-text {
  margin: 8px 0 0;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
}

@media (max-width: 480px) {
  .footer-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .footer-link {
    display: inline-block;
  }
}
</style> 