# Netlify 部署配置指南

本文档详细说明如何将此项目从Vercel迁移到Netlify，确保所有功能正常运行。

## 🏗️ 项目架构分析

### 应用组成
根据 `vercel.json` 配置，本项目包含：

1. **sansen_planner_vue** - Vue.js 单页应用（主要规划工具）
2. **sansen_planner_vuetify** - Vuetify版本的Vue应用
3. **ichibankuji** - 一番赏抽奖工具（静态HTML应用）
4. **shared** - 共享资源文件（样式、图片等）
5. **index.html** - 项目主页

### Vercel vs Netlify 路由配置对比

#### Vercel配置（vercel.json）
```json
{
  "rewrites": [
    {
      "source": "/sansen_planner_vue((?!/assets|/images|/logo\\.png|/favicon\\.ico|/manifest\\.webmanifest|/sw\\.js|/robots\\.txt|/site\\.webmanifest).*)",
      "destination": "/sansen_planner_vue/index.html"
    },
    {
      "source": "/vuetify((?!/assets|/images|/logo\\.png|/favicon\\.ico|/manifest\\.webmanifest|/sw\\.js|/robots\\.txt|/site\\.webmanifest).*)",
      "destination": "/sansen_planner_vuetify/dist/index.html"
    }
  ]
}
```

#### Netlify配置（netlify.toml）
```toml
[[redirects]]
  from = "/sansen_planner_vue/*"
  to = "/sansen_planner_vue/index.html"
  status = 200
  force = false

[[redirects]]
  from = "/vuetify/*"
  to = "/sansen_planner_vuetify/dist/index.html"
  status = 200
  force = false
```

## 📁 配置文件说明

### 1. netlify.toml（推荐）
主配置文件，包含：
- **构建设置**：指定发布目录
- **路由重定向**：SPA路由支持
- **HTTP头配置**：缓存策略和安全头
- **静态资源优化**：长期缓存配置

### 2. _redirects（备用）
简化的重定向配置文件，如果不使用 `netlify.toml` 可以使用此文件。

## 🚀 部署步骤

### 方式一：Git仓库连接（推荐）

1. **推送到Git仓库**
   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

2. **连接Netlify**
   - 登录 [Netlify控制台](https://app.netlify.com)
   - 点击 "New site from Git"
   - 选择你的Git提供商（GitHub/GitLab/Bitbucket）
   - 选择对应的仓库

3. **构建配置**
   - Build command: 留空（或 `echo "Static deployment"`）
   - Publish directory: `.`（项目根目录）
   - 点击 "Deploy site"

### 方式二：手动上传

1. **准备文件**
   - 确保项目根目录包含 `netlify.toml` 配置文件
   - 压缩整个项目文件夹为ZIP格式

2. **上传部署**
   - 在Netlify控制台点击 "Deploy manually"
   - 拖拽ZIP文件到部署区域
   - 等待部署完成

## 🔧 关键配置说明

### SPA路由处理
```toml
[[redirects]]
  from = "/sansen_planner_vue/*"
  to = "/sansen_planner_vue/index.html"
  status = 200
  force = false  # 关键：不强制重定向，让静态资源优先
```

- `force = false` 确保静态文件（JS、CSS、图片）不被重定向
- Netlify会自动识别静态资源并直接提供服务
- 只有找不到对应文件时才会重定向到 `index.html`

### 缓存策略
```toml
# 静态资源长期缓存
[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# HTML文件不缓存
[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### 安全头配置
添加了现代化的安全HTTP头：
- `X-Frame-Options`: 防止页面被嵌入iframe
- `X-Content-Type-Options`: 防止MIME类型嗅探
- `X-XSS-Protection`: XSS保护
- `Referrer-Policy`: 控制referrer信息

## ✅ 测试验证

部署完成后，请测试以下URL确保功能正常：

### 主要页面
- 🏠 **主页**: `https://your-site.netlify.app/`
- 📊 **规划工具**: `https://your-site.netlify.app/sansen_planner_vue/`
- 🎯 **一番赏工具**: `https://your-site.netlify.app/ichibankuji/`

### SPA路由测试
- 📝 **规划详情页**: `https://your-site.netlify.app/sansen_planner_vue/planner/123`
- 📚 **文档页面**: `https://your-site.netlify.app/sansen_planner_vue/docs`

### 静态资源测试
- 🎨 **样式文件**: `https://your-site.netlify.app/shared/styles.css`
- 🖼️ **图片资源**: `https://your-site.netlify.app/shared/assets/logo.png`

## 🛠️ 常见问题解决

### 1. 404错误
**症状**: Vue应用的子路由返回404
**解决方案**:
- 检查 `netlify.toml` 重定向配置是否正确
- 确认Vue应用的 `publicPath` 配置
- 验证 `force = false` 参数设置

### 2. 静态资源加载失败
**症状**: CSS/JS文件无法加载
**解决方案**:
- 检查资源路径是否正确
- 确认没有被重定向规则误拦截
- 验证文件确实存在于发布目录中

### 3. Vue路由器配置
确保Vue应用使用正确的base路径：

```javascript
// sansen_planner_vue/src/router/index.js
const router = createRouter({
  history: createWebHistory('/sansen_planner_vue/'),
  // 其他配置...
})
```

### 4. Vuetify应用路径问题
如果Vuetify应用有问题，检查：
- 构建输出目录是否为 `dist`
- 路由base路径是否设置为 `/vuetify/`

## 🔄 环境变量配置

如果应用需要环境变量：

1. **在Netlify控制台设置**
   - Site settings → Environment variables
   - 添加所需的环境变量

2. **构建时变量**
   ```toml
   [build.environment]
     NODE_ENV = "production"
     VUE_APP_API_URL = "https://api.example.com"
   ```

## 🌐 自定义域名

### 配置步骤
1. **在Netlify控制台**
   - Domain settings → Add custom domain
   - 输入你的域名

2. **DNS配置**
   - 添加CNAME记录指向 `your-site.netlify.app`
   - 或添加A记录指向Netlify的IP地址

3. **HTTPS启用**
   - Netlify会自动配置Let's Encrypt证书
   - 启用 "Force HTTPS"

## 📊 性能优化建议

### 1. 资源压缩
Netlify自动启用Gzip压缩，但可以进一步优化：
```toml
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true
```

### 2. 图片优化
考虑使用Netlify的图片优化服务：
```toml
[[plugins]]
  package = "@netlify/plugin-gatsby"
```

## 📝 迁移检查清单

- [ ] 创建 `netlify.toml` 配置文件
- [ ] 测试所有主要页面可访问
- [ ] 验证SPA路由功能正常
- [ ] 检查静态资源加载
- [ ] 测试移动端响应式设计
- [ ] 验证缓存策略生效
- [ ] 检查安全头配置
- [ ] 设置自定义域名（如需要）
- [ ] 配置环境变量（如需要）
- [ ] 更新DNS解析
- [ ] 测试HTTPS访问

## 📞 技术支持

如遇到部署问题：
1. 查看Netlify部署日志
2. 检查浏览器开发者工具的Network面板
3. 参考Netlify官方文档
4. 提交GitHub Issue获取帮助

---

**配置完成后，你的多应用项目将在Netlify上完美运行！** 🎉 