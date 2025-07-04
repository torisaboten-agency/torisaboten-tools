<template>
  <div class="documentation">
    <!-- 顶部标题栏 -->
    <header class="doc-header">
      <div class="container">
        <div class="header-content">
          <div class="logo-title">
            <img :src="logoSrc" alt="Logo" class="header-logo">
            <h1>参战计划作成工具</h1>
          </div>
          <nav class="nav-links">
            <router-link to="/" class="nav-link">🏠 返回主页</router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- 文档内容 -->
    <main class="doc-content">
      <div class="container">
        <div class="doc-sidebar">
          <nav class="toc">
            <h3>目录</h3>
            <ul>
              <li><a href="#overview">📖 工具简介</a></li>
              <li><a href="#features">✨ 主要功能</a></li>
              <li><a href="#getting-started">🚀 快速开始</a></li>
              <li><a href="#single-activity">🎯 单一活动模式</a></li>
              <li><a href="#multiple-activities">🎪 多活动模式</a></li>
              <li><a href="#gantt-chart">📊 甘特图功能</a></li>
              <li><a href="#export">📤 导出功能</a></li>
              <li><a href="#tips">💡 使用技巧</a></li>
              <li><a href="#faq">❓ 常见问题</a></li>
            </ul>
          </nav>
        </div>

        <article class="doc-main">
          <section id="overview" class="doc-section">
            <h2>📖 工具简介</h2>
            <p>参战计划作成工具是一个专为偶像活动参战规划设计的现代化工具。它能帮助你高效地规划活动时间、管理多个团体的演出和特典安排，并生成直观的甘特图来可视化整个参战计划。</p>
            
            <div class="feature-grid">
              <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h4>精确规划</h4>
                <p>支持分钟级时间安排，确保每个时间段都不会错过</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h4>可视化展示</h4>
                <p>甘特图直观显示时间冲突和安排，一目了然</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📱</div>
                <h4>响应式设计</h4>
                <p>完美适配手机、平板和桌面端，随时随地使用</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">💾</div>
                <h4>本地存储</h4>
                <p>数据保存在浏览器本地，保护隐私安全</p>
              </div>
            </div>
          </section>

          <section id="features" class="doc-section">
            <h2>✨ 主要功能</h2>
            <ul class="feature-list">
              <li><strong>双模式支持：</strong>单一活动模式适合简单场景，多活动模式支持复杂规划</li>
              <li><strong>Live管理：</strong>添加演出时间、地点等详细信息</li>
              <li><strong>特典会管理：</strong>独立管理特典时间，支持与演出时间重叠显示</li>
              <li><strong>智能交互：</strong>优化的tooltip系统，支持智能定位和触摸友好操作</li>
              <li><strong>时区支持：</strong>支持多个时区设置，适应不同地区的活动</li>
              <li><strong>双模式导出：</strong>简洁模式和详细模式图片导出，满足不同需求</li>
              <li><strong>日历导出：</strong>导出为ICS格式，导入到手机日历</li>
              <li><strong>响应式优化：</strong>特别针对移动端和iPad进行了深度优化</li>
              <li><strong>微信环境适配：</strong>针对微信浏览器进行了特别优化</li>
            </ul>
          </section>

          <section id="getting-started" class="doc-section">
            <h2>🚀 快速开始</h2>
            <div class="steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>选择模式</h4>
                  <p>在主页点击"创建"按钮，选择"单一活动"或"多活动"模式</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>基础配置</h4>
                  <p>设置活动日期、时区等基本信息</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>添加团体</h4>
                  <p>创建参战团体，设置演出和特典时间安排</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>查看甘特图</h4>
                  <p>右侧自动生成甘特图，可视化你的参战计划</p>
                </div>
              </div>
            </div>
          </section>

          <section id="single-activity" class="doc-section">
            <h2>🎯 单一活动模式</h2>
            <p>适用于单个活动的参战规划，界面简洁，操作便捷。</p>
            
            <h4>适用场景：</h4>
            <ul>
              <li>同一场演出活动内的时间安排</li>
            </ul>

            <h4>操作步骤：</h4>
            <ol>
              <li>填写活动名称和地点</li>
              <li>设置活动日期和时区</li>
              <li>添加参战团体</li>
              <li>为每个团体设置Live时间和特典时间</li>
            </ol>
          </section>

          <section id="multiple-activities" class="doc-section">
            <h2>🎪 多活动模式</h2>
            <p>适用于复杂的多活动参战规划，支持不同地点的多个活动。</p>
            
            <h4>适用场景：</h4>
            <ul>
              <li>单日赶场多个活动的时间安排</li>
            </ul>

            <h4>操作步骤：</h4>
            <ol>
              <li>设置规划器名称和基本信息</li>
              <li>创建活动卡片，每个卡片代表一个活动</li>
              <li>为每个活动添加团体和时间安排</li>
              <li>在甘特图中统一查看所有活动的时间安排</li>
            </ol>
          </section>

          <section id="gantt-chart" class="doc-section">
            <h2>📊 甘特图功能</h2>
            <p>甘特图是工具的核心功能，提供直观的时间可视化。经过多次优化，现已具备出色的交互体验。</p>
            
            <h4>甘特图特性：</h4>
            <ul>
              <li><span class="color-demo live"></span> <strong>绿色条块：</strong>Live时间</li>
              <li><span class="color-demo tokuten"></span> <strong>粉色条块：</strong>特典会时间</li>
              <li><strong>时间冲突检测：</strong>重叠时间会自动调整显示位置</li>
              <li><strong>智能时间显示：</strong>根据时间段宽度自动决定是否显示时间文字</li>
              <li><strong>层级关系优化：</strong>活动时段块始终覆盖在时间轴竖直线之上</li>
              <li><strong>响应式布局：</strong>自适应不同屏幕尺寸，特别优化iPad体验</li>
            </ul>

            <h4>交互功能：</h4>
            <ul>
              <li><strong>悬浮提示：</strong>桌面端鼠标悬停显示详细信息，移动端触摸显示</li>
              <li><strong>智能定位：</strong>tooltip会根据屏幕位置智能调整显示方向</li>
              <li><strong>触摸优化：</strong>移动端小时间段增大触摸区域，提升操作体验</li>
              <li><strong>水平滚动：</strong>支持滑动查看完整时间线</li>
              <li><strong>固定定位：</strong>tooltip使用固定定位，不受容器滚动影响</li>
            </ul>

            <h4>显示规则：</h4>
            <ul>
              <li>时间段宽度 ≥ 85像素：显示完整时间范围（如"14:00-17:00"）</li>
              <li>时间段宽度 ≥ 110像素：额外显示地点信息</li>
              <li>宽度不足时：仅通过颜色区分，悬浮显示完整信息</li>
              <li>移动端最小宽度3%，确保可触摸操作</li>
            </ul>
          </section>

          <section id="export" class="doc-section">
            <h2>📤 导出功能</h2>
            
            <h4>图片导出 📷</h4>
            <p>将甘特图导出为PNG图片，提供两种模式选择：</p>
            
            <div class="export-modes">
              <div class="export-mode">
                <h5>🎯 简洁模式</h5>
                <ul>
                  <li>仅包含甘特图主体内容</li>
                  <li>适合日常分享和保存</li>
                  <li>文件更小，加载更快</li>
                </ul>
              </div>
              
              <div class="export-mode">
                <h5>📋 详细模式</h5>
                <ul>
                  <li>甘特图 + 右侧时间明细表</li>
                  <li>保留所有时间信息，无遗漏</li>
                  <li>适合小时间段较多的复杂规划</li>
                  <li>明细表包含：活动分组、团体名称、具体时间段</li>
                </ul>
              </div>
            </div>

            <h4>导出特性：</h4>
            <ul>
              <li>高分辨率输出，适合打印和高清显示</li>
              <li>自动添加规划名称和日期标题</li>
              <li>兼容不同浏览器的下载方式</li>
              <li>微信环境提供特别的保存指引</li>
              <li>详细模式的明细表采用优雅的视觉设计</li>
            </ul>

            <h4>日历导出 📅</h4>
            <p>导出为ICS格式，可导入到各种日历应用：</p>
            <ul>
              <li>支持iPhone、Android系统日历</li>
              <li>兼容Google Calendar、Outlook等</li>
              <li>包含活动时间、地点等完整信息</li>
              <li>自动设置提醒功能</li>
              <li>正确处理时区信息</li>
            </ul>
          </section>

          <section id="tips" class="doc-section">
            <h2>💡 使用技巧</h2>
            
            <div class="tips-grid">
              <div class="tip-card">
                <h4>⏰ 时间设置</h4>
                <ul>
                  <li>支持次日时间（如24:00-26:00表示次日0:00-2:00）</li>
                  <li>建议设置与活动地点相符的时区</li>
                  <li>特典时间可以与Live时间重叠</li>
                </ul>
              </div>
              
              <div class="tip-card">
                <h4>📱 移动端使用</h4>
                <ul>
                  <li>甘特图支持水平滚动查看</li>
                  <li>触摸时间条查看详细信息，小时间段已优化触摸区域</li>
                  <li>tooltip会智能避开手指位置，确保信息可见</li>
                  <li>导出图片可长按保存到相册</li>
                  <li>推荐使用详细模式导出，保留完整时间信息</li>
                </ul>
              </div>
              
              <div class="tip-card">
                <h4>💾 数据管理</h4>
                <ul>
                  <li>数据自动保存到浏览器本地</li>
                  <li>清除浏览器数据会丢失规划</li>
                  <li>建议及时导出重要规划</li>
                </ul>
              </div>
              
              <div class="tip-card">
                <h4>🔄 团体管理</h4>
                <ul>
                  <li>可以随时编辑团体信息</li>
                  <li>删除团体会同时删除其时间安排</li>
                  <li>团体名称建议简洁明了</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="faq" class="doc-section">
            <h2>❓ 常见问题</h2>
            
            <div class="faq-item">
              <h4>Q: 为什么在微信中使用会有提示？</h4>
              <p>A: 微信内置浏览器对某些功能有限制，可能影响数据保存和导出。建议在Safari、Chrome等外部浏览器中使用以获得最佳体验。</p>
            </div>

            <div class="faq-item">
              <h4>Q: 甘特图中的时间为什么显示不全？</h4>
              <p>A: 工具会根据时间段的实际像素宽度智能决定是否显示时间文字。当时间段宽度不足85像素时，为避免文字重叠和显示不清，会隐藏文字只保留颜色区分。您可以悬浮鼠标或触摸查看完整信息，或选择详细模式导出以保留所有时间信息。</p>
            </div>

            <div class="faq-item">
              <h4>Q: 如何备份我的规划数据？</h4>
              <p>A: 目前工具将数据保存在浏览器本地。建议定期导出甘特图图片或ICS文件作为备份。未来版本会考虑添加数据导出功能。</p>
            </div>

            <div class="faq-item">
              <h4>Q: 可以同时规划多天的活动吗？</h4>
              <p>A: 当前版本每个规划器针对单天活动设计。多天活动建议创建多个规划器，或在多活动模式中为每天创建不同的活动卡片。</p>
            </div>

            <div class="faq-item">
              <h4>Q: 为什么导出的图片在手机上看不清？</h4>
              <p>A: 导出的图片已针对高分辨率优化。如果仍有问题，可以尝试在桌面端导出，或使用系统截图功能。</p>
            </div>

            <div class="faq-item">
              <h4>Q: 移动端触摸小时间段很难点中怎么办？</h4>
              <p>A: 工具已经特别优化了移动端体验。小于5%宽度的时间段会自动扩展触摸区域，确保易于操作。如果仍有困难，可以尝试放大页面或使用横屏模式增加可视区域。</p>
            </div>

            <div class="faq-item">
              <h4>Q: tooltip（悬浮提示）有时候看不到怎么办？</h4>
              <p>A: 工具使用智能定位系统，会根据屏幕边界自动调整tooltip位置。移动端会避开手指遮挡，自动选择合适的显示方向。如果仍有问题，可以尝试滚动页面到合适位置再操作。</p>
            </div>

            <div class="faq-item">
              <h4>Q: 什么时候选择详细模式导出？</h4>
              <p>A: 当规划包含较多短时间段（如30分钟以内的特典）或时间安排较为密集时，建议选择详细模式。这样可以确保所有时间信息都完整保留在导出图片中，方便后续查看和分享。</p>
            </div>
          </section>

          <section class="doc-section">
            <h2>🎯 关于作者</h2>
            <p>本工具由 <strong>Torisaboten</strong> 开发和维护。感谢您的使用！</p>
            
            <div class="support-charity">
              <h4>🌸 支持公益</h4>
              <p>如果这个工具对您有帮助，也欢迎您关注和支持 <a href="https://www.cctf.org.cn/zt/cljh/" target="_blank">春蕾计划</a>，帮助中国乡村女童的教育与可持续发展。</p>
            </div>
          </section>
        </article>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="doc-footer">
      <div class="container">
        <p>@ToriSaboten 2025</p>
      <p class="footer-links">
        <a href="https://weibo.com/u/7987651990" target="_blank" class="footer-link">💼ToriSaboten_Official</a> | 
        <a href="https://weibo.com/u/7919013782" target="_blank" class="footer-link">🌸花与心事Affloret</a> | 
        <a href="https://weibo.com/u/7998857709" target="_blank" class="footer-link">🦋她蝶效应Psychelles</a>
      </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import logoSrc from '@/assets/logo.png'
