<template>
  <div class="lottery-config">
    <header class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>{{ isEditing ? '🔧 编辑抽奖配置' : '✨ 创建新抽奖' }}</h1>
          <div class="header-actions">
            <router-link to="/" class="btn btn-secondary">
              🏠 返回主页
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="container">
      <div class="config-layout">
        <!-- 左侧：配置表单 -->
        <div class="config-panel">
          <form @submit.prevent="handleSubmit" class="config-form">
            <!-- 抽奖类型选择 -->
            <div class="card">
              <div class="card-header">
                <h3>🎯 抽奖类型</h3>
              </div>
              <div class="card-body">
                <div class="type-selection">
                  <label class="type-option" :class="{ active: config.type === 'ichiban' }">
                    <input
                      v-model="config.type"
                      type="radio"
                      value="ichiban"
                      @change="handleTypeChange"
                    >
                    <div class="type-card">
                      <div class="type-icon">🎲</div>
                      <h4>一番赏模式</h4>
                      <p>传统一番赏抽奖，支持多箱设置和LAST赏机制</p>
                    </div>
                  </label>
                  
                  <label class="type-option" :class="{ active: config.type === 'probability' }">
                    <input
                      v-model="config.type"
                      type="radio"
                      value="probability"
                      @change="handleTypeChange"
                    >
                    <div class="type-card">
                      <div class="type-icon">🎰</div>
                      <h4>概率抽奖模式</h4>
                      <p>基于权重的概率抽奖，每个奖项设置获奖概率</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- 基础配置 -->
            <div class="card">
              <div class="card-header">
                <h3>⚙️ 基础配置</h3>
              </div>
              <div class="card-body">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label" for="lottery-name">
                      抽奖名称 <span class="required">*</span>
                    </label>
                    <input
                      id="lottery-name"
                      v-model="config.name"
                      type="text"
                      class="form-input"
                      placeholder="例如：春节活动抽奖"
                      :class="{ error: errors.name }"
                      @blur="validateName"
                    >
                    <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                  </div>

                  <div v-if="config.type === 'ichiban'" class="form-group">
                    <label class="form-label" for="total-boxes">
                      总箱数
                    </label>
                    <input
                      id="total-boxes"
                      v-model.number="config.totalBoxes"
                      type="number"
                      class="form-input"
                      placeholder="0表示无限箱数"
                      min="0"
                      @blur="validateTotalBoxes"
                    >
                    <small class="form-hint">设置为0表示无限箱数，非0表示限定箱数</small>
                  </div>

                  <div v-if="config.type === 'ichiban'" class="form-group">
                    <label class="checkbox-label">
                      <input
                        v-model="config.includeLastPrize"
                        type="checkbox"
                        class="form-checkbox"
                      >
                      <span class="checkbox-text">启用LAST赏</span>
                    </label>
                    <small class="form-hint">每箱最后一次抽奖额外获得的特殊奖励</small>
                  </div>

                  <div v-if="config.type === 'ichiban' && config.includeLastPrize" class="form-group">
                    <label for="lastPrizeName" class="form-label">LAST赏名称</label>
                    <input
                      id="lastPrizeName"
                      v-model="config.lastPrizeName"
                      type="text"
                      class="form-input"
                      placeholder="例如：特别奖、最后一击奖、LAST赏"
                      maxlength="20"
                    >
                    <small class="form-hint">自定义LAST赏的显示名称</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- 奖项配置 -->
            <div class="card">
              <div class="card-header">
                <h3>🎁 奖项配置</h3>
                <button type="button" @click="addPrize" class="btn btn-primary btn-sm">
                  ➕ 添加奖项
                </button>
              </div>
              <div class="card-body">
                <div v-if="config.prizes.length === 0" class="empty-prizes">
                  <div class="empty-icon">🎁</div>
                  <p>还没有添加任何奖项</p>
                  <button type="button" @click="addPrize" class="btn btn-primary">
                    添加第一个奖项
                  </button>
                </div>

                <div v-else class="prizes-list">
                  <div
                    v-for="(prize, index) in config.prizes"
                    :key="prize.id"
                    class="prize-item"
                    :class="{ error: errors.prizes && errors.prizes[index] }"
                  >
                    <div class="prize-header">
                      <span class="prize-number"># {{ index + 1 }}</span>
                      <button
                        type="button"
                        @click="removePrize(index)"
                        class="btn btn-danger btn-sm"
                        :disabled="config.prizes.length === 1"
                      >
                        🗑️ 删除
                      </button>
                    </div>

                    <div class="prize-form">
                      <div class="form-group">
                        <label class="form-label">
                          奖项等级 <span class="required">*</span>
                        </label>
                        <input
                          v-model="prize.level"
                          type="text"
                          class="form-input"
                          placeholder="例如：A赏、B赏、特等奖等"
                          @blur="validatePrize(index)"
                        >
                      </div>

                      <div class="form-group">
                        <label class="form-label">
                          奖项描述 <span class="required">*</span>
                        </label>
                        <input
                          v-model="prize.description"
                          type="text"
                          class="form-input"
                          placeholder="例如：限定手办、周边礼品等"
                          @blur="validatePrize(index)"
                        >
                      </div>

                      <div v-if="config.type === 'ichiban'" class="form-group">
                        <label class="form-label">
                          每箱数量 <span class="required">*</span>
                        </label>
                        <input
                          v-model.number="prize.count"
                          type="number"
                          class="form-input"
                          placeholder="每箱包含的奖品数量"
                          min="1"
                          @blur="validatePrize(index)"
                        >
                      </div>

                      <div v-else class="form-group">
                        <label class="form-label">
                          获奖概率 (%) <span class="required">*</span>
                        </label>
                        <input
                          v-model.number="prize.probability"
                          type="number"
                          class="form-input"
                          placeholder="0-100之间的数值"
                          min="0"
                          max="100"
                          step="0.1"
                          @blur="validatePrize(index)"
                        >
                      </div>
                    </div>

                    <div v-if="errors.prizes && errors.prizes[index]" class="error-messages">
                      <div v-for="error in errors.prizes[index]" :key="error" class="error-message">
                        {{ error }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 概率抽奖总和提示 -->
                <div v-if="config.type === 'probability' && config.prizes.length > 0" class="probability-summary">
                  <div class="summary-item" :class="{ error: totalProbability !== 100 }">
                    <span class="summary-label">概率总和：</span>
                    <span class="summary-value">{{ totalProbability.toFixed(1) }}%</span>
                  </div>
                  <div v-if="totalProbability !== 100" class="error-message">
                    所有奖项的概率总和必须等于100%
                  </div>
                </div>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary btn-large"
                :disabled="!isFormValid"
              >
                {{ isEditing ? '💾 保存配置' : '🎯 创建抽奖' }}
              </button>
              
              <button
                v-if="!isEditing"
                type="button"
                @click="addSamplePrizes"
                class="btn btn-outline btn-large"
              >
                ✨ 使用示例配置
              </button>
            </div>
          </form>
        </div>

        <!-- 右侧：预览面板 -->
        <div class="preview-panel">
          <div class="card">
            <div class="card-header">
              <h3>👀 配置预览</h3>
            </div>
            <div class="card-body">
              <div class="preview-content">
                <div class="preview-item">
                  <span class="preview-label">抽奖名称：</span>
                  <span class="preview-value">{{ config.name || '未设置' }}</span>
                </div>
                
                <div class="preview-item">
                  <span class="preview-label">抽奖类型：</span>
                  <span class="preview-value">
                    {{ config.type === 'ichiban' ? '一番赏模式' : '概率抽奖模式' }}
                  </span>
                </div>

                <div v-if="config.type === 'ichiban'" class="preview-item">
                  <span class="preview-label">总箱数：</span>
                  <span class="preview-value">
                    {{ config.totalBoxes === 0 ? '无限箱数' : `${config.totalBoxes}箱` }}
                  </span>
                </div>

                <div v-if="config.type === 'ichiban'" class="preview-item">
                  <span class="preview-label">LAST赏：</span>
                  <span class="preview-value">
                    {{ config.includeLastPrize ? `启用 (${config.lastPrizeName})` : '禁用' }}
                  </span>
                </div>

                <div class="preview-item">
                  <span class="preview-label">奖项数量：</span>
                  <span class="preview-value">{{ config.prizes.length }}个</span>
                </div>

                <div v-if="config.prizes.length > 0" class="preview-prizes">
                  <h4>奖项列表：</h4>
                  <div class="preview-prize-list">
                    <div
                      v-for="(prize, index) in config.prizes"
                      :key="prize.id"
                      class="preview-prize-item"
                    >
                      <span class="prize-level">{{ prize.level || `奖项${index + 1}` }}</span>
                      <span class="prize-info">
                        {{ prize.description || '未设置描述' }}
                        <span v-if="config.type === 'ichiban'" class="prize-count">
                          ({{ prize.count || 0 }}个/箱)
                        </span>
                        <span v-else class="prize-probability">
                          ({{ prize.probability || 0 }}%)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div v-if="config.type === 'ichiban' && config.prizes.length > 0" class="preview-stats">
                  <h4>统计信息：</h4>
                  <div class="stats-item">
                    <span class="stats-label">每箱总奖品：</span>
                    <span class="stats-value">{{ totalPrizesPerBox }}个</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 快速操作 -->
          <div class="card">
            <div class="card-header">
              <h3>🚀 快速操作</h3>
            </div>
            <div class="card-body">
              <div class="quick-actions">
                <button
                  type="button"
                  @click="clearAll"
                  class="btn btn-outline btn-full"
                >
                  🗑️ 清空所有配置
                </button>
                
                <button
                  v-if="isEditing"
                  type="button"
                  @click="previewLottery"
                  class="btn btn-primary btn-full"
                  :disabled="!isFormValid"
                >
                  🎯 预览抽奖
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLotteryStore } from '@/stores/lottery'
import type { LotteryConfig, Prize } from '@/types/lottery'

