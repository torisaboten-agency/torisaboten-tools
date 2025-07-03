<template>
  <div class="documentation">
    <header class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>📖 使用文档</h1>
          <div class="header-actions">
            <router-link to="/" class="btn btn-secondary">
              🏠 返回主页
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="container">
      <div class="docs-content">
        <section class="docs-section">
          <h2>🎯 项目简介</h2>
          <p>
            这是一个专为线下活动设计的网页版抽奖工具，支持传统一番赏和概率抽奖两种模式。
            工具采用Vue 3 + TypeScript + Pinia技术栈，数据存储在本地浏览器中，确保数据安全和隐私保护。
          </p>
        </section>

        <section class="docs-section">
          <h2>🌟 主要功能</h2>
          
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">🎲</div>
              <h3>双重抽奖模式</h3>
              <ul>
                <li><strong>一番赏模式</strong>：传统的一番赏抽奖规则，支持多箱设置和LAST赏机制</li>
                <li><strong>概率抽奖模式</strong>：基于权重的概率抽奖，每个奖项设置获奖概率</li>
              </ul>
            </div>

            <div class="feature-card">
              <div class="feature-icon">💾</div>
              <h3>数据管理</h3>
              <ul>
                <li><strong>本地存储</strong>：所有数据存储在本地浏览器</li>
                <li><strong>快照导出</strong>：支持JSON格式的完整抽奖快照</li>
                <li><strong>记录导出</strong>：支持详细的抽奖记录CSV文件</li>
                <li><strong>撤销功能</strong>：支持撤销最近的抽奖记录</li>
              </ul>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>现代化界面</h3>
              <ul>
                <li><strong>响应式设计</strong>：完美适配桌面端和移动端</li>
                <li><strong>组件化架构</strong>：可维护、可复用的组件设计</li>
                <li><strong>类型安全</strong>：TypeScript提供完整的类型检查</li>
                <li><strong>实时更新</strong>：状态管理确保数据实时同步</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="docs-section">
          <h2>🚀 快速开始</h2>
          
          <div class="steps-container">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>创建抽奖</h3>
                <p>点击主页的"创建新抽奖"按钮，选择抽奖类型（一番赏或概率抽奖）</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>配置奖项</h3>
                <p>填写抽奖名称，添加奖项等级、描述，设置数量（一番赏）或概率（概率抽奖）</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>开始抽奖</h3>
                <p>进入抽奖页面，输入抽奖者ID，设置抽奖次数，点击"开始抽奖"</p>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>管理记录</h3>
                <p>查看抽奖历史，支持撤销、重置、导出等操作</p>
              </div>
            </div>
          </div>
        </section>

        <section class="docs-section">
          <h2>📋 详细指南</h2>
          
          <div class="guide-tabs">
            <button 
              v-for="tab in guideTabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="tab-button"
              :class="{ active: activeTab === tab.id }"
            >
              {{ tab.name }}
            </button>
          </div>

          <div class="tab-content">
            <!-- 一番赏指南 -->
            <div v-if="activeTab === 'ichiban'" class="guide-content">
              <h3>🎯 一番赏模式使用指南</h3>
              
              <div class="guide-item">
                <h4>基础配置</h4>
                <ul>
                  <li><strong>抽奖名称</strong>：建议包含活动信息，便于管理</li>
                  <li><strong>总箱数</strong>：设置0表示无限箱数，非0表示限定箱数</li>
                  <li><strong>LAST赏</strong>：每箱最后一次抽奖自动获得的特殊奖励</li>
                </ul>
              </div>

              <div class="guide-item">
                <h4>奖项设置</h4>
                <ul>
                  <li>每个奖项需要设置：等级、描述、每箱数量</li>
                  <li>建议按稀有度命名：A赏、B赏、C赏等</li>
                  <li>数量决定了获奖概率，数量越多越容易抽中</li>
                </ul>
              </div>

              <div class="guide-item">
                <h4>抽奖执行</h4>
                <ul>
                  <li>显示当前箱数和剩余奖品数量</li>
                  <li>支持单次或多次连续抽奖</li>
                  <li>箱子抽完后自动切换到下一箱</li>
                  <li>最后一次抽奖会额外获得LAST赏（如果启用）</li>
                </ul>
              </div>
            </div>

            <!-- 概率抽奖指南 -->
            <div v-if="activeTab === 'probability'" class="guide-content">
              <h3>🎲 概率抽奖模式使用指南</h3>
              
              <div class="guide-item">
                <h4>基础配置</h4>
                <ul>
                  <li><strong>抽奖名称</strong>：建议包含活动信息</li>
                  <li><strong>奖项概率</strong>：所有奖项概率总和必须为100%</li>
                  <li>不支持箱数限制，可以无限次抽奖</li>
                </ul>
              </div>

              <div class="guide-item">
                <h4>概率设置</h4>
                <ul>
                  <li>每个奖项设置0-100%的获奖概率</li>
                  <li>高价值奖品建议设置较低概率</li>
                  <li>确保所有概率加起来等于100%</li>
                  <li>支持小数点，如0.1%的超低概率</li>
                </ul>
              </div>

              <div class="guide-item">
                <h4>抽奖特点</h4>
                <ul>
                  <li>每次抽奖都是独立的概率事件</li>
                  <li>不受之前抽奖结果影响</li>
                  <li>适合长期活动或大量参与者</li>
                  <li>可以设置保底奖品确保不空手而归</li>
                </ul>
              </div>
            </div>

            <!-- 数据管理指南 -->
            <div v-if="activeTab === 'data'" class="guide-content">
              <h3>💾 数据管理指南</h3>
              
              <div class="guide-item">
                <h4>本地存储</h4>
                <ul>
                  <li>所有数据存储在浏览器本地，不上传到服务器</li>
                  <li>清除浏览器数据会丢失所有抽奖记录</li>
                  <li>建议定期导出重要数据作为备份</li>
                </ul>
              </div>

              <div class="guide-item">
                <h4>快照功能</h4>
                <ul>
                  <li><strong>导出快照</strong>：保存所有抽奖配置和历史记录</li>
                  <li><strong>导入快照</strong>：从备份文件恢复数据</li>
                  <li>文件格式为JSON，包含完整的抽奖信息</li>
                  <li>可以在不同设备间迁移数据</li>
                </ul>
              </div>

              <div class="guide-item">
                <h4>记录导出</h4>
                <ul>
                  <li>导出CSV格式的详细抽奖记录</li>
                  <li>包含时间、抽奖者、奖品等完整信息</li>
                  <li>便于后续数据分析和统计</li>
                  <li>支持Excel等表格软件打开</li>
                </ul>
              </div>
            </div>

            <!-- 高级功能指南 -->
            <div v-if="activeTab === 'advanced'" class="guide-content">
              <h3>⚙️ 高级功能指南</h3>
              
              <div class="guide-item">
                <h4>撤销功能</h4>
                <ul>
                  <li>支持撤销最近的一次抽奖记录</li>
                  <li>一番赏模式会智能处理跨箱撤销</li>
                  <li>撤销后会恢复相应的奖品数量</li>
                  <li>谨慎使用，撤销操作不可恢复</li>
                </ul>
              </div>

              <div class="guide-item">
                <h4>重置功能</h4>
                <ul>
                  <li><strong>重置抽奖</strong>：清空历史记录，保留配置</li>
                  <li><strong>再来一次</strong>：保留历史，重新开始抽奖</li>
                  <li>适用于需要重复使用同一配置的场景</li>
                </ul>
              </div>

              <div class="guide-item">
                <h4>移动端优化</h4>
                <ul>
                  <li>完整的响应式设计，手机平板都可使用</li>
                  <li>触摸友好的操作界面</li>
                  <li>微信环境会提示功能限制</li>
                  <li>建议在外部浏览器中使用完整功能</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section class="docs-section">
          <h2>❓ 常见问题</h2>
          
          <div class="faq-list">
            <details class="faq-item">
              <summary>为什么在微信中无法下载文件？</summary>
              <p>微信内置浏览器出于安全考虑限制了文件下载功能。建议点击右上角菜单选择"在浏览器中打开"以获得完整功能。</p>
            </details>

            <details class="faq-item">
              <summary>数据会丢失吗？</summary>
              <p>数据存储在浏览器本地，正常使用不会丢失。但清除浏览器数据、更换设备等情况下可能丢失，建议定期导出备份。</p>
            </details>

            <details class="faq-item">
              <summary>一番赏的LAST赏是什么？</summary>
              <p>LAST赏是一番赏中的特殊机制，当一箱的普通奖品全部抽完时，最后一次抽奖会额外获得LAST赏，增加抽奖的刺激感。</p>
            </details>

            <details class="faq-item">
              <summary>概率抽奖如何确保公平？</summary>
              <p>系统使用真随机算法，每次抽奖都是独立的概率事件，不受之前结果影响，确保抽奖的公平性。</p>
            </details>

            <details class="faq-item">
              <summary>可以修改已创建的抽奖吗？</summary>
              <p>可以通过"编辑配置"重新进入配置页面修改设置，但建议在正式开始抽奖前完成所有配置。</p>
            </details>
          </div>
        </section>

        <section class="docs-section">
          <h2>🎯 适用场景</h2>
          
          <div class="scenarios-grid">
            <div class="scenario-card">
              <div class="scenario-icon">🎪</div>
              <h3>动漫展会</h3>
              <p>角色周边、手办等奖品的抽奖活动，一番赏模式完美适配展会销售场景。</p>
            </div>

            <div class="scenario-card">
              <div class="scenario-icon">🏢</div>
              <h3>企业活动</h3>
              <p>年会抽奖、团建活动奖品分发，概率抽奖适合大型企业活动。</p>
            </div>

            <div class="scenario-card">
              <div class="scenario-icon">👥</div>
              <h3>社团活动</h3>
              <p>小型聚会、生日派对等抽奖环节，增加活动趣味性。</p>
            </div>

            <div class="scenario-card">
              <div class="scenario-icon">📺</div>
              <h3>直播互动</h3>
              <p>主播与粉丝的互动抽奖活动，支持实时抽奖和结果展示。</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="container">
        <div class="footer-links">
          <router-link to="/" class="footer-link">🏠 返回主页</router-link>
          <a href="https://github.com/torisaboten" target="_blank" class="footer-link">🔗 GitHub</a>
        </div>
        <p class="footer-text">@Torisaboten 2025 | 完全免费，欢迎分享使用</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('ichiban')

