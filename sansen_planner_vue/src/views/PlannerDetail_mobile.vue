<template>
  <div class="planner-detail">
    <!-- 顶部标题栏 -->
    <div class="app-header">
      <div class="app-header-content">
        <div class="app-logo">
          <!-- <span id="app-logo-icon">🌸</span> -->
          <img :src="logoSrc" alt="App Logo" style="width: 32px; height: 32px;">
        </div>
        <!-- Wrap title for centering -->
        <div class="app-title-wrapper">
        <div class="app-title">
            <h1>参战计划作成工具</h1>
          <p class="app-author">By Torisaboten</p>
        </div>
        </div>
        <!-- Add a spacer div to balance the logo for justify-content: space-between -->
        <div style="width: 48px;"></div> <!-- Adjust width to match logo or as needed -->
      </div>
    </div>

    <div id="app">
      <!-- 规划器配置页面 -->
      <div id="planner-config-page" class="page active">
        <header class="header">
          <div class="header-content">
            <h2 id="planner-title">
              📅 {{ displayTitle.replace('📅 ', '') }}
            </h2>
          <div class="header-actions">
              <router-link to="/docs" class="btn btn-outline">📖 文档</router-link>
            <router-link to="/" class="btn btn-secondary">↩️ 返回列表</router-link>
            </div>
          </div>
        </header>
        
        <main v-if="planner" class="main-content">
          <div class="planner-container">
            <!-- 左侧：配置和列表 -->
            <div class="planner-left">
              <!-- 基础配置 -->
              <div class="form-section">
                <h3>基础配置</h3>
                
                <div v-if="planner.type === 'multiple'" class="form-group" id="planner-name-group">
                  <label for="planner-name">规划器名称：</label>
                  <input 
                    v-model="planner.name"
                    @input="updatePlanner"
                    type="text" 
                    id="planner-name" 
                    placeholder="例：AKB48新年演唱会参战规划" 
                    autocomplete="off"
                  >
                </div>
                
                <div class="form-group">
                  <label for="planner-date">活动日期：</label>
                  <input 
                    v-model="planner.date"
                    @change="updatePlanner"
                    type="date" 
                    id="planner-date" 
                    autocomplete="off"
                  >
                </div>
                
                <div class="form-group">
                  <label for="planner-timezone">时区设置：</label>
                  <select 
                    v-model="planner.timezone"
                    @change="updatePlanner"
                    id="planner-timezone" 
                    autocomplete="off"
                  >
                    <!-- 常用时区置顶 -->
                    <optgroup label="━━ 常用时区 ━━">
                      <option value="Asia/Bangkok">GMT+7 (泰国)</option>
                      <option value="Asia/Shanghai">GMT+8 (中国大陆)</option>
                      <option value="Asia/Taipei">GMT+8 (台湾)</option>
                      <option value="Asia/Hong_Kong">GMT+8 (香港)</option>
                      <option value="Asia/Macau">GMT+8 (澳门)</option>
                      <option value="Asia/Tokyo">GMT+9 (日本)</option>
                      <option value="Asia/Seoul">GMT+9 (韩国)</option>
                    </optgroup>
                    <!-- 其他时区按顺序排列 -->
                    <optgroup label="━━ 其他时区 ━━">
                    <option value="auto">自动检测本地时区</option>
                      <option value="Pacific/Honolulu">GMT-10 (夏威夷)</option>
                      <option value="America/Anchorage">GMT-9 (阿拉斯加)</option>
                      <option value="America/Los_Angeles">GMT-8 (美国西部)</option>
                      <option value="America/Denver">GMT-7 (美国山区)</option>
                      <option value="America/Chicago">GMT-6 (美国中部)</option>
                      <option value="America/New_York">GMT-5 (美国东部)</option>
                      <option value="Europe/London">GMT+0 (英国)</option>
                      <option value="Europe/Berlin">GMT+1 (德国)</option>
                      <option value="Europe/Moscow">GMT+3 (俄罗斯)</option>
                      <option value="Asia/Dubai">GMT+4 (阿联酋)</option>
                      <option value="Asia/Karachi">GMT+5 (巴基斯坦)</option>
                      <option value="Asia/Kolkata">GMT+5:30 (印度)</option>
                      <option value="Asia/Dhaka">GMT+6 (孟加拉)</option>
                      <option value="Asia/Jakarta">GMT+7 (印尼)</option>
                      <option value="Asia/Manila">GMT+8 (菲律宾)</option>
                      <option value="Asia/Singapore">GMT+8 (新加坡)</option>
                      <option value="Australia/Sydney">GMT+10 (澳大利亚东部)</option>
                      <option value="Pacific/Auckland">GMT+12 (新西兰)</option>
                    </optgroup>
                  </select>
                  <small style="color: #718096; font-size: 0.875rem; margin-top: 0.25rem; display: block;">
                    💡 影响日历导出的时区，建议选择活动举办地时区
                  </small>
                </div>
              </div>
              
              <!-- 单一活动配置 -->
              <div v-if="planner.type === 'single'" id="single-activity-config" class="form-section">
                <h3>活动信息</h3>
                <div class="form-group">
                  <label for="activity-name">活动名称：</label>
                  <input 
                    v-model="planner.activityName"
                    @input="updatePlanner"
                    type="text" 
                    id="activity-name" 
                    placeholder="例：AKB48新年演唱会" 
                    autocomplete="off"
                  >
                </div>
                <div class="form-group">
                  <label for="activity-location">活动地点：</label>
                  <input 
                    v-model="planner.location"
                    @input="updatePlanner"
                    type="text" 
                    id="activity-location" 
                    placeholder="例：东京巨蛋" 
                    autocomplete="off"
                  >
                </div>
              </div>
              
              <!-- 多活动配置 -->
              <div v-if="planner.type === 'multiple'" id="multiple-activities-config" class="form-section">
                <div class="section-header">
                  <h3>活动收集器</h3>
                  <button @click="addActivity" type="button" id="add-activity-card-btn" class="btn btn-primary btn-small">➕ 新建活动卡片</button>
                </div>
                
                <div id="activity-cards-container" class="activity-cards">
                  <div v-if="planner.activities.length === 0" class="empty-state">
                    <div class="empty-state-icon">🎯</div>
                    <div>还没有活动卡片</div>
                    <div style="font-size: 14px; margin-top: 8px;">点击上方按钮创建你的第一个活动</div>
                  </div>
                  
                  <div v-else>
                    <div 
                      v-for="activity in planner.activities" 
                      :key="activity.id"
                      class="activity-card" 
                      :data-activity-id="activity.id"
                    >
                      <div class="activity-card-header">
                        <div class="activity-card-title">{{ activity.name }}</div>
                        <div class="activity-card-location">{{ activity.location || '未设置地点' }}</div>
                        <div class="activity-card-actions">
                          <button @click="editActivity(activity)" class="card-btn edit-activity-btn">✏️</button>
                          <button @click="deleteActivity(activity.id)" class="card-btn delete-activity-btn">🗑️</button>
                        </div>
                      </div>
                      <div class="activity-card-body">
                        <div class="team-cards">
                          <div 
                            v-for="team in getTeamsForActivity(activity.id)" 
                            :key="team.id" 
                            class="team-card" 
                            :data-team-id="team.id"
                          >
                            <div class="team-card-header">
                              <div class="team-card-name">{{ team.name }}</div>
                              <div class="team-card-actions">
                                <button @click="editTeam(team)" class="card-btn edit-team-btn">✏️</button>
                                <button @click="deleteTeam(team.id)" class="card-btn delete-team-btn">🗑️</button>
                              </div>
                            </div>
                            <div class="team-time-slots">
                              <span 
                                v-for="(slot, index) in team.liveSlots" 
                                :key="'live-' + index"
                                class="team-time-chip live"
                              >
                                🎤 {{ formatTimeDisplay(slot.start) }}-{{ formatTimeDisplay(slot.end) }}
                              </span>
                              <span 
                                v-for="(slot, index) in team.tokutenSlots" 
                                :key="'tokuten-' + index"
                                class="team-time-chip tokuten"
                              >
                                🤝 {{ formatTimeDisplay(slot.start) }}-{{ formatTimeDisplay(slot.end) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button @click="createTeamForActivity(activity.id)" class="add-team-btn">
                          ➕ 添加团体
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 团体管理（仅单一活动模式） -->
              <div v-if="planner.type === 'single'" class="form-section" id="single-activity-teams">
                <div class="section-header">
                  <h3 id="teams-section-title">参战团体</h3>
                  <button @click="addTeamSingle" type="button" id="add-team-card-btn" class="btn btn-primary btn-small">➕ 添加团体</button>
                </div>
                
                <div id="teams-container">
                  <div v-if="planner.groups.length === 0" class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <div>还没有添加团体</div>
                    <div style="font-size: 14px; margin-top: 8px;">点击上方按钮添加第一个团体</div>
                  </div>
                  
                  <TeamCard
                    v-for="team in planner.groups"
                    :key="`team-${team.id}-${team.liveSlots.length}-${team.tokutenSlots.length}`"
                    :team="team"
                    :planner="planner"
                    @update="handleTeamUpdate"
                    @delete="handleTeamDelete"
                  />
                </div>
              </div>
            </div>
            
            <!-- 右侧：甘特图 -->
            <div class="planner-right">
              <div class="gantt-container">
                <!-- 微信环境警告 -->
                <div v-if="isWeChatBrowser()" class="wechat-warning-callout">
                  <div class="wechat-warning-icon">⚠️</div>
                  <div class="wechat-warning-content">
                    <h4>微信环境提示</h4>
                    <p>您当前处于微信环境中，您可以进行参战计划配置，但无法导出日历文件和图片。<strong>强烈建议从系统浏览器使用该工具</strong>以获得完整功能。</p>
                    <div class="wechat-guide">
                      <strong>📱 操作指引：</strong>点击右上角"···"菜单 → 选择"在浏览器打开"
                    </div>
                  </div>
                </div>
                
                <div class="section-header">
                  <h3>参战时间表</h3>
                  <div class="export-actions">
                    <button @click="exportImage" id="export-image-btn" class="btn btn-outline btn-small">📷 导出图片</button>
                    <button @click="exportICS" id="export-ics-btn" class="btn btn-outline btn-small">📅 导出日历</button>
                  </div>
                </div>
                
                <div class="gantt-legend">
                  <div class="legend-item">
                    <div class="legend-color legend-live"></div>
                    <span>Live演出</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color legend-tokuten"></div>
                    <span>特典会</span>
                  </div>
                  <div class="legend-item" style="margin-left: 20px; color: #718096; font-size: 12px;">
                    <span>💡 短时间演出请悬浮查看详情</span>
                  </div>
                </div>
                
                <!-- 移动端使用提示 -->
                <div class="mobile-usage-callout">
                  <div class="callout-icon">📱</div>
                  <div class="callout-content">
                    <p>您可以左右滑动来查看完整时间轴。为了获得最佳浏览体验，建议您将规划导出为图片或导入系统日历。</p>
                  </div>
                </div>
                
                <!-- 甘特图容器 -->
                <GanttErrorBoundary
                  ref="ganttErrorBoundaryRef"
                  @retry="handleGanttRetry"
                  @error="handleGanttError"
                >
                  <div class="gantt-chart-container gantt-desktop-view">
                    <div v-show="!hasData" class="empty-gantt">
                      <div class="empty-icon">📊</div>
                      <h3>暂无数据</h3>
                      <p>添加团体和时间安排后，甘特图将在这里显示</p>
                    </div>
                    <!-- 使用key和ref管理的甘特图容器 -->
                    <div 
                      ref="ganttChartRef" 
                      :key="`gantt-${ganttKey}`"
                      v-show="hasData" 
                      class="gantt-chart-content"
                    ></div>
                  </div>
                  
                  <!-- 错误时的备用内容 -->
                  <template #fallback>
                    <div v-if="planner" class="fallback-timeline">
                      <div v-for="team in planner.groups" :key="team.id" class="fallback-team">
                        <h5>{{ team.name }}</h5>
                        <div class="fallback-slots">
                          <div 
                            v-for="(slot, index) in team.liveSlots" 
                            :key="'live-' + index"
                            class="fallback-slot live"
                          >
                            🎤 {{ formatTimeDisplay(slot.start) }}-{{ formatTimeDisplay(slot.end) }}
                            <span v-if="slot.location"> @{{ slot.location }}</span>
                          </div>
                          <div 
                            v-for="(slot, index) in team.tokutenSlots" 
                            :key="'tokuten-' + index"
                            class="fallback-slot tokuten"
                          >
                            🤝 {{ formatTimeDisplay(slot.start) }}-{{ formatTimeDisplay(slot.end) }}
                            <span v-if="slot.location"> @{{ slot.location }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </GanttErrorBoundary>
                
                <!-- 手机端卡片视图 -->
                <div ref="ganttMobileRef" class="gantt-mobile-view">
                  <!-- 手机端视图将在这里动态生成 -->
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="container">
        <p class="footer-text">@Torisaboten 2025 | 完全免费，欢迎分享使用</p>
      </div>
    </footer>
    
    <!-- 团体创建/编辑模态框 -->
    <CreateTeamModal
      v-if="showTeamModal"
      :activity-id="currentActivityId"
      :team="editingTeam"
      :is-edit-mode="isEditMode"
      @save="handleTeamSave"
      @close="closeTeamModal"
    />
    
    <!-- 活动编辑模态框 -->
    <ActivityEditModal
      v-if="showActivityModal && editingActivity"
      :activity="editingActivity"
      @save="handleActivitySave"
      @close="closeActivityModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlannerStore } from '@/stores/planner'
import TeamCard from '@/components/TeamCard.vue'
import CreateTeamModal from '@/components/CreateTeamModal.vue'
import ActivityEditModal from '@/components/ActivityEditModal.vue'
import GanttErrorBoundary from '@/components/GanttErrorBoundary.vue'
import { drawGanttChart, exportGanttAsImage, isWeChatBrowser } from '@/utils/gantt'
import { exportToICS } from '@/utils/export'
import type { Team, Activity } from '@/types/planner'
import logoSrc from '@/assets/logo.png'

const route = useRoute()
const router = useRouter()
const store = usePlannerStore()

// 响应式状态
const showTeamModal = ref(false)
const showActivityModal = ref(false)
const currentActivityId = ref<string>('')
const editingTeam = ref<Team | null>(null)
const editingActivity = ref<Activity | null>(null)
const isEditMode = ref(false)

// 甘特图容器refs
const ganttChartRef = ref<HTMLElement>()
const ganttMobileRef = ref<HTMLElement>()
// 甘特图渲染key，用于强制重新渲染
const ganttKey = ref(0)
// 错误边界ref
const ganttErrorBoundaryRef = ref<InstanceType<typeof GanttErrorBoundary>>()

// 计算属性
const planner = computed(() => store.currentPlanner)
const hasData = computed(() => {
  return planner.value && planner.value.groups.length > 0
})

const displayTitle = computed(() => {
  if (!planner.value) return '📅 新规划器'
  
  let title = ''
  if (planner.value.type === 'single') {
    // 单一活动模式：显示活动名称@地点
    const activityName = planner.value.activityName || '新活动'
    const location = planner.value.location || ''
    title = location ? `${activityName}@${location}` : activityName
  } else {
    // 多活动模式：显示规划器名称
    title = planner.value.name || '新规划器'
  }
  
  return `📅 ${title}`
})

// 方法
const formatTimeDisplay = (timeStr: string): string => {
  const [hours] = timeStr.split(':').map(Number)
  if (hours >= 24) {
    const [h, m] = timeStr.split(':')
    const normalHours = (parseInt(h) - 24).toString().padStart(2, '0')
    return `次日${normalHours}:${m}`
  }
  return timeStr
}

const getTeamsForActivity = (activityId: string) => {
  if (!planner.value) return []
  return planner.value.groups.filter(team => team.activityId === activityId)
}

const updatePlanner = () => {
  if (!planner.value) return
  
  // 单一活动模式下，同步活动名称和规划器名称
  if (planner.value.type === 'single' && planner.value.activityName) {
    planner.value.name = planner.value.activityName
  }
  
  store.updatePlanner({})
  redrawGantt()
}

const addActivity = () => {
  const activity = store.addActivity({
    name: '新活动',
    location: ''
  })
  
  // 自动进入编辑模式
  nextTick(() => {
    editActivity(activity)
  })
}

const editActivity = (activity: Activity) => {
  editingActivity.value = { ...activity }
  showActivityModal.value = true
}

const deleteActivity = (activityId: string) => {
  if (confirm('确定要删除这个活动吗？相关团体也会被删除。')) {
    try {
      store.deleteActivity(activityId)
      redrawGantt()
    } catch (error) {
      console.error('删除活动时出错:', error)
      alert('删除活动失败，请重试')
    }
  }
}

const addTeamSingle = () => {
  console.log('🎯 单一活动模式：打开添加团体弹窗')
  currentActivityId.value = 'single-activity'
  editingTeam.value = null
  isEditMode.value = false
  showTeamModal.value = true
  console.log('📝 弹窗状态已设置:', {
    currentActivityId: currentActivityId.value,
    showTeamModal: showTeamModal.value,
    isEditMode: isEditMode.value
  })
}

const createTeamForActivity = (activityId: string) => {
  console.log('🎯 多活动模式：为活动创建团体', activityId)
  currentActivityId.value = activityId
  editingTeam.value = null
  isEditMode.value = false
  showTeamModal.value = true
  console.log('📝 弹窗状态已设置:', {
    currentActivityId: currentActivityId.value,
    showTeamModal: showTeamModal.value,
    isEditMode: isEditMode.value
  })
}

const editTeam = (team: Team) => {
  editingTeam.value = { ...team }
  currentActivityId.value = team.activityId || 'single-activity'
  isEditMode.value = true
  showTeamModal.value = true
}

const handleTeamDelete = (teamId: string) => {
  console.log('🗑️ 删除团体:', teamId)
  
  try {
    store.deleteTeam(teamId)
    console.log('🔄 团体删除成功，重新渲染甘特图')
    redrawGantt()
  } catch (error) {
    console.error('删除团体时出错:', error)
    alert('删除团体失败，请重试')
  }
}

const deleteTeam = (teamId: string) => {
  if (confirm('确定要删除这个团体吗？')) {
    handleTeamDelete(teamId)
  }
}

const handleTeamUpdate = (teamId: string, updates: Partial<Team>) => {
  store.updateTeam(teamId, updates)
  redrawGantt()
}

const handleTeamSave = (teamData: Omit<Team, 'id'>) => {
  console.log('💾 保存团体数据:', teamData)
  console.log('📝 当前状态:', {
    isEditMode: isEditMode.value,
    editingTeam: editingTeam.value,
    currentActivityId: currentActivityId.value
  })
  
  try {
    if (isEditMode.value && editingTeam.value) {
      console.log('✏️ 更新现有团体:', editingTeam.value.id)
      store.updateTeam(editingTeam.value.id, teamData)
    } else {
      console.log('➕ 创建新团体')
      const newTeam = store.addTeam({
        ...teamData,
        activityId: currentActivityId.value
      })
      console.log('✅ 新团体创建成功:', newTeam)
    }
    
    console.log('🔄 关闭弹窗并重新渲染甘特图')
    closeTeamModal()
    redrawGantt()
  } catch (error) {
    console.error('❌ 保存团体失败:', error)
    alert('保存团体失败，请检查输入数据或重试')
  }
}

const closeTeamModal = () => {
  console.log('❌ 关闭团体弹窗')
  showTeamModal.value = false
  editingTeam.value = null
  currentActivityId.value = ''
  isEditMode.value = false
  console.log('📝 弹窗状态已清理:', {
    showTeamModal: showTeamModal.value,
    editingTeam: editingTeam.value,
    currentActivityId: currentActivityId.value,
    isEditMode: isEditMode.value
  })
}

const handleActivitySave = (activityData: Activity) => {
  if (editingActivity.value) {
    store.updateActivity(editingActivity.value.id, activityData)
  }
  closeActivityModal()
  redrawGantt()
}

const closeActivityModal = () => {
  showActivityModal.value = false
  editingActivity.value = null
}

const redrawGantt = () => {
  console.log('🔄 重新渲染甘特图')
  
  // 增加key强制重新创建甘特图容器
  ganttKey.value++
  console.log('🔑 甘特图key更新为:', ganttKey.value)
  
  nextTick(() => {
    // 使用ref获取甘特图容器
    const container = ganttChartRef.value;
    if (!container) {
      console.warn('⚠️ 甘特图容器ref未准备好');
      return;
    }

    const currentPlanner = planner.value;
    if (!currentPlanner) {
      console.log('❌ 没有规划器');
      return;
    }

    console.log('📊 甘特图状态:', {
      plannerExists: !!currentPlanner,
      teamCount: currentPlanner.groups?.length || 0,
      hasData: hasData.value
    });

    // 如果没有数据，不需要渲染甘特图
    if (!hasData.value) {
      console.log('❌ 没有团体数据，甘特图容器已通过v-show隐藏');
      return;
    }

    // 检查甘特图数据的有效性
    const currentGanttData = store.ganttData;
    const currentTimeRange = store.timeRange;
    
    console.log('📊 甘特图数据检查:', {
      ganttDataLength: currentGanttData.length,
      timeRange: currentTimeRange,
      hasValidData: currentGanttData.length > 0 && currentTimeRange.start < currentTimeRange.end
    });

    // 如果甘特图数据无效，不渲染
    if (!currentGanttData || currentGanttData.length === 0) {
      console.log('❌ 甘特图数据为空');
      return;
    }

    // 检查是否有有效的时间段
    const hasValidTimeSlots = currentGanttData.some(teamData => 
      teamData.liveBars.length > 0 || teamData.tokutenBars.length > 0
    );

    if (!hasValidTimeSlots) {
      console.log('❌ 没有有效的时间段');
      return;
    }

    // 渲染甘特图到新的容器中
    console.log('✅ 开始渲染甘特图到新容器');
    console.log('甘特图数据:', currentGanttData);
    console.log('时间范围:', currentTimeRange);
    
    try {
      // 由于使用了key，容器是全新的，可以安全地渲染
      drawGanttChart(container, currentGanttData, currentTimeRange);
      console.log('✅ 甘特图渲染完成');
    } catch (error) {
      console.error('❌ 甘特图渲染出错:', error);
    }
  });
};

// 添加窗口resize事件监听
const handleResize = () => {
  console.log('🔄 窗口大小变化，重新渲染甘特图')
  redrawGantt()
}

const exportImage = async () => {
  if (!planner.value || !hasData.value) {
    alert('没有可导出的甘特图数据')
    return
  }
  
  // 使用ref获取甘特图容器
  const container = ganttChartRef.value
  if (!container) {
    alert('找不到甘特图容器')
    return
  }
  
  try {
    // 使用完整的导出图片功能
    const plannerName = planner.value.type === 'single' 
      ? (planner.value.activityName || '参战规划')
      : (planner.value.name || '参战规划')
    
    const plannerDate = planner.value.date || new Date().toLocaleDateString()
    
    await exportGanttAsImage(
      container,
      store.ganttData,
      store.timeRange,
      plannerName,
      plannerDate
    )
  } catch (error) {
    console.error('导出图片失败:', error)
    alert('导出图片失败，请重试')
  }
}

const exportICS = () => {
  if (!planner.value) return
  
  try {
    exportToICS(planner.value)
  } catch (error) {
    console.error('导出日历失败:', error)
    alert('导出日历失败，请重试')
  }
}

// 错误边界处理函数
const handleGanttError = (error: Error) => {
  console.error('🚨 甘特图发生错误:', error)
  
  // 可以在这里添加错误上报逻辑
  // reportError('gantt-render-error', error)
  
  // 显示用户友好的提示
  if (error.message.includes('insertBefore') || error.message.includes('nextSibling')) {
    console.warn('⚠️ 检测到DOM操作冲突，这通常是临时问题')
  }
}

const handleGanttRetry = () => {
  console.log('🔄 处理甘特图重试请求')
  
  try {
    // 重置错误边界状态
    if (ganttErrorBoundaryRef.value) {
      ganttErrorBoundaryRef.value.resetError()
    }
    
    // 强制重新渲染甘特图
    ganttKey.value++
    console.log('🔑 甘特图key更新为:', ganttKey.value)
    
    // 重新绘制甘特图
    nextTick(() => {
      redrawGantt()
    })
  } catch (error) {
    console.error('❌ 甘特图重试失败:', error)
    alert('重试失败，请刷新页面或联系支持')
  }
}

// 生命周期
onMounted(() => {
  const plannerId = route.params.id as string
  
  if (!plannerId) {
    router.push('/')
    return
  }
  
  store.loadPlanners()
  const success = store.loadPlanner(plannerId)
  
  if (!success) {
    alert('规划器不存在，将返回主页')
    router.push('/')
    return
  }
  
  // 初始化甘特图
  nextTick(() => {
    redrawGantt()
  })
  
  // 添加窗口resize事件监听
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 导入原版的样式结构 */
.planner-detail {
  min-height: 100vh;
  background: #f5f5f5;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.app-header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  min-height: 48px;
}

.app-logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.app-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-logo span {
  font-size: 24px;
}

/* New wrapper for true centering of app title */
.app-title-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.app-title h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.app-author {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.header {
  background: white;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  max-width: calc(100vw - 40px);
  margin: 0 auto;
  padding: 0 20px;
}

.header-content h2 {
  margin: 0;
  flex: 1;
  min-width: 0;
  color: #2d3748;
  font-size: 1.75rem;
  font-weight: 600;
  text-align: left;
  padding-left: 1.5rem;
}

.header-actions {
  flex-shrink: 0;
}

.main-content {
  max-width: calc(100vw - 40px);
  margin: 0 auto;
  padding: 0 20px;
}

.planner-container {
  display: flex;
  gap: 1.5rem;
  min-height: calc(100vh - 200px);
}

.planner-left {
  flex: 0 0 550px;
  min-width: 550px;
  max-width: 550px;
}

.planner-right {
  flex: 1;
  min-width: 0;
  overflow: hidden; /* 防止内容溢出 */
}

.form-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.125rem;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
}

.empty-state-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.activity-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.activity-card-header {
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-card-title {
  font-weight: 600;
  color: #2d3748;
}

.activity-card-location {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: none;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  color: #6b7280;
}

.card-btn:hover {
  background: #fee2e2;
  color: #ef4444;
  transform: scale(1.05);
}

.activity-card-body {
  padding: 1rem;
}

.team-cards {
  margin-bottom: 1rem;
}

.team-card {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.team-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.team-card-name {
  font-weight: 500;
  color: #374151;
}

.team-card-actions {
  display: flex;
  gap: 0.25rem;
}

.team-time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.team-time-chip {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #2d3748;
}

.team-time-chip.live {
  background: #a8d8b9;
}

.team-time-chip.tokuten {
  background: #fedfe1;
}

.add-team-btn {
  width: 100%;
  padding: 0.5rem;
  background: #f3f4f6;
  border: 1px dashed #9ca3af;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-team-btn:hover {
  background: #e5e7eb;
  border-color: #6b7280;
  color: #374151;
}

.gantt-container {
  width: 100%;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem; /* 减少padding以保持一致的间距 */
  min-height: 400px;
  position: sticky;
  top: 1rem;
  overflow: hidden; /* 确保容器边界 */
}

.export-actions {
  display: flex;
  gap: 0.5rem;
}

.gantt-legend {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.legend-live {
  background: #a8d8b9;
}

.legend-tokuten {
  background: #fedfe1;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
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

.btn-outline {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background: #f3f4f6;
}

.btn-small {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .planner-container {
    flex-direction: column;
  }
  
  .planner-left {
    flex: none;
    min-width: auto;
    max-width: none;
  }
  
  .gantt-container {
    position: static;
  }
  
  /* 微信环境警告移动端优化 */
  .wechat-warning-callout {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }
  
  .wechat-warning-icon {
    font-size: 18px;
    margin-top: 0;
    align-self: flex-start;
  }
  
  .wechat-warning-content h4 {
    font-size: 15px;
  }
  
  .wechat-warning-content p {
    font-size: 13px;
  }
  
  .wechat-guide {
    font-size: 12px;
    padding: 8px 10px;
  }
}

/* 响应式调整 */
@media (max-width: 576px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .header-content h2 {
    text-align: center;
    font-size: 1.5rem;
  }
  
  .header-actions {
    align-self: center;
  }
}

/* Smaller screen adjustments for Gantt header */
@media (max-width: 480px) {
  .gantt-container .section-header {
    flex-direction: column; /* Stack title and actions */
    align-items: flex-start; /* Align items to the start */
    gap: 0.75rem; /* Space between title and actions block */
  }

  .gantt-container .section-header h3 {
    font-size: 1.1rem; /* Slightly reduce title font size if needed */
  }

  .gantt-container .section-header .export-actions {
    width: 100%; /* Make actions block take full width */
    justify-content: flex-start; /* Align buttons to the start */
  }

  .gantt-container .section-header .export-actions .btn-small {
    font-size: 0.75rem; /* Maintain button font size or slightly reduce */
    padding: 0.375rem 0.6rem; /* Adjust padding if text still wraps */
    white-space: nowrap; /* Prevent text inside buttons from wrapping */
  }
}

/* 备用时间表样式 */
.fallback-timeline {
  max-height: 300px;
  overflow-y: auto;
}

.fallback-team {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.fallback-team h5 {
  margin: 0 0 0.75rem 0;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
}

.fallback-slots {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fallback-slot {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.fallback-slot.live {
  background: #a8d8b9;
  color: #2d3748;
}

.fallback-slot.tokuten {
  background: #fedfe1;
  color: #2d3748;
}

.fallback-slot span {
  font-weight: 400;
  opacity: 0.8;
}

/* 微信环境警告callout样式 */
.wechat-warning-callout {
  display: flex;
  gap: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #f39c12;
  border-left: 4px solid #e67e22;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(243, 156, 18, 0.2);
}

.wechat-warning-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.wechat-warning-content {
  flex: 1;
  min-width: 0;
}

.wechat-warning-content h4 {
  margin: 0 0 8px 0;
  color: #d68910;
  font-size: 16px;
  font-weight: 600;
}

.wechat-warning-content p {
  margin: 0 0 12px 0;
  color: #873600;
  line-height: 1.5;
  font-size: 14px;
}

.wechat-guide {
  background: rgba(230, 126, 34, 0.1);
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #873600;
  border: 1px solid rgba(230, 126, 34, 0.2);
}

.wechat-guide strong {
  color: #d68910;
}

/* 移动端使用提示样式 */
.mobile-usage-callout {
  display: flex;
  gap: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid #2196f3;
  border-left: 4px solid #1976d2;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
}

.mobile-usage-callout .callout-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.mobile-usage-callout .callout-content {
  flex: 1;
  min-width: 0;
}

.mobile-usage-callout .callout-content p {
  margin: 0;
  color: #0d47a1;
  line-height: 1.5;
  font-size: 14px;
}
</style>

<!-- 甘特图全局样式 -->
<style>
.gantt-chart-container {
  /* 移动端甘特图容器样式优化 */
  min-width: 100%;
  width: 100%;
  max-height: calc(100vh - 100px); /* 移动端更宽松的高度限制 */
  overflow-x: auto;
  overflow-y: visible; /* 改为visible，让sticky定位生效 */
  -webkit-overflow-scrolling: touch;
  border-radius: 6px;
}

.gantt-chart-container:active {
  cursor: grabbing; /* 拖动时的光标 */
}

/* iPad 优化样式 */
@media only screen and (max-width: 1024px) and (min-width: 768px), 
       only screen and (-webkit-min-device-pixel-ratio: 1.5) and (max-device-width: 1024px) {
  .gantt-chart-container {
    min-width: 600px; /* iPad 减少最小宽度 */
    -webkit-overflow-scrolling: touch; /* 优化触摸滚动 */
  }
  
  .gantt-container {
    padding: 0.75rem; /* iPad上进一步减少padding */
  }
}

/* 移动端优化样式 */
@media only screen and (max-width: 768px) {
  .gantt-chart-container {
    min-width: 400px; /* 移动端进一步减少最小宽度 */
    -webkit-overflow-scrolling: touch;
    /* 移动端增强触摸体验 */
    overscroll-behavior-x: contain; /* 防止过度滚动 */
  }
  
  .gantt-container {
    padding: 0.5rem; /* 移动端最小padding */
    position: static; /* 移动端不使用sticky */
    margin: 0; /* 确保没有额外margin */
  }
  
  .planner-container {
    flex-direction: column; /* 移动端垂直布局 */
    gap: 1rem; /* 控制间距 */
  }
  
  .planner-left {
    flex: none;
    min-width: auto;
    max-width: none;
    width: 100%;
  }
  
  .planner-right {
    flex: none;
    width: 100%;
    min-width: auto;
  }
  
  /* 移动端显示手机端甘特图视图 */
  .gantt-desktop-view {
    display: none; /* 隐藏桌面版甘特图 */
  }
  
  .gantt-mobile-view {
    display: block; /* 显示移动端甘特图 */
  }
}

.gantt-chart-content {
  min-width: 100%;
  max-height: calc(100vh - 100px);
  overflow-y: auto; /* 将垂直滚动移到内容层 */
}

.gantt-header {
  position: sticky;
  top: 0;
  background: #f8f9fa; /* 改回灰色，保持视觉统一 */
  z-index: 30; /* 提高z-index确保置顶 */
  height: 48px;
  display: flex;
  align-items: center;
}

.gantt-body {
  min-width: 800px; /* 确保最小宽度匹配时间轴内容 */
  background: #ffffff;
  /* 用背景图像绘制完整的分割线 */
  background-image: linear-gradient(to bottom, #f1f3f4 1px, transparent 1px);
  background-size: 100% 56px; /* 56px 是每个 gantt-row 的高度 */
  border-top: 1px solid #f1f3f4; /* 保留顶部的第一条线 */
  border-bottom: 1px solid #f1f3f4; /* 添加一条永远完整的底线 */
}

.gantt-row {
  display: flex;
  align-items: center;
  min-height: 56px;
  /* 移除 border-bottom，改用背景线绘制分割线 */
  /* border-bottom: 1px solid #f1f3f4; */
  /* 移除白色背景，让垂直分割线自然贯穿 */
  /* background: #ffffff; */
}

.gantt-activity-header {
  background: #e3f2fd;
  font-weight: 600;
  padding: 0;
  border-bottom: 1px solid #bbdefb;
  border-top: 1px solid #bbdefb;
  min-height: 56px;
  color: #1565c0;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 15; /* 高于普通行但低于时间轴，避免滚动时覆盖固定头部 */
}

.gantt-activity-header .activity-name {
  background: #e3f2fd !important; /* 强制保持蓝色背景 */
  font-weight: 600;
  font-size: 15px;
  color: #1565c0;
  width: var(--dynamic-left-panel-width, 160px);
  min-width: var(--dynamic-left-panel-width, 160px);
  padding: 0 12px;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-header-timeline {
  flex: 1;
  background: #e3f2fd;
  position: relative;
  min-height: 56px;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 15; /* 与活动头部保持相同层级 */
}

.activity-location-text {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: #1976d2;
  font-weight: 500;
  width: calc(100% - 32px);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 2; /* 确保地点文字在时间竖线之上 */
}

.gantt-left-panel {
  width: var(--dynamic-left-panel-width, 160px);
  min-width: var(--dynamic-left-panel-width, 160px);
  padding: 0 12px;
  background: #f8f9fa; /* 改回灰色，与header保持一致 */
  text-align: right;
  font-size: 14px;
  color: #5f6368;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 只有非活动头部的行才使用白色背景 */
.gantt-row:not(.gantt-activity-header) .gantt-left-panel {
  background: #ffffff;
}

/* 限制timeline样式只对非头部元素生效 */
.gantt-body .gantt-timeline {
  flex: 1;
  position: relative;
  min-height: 56px;
  padding: 8px 0;
  /* 移除白色背景，让垂直分割线自然贯穿 */
  /* background: #ffffff; */
  width: 100%; /* 确保占满宽度 */
  z-index: 10; /* 确保timeline容器覆盖在时间轴线之上 */
}

.gantt-time-header {
  display: flex;
  position: relative;
  height: 56px;
  background: #f8f9fa !important; /* 强制使用灰色背景，避免被覆盖 */
  width: 100%; /* 确保占满宽度 */
  overflow: visible; /* 允许分割线延伸到容器外 */
  z-index: 20; /* 确保时间头部在时间线之上 */
}

/* 确保时间轴头部不受gantt-timeline白色背景影响 */
.gantt-header .gantt-time-header {
  background: #f8f9fa !important;
}

/* 更强的选择器确保时间轴头部背景不被覆盖 */
.gantt-chart-content .gantt-header .gantt-time-header {
  background: #f8f9fa !important;
}

.gantt-time-mark {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%); /* 居中对齐到精确时间点 */
  pointer-events: none;
  z-index: 2;
}

.time-label {
  font-size: 12px;
  color: #5f6368;
  font-weight: 500;
  position: relative;
  z-index: 25; /* 提高时间标签层级 */
  margin-top: 4px;
  white-space: nowrap;
}

/* 时间参考线样式（用于2小时间隔时的虚线） */
.gantt-time-reference {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  border-left: 1px dashed #bdbdbd;
  opacity: 0.6;
  pointer-events: none;
}

.gantt-timeline-reference {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  border-left: 1px dashed #bdbdbd;
  opacity: 0.6;
  pointer-events: none;
}

.gantt-time-bar {
  position: absolute;
  height: 36px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #2d3748;
  cursor: pointer;
  font-weight: 500;
  top: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 20px; /* 确保最小宽度 */
  z-index: 5; /* 确保活动时段块覆盖在时间轴竖直线之上 */
}

.gantt-time-bar:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.gantt-time-bar.live {
  background: #A8D8B9;
  border-left: 4px solid #4caf50;
}

.gantt-time-bar.tokuten {
  background: #FEDFE1;
  border-left: 4px solid #e91e63;
}

.gantt-time-bar.has-overlap {
  height: 24px;
  font-size: 9px;
}

.gantt-time-bar.live.has-overlap {
  top: 2px;
}

.gantt-time-bar.tokuten.has-overlap {
  top: 30px;
}

.gantt-time-bar.tokuten-overlap {
  top: 30px;
}

/* 移动端小元素触摸优化 */
.gantt-time-bar.touch-friendly {
  /* 增大小元素的触摸区域 */
  min-width: 20px !important;
  position: relative;
}

.gantt-time-bar.touch-friendly::before {
  content: '';
  position: absolute;
  left: -8px;
  right: -8px;
  top: -6px;
  bottom: -6px;
  z-index: -1;
  background: transparent;
}

/* 工具提示样式优化 */
.gantt-tooltip {
  position: fixed; /* 改为fixed定位，避免被容器overflow裁剪 */
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  z-index: 9999;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  transform: translateX(-50%);
  max-width: 280px;
  min-width: 120px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.gantt-tooltip.show {
  opacity: 1;
  visibility: visible;
}

.gantt-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.95);
}

/* 当tooltip显示在下方时，箭头指向上方 */
.gantt-tooltip.tooltip-below::after {
  top: -10px;
  border-top-color: transparent;
  border-bottom-color: rgba(0, 0, 0, 0.95);
}

/* 空状态样式 */
.empty-gantt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #9ca3af;
  text-align: center;
}

.empty-gantt h3 {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 18px;
}

.empty-gantt p {
  margin: 0;
  font-size: 14px;
  color: #9ca3af;
}

/* 手机端甘特图样式 */
@media (max-width: 768px) {
  .planner-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .planner-left {
    order: 1;
    flex: none;
    min-width: auto;
    max-width: none;
  }
  
  .planner-right {
    order: 0;
    flex: none;
  }
  
  .gantt-chart-container {
    /* 简化手机端甘特图容器样式 */
    min-width: 100%;
    width: 100%;
    max-height: calc(100vh - 100px); /* 移动端更宽松的高度限制 */
    overflow-x: auto;
    overflow-y: auto; /* 启用垂直滚动 */
    -webkit-overflow-scrolling: touch;
    border-radius: 6px;
  }
  
  .gantt-chart-content {
    min-width: 600px; /* 减少最小宽度要求 */
  }
  
  .gantt-left-panel {
    min-width: 80px;
    width: 80px;
    font-size: 11px;
    padding: 0 4px;
  }
  
  .gantt-time-header {
    min-width: 520px; /* 相应减少时间轴宽度 */
    background: #f8f9fa !important; /* 确保响应式下的时间轴头部背景 */
  }
  
  .gantt-row {
    min-height: 40px;
  }
  
  /* 手机端背景线调整 */
  .gantt-body {
    background-size: 100% 40px; /* 手机端行高调整为40px */
  }
  
  .gantt-body {
    min-width: 520px; /* 确保手机端最小宽度匹配时间轴内容 */
  }
  
  .gantt-body .gantt-timeline {
    min-width: 520px; /* 相应减少时间轴宽度 */
  }
  

  
  .gantt-time-bar {
    height: 28px;
    top: 6px;
    font-size: 9px;
    min-width: 16px;
    z-index: 5 !important; /* 确保活动时段块覆盖在时间轴竖直线之上 */
  }
  
  .gantt-time-bar.has-overlap {
    height: 20px;
    font-size: 8px;
  }
  
  .gantt-time-bar.live.has-overlap {
    top: 2px;
  }
  
  .gantt-time-bar.tokuten.has-overlap {
    top: 22px;
  }
  
  .time-label {
    font-size: 10px;
  }

  /* 时间参考线样式（用于2小时间隔时的虚线） */
  .gantt-time-reference {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    border-left: 1px dashed #bdbdbd;
    opacity: 0.6;
    pointer-events: none;
  }

  .gantt-timeline-reference {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    border-left: 1px dashed #bdbdbd;
    opacity: 0.6;
    pointer-events: none;
  }
  
  /* 手机端活动头部样式 */
  .gantt-activity-header .activity-name {
    background: #e3f2fd !important; /* 强制保持蓝色背景 */
    font-weight: 600;
    font-size: 11px;
    color: #1565c0;
    min-width: 80px;
    width: 80px;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .activity-header-timeline {
    background: #e3f2fd;
    min-width: 520px;
  }
  
  .activity-location-text {
    font-size: 11px;
    left: 8px;
  }
  
  /* 手机端特定的甘特图样式 */
  .main-content {
    padding: 0 0.5rem;
  }
  
  .gantt-container {
    padding: 1rem;
    position: static;
  }
}

/* 默认隐藏手机视图 */
.gantt-mobile-view {
  display: none;
}

.gantt-desktop-view {
  display: block;
}

/* 页脚样式 */
.app-footer {
  background: #2d3748;
  color: white;
  padding: 2rem 0;
  margin-top: 4rem;
  text-align: center;
}

.footer-text {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}
</style> 