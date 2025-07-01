/**
 * 本地二维码生成工具
 * 使用 qrcode 库生成真实可扫描的二维码
 * 避免外部API依赖和CORS问题
 */

import QRCode from 'qrcode'

/**
 * 生成真实的二维码 DataURL
 * @param text 要编码的文本（通常是URL）
 * @param size 二维码尺寸
 * @returns Promise<string> 返回 DataURL
 */
export async function generateQRCodeDataURL(text: string, size: number = 150): Promise<string> {
  try {
    const dataURL = await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
    return dataURL
  } catch (error) {
    console.error('生成二维码失败:', error)
    // 如果生成失败，返回一个简单的占位符
    return generateFallbackQR(size)
  }
}

/**
 * 生成备用的简单二维码图案（当真正的QR生成失败时使用）
 */
function generateFallbackQR(size: number): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  canvas.width = size
  canvas.height = size
  
  // 白色背景
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, size, size)
  
  // 简单的格子图案作为占位符
  ctx.fillStyle = '#000000'
  const gridSize = Math.floor(size / 20)
  
  for (let x = 0; x < size; x += gridSize * 2) {
    for (let y = 0; y < size; y += gridSize * 2) {
      if ((x / gridSize + y / gridSize) % 2 === 0) {
        ctx.fillRect(x, y, gridSize, gridSize)
      }
    }
  }
  
  return canvas.toDataURL('image/png')
}

/**
 * 预加载真实的二维码图片
 * @param text 要编码的文本
 * @param size 二维码尺寸
 * @returns Promise<HTMLImageElement> 返回加载好的图片元素
 */
export async function preloadLocalQRCode(text: string, size: number = 150): Promise<HTMLImageElement> {
  return new Promise(async (resolve, reject) => {
    try {
      const dataURL = await generateQRCodeDataURL(text, size)
      const img = new Image()
      
      img.onload = () => resolve(img)
      img.onerror = reject
      
      // 使用本地生成的DataURL，无需设置crossOrigin
      img.src = dataURL
    } catch (error) {
      reject(error)
    }
  })
}