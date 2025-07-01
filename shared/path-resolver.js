/**
 * 通用路径解析器
 * 自动检测运行环境（本地 file:// 或服务器 http(s)://）
 * 并返回相应的路径格式
 */
class PathResolver {
    constructor() {
        this.isLocalFile = window.location.protocol === 'file:';
        this.isServer = window.location.protocol.startsWith('http');
        
        // 检测当前页面在哪个子目录
        const pathname = window.location.pathname;
        if (pathname.includes('/ichibankuji/')) {
            this.currentApp = 'ichibankuji';
        } else if (pathname.includes('/sansen_planner/')) {
            this.currentApp = 'sansen_planner';
        } else {
            this.currentApp = 'root';
        }
    }
    
    /**
     * 解析共享资源路径
     * @param {string} path - 相对于 shared 目录的路径
     * @returns {string} - 解析后的完整路径
     */
    shared(path) {
        if (this.isLocalFile) {
            // 本地文件系统，使用相对路径
            switch (this.currentApp) {
                case 'ichibankuji':
                case 'sansen_planner':
                    return `../shared/${path}`;
                case 'root':
                default:
                    return `shared/${path}`;
            }
        } else {
            // 服务器环境，使用绝对路径
            return `/shared/${path}`;
        }
    }
    
    /**
     * 解析应用内资源路径
     * @param {string} appName - 应用名称
     * @param {string} path - 应用内路径
     * @returns {string} - 解析后的完整路径
     */
    app(appName, path) {
        if (this.isLocalFile) {
            // 本地文件系统，使用相对路径
            if (this.currentApp === appName) {
                // 同一个应用内
                return `./${path}`;
            } else if (this.currentApp === 'root') {
                // 从根目录访问子应用
                return `${appName}/${path}`;
            } else {
                // 从其他应用访问
                return `../${appName}/${path}`;
            }
        } else {
            // 服务器环境，使用绝对路径
            return `/${appName}/${path}`;
        }
    }
    
    /**
     * 解析根目录路径
     * @param {string} path - 根目录下的路径
     * @returns {string} - 解析后的完整路径
     */
    root(path = '') {
        if (this.isLocalFile) {
            // 本地文件系统，使用相对路径
            switch (this.currentApp) {
                case 'ichibankuji':
                case 'sansen_planner':
                    return `../${path}`;
                case 'root':
                default:
                    return path;
            }
        } else {
            // 服务器环境，使用绝对路径
            return `/${path}`;
        }
    }
    
    /**
     * 解析页面跳转路径
     * @param {string} appName - 目标应用名称
     * @param {string} page - 页面名称（可选）
     * @returns {string} - 解析后的完整路径
     */
    navigate(appName, page = '') {
        if (appName === 'root') {
            return this.root(page);
        } else {
            return this.app(appName, page);
        }
    }
}

// 创建全局实例
window.pathResolver = new PathResolver();

// 便捷函数
window.resolvePath = {
    shared: (path) => window.pathResolver.shared(path),
    app: (appName, path) => window.pathResolver.app(appName, path),
    root: (path) => window.pathResolver.root(path),
    navigate: (appName, page) => window.pathResolver.navigate(appName, page)
};

// 立即执行：修复HTML中的硬编码路径
(function() {
    // 等待DOM加载完成
    function fixHardcodedPaths() {
        const pathResolver = window.pathResolver;
        
        // 修复CSS链接
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.href;
            if (href.includes('/shared/')) {
                // 提取shared/后面的路径
                const sharedPath = href.substring(href.lastIndexOf('/shared/') + 8);
                link.href = pathResolver.shared(sharedPath);
            }
        });
        
        // 修复JavaScript引用
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.src;
            if (src.includes('/shared/')) {
                // 提取shared/后面的路径
                const sharedPath = src.substring(src.lastIndexOf('/shared/') + 8);
                script.src = pathResolver.shared(sharedPath);
            }
        });
        
        // 修复图片路径
        document.querySelectorAll('img[src]').forEach(img => {
            const src = img.src;
            if (src.includes('/shared/')) {
                // 提取shared/后面的路径
                const sharedPath = src.substring(src.lastIndexOf('/shared/') + 8);
                img.src = pathResolver.shared(sharedPath);
            }
        });
        
        // 修复链接路径
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            
            // 忽略锚点链接和特殊协议链接
            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
                return;
            }
            
            // 只处理相对路径和绝对路径中的应用路径
            if (href.includes('/ichibankuji/') || href.includes('/sansen_planner/')) {
                // 提取应用路径
                if (href.includes('/ichibankuji/')) {
                    const appPath = href.substring(href.lastIndexOf('/ichibankuji/') + 12);
                    link.href = pathResolver.app('ichibankuji', appPath);
                } else if (href.includes('/sansen_planner/')) {
                    const appPath = href.substring(href.lastIndexOf('/sansen_planner/') + 16);
                    link.href = pathResolver.app('sansen_planner', appPath);
                }
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixHardcodedPaths);
    } else {
        fixHardcodedPaths();
    }
})();

// 兼容性：向后兼容旧的路径解析方式
window.getAssetPath = (path) => window.pathResolver.shared(`assets/${path}`);
window.getStylePath = (path) => window.pathResolver.shared(path);

// 微信环境检测和文件下载工具
window.WeChatHelper = {
    // 检测是否在微信内置浏览器中
    isWeChat() {
        return /MicroMessenger/i.test(navigator.userAgent);
    },
    
    // 检查文件下载是否受限
    canDownloadFiles() {
        return !this.isWeChat();
    },
    
    // 显示微信限制提示
    showWeChatLimitation(fileType = '文件') {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;
        
        content.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🚫</div>
            <h3 style="margin: 0 0 1rem 0; color: #e53e3e;">微信环境限制</h3>
            <p style="margin: 0 0 1.5rem 0; color: #4a5568; line-height: 1.5;">
                由于微信内置浏览器的安全限制，无法下载${fileType}。<br>
                请在外部浏览器中打开本页面。
            </p>
            <div style="text-align: left; margin: 1rem 0; padding: 1rem; background: #f0fff4; border-radius: 8px; border-left: 4px solid #48bb78;">
                <div style="font-weight: 600; color: #22543d; margin-bottom: 0.5rem;">📱 如何在外部浏览器打开：</div>
                <div style="font-size: 0.9rem; color: #2d5016; line-height: 1.4;">
                    1. 点击右上角"···"菜单<br>
                    2. 选择"在浏览器打开"<br>
                    3. 在外部浏览器中使用完整功能
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: #48bb78; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                我知道了
            </button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return false; // 表示操作被中止
    },
    
    // 通用的文件下载前检查
    checkDownloadPermission(fileType = '文件') {
        if (!this.canDownloadFiles()) {
            return this.showWeChatLimitation(fileType);
        }
        return true; // 可以继续下载
    }
}; 