const router = useRouter()
const lotteryStore = useLotteryStore()

// Props
const props = defineProps<{
  id?: string
}>()

// 响应式数据
const isEditing = computed(() => !!props.id)

const config = reactive<LotteryConfig>({
  name: '',
  type: 'ichiban',
  totalBoxes: 0,
  includeLastPrize: true,
  lastPrizeName: 'LAST赏',
  prizes: []
})

const errors = reactive<{
  name?: string
  totalBoxes?: string
  prizes?: Array<string[]>
}>({})

// 计算属性
const totalProbability = computed(() => {
  if (config.type !== 'probability') return 0
  return config.prizes.reduce((sum, prize) => sum + (prize.probability || 0), 0)
})

const totalPrizesPerBox = computed(() => {
  if (config.type !== 'ichiban') return 0
  return config.prizes.reduce((sum, prize) => sum + (prize.count || 0), 0)
})

const isFormValid = computed(() => {
  // 基础验证
  if (!config.name.trim()) return false
  if (config.prizes.length === 0) return false
  
  // 奖项验证
  for (const prize of config.prizes) {
    if (!prize.level.trim() || !prize.description.trim()) return false
    
    if (config.type === 'ichiban') {
      if (!prize.count || prize.count < 1) return false
    } else {
      if (prize.probability === undefined || prize.probability < 0 || prize.probability > 100) return false
    }
  }
  
  // 概率抽奖总和验证
  if (config.type === 'probability' && totalProbability.value !== 100) {
    return false
  }
  
  return true
})