</script>

<style scoped>
.documentation {
  min-height: 100vh;
  background: #fafafa;
}

.doc-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-logo {
  width: 2.5rem;
  height: 2.5rem;
}

.doc-header h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.2s ease;
  font-size: 0.9rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.doc-content {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  gap: 2rem;
}

.doc-sidebar {
  flex: 0 0 250px;
  height: fit-content;
}

.toc {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.toc h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc li {
  margin-bottom: 0.5rem;
}

.toc a {
  color: #4a5568;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
}

.toc a:hover {
  color: #667eea;
}

.doc-main {
  flex: 1;
  min-width: 0;
}

.doc-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.doc-section h2 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.75rem;
  font-weight: 600;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.doc-section h4 {
  margin: 1.5rem 0 0.75rem 0;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}

.doc-section p {
  line-height: 1.7;
  color: #4a5568;
  margin-bottom: 1rem;
}

.doc-section ul, .doc-section ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.doc-section li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #4a5568;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h4 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
}

.feature-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f3f4;
}

.feature-list li:last-child {
  border-bottom: none;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-number {
  flex: 0 0 2.5rem;
  height: 2.5rem;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.step-content h4 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
}

.step-content p {
  margin: 0;
  color: #6b7280;
}

.color-demo {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border-radius: 2px;
  vertical-align: middle;
  margin-right: 0.5rem;
}

.color-demo.live {
  background: #A8D8B9;
}

.color-demo.tokuten {
  background: #FEDFE1;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.tip-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #667eea;
}

.tip-card h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.tip-card ul {
  margin: 0;
  padding-left: 1.25rem;
}

.tip-card li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.faq-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f3f4;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-item h4 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-size: 1.05rem;
}

.faq-item p {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
}

.support-charity {
  background: #e8f5e8;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  border-left: 4px solid #4caf50;
}

.support-charity h4 {
  margin: 0 0 0.75rem 0;
  color: #2d5a2d;
}

.support-charity p {
  margin: 0;
  color: #2d5a2d;
}

.export-modes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.export-mode {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #667eea;
}

.export-mode h5 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.05rem;
  font-weight: 600;
}

.export-mode ul {
  margin: 0;
  padding-left: 1.25rem;
}

.export-mode li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.doc-footer {
  background: #2d3748;
  color: white;
  padding: 2rem 0;
  text-align: center;
  margin-top: 3rem;
}

.doc-footer p {
  margin: 0;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .doc-content {
    flex-direction: column;
    padding: 1rem;
  }
  
  .doc-sidebar {
    position: static;
    flex: none;
  }
  
  .toc {
    margin-bottom: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .nav-links {
    justify-content: center;
  }
  
  .feature-grid,
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .steps .step {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .step-content {
    text-align: center;
    width: 100%;
  }
  
  .doc-section {
    padding: 1.5rem;
  }
}
</style> 