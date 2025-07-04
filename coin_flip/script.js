const { createApp } = Vue;

createApp({
    data() {
        return {
            headsText: '正面',
            tailsText: '反面',
            isFlipping: false,
            lastResult: null,
            history: [],
            coinClass: '',
            storageKey: 'coin_flip_data'
        }
    },
    computed: {
        headsCount() {
            return this.history.filter(record => record.result === 'heads').length;
        },
        tailsCount() {
            return this.history.filter(record => record.result === 'tails').length;
        }
    },
    methods: {
        flipCoin() {
            if (this.isFlipping) return;
            
            this.isFlipping = true;
            
            // 生成随机结果
            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            const resultText = result === 'heads' ? this.headsText : this.tailsText;
            
            // 设置动画类
            this.coinClass = `flip-${result}`;
            
            // 创建结果记录
            const record = {
                result: result,
                text: resultText,
                timestamp: new Date().toISOString(),
                headsText: this.headsText,
                tailsText: this.tailsText
            };
            
            // 延迟设置结果，让动画有时间完成
            setTimeout(() => {
                this.lastResult = record;
                this.history.push(record);
                this.saveToStorage();
            }, 1500); // 动画时间1.5秒
        },
        
        onAnimationEnd() {
            this.isFlipping = false;
            this.coinClass = '';
        },
        
        clearHistory() {
            if (confirm('确定要清空所有历史记录吗？')) {
                this.history = [];
                this.lastResult = null;
                this.saveToStorage();
            }
        },
        
        formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            
            if (diffMins < 1) {
                return '刚刚';
            } else if (diffMins < 60) {
                return `${diffMins}分钟前`;
            } else if (diffMins < 1440) {
                const hours = Math.floor(diffMins / 60);
                return `${hours}小时前`;
            } else {
                return date.toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        },
        
        saveToStorage() {
            const data = {
                headsText: this.headsText,
                tailsText: this.tailsText,
                history: this.history,
                lastResult: this.lastResult
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        },
        
        loadFromStorage() {
            try {
                const data = localStorage.getItem(this.storageKey);
                if (data) {
                    const parsed = JSON.parse(data);
                    this.headsText = parsed.headsText || '正面';
                    this.tailsText = parsed.tailsText || '反面';
                    this.history = parsed.history || [];
                    this.lastResult = parsed.lastResult || null;
                }
            } catch (error) {
                console.error('加载数据失败:', error);
                // 如果加载失败，使用默认值
                this.headsText = '正面';
                this.tailsText = '反面';
                this.history = [];
                this.lastResult = null;
            }
        }
    },
    
    watch: {
        headsText() {
            this.saveToStorage();
        },
        tailsText() {
            this.saveToStorage();
        }
    },
    
    mounted() {
        this.loadFromStorage();
        
        // 如果用户设置为空，使用默认值
        if (!this.headsText.trim()) {
            this.headsText = '正面';
        }
        if (!this.tailsText.trim()) {
            this.tailsText = '反面';
        }
        
        // 添加键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isFlipping) {
                e.preventDefault();
                this.flipCoin();
            }
        });
    }
}).mount('#app'); 