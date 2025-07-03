<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useLotteryStore } from '@/stores/lottery'

const lotteryStore = useLotteryStore()

onMounted(() => {
  lotteryStore.loadLotteries()
})
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  /* 禁止双击缩放 */
  touch-action: manipulation;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", 
               "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8fafc;
}

#app {
  min-height: 100vh;
}

/* 全局按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.5rem;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 容器布局 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* 公益callout样式 */
.charity-callout {
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border: 1px solid #f3e8ff;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.charity-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.charity-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.charity-text {
  flex: 1;
  min-width: 200px;
}

.charity-text p {
  margin: 0;
  color: #7c2d12;
  font-weight: 500;
}

.charity-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.charity-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #c2410c;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.charity-link:hover {
  background: #9a3412;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
  
  .charity-content {
    flex-direction: column;
    text-align: center;
  }
  
  .charity-buttons {
    justify-content: center;
  }
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-state .empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.empty-state p {
  font-size: 1rem;
  margin: 0;
}
</style> 