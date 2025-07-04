const { createApp } = Vue;

createApp({
    data() {
        return {
            headsText: '正面',
            tailsText: '反面',
            canStand: false,
            standingText: '立起',
            standingProbability: 1.0,
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
        },
        standingCount() {
            return this.history.filter(record => record.result === 'standing').length;
        }
    },
    methods: {
        flipCoin() {
            if (this.isFlipping) return;
            
            this.isFlipping = true;
            
            // 计算概率
            let result, resultText;
            const random = Math.random() * 100;
            
            if (this.canStand && random < this.standingProbability) {
                // 硬币立起
                result = 'standing';
                resultText = this.standingText;
                this.coinClass = 'flip-standing';
            } else {
                // 正常抛硬币，调整概率
                const adjustedThreshold = this.canStand ? 
                    50 - (this.standingProbability / 2) : 50;
                
                if (random < adjustedThreshold || (!this.canStand && random < 50)) {
                    result = 'heads';
                    resultText = this.headsText;
                    this.coinClass = 'flip-heads';
                } else {
                    result = 'tails';
                    resultText = this.tailsText;
                    this.coinClass = 'flip-tails';
                }
            }
            
            // 创建结果记录
            const record = {
                result: result,
                text: resultText,
                timestamp: new Date().toISOString(),
                headsText: this.headsText,
                tailsText: this.tailsText,
                standingText: this.standingText,
                canStand: this.canStand,
                standingProbability: this.standingProbability
            };
            
            // 延迟设置结果，让动画有时间完成
            setTimeout(() => {
                this.lastResult = record;
                this.history.push(record);
                this.saveToStorage();
            }, 1200); // 动画时间1.2秒
        },
        
        onAnimationEnd() {
            this.isFlipping = false;
            this.coinClass = '';
        },
        
        onStandingChange() {
            // 当取消立起选项时，确保概率正常
            if (!this.canStand) {
                this.standingProbability = 0;
            } else if (this.standingProbability === 0) {
                this.standingProbability = 1.0;
            }
            this.saveToStorage();
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
                canStand: this.canStand,
                standingText: this.standingText,
                standingProbability: this.standingProbability,
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
                    this.canStand = parsed.canStand || false;
                    this.standingText = parsed.standingText || '立起';
                    this.standingProbability = parsed.standingProbability || 1.0;
                    this.history = parsed.history || [];
                    this.lastResult = parsed.lastResult || null;
                }
            } catch (error) {
                console.error('加载数据失败:', error);
                // 如果加载失败，使用默认值
                this.headsText = '正面';
                this.tailsText = '反面';
                this.canStand = false;
                this.standingText = '立起';
                this.standingProbability = 1.0;
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
        },
        standingText() {
            this.saveToStorage();
        },
        standingProbability() {
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