import { ref, onMounted, onUnmounted } from 'vue'

// 判断是否为移动设备
export function useDevice() {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const deviceInfo = ref({
    width: 0,
    height: 0,
    userAgent: '',
    touchDevice: false,
    deviceType: 'desktop' as 'mobile' | 'tablet' | 'desktop'
  })

  const checkDevice = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    
    isMobile.value = width <= 768
    isTablet.value = width > 768 && width <= 1024
    isDesktop.value = width > 1024
    
    // 更新设备信息
    deviceInfo.value = {
      width,
      height,
      userAgent: navigator.userAgent,
      touchDevice: isTouchDevice(),
      deviceType: width <= 768 ? 'mobile' : width <= 1024 ? 'tablet' : 'desktop'
    }
    
    // 开发环境下打印设备信息
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 设备检测信息:', {
        宽度: width,
        高度: height,
        设备类型: deviceInfo.value.deviceType,
        是否移动端: isMobile.value,
        是否触摸设备: deviceInfo.value.touchDevice,
        断点: width <= 768 ? '移动端(≤768px)' : width <= 1024 ? '平板(769-1024px)' : '桌面端(>1024px)'
      })
    }
  }

  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', checkDevice)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkDevice)
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceInfo
  }
}

// 检测是否为触摸设备
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// 检测是否为iPad
export function isIPad(): boolean {
  return /iPad/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

// 检测是否为移动设备（基于User Agent）
export function isMobileUserAgent(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 获取当前设备类型
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth
  
  // 专门检测iPad
  if (isIPad()) return 'tablet'
  
  if (width <= 768) return 'mobile'
  if (width <= 1024) return 'tablet'
  return 'desktop'
}

// 综合检测（宽度 + User Agent + 触摸）
export function getDeviceTypeAdvanced(): {
  type: 'mobile' | 'tablet' | 'desktop'
  confidence: 'high' | 'medium' | 'low'
  reasons: string[]
  isIPad: boolean
} {
  const width = window.innerWidth
  const isMobileUA = isMobileUserAgent()
  const isTouch = isTouchDevice()
  const iPadDetected = isIPad()
  const reasons: string[] = []
  
  let type: 'mobile' | 'tablet' | 'desktop' = 'desktop'
  let confidence: 'high' | 'medium' | 'low' = 'low'
  
  // iPad 优先判断
  if (iPadDetected) {
    type = 'tablet'
    confidence = 'high'
    reasons.push('检测到iPad设备')
    return { type, confidence, reasons, isIPad: true }
  }
  
  // 基于宽度判断
  if (width <= 768) {
    type = 'mobile'
    reasons.push(`宽度${width}px ≤ 768px`)
  } else if (width <= 1024) {
    type = 'tablet'
    reasons.push(`宽度${width}px 在 769-1024px 范围`)
  } else {
    type = 'desktop'
    reasons.push(`宽度${width}px > 1024px`)
  }
  
  // User Agent 验证
  if (isMobileUA) {
    reasons.push('User Agent 检测到移动设备')
    if (type === 'mobile') confidence = 'high'
  }
  
  // 触摸设备验证
  if (isTouch) {
    reasons.push('检测到触摸支持')
    if (type !== 'desktop') confidence = 'high'
  }
  
  // 宽度和UA不一致时降低置信度
  if ((width <= 768 && !isMobileUA) || (width > 1024 && isMobileUA)) {
    confidence = 'medium'
    reasons.push('宽度和User Agent检测结果不一致')
  }
  
  return { type, confidence, reasons, isIPad: false }
} 