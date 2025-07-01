/**
 * URL工具函数
 * 用于获取当前工具的URL和生成二维码
 */

/**
 * 获取当前工具的基础URL
 * @returns 工具的完整URL
 */
export function getToolUrl(): string {
  const origin = window.location.origin
  const pathname = window.location.pathname
  
  // 检查是否在本地开发环境
  if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.startsWith('file://')) {
    // 本地环境返回部署后的URL
    return 'https://torisaboten-tools.vercel.app/sansen_planner_vue/'
  }
  
  // 服务器环境，动态获取当前URL
  if (pathname.includes('/sansen_planner_vue/')) {
    // 已经在工具目录中，返回工具根目录
    return `${origin}/sansen_planner_vue/`
  } else {
    // 在根目录，拼接工具路径
    return `${origin}/sansen_planner_vue/`
  }
}

/**
 * 获取工具的显示名称
 */
export function getToolName(): string {
  return 'Torisaboten参战计划作成工具'
}

/**
 * 获取工具的签名文本（用于导出）
 */
export function getToolSignature(): string {
  return `由${getToolName()}生成`
}

/**
 * 获取完整的署名信息（包含URL）
 */
export function getFullSignature(): string {
  return `${getToolSignature()}\n${getToolUrl()}`
}

/**
 * @deprecated 使用外部API会导致CORS问题，请使用 qrcode.ts 中的本地生成方法
 * 生成二维码的Data URL
 * 使用QR Server API生成二维码
 * @param text 要编码的文本
 * @param size 二维码尺寸
 * @returns 二维码图片的URL
 */
export function generateQRCode(text: string, size: number = 150): string {
  // 使用免费的QR码API服务
  const encodedText = encodeURIComponent(text)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&format=png&bgcolor=FFFFFF&color=000000&qzone=2`
}

/**
 * @deprecated 使用外部API会导致CORS问题，请使用 qrcode.ts 中的本地生成方法
 * 预加载二维码图片
 * @param url 二维码URL
 * @returns Promise<HTMLImageElement>
 */
export function preloadQRCode(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
} 