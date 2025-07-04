const { createApp } = Vue;

createApp({
    data() {
        return {
            headsText: '正面',
            tailsText: '反面',
            isFlipping: false,
            lastResult: null,
            history: [],
            // 'heads', 'tails'
            currentState: 'heads', 
            // 'flip-heads', 'flip-tails'
            animationClass: ''
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
            
            // 简单的50/50概率
            const isHeads = Math.random() < 0.5;
            const result = isHeads ? 'heads' : 'tails';
            const resultText = isHeads ? this.headsText : this.tailsText;
            
            this.animationClass = 'flip-' + result;
            
            // 创建结果记录
            const record = {
                result: result,
                text: resultText,
                timestamp: new Date().toISOString(),
                headsText: this.headsText,
                tailsText: this.tailsText
            };
            
            // 动画结束后更新状态
            setTimeout(() => {
                this.isFlipping = false;
                this.animationClass = '';
                this.currentState = result;
                this.lastResult = record;
                this.history.unshift(record);
            }, 1200);
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