const guideTabs = [
  { id: 'ichiban', name: '一番赏模式' },
  { id: 'probability', name: '概率抽奖' },
  { id: 'data', name: '数据管理' },
  { id: 'advanced', name: '高级功能' }
]
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 3rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.docs-content {
  max-width: 900px;
  margin: 0 auto;
}

.docs-section {
  margin-bottom: 4rem;
}

.docs-section h2 {
  color: #374151;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.docs-section p {
  color: #6b7280;
  line-height: 1.8;
  font-size: 1.1rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #374151;
  margin-bottom: 1rem;
}

.feature-card ul {
  text-align: left;
  color: #6b7280;
  line-height: 1.8;
}

.feature-card li {
  margin-bottom: 0.5rem;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content h3 {
  color: #374151;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #6b7280;
  margin: 0;
}

.guide-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #374151;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: #f8fafc;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.guide-content h3 {
  color: #374151;
  margin-bottom: 1.5rem;
}

.guide-item {
  margin-bottom: 2rem;
}

.guide-item h4 {
  color: #667eea;
  margin-bottom: 0.75rem;
}

.guide-item ul {
  color: #6b7280;
  line-height: 1.8;
}

.guide-item li {
  margin-bottom: 0.5rem;
}

.faq-list {
  margin-top: 2rem;
}

.faq-item {
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.faq-item summary {
  padding: 1.5rem;
  cursor: pointer;
  color: #374151;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.faq-item summary:hover {
  background: #f8fafc;
}

.faq-item p {
  padding: 0 1.5rem 1.5rem 1.5rem;
  margin: 0;
  color: #6b7280;
  line-height: 1.8;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.scenario-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease;
}

.scenario-card:hover {
  transform: translateY(-2px);
}

.scenario-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.scenario-card h3 {
  color: #374151;
  margin-bottom: 0.75rem;
}

.scenario-card p {
  color: #6b7280;
  margin: 0;
  font-size: 0.9rem;
}

.app-footer {
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  padding: 3rem 0;
  margin-top: 4rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-text {
  text-align: center;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .step-item {
    flex-direction: column;
    text-align: center;
  }
  
  .guide-tabs {
    flex-wrap: wrap;
  }
  
  .scenarios-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}
</style> 