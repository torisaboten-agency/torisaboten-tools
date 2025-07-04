# Torisaboten 工具集

这是一个包含多个实用工具的项目集合，主要面向线下活动和娱乐场景。

## 📁 项目结构

```
workspace/
├── shared/                   # 共享资源目录
│   ├── styles.css           # 主样式文件
│   ├── docs-styles.css      # 文档样式文件
│   └── assets/              # 共享资源
│       └── logo.png         # Logo文件
├── ichibankuji/             # 一番赏工具
│   ├── index.html           # 主页面
│   ├── script.js            # 主要脚本
│   ├── docs.html            # 用户文档
│   ├── demo-snapshot.json   # 演示快照
│   └── README.md            # 工具说明
├── coin_flip/               # 抛硬币工具
│   ├── index.html           # 主页面
│   ├── script.js            # 主要脚本
│   ├── styles.css           # 工具样式
│   └── README.md            # 工具说明
├── sansen_planner/          # 偶活参战规划小助手 (原版)
│   ├── index.html           # 主页面
│   ├── planner.html         # 规划器页面
│   ├── script.js            # 主页面脚本
│   ├── planner-script.js    # 规划器脚本
│   └── README.md            # 工具说明
├── sansen_planner_vue/      # 偶活参战规划小助手 (Vue版)
│   ├── src/                 # Vue源代码
│   ├── package.json         # 项目依赖
│   ├── vite.config.ts       # Vite配置
│   └── README.md            # 工具说明
├── sansen_planner_vuetify/  # 偶活参战规划小助手 (Vuetify版)
│   ├── src/                 # Vue + Vuetify源代码
│   ├── package.json         # 项目依赖
│   ├── vite.config.ts       # Vite配置
│   └── README.md            # 工具说明
└── README.md                # 总项目说明
```

## 🛠️ 工具列表

### 1. 抽奖工具 (`ichibankuji/`)
线下抽奖小助手，支持一番赏和概率抽奖两种模式。

**功能特点：**
- 🎯 双重抽奖模式（一番赏/概率抽奖）
- 📦 多箱设置和LAST赏机制
- 💾 本地数据存储和快照导出
- 📱 响应式设计，支持桌面和移动端

**使用方法：**
```bash
# 在ichibankuji目录下打开index.html即可使用
```

### 2. 抛硬币工具 (`coin_flip/`)
精美的在线抛硬币工具，支持自定义选项和历史记录。

**功能特点：**
- 🪙 真实3D硬币翻转动画，视觉效果震撼
- ⚙️ 自定义正反面结果，适应各种决策场景
- 📊 完整历史记录和统计分析
- ⌨️ 键盘快捷键支持（空格键抛硬币）
- 💾 本地数据存储，设置和历史永久保存
- 📱 响应式设计，完美适配各种设备

**使用方法：**
```bash
# 在coin_flip目录下打开index.html即可使用
```

**典型使用场景：**
- 日常决策：选择困难时的快速裁决工具
- 娱乐游戏：聚会互动和运气测试
- 教育教学：概率演示和决策训练
- 团队协作：公平决策和打破僵局

### 3. 偶活参战规划小助手 (`sansen_planner/`, `sansen_planner_vue/`, `sansen_planner_vuetify/`)
专为偶像活动粉丝设计的参战规划工具，生成可视化甘特图。提供三个版本：

#### 原版 (`sansen_planner/`)
纯HTML/CSS/JavaScript实现，完全离线可用。

#### Vue版 (`sansen_planner_vue/`)
基于Vue 3 + TypeScript的现代化重构版本。

#### Vuetify版 (`sansen_planner_vuetify/`) 🆕
基于Vue 3 + Vuetify的Material Design版本，提供更现代化的UI体验。

**功能特点：**
- 📅 多规划器管理，支持不同活动独立规划
- 🎭 活动和团体管理，灵活配置演出安排
- ⏰ Live演出和特典会时间段分别设置
- 📊 实时甘特图生成，按活动分组显示
- 🎨 双色时间条（蓝色Live + 绿色特典）
- 📷 一键导出高清PNG图片到相册
- 📱 响应式设计，PC端左右分栏，移动端上下布局

**Vuetify版本新增特性：**
- 🎨 Material Design设计语言
- 🧩 统一的组件库支持
- 🔧 改进的表单和对话框交互
- 🎯 更优雅的响应式布局

**使用方法：**
```bash
# 在sansen_planner目录下打开index.html即可使用
```

**典型使用场景：**
- 大型偶像节多团体参战规划
- 握手会Live+特典时间安排
- 巡回演唱会单日多场次规划
- 粉丝见面会活动时间管理

## 🎨 共享资源

`shared/` 目录包含了各工具共用的样式文件和资源：
- `styles.css`: 主样式文件，提供统一的设计语言
- `docs-styles.css`: 文档页面样式
- `assets/logo.png`: 统一Logo文件

## 🚀 开发

当前项目使用纯前端技术栈，无需特殊安装步骤。

**技术栈：**
- HTML5 + CSS3 + JavaScript ES6+
- Canvas 2D API（甘特图绘制）
- LocalStorage（本地数据存储）
- 响应式设计（支持桌面和移动端）

**运行方式：**
直接在浏览器中打开对应工具的HTML文件即可使用，支持完全离线运行。

## 📖 文档

每个工具都有独立的README和用户文档，详见各工具目录：

- [一番赏工具文档](ichibankuji/README.md)
- [抛硬币工具文档](coin_flip/README.md)
- [偶活参战规划小助手文档](sansen_planner/README.md)

## 🌟 特色

### 统一设计语言
- 所有工具保持一致的界面风格和交互体验
- 共享样式文件确保视觉统一性
- 标准化的组件和布局模式

### 本地化存储
- 完全基于浏览器LocalStorage
- 不同用户数据完全隔离
- 无需服务器，完全离线可用

### 响应式设计
- 完美适配桌面端和移动端
- 智能布局切换（左右分栏 ↔ 上下堆叠）
- 触控友好的操作界面

### 数据导出
- 支持多种格式导出（快照JSON、记录CSV、图片PNG）
- 便于数据备份和分享
- 高质量图片适合保存到相册

## 🎯 路线图

### 已完成 ✅
- 一番赏工具完整功能
- 抛硬币工具（3D动画版）
- 偶活参战规划小助手基础版本
- 统一的项目结构和设计语言
- 响应式布局和移动端适配

### 规划中 🚧
- 更多实用工具的加入
- 数据同步和云端存储选项
- 更丰富的导出选项
- 用户体验优化

---

**By Torisaboten** 🌸  
**更新时间：** 2025年1月  
**版本：** v1.1.0 