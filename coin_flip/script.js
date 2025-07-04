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
            // 'heads', 'tails', 'standing'
            currentState: 'heads', 
            // 'flip-heads', 'flip-tails', 'flip-standing'
            animationClass: ''
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
                result = 'standing';
                resultText = this.standingText;
            } else {
                const adjustedThreshold = this.canStand ? 50 - (this.standingProbability / 2) : 50;
                if (random < adjustedThreshold || (!this.canStand && random < 50)) {
                    result = 'heads';
                    resultText = this.headsText;
                } else {
                    result = 'tails';
                    resultText = this.tailsText;
                }
            }
            
            this.animationClass = 'flip-' + result;
            
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
            
            // 动画结束后更新状态
            setTimeout(() => {
                this.isFlipping = false;
                this.animationClass = '';
                this.currentState = result;
                this.lastResult = record;
                this.history.unshift(record);
            }, 1200); // 必须和CSS动画时间一致
        },
        
        onStandingChange() {
            // 当取消立起选项时，确保概率正常
            if (!this.canStand) {
                this.standingProbability = 0;
            } else if (this.standingProbability === 0) {
                this.standingProbability = 1.0;
            }
        },
        
        clearHistory() {
            if (confirm('确定要清空所有历史记录吗？')) {
                this.history = [];
                this.lastResult = null;
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
        }
    },
    
    mounted() {
        // 添加键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isFlipping) {
                e.preventDefault();
                this.flipCoin();
            }
        });
    }
}).mount('#app'); 