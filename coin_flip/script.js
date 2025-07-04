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
            currentState: 'heads' // 当前硬币状态: heads, tails, standing
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
                this.coinClass = this.getAnimationClass(result);
            } else {
                // 正常抛硬币，调整概率
                const adjustedThreshold = this.canStand ? 
                    50 - (this.standingProbability / 2) : 50;
                
                if (random < adjustedThreshold || (!this.canStand && random < 50)) {
                    result = 'heads';
                    resultText = this.headsText;
                    this.coinClass = this.getAnimationClass(result);
                } else {
                    result = 'tails';
                    resultText = this.tailsText;
                    this.coinClass = this.getAnimationClass(result);
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
                this.currentState = result; // 更新硬币状态
                this.isFlipping = false;
                this.coinClass = ''; // 清除动画类
            }, 1200); // 动画时间1.2秒
        },
        
        // 根据当前状态和目标结果选择动画类
        getAnimationClass(targetResult) {
            if (this.currentState === 'heads') {
                if (targetResult === 'heads') return 'flip-heads';
                if (targetResult === 'tails') return 'flip-tails-from-heads';
                if (targetResult === 'standing') return 'flip-standing-from-heads';
            } else if (this.currentState === 'tails') {
                if (targetResult === 'heads') return 'flip-heads-from-tails';
                if (targetResult === 'tails') return 'flip-tails';
                if (targetResult === 'standing') return 'flip-standing-from-tails';
            } else if (this.currentState === 'standing') {
                if (targetResult === 'heads') return 'flip-heads-from-standing';
                if (targetResult === 'tails') return 'flip-tails-from-standing';
                if (targetResult === 'standing') return 'flip-standing';
            }
            
            // 默认动画（首次抛硬币）
            if (targetResult === 'heads') return 'flip-heads';
            if (targetResult === 'tails') return 'flip-tails';
            if (targetResult === 'standing') return 'flip-standing';
            
            return 'flip-heads';
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