// 方法
const generatePrizeId = (): string => {
  return 'prize_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

const addPrize = (): void => {
  const newPrize: Prize = {
    id: generatePrizeId(),
    level: '',
    description: '',
    count: config.type === 'ichiban' ? 1 : undefined,
    probability: config.type === 'probability' ? 0 : undefined
  }
  
  config.prizes.push(newPrize)
}

const removePrize = (index: number): void => {
  if (config.prizes.length > 1) {
    config.prizes.splice(index, 1)
    // 清除相应的错误信息
    if (errors.prizes && errors.prizes[index]) {
      errors.prizes.splice(index, 1)
    }
  }
}

const handleTypeChange = (): void => {
  // 切换类型时清空奖项重新开始
  config.prizes = []
  errors.prizes = []
  
  // 重置相关配置
  if (config.type === 'probability') {
    config.totalBoxes = 0
    config.includeLastPrize = false
  } else {
    config.includeLastPrize = true
  }
}

const validateName = (): void => {
  if (!config.name.trim()) {
    errors.name = '抽奖名称不能为空'
  } else if (config.name.length > 50) {
    errors.name = '抽奖名称不能超过50个字符'
  } else {
    delete errors.name
  }
}

const validateTotalBoxes = (): void => {
  if (config.totalBoxes < 0) {
    config.totalBoxes = 0
  }
  delete errors.totalBoxes
}

const validatePrize = (index: number): void => {
  const prize = config.prizes[index]
  const prizeErrors: string[] = []
  
  if (!prize.level.trim()) {
    prizeErrors.push('奖项等级不能为空')
  }
  
  if (!prize.description.trim()) {
    prizeErrors.push('奖项描述不能为空')
  }
  
  if (config.type === 'ichiban') {
    if (!prize.count || prize.count < 1) {
      prizeErrors.push('每箱数量必须大于0')
    }
  } else {
    if (prize.probability === undefined || prize.probability < 0) {
      prizeErrors.push('获奖概率不能小于0')
    } else if (prize.probability > 100) {
      prizeErrors.push('获奖概率不能大于100')
    }
  }
  
  if (!errors.prizes) {
    errors.prizes = []
  }
  
  if (prizeErrors.length > 0) {
    errors.prizes[index] = prizeErrors
  } else {
    delete errors.prizes[index]
  }
}

const addSamplePrizes = (): void => {
  if (config.type === 'ichiban') {
    config.prizes = [
      {
        id: generatePrizeId(),
        level: 'A赏',
        description: '超稀有限定手办',
        count: 1
      },
      {
        id: generatePrizeId(),
        level: 'B赏',
        description: '精美周边套装',
        count: 2
      },
      {
        id: generatePrizeId(),
        level: 'C赏',
        description: '角色徽章',
        count: 5
      },
      {
        id: generatePrizeId(),
        level: 'D赏',
        description: '贴纸套装',
        count: 10
      }
    ]
  } else {
    config.prizes = [
      {
        id: generatePrizeId(),
        level: '特等奖',
        description: '价值1000元大奖',
        probability: 1
      },
      {
        id: generatePrizeId(),
        level: '一等奖',
        description: '价值500元奖品',
        probability: 5
      },
      {
        id: generatePrizeId(),
        level: '二等奖',
        description: '价值100元奖品',
        probability: 14
      },
      {
        id: generatePrizeId(),
        level: '三等奖',
        description: '价值50元奖品',
        probability: 30
      },
      {
        id: generatePrizeId(),
        level: '参与奖',
        description: '纪念品',
        probability: 50
      }
    ]
  }
}

const clearAll = (): void => {
  if (confirm('确定要清空所有配置吗？')) {
    config.name = ''
    config.prizes = []
    // 清除所有错误信息
    delete errors.name
    delete errors.totalBoxes
    delete errors.prizes
  }
}

const previewLottery = (): void => {
  if (props.id) {
    router.push(`/draw/${props.id}`)
  }
}

const handleSubmit = async (): Promise<void> => {
  // 最终验证
  validateName()
  config.prizes.forEach((_, index) => validatePrize(index))
  
  if (!isFormValid.value) {
    alert('请检查表单中的错误信息')
    return
  }
  
  try {
    if (isEditing.value) {
      // 编辑模式：更新现有抽奖
      lotteryStore.updateLottery({
        name: config.name,
        type: config.type,
        totalBoxes: config.totalBoxes,
        includeLastPrize: config.includeLastPrize,
        lastPrizeName: config.lastPrizeName,
        prizes: config.prizes.map(prize => ({
          ...prize,
          originalCount: prize.count
        }))
      })
      
      alert('配置更新成功！')
      router.push(`/draw/${props.id}`)
    } else {
      // 创建模式：创建新抽奖
      const lotteryId = lotteryStore.createLottery(config)
      alert('抽奖创建成功！')
      
      // 确保数据已保存到localStorage，然后再跳转
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push(`/draw/${lotteryId}`)
    }
  } catch (error) {
    alert(`操作失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

// 初始化
onMounted(() => {
  if (isEditing.value && props.id) {
    // 编辑模式：加载现有配置
    const success = lotteryStore.loadLottery(props.id)
    if (success && lotteryStore.currentLottery) {
      const lottery = lotteryStore.currentLottery
      config.name = lottery.name
      config.type = lottery.type
      config.totalBoxes = lottery.totalBoxes
      config.includeLastPrize = lottery.includeLastPrize
      config.lastPrizeName = lottery.lastPrizeName || 'LAST赏'
      config.prizes = lottery.prizes.filter(p => !p.isLastPrize).map(prize => ({
        id: prize.id,
        level: prize.level,
        description: prize.description,
        count: prize.originalCount || prize.count,
        probability: prize.probability
      }))
    } else {
      alert('抽奖不存在，将返回主页')
      router.push('/')
    }
  } else {
    // 创建模式：添加第一个奖项
    addPrize()
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

.config-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.config-panel,
.preview-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.type-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.type-option {
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.type-option input {
  display: none;
}

.type-card {
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s ease;
  background: white;
}

.type-option.active .type-card {
  border-color: #667eea;
  background: #f0f9ff;
}

.type-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.type-card h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.type-card p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.form-hint {
  font-size: 0.875rem;
  color: #6b7280;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
}

.checkbox-text {
  font-weight: 600;
  color: #374151;
}

.empty-prizes {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.prizes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.prize-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
}

.prize-item.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.prize-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.prize-number {
  font-weight: 600;
  color: #667eea;
}

.prize-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.error-messages {
  margin-top: 1rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.probability-summary {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 6px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item.error {
  color: #ef4444;
}

.summary-label {
  font-weight: 600;
}

.summary-value {
  font-size: 1.125rem;
  font-weight: 700;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.preview-label {
  font-weight: 600;
  color: #6b7280;
}

.preview-value {
  color: #374151;
}

.preview-prizes {
  margin-top: 1rem;
}

.preview-prizes h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.preview-prize-list {
  max-height: 200px;
  overflow-y: auto;
}

.preview-prize-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.prize-level {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #667eea;
  color: white;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.prize-info {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
}

.prize-count,
.prize-probability {
  color: #6b7280;
  font-weight: 600;
}

.preview-stats {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.preview-stats h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.stats-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.stats-label {
  color: #6b7280;
}

.stats-value {
  font-weight: 600;
  color: #374151;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-full {
  width: 100%;
}

@media (max-width: 1024px) {
  .config-layout {
    grid-template-columns: 1fr;
  }
  
  .preview-panel {
    order: -1;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .type-selection {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .prize-form {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style> 