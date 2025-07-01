# 🚀 部署指南

## Vercel 一键部署

### **方法一：GitHub自动部署（推荐）**

1. **将代码推送到GitHub**
   ```bash
   git add .
   git commit -m "Vue版本完成"
   git push origin main
   ```

2. **在Vercel中导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 连接GitHub账户，选择这个仓库
   - Vercel会自动检测为Vue.js项目

3. **配置设置**（通常自动配置，无需手动设置）
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **点击Deploy**
   - Vercel会自动构建和部署
   - 部署完成后会提供一个URL

### **方法二：Vercel CLI部署**

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **在项目目录部署**
   ```bash
   cd sansen_planner_vue
   vercel
   ```

4. **跟随提示配置**
   - 项目名称
   - 是否链接到现有项目
   - 设置为默认配置

## 🌐 其他部署平台

### **Netlify部署**
1. 拖拽 `dist` 文件夹到 [netlify.com/drop](https://netlify.com/drop)
2. 或连接GitHub仓库进行自动部署

### **GitHub Pages部署**
1. 构建项目: `npm run build`
2. 将 `dist` 目录内容推送到 `gh-pages` 分支

### **自己的服务器**
1. 构建项目: `npm run build`
2. 将 `dist` 目录内容上传到服务器
3. 配置Web服务器处理SPA路由

## ⚙️ 环境配置

### **本地开发**
确保安装了Node.js (版本16+):
```bash
# 检查Node.js版本
node --version
npm --version

# 如果没有Node.js，请到 nodejs.org 下载安装
```

### **项目启动**
```bash
cd sansen_planner_vue
npm install
npm run dev
```

## 🔧 构建配置

项目已配置好以下构建设置：
- ✅ Vite构建优化
- ✅ TypeScript类型检查
- ✅ SPA路由处理
- ✅ 静态资源优化
- ✅ 现代浏览器支持

## 📱 部署后访问

部署成功后，你可以：
- 📋 创建和管理参战规划
- 📊 查看甘特图
- 📅 导出ICS日历文件
- 🖼️ 导出PNG图片
- 📱 在移动设备上使用

## 🌍 域名配置

### **自定义域名（Vercel）**
1. 在Vercel项目设置中添加域名
2. 配置DNS指向Vercel
3. 自动HTTPS证书

### **多环境部署**
- `main` 分支 → 生产环境
- `develop` 分支 → 预览环境
- Pull Request → 临时预览

## 🚨 常见问题

### **路由404问题**
✅ 已配置 `vercel.json` 处理SPA路由

### **构建失败**
- 检查Node.js版本（需要16+）
- 确保所有依赖正确安装
- 检查TypeScript编译错误

### **环境变量**
如需要环境变量，在Vercel项目设置中添加：
```
NODE_ENV=production
```

## 💡 性能优化

项目已包含：
- 🚀 Vite构建优化
- 📦 代码分割
- 🗜️ 资源压缩
- 📱 响应式设计
- ⚡ 快速加载

完成部署后，享受现代化的偶活参战规划体验！🎭 