<template>
  <div v-if="showDebugger" class="device-debugger">
    <div class="debugger-toggle" @click="isExpanded = !isExpanded">
      🔍 设备检测 {{ isExpanded ? '▼' : '▶' }}
    </div>
    
    <div v-if="isExpanded" class="debugger-content">
      <div class="debug-section">
        <h4>基础检测</h4>
        <div class="debug-item">
          <span class="label">当前设备:</span>
          <span class="value" :class="deviceInfo.deviceType">{{ deviceInfo.deviceType.toUpperCase() }}</span>
        </div>
        <div class="debug-item">
          <span class="label">屏幕尺寸:</span>
          <span class="value">{{ deviceInfo.width }} × {{ deviceInfo.height }}px</span>
        </div>
        <div class="debug-item">
          <span class="label">触摸设备:</span>
          <span class="value">{{ deviceInfo.touchDevice ? '是' : '否' }}</span>
        </div>
      </div>
      
      <div class="debug-section">
        <h4>响应式状态</h4>
        <div class="debug-item">
          <span class="label">isMobile:</span>
          <span class="value" :class="{ active: isMobile }">{{ isMobile }}</span>
        </div>
        <div class="debug-item">
          <span class="label">isTablet:</span>
          <span class="value" :class="{ active: isTablet }">{{ isTablet }}</span>
        </div>
        <div class="debug-item">
          <span class="label">isDesktop:</span>
          <span class="value" :class="{ active: isDesktop }">{{ isDesktop }}</span>
        </div>
      </div>
      
      <div class="debug-section">
        <h4>高级检测</h4>
        <div class="debug-item">
          <span class="label">检测结果:</span>
          <span class="value">{{ advancedDetection.type }}</span>
        </div>
        <div class="debug-item">
          <span class="label">置信度:</span>
          <span class="value" :class="'confidence-' + advancedDetection.confidence">{{ advancedDetection.confidence }}</span>
        </div>
        <div class="debug-reasons">
          <div class="label">检测依据:</div>
          <ul>
            <li v-for="reason in advancedDetection.reasons" :key="reason">{{ reason }}</li>
          </ul>
        </div>
      </div>
      
      <div class="debug-section">
        <h4>User Agent</h4>
        <div class="debug-item">
          <span class="label">浏览器:</span>
          <span class="value user-agent">{{ userAgentInfo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDevice, getDeviceTypeAdvanced } from '@/utils/device'

// 只在开发环境显示
const showDebugger = process.env.NODE_ENV === 'development'
const isExpanded = ref(false)

const { isMobile, isTablet, isDesktop, deviceInfo } = useDevice()

const advancedDetection = computed(() => getDeviceTypeAdvanced())

const userAgentInfo = computed(() => {
  const ua = navigator.userAgent
  if (ua.includes('iPhone')) return 'iPhone'
  if (ua.includes('iPad')) return 'iPad'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac')) return 'Mac'
  return 'Unknown'
})
</script>

<style scoped>
.device-debugger {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  font-family: monospace;
  font-size: 12px;
  min-width: 280px;
  max-width: 350px;
}

.debugger-toggle {
  padding: 8px 12px;
  cursor: pointer;
  background: #667eea;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
  text-align: center;
}

.debugger-toggle:hover {
  background: #5a6fd8;
}

.debugger-content {
  padding: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.debug-section {
  margin-bottom: 16px;
  border-bottom: 1px solid #333;
  padding-bottom: 12px;
}

.debug-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.debug-section h4 {
  margin: 0 0 8px 0;
  color: #8fa8ff;
  font-size: 13px;
  font-weight: bold;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.label {
  color: #bbb;
  font-size: 11px;
}

.value {
  color: white;
  font-weight: bold;
  text-align: right;
}

.value.mobile {
  color: #4ade80;
}

.value.tablet {
  color: #fbbf24;
}

.value.desktop {
  color: #60a5fa;
}

.value.active {
  color: #4ade80;
}

.confidence-high {
  color: #4ade80;
}

.confidence-medium {
  color: #fbbf24;
}

.confidence-low {
  color: #f87171;
}

.debug-reasons {
  margin-top: 8px;
}

.debug-reasons ul {
  margin: 4px 0 0 0;
  padding-left: 16px;
}

.debug-reasons li {
  color: #ccc;
  font-size: 10px;
  margin-bottom: 2px;
}

.user-agent {
  font-size: 10px;
  max-width: 120px;
  word-break: break-all;
}

@media (max-width: 768px) {
  .device-debugger {
    position: relative;
    top: auto;
    right: auto;
    margin: 10px;
    width: calc(100% - 20px);
  }
}
</style> 