// 一番赏抽奖工具 - 主要功能实现
class IchibanLotteryApp {
    constructor() {
        this.currentLottery = null;
        this.lotteries = this.loadLotteries();
        this.currentPage = 'lottery-list-page';
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.checkLogo();
        this.renderLotteryList();
        this.showPage('lottery-list-page');
    }

    // 检查Logo文件
    checkLogo() {
        const logoImg = document.getElementById('app-logo-img');
        const logoIcon = document.getElementById('app-logo-icon');
        
        const testImg = new Image();
        testImg.onload = () => {
            logoImg.style.display = 'block';
            logoIcon.style.display = 'none';
        };
        testImg.onerror = () => {
            logoImg.style.display = 'none';
            logoIcon.style.display = 'block';
        };
        
        // 使用路径解析器获取正确的logo路径
        const logoPath = window.resolvePath ? window.resolvePath.shared('assets/logo.png') : '/shared/assets/logo.png';
        testImg.src = logoPath;
        logoImg.src = logoPath;
    }

    // 绑定事件监听器
    bindEvents() {
        // 页面导航事件
        document.getElementById('create-lottery-btn').addEventListener('click', () => {
            // 检查微信环境并提前告知限制
            if (window.WeChatHelper.isWeChat()) {
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
                    max-width: 450px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                `;
                
                content.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3 style="margin: 0 0 1rem 0; color: #d69e2e;">微信环境提示</h3>
                    <p style="margin: 0 0 1.5rem 0; color: #4a5568; line-height: 1.5; text-align: left;">
                        您正在微信内置浏览器中使用此工具。由于微信的安全限制：<br><br>
                        <strong>🚫 受限功能：</strong><br>
                        • 无法下载抽奖配置JSON文件<br>
                        • 无法下载抽奖记录CSV文件<br><br>
                        <strong>✅ 正常功能：</strong><br>
                        • 可以正常创建和进行抽奖<br>
                        • 数据会保存在本地浏览器中
                    </p>
                    <div style="text-align: left; margin: 1rem 0; padding: 1rem; background: #f0fff4; border-radius: 8px; border-left: 4px solid #48bb78;">
                        <div style="font-weight: 600; color: #22543d; margin-bottom: 0.5rem;">💡 建议在外部浏览器中获得完整功能</div>
                        <div style="font-size: 0.9rem; color: #2d5016; line-height: 1.4;">
                            点击右上角"···"菜单 → 选择"在浏览器打开"
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                                style="flex: 1; background: #e2e8f0; color: #4a5568; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                            返回列表
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove(); lotteryApp.continueToCreateLottery();" 
                                style="flex: 1; background: #48bb78; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                            仍要继续
                        </button>
                    </div>
                `;
                
                modal.appendChild(content);
                document.body.appendChild(modal);
                
                // 点击背景关闭
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
                
                return; // 阻止继续执行
            }
            
            // 非微信环境直接继续
            this.continueToCreateLottery();
        });

        document.getElementById('back-to-list-btn').addEventListener('click', () => {
            this.showPage('lottery-list-page');
            this.renderLotteryList(); // 刷新列表
        });

        document.getElementById('back-to-list-from-draw-btn').addEventListener('click', () => {
            this.showPage('lottery-list-page');
            this.renderLotteryList(); // 刷新列表
        });

        document.getElementById('back-to-config-btn').addEventListener('click', () => {
            if (confirm('返回配置将清空当前抽奖进度，您确定要继续吗？')) {
                // 清空当前抽奖的历史记录和状态
                this.resetCurrentLotteryProgress();
                this.showPage('lottery-config-page');
                this.loadConfigFromCurrentLottery();
            }
        });

        document.getElementById('clear-all-btn').addEventListener('click', () => {
            if (confirm('确定要清空所有抽奖记录吗？此操作不可恢复！')) {
                this.clearAllLotteries();
            }
        });

        // 配置表单事件
        document.getElementById('add-prize-btn').addEventListener('click', () => {
            this.addPrizeItem();
        });

        document.getElementById('include-last-prize').addEventListener('change', (e) => {
            this.updateLastPrize(e.target.checked);
        });

        document.getElementById('lottery-type').addEventListener('change', (e) => {
            this.switchLotteryType(e.target.value);
        });

        document.getElementById('lottery-config-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createLottery();
        });

        // 抽奖事件
        document.getElementById('draw-btn').addEventListener('click', () => {
            this.performDraw();
        });

        // 再来一次事件
        document.getElementById('restart-lottery-btn').addEventListener('click', () => {
            this.restartLottery();
        });

        // 重置抽奖事件
        document.getElementById('reset-lottery-btn').addEventListener('click', () => {
            this.resetLottery();
        });

        // 导出事件
        document.getElementById('export-snapshot-btn').addEventListener('click', () => {
            this.exportSnapshot();
        });

        document.getElementById('export-csv-btn').addEventListener('click', () => {
            this.exportCSV();
        });

        // 文件导入处理（用于快照导入）
        this.setupFileImport();
    }

    // 页面切换
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        this.currentPage = pageId;
    }

    // LocalStorage 操作
    loadLotteries() {
        const stored = localStorage.getItem('ichiban-lotteries');
        return stored ? JSON.parse(stored) : [];
    }

    saveLotteries() {
        localStorage.setItem('ichiban-lotteries', JSON.stringify(this.lotteries));
    }

    // 渲染抽奖列表
    renderLotteryList() {
        const listContainer = document.getElementById('lottery-list');
        const emptyState = document.getElementById('empty-state');

        if (this.lotteries.length === 0) {
            listContainer.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        listContainer.style.display = 'grid';
        emptyState.style.display = 'none';
        
        listContainer.innerHTML = this.lotteries.map((lottery, index) => {
            const isCompleted = this.isLotteryCompleted(lottery);
            
            if (lottery.type === 'probability') {
                // 概率抽奖的显示
                return `
                    <div class="lottery-card" onclick="lotteryApp.openLottery(${index})">
                        <div class="lottery-card-header">
                            <div>
                                <div class="lottery-card-title">${lottery.name}</div>
                                <div class="lottery-card-info">
                                    创建时间: ${new Date(lottery.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <div class="lottery-card-type">概率抽奖</div>
                        </div>
                        <div class="lottery-card-info">
                            <div>奖项数量: ${lottery.config.prizes.length}</div>
                            <div>累计抽奖: ${lottery.history.length} 次</div>
                        </div>
                        <div class="lottery-card-status">
                            <span class="status-badge status-active">进行中</span>
                            <span>${lottery.history.length} 次抽奖</span>
                        </div>
                    </div>
                `;
            } else {
                // 一番赏的显示
                const totalItemsPerBox = this.getTotalItemsPerBox(lottery.config.prizes);
                const remainingInCurrentBox = lottery.state.remainingInCurrentBox;
                const currentBoxProgress = totalItemsPerBox > 0 ? ((totalItemsPerBox - remainingInCurrentBox) / totalItemsPerBox * 100) : 0;
                const isInfinite = lottery.config.totalBoxes === 0;

                return `
                    <div class="lottery-card" onclick="lotteryApp.openLottery(${index})">
                        <div class="lottery-card-header">
                            <div>
                                <div class="lottery-card-title">${lottery.name}</div>
                                <div class="lottery-card-info">
                                    创建时间: ${new Date(lottery.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <div class="lottery-card-type">一番赏</div>
                        </div>
                        <div class="lottery-card-info">
                            <div>总箱数: ${isInfinite ? '无限' : lottery.config.totalBoxes}</div>
                            <div>当前: 第${lottery.state.currentBox}箱</div>
                            <div>当前箱进度: ${currentBoxProgress.toFixed(1)}%</div>
                            <div>本箱剩余: ${remainingInCurrentBox}/${totalItemsPerBox}</div>
                        </div>
                        <div class="lottery-card-status">
                            <span class="status-badge ${isCompleted ? 'status-completed' : 'status-active'}">
                                ${isCompleted ? '已完成' : '进行中'}
                            </span>
                            <span>${lottery.history.length} 次抽奖</span>
                        </div>
                    </div>
                `;
            }
        }).join('');
    }

    // 打开抽奖
    openLottery(index) {
        // 检查微信环境并提前告知限制
        if (window.WeChatHelper.isWeChat()) {
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
                max-width: 450px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            `;
            
            content.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="margin: 0 0 1rem 0; color: #d69e2e;">微信环境提示</h3>
                <p style="margin: 0 0 1.5rem 0; color: #4a5568; line-height: 1.5; text-align: left;">
                    您正在微信内置浏览器中使用此工具。由于微信的安全限制：<br><br>
                    <strong>🚫 受限功能：</strong><br>
                    • 无法下载抽奖配置JSON文件<br>
                    • 无法下载抽奖记录CSV文件<br><br>
                    <strong>✅ 正常功能：</strong><br>
                    • 可以正常进行抽奖活动<br>
                    • 数据会保存在本地浏览器中
                </p>
                <div style="text-align: left; margin: 1rem 0; padding: 1rem; background: #f0fff4; border-radius: 8px; border-left: 4px solid #48bb78;">
                    <div style="font-weight: 600; color: #22543d; margin-bottom: 0.5rem;">💡 建议在外部浏览器中获得完整功能</div>
                    <div style="font-size: 0.9rem; color: #2d5016; line-height: 1.4;">
                        点击右上角"···"菜单 → 选择"在浏览器打开"
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="flex: 1; background: #e2e8f0; color: #4a5568; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                        返回列表
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); lotteryApp.continueToOpenLottery(${index});" 
                            style="flex: 1; background: #48bb78; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                        仍要继续
                    </button>
                </div>
            `;
            
            modal.appendChild(content);
            document.body.appendChild(modal);
            
            // 点击背景关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
            
            return; // 阻止继续执行
        }
        
        // 非微信环境直接继续
        this.continueToOpenLottery(index);
    }

    // 重置配置表单
    resetConfigForm() {
        document.getElementById('lottery-config-form').reset();
        document.getElementById('total-boxes').value = 1;
        document.getElementById('lottery-type').value = 'ichiban';
        document.getElementById('prizes-container').innerHTML = '';
        this.switchLotteryType('ichiban'); // 先切换类型，这会添加第一个奖项
        this.updateLastPrize(false);
    }

    // 添加奖项配置项
    addPrizeItem(isLastPrize = false) {
        const container = document.getElementById('prizes-container');
        const lotteryType = document.getElementById('lottery-type').value;
        const prizeId = `prize-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const prizeItem = document.createElement('div');
        prizeItem.className = `prize-item${isLastPrize ? ' last-prize' : ''}`;
        
        if (lotteryType === 'probability') {
            // 概率抽奖模式
            prizeItem.innerHTML = `
                <div class="prize-item-header">
                    <span class="prize-item-title">🎁 奖项</span>
                    <button type="button" class="remove-prize-btn" onclick="this.parentElement.parentElement.remove(); lotteryApp.updateProbabilityTotalDisplay();">×</button>
                </div>
                <div class="prize-fields">
                    <div class="form-group">
                        <label>等级:</label>
                        <input type="text" name="prize-level" required placeholder="例：一等奖" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label>描述:</label>
                        <input type="text" name="prize-name" required placeholder="例：签名团切" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label>获奖概率:</label>
                        <div class="number-input-group probability-input-group">
                            <button type="button" class="number-btn minus" onclick="adjustProbabilityNumber(this, -1)">−</button>
                            <input type="number" name="prize-probability" min="0.1" max="100" step="0.1" required autocomplete="off" onchange="lotteryApp.updateProbabilityTotalDisplay()">
                            <span class="probability-suffix">%</span>
                            <button type="button" class="number-btn plus" onclick="adjustProbabilityNumber(this, 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 一番赏模式
            prizeItem.innerHTML = `
                <div class="prize-item-header">
                    <span class="prize-item-title">${isLastPrize ? '👑 LAST赏' : '🎁 奖项'}</span>
                    ${!isLastPrize ? `<button type="button" class="remove-prize-btn" onclick="this.parentElement.parentElement.remove(); lotteryApp.updateConfigTotalDisplay();">×</button>` : ''}
                </div>
                <div class="prize-fields">
                    <div class="form-group">
                        <label>等级:</label>
                        <input type="text" name="prize-level" required placeholder="${isLastPrize ? '例：LAST赏' : '例：A赏'}" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label>描述:</label>
                        <input type="text" name="prize-name" required placeholder="${isLastPrize ? '例：手作礼物、手写信' : '例：手机合影券、三寸带签券'}" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label>数量:</label>
                        <div class="number-input-group">
                            <button type="button" class="number-btn minus" onclick="adjustPrizeNumber(this, -1)">−</button>
                            <input type="number" name="prize-count" min="1" ${isLastPrize ? 'value="1" readonly' : 'required'} placeholder="例：1" autocomplete="off" onchange="lotteryApp.updateConfigTotalDisplay()">
                            <button type="button" class="number-btn plus" onclick="adjustPrizeNumber(this, 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (isLastPrize) {
            // LAST赏总是添加到最后
            container.appendChild(prizeItem);
        } else {
            // 普通奖项添加到最前面（但在其他普通奖项之前）
            const firstNormalPrize = container.querySelector('.prize-item:not(.last-prize)');
            if (firstNormalPrize) {
                container.insertBefore(prizeItem, firstNormalPrize);
            } else {
                // 如果没有普通奖项，检查是否有LAST赏
                const lastPrize = container.querySelector('.last-prize');
                if (lastPrize) {
                    container.insertBefore(prizeItem, lastPrize);
                } else {
                    container.appendChild(prizeItem);
                }
            }
        }
        
        // 更新总数显示
        if (lotteryType === 'probability') {
            this.updateProbabilityTotalDisplay();
        } else {
            this.updateConfigTotalDisplay();
        }
    }

    // 更新LAST赏显示
    updateLastPrize(include) {
        const lastPrize = document.querySelector('.prize-item.last-prize');
        if (include && !lastPrize) {
            this.addPrizeItem(true);
        } else if (!include && lastPrize) {
            lastPrize.remove();
        }
        // 更新总数显示
        this.updateConfigTotalDisplay();
    }

    // 切换抽奖类型
    switchLotteryType(type) {
        const ichibanConfig = document.getElementById('ichiban-config');
        const probabilityConfig = document.getElementById('probability-config');
        const prizesContainer = document.getElementById('prizes-container');
        const totalItemsDisplay = document.getElementById('total-items-display');
        const totalProbabilityDisplay = document.getElementById('total-probability-display-main');
        
        // 清空所有已配置的奖项
        prizesContainer.innerHTML = '';
        
        if (type === 'ichiban') {
            ichibanConfig.style.display = 'block';
            probabilityConfig.style.display = 'none';
            totalItemsDisplay.style.display = 'block';
            totalProbabilityDisplay.style.display = 'none';
            // 重置LAST赏选项
            document.getElementById('include-last-prize').checked = false;
            // 添加第一个一番赏奖项
            this.addPrizeItem();
            this.updateConfigTotalDisplay();
        } else if (type === 'probability') {
            ichibanConfig.style.display = 'none';
            probabilityConfig.style.display = 'block';
            totalItemsDisplay.style.display = 'none';
            totalProbabilityDisplay.style.display = 'block';
            // 添加第一个概率奖项
            this.addPrizeItem();
            this.updateProbabilityTotalDisplay();
        }
    }

    // 奖项排序函数：LAST赏最前，然后按初始数量升序（数量少的更珍贵）
    sortPrizes(prizes) {
        return prizes.sort((a, b) => {
            if (a.isLastPrize) return -1;
            if (b.isLastPrize) return 1;
            return a.count - b.count;
        });
    }

    // 结果排序函数：LAST赏最前，然后按等级排序
    sortResults(results, allPrizes) {
        return results.sort((a, b) => {
            if (a.isLastPrize) return -1;
            if (b.isLastPrize) return 1;
            
            // 根据剩余奖项中的顺序排序
            const prizeA = allPrizes.find(p => p.level === a.level && p.name === a.name);
            const prizeB = allPrizes.find(p => p.level === b.level && p.name === b.name);
            
            if (prizeA && prizeB) {
                return prizeA.remaining - prizeB.remaining;
            }
            
            return 0;
        });
    }

    // 创建抽奖
    createLottery() {
        // 直接获取表单字段值
        const name = document.getElementById('lottery-name').value;
        const lotteryType = document.getElementById('lottery-type').value;
        
        if (lotteryType === 'probability') {
            this.createProbabilityLottery(name);
        } else {
            this.createIchibanLottery(name);
        }
    }

    // 创建一番赏抽奖
    createIchibanLottery(name) {
        const totalBoxes = parseInt(document.getElementById('total-boxes').value);
        const includeLastPrize = document.getElementById('include-last-prize').checked;

        // 收集奖项数据
        const prizeItems = document.querySelectorAll('.prize-item:not(.last-prize)');
        const prizes = Array.from(prizeItems).map(item => ({
            level: item.querySelector('[name="prize-level"]').value,
            name: item.querySelector('[name="prize-name"]').value,
            count: parseInt(item.querySelector('[name="prize-count"]').value),
            remaining: parseInt(item.querySelector('[name="prize-count"]').value) // 无限箱数时就是单箱数量
        }));

        let lastPrize = null;
        if (includeLastPrize) {
            const lastPrizeItem = document.querySelector('.prize-item.last-prize');
            if (lastPrizeItem) {
                lastPrize = {
                    level: lastPrizeItem.querySelector('[name="prize-level"]').value,
                    name: lastPrizeItem.querySelector('[name="prize-name"]').value,
                    count: 1,
                    remaining: 1 // 无限箱数时每箱都有1个LAST赏
                };
            }
        }

        // 验证数据
        if (!name || name.trim() === '') {
            showNotification('请填写抽奖名称！', 'error');
            return;
        }

        if (prizes.length === 0) {
            showNotification('请至少添加一个奖项！', 'error');
            return;
        }

        // 检查普通奖项是否填写完整
        for (let i = 0; i < prizes.length; i++) {
            const prize = prizes[i];
            if (!prize.level || prize.level.trim() === '') {
                showNotification(`第${i + 1}个奖项的等级不能为空！`, 'error');
                return;
            }
            if (!prize.name || prize.name.trim() === '') {
                showNotification(`第${i + 1}个奖项的描述不能为空！`, 'error');
                return;
            }
            if (!prize.count || prize.count <= 0 || isNaN(prize.count)) {
                showNotification(`第${i + 1}个奖项的数量必须是大于0的数字！`, 'error');
                return;
            }
        }

        // 检查LAST赏是否填写完整
        if (includeLastPrize && lastPrize) {
            if (!lastPrize.level || lastPrize.level.trim() === '') {
                showNotification('LAST赏的等级不能为空！', 'error');
                return;
            }
            if (!lastPrize.name || lastPrize.name.trim() === '') {
                showNotification('LAST赏的描述不能为空！', 'error');
                return;
            }
        }

        // 创建抽奖对象
        const lottery = {
            id: generateUUID4(),
            name: name.trim(),
            type: 'ichiban',
            createdAt: new Date().toISOString(),
            config: {
                totalBoxes,
                includeLastPrize,
                prizes,
                lastPrize
            },
            state: {
                currentBox: 1,
                remainingInCurrentBox: this.getTotalItemsPerBox(prizes),
                prizes: JSON.parse(JSON.stringify(prizes)), // 深拷贝
                lastPrize: lastPrize ? JSON.parse(JSON.stringify(lastPrize)) : null
            },
            history: []
        };

        this.lotteries.push(lottery);
        this.saveLotteries();
        this.currentLottery = lottery;
        
        this.showPage('lottery-draw-page');
        this.renderDrawPage();
    }

    // 创建概率抽奖
    createProbabilityLottery(name) {
        // 收集奖项数据
        const prizeItems = document.querySelectorAll('.prize-item');
        const prizes = Array.from(prizeItems).map(item => ({
            level: item.querySelector('[name="prize-level"]').value,
            name: item.querySelector('[name="prize-name"]').value,
            probability: parseFloat(item.querySelector('[name="prize-probability"]').value)
        }));

        // 验证数据
        if (!name || name.trim() === '') {
            showNotification('请填写抽奖名称！', 'error');
            return;
        }

        if (prizes.length === 0) {
            showNotification('请至少添加一个奖项！', 'error');
            return;
        }

        // 检查奖项是否填写完整
        for (let i = 0; i < prizes.length; i++) {
            const prize = prizes[i];
            if (!prize.level || prize.level.trim() === '') {
                showNotification(`第${i + 1}个奖项的等级不能为空！`, 'error');
                return;
            }
            if (!prize.name || prize.name.trim() === '') {
                showNotification(`第${i + 1}个奖项的描述不能为空！`, 'error');
                return;
            }
            if (!prize.probability || prize.probability <= 0 || isNaN(prize.probability)) {
                showNotification(`第${i + 1}个奖项的概率必须是大于0的数字！`, 'error');
                return;
            }
        }

        // 检查概率总和
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
        if (Math.abs(totalProbability - 100) > 0.01) {
            showNotification(`概率总和必须为100%，当前为${totalProbability.toFixed(1)}%！`, 'error');
            return;
        }

        // 创建抽奖对象
        const lottery = {
            id: generateUUID4(),
            name: name.trim(),
            type: 'probability',
            createdAt: new Date().toISOString(),
            config: {
                prizes
            },
            state: {
                prizes: JSON.parse(JSON.stringify(prizes)) // 深拷贝
            },
            history: []
        };

        this.lotteries.push(lottery);
        this.saveLotteries();
        this.currentLottery = lottery;
        
        this.showPage('lottery-draw-page');
        this.renderDrawPage();
    }

    // 获取每箱总奖项数（不含LAST赏）
    getTotalItemsPerBox(prizes) {
        return prizes.reduce((total, prize) => total + prize.count, 0);
    }

    // 计算总奖项数
    getTotalItems(lottery) {
        const normalItems = lottery.config.prizes.reduce((total, prize) => total + prize.count, 0) * lottery.config.totalBoxes;
        const lastPrizeItems = lottery.config.includeLastPrize ? lottery.config.totalBoxes : 0;
        return normalItems + lastPrizeItems;
    }

    // 计算剩余奖项数
    getRemainingItems(lottery) {
        const normalRemaining = lottery.state.prizes.reduce((total, prize) => total + prize.remaining, 0);
        const lastPrizeRemaining = lottery.state.lastPrize ? lottery.state.lastPrize.remaining : 0;
        return normalRemaining + lastPrizeRemaining;
    }

    // 判断抽奖是否完成
    isLotteryCompleted(lottery) {
        // 如果是无限箱数，永远不算完成
        if (lottery.config.totalBoxes === 0) return false;
        
        // 如果当前箱已经超过总箱数，算完成
        return lottery.state.currentBox > lottery.config.totalBoxes;
    }

    // 再来一次功能
    restartLottery() {
        if (!this.currentLottery) return;
        
        if (!confirm('确定要重新开始吗？这将保留现有记录，重置箱数和奖项数量。')) {
            return;
        }

        const lottery = this.currentLottery;
        
        // 重置状态，但保留历史记录
        lottery.state.currentBox = 1;
        lottery.state.remainingInCurrentBox = this.getTotalItemsPerBox(lottery.config.prizes);
        
        // 重置奖项数量
        lottery.state.prizes = lottery.config.prizes.map(prize => ({
            ...prize,
            remaining: prize.count // 每次重置都回到单箱数量
        }));
        
        // 重置LAST赏
        if (lottery.state.lastPrize) {
            lottery.state.lastPrize.remaining = 1; // 每次重置都是1个
        }

        // 保存并重新渲染
        this.saveLotteries();
        this.renderDrawPage();
        
        showNotification('重新开始成功！', 'success');
    }

    // 重置抽奖功能
    resetLottery() {
        if (!this.currentLottery) return;
        
        const lottery = this.currentLottery;
        const lotteryName = lottery.name;
        
        if (!confirm(`确定要重置「${lotteryName}」吗？\n\n这将清空所有抽奖记录，但保留奖项配置，抽奖将回到初始状态。\n\n此操作不可恢复！`)) {
            return;
        }

        if (lottery.type === 'probability') {
            // 概率抽奖重置：只需清空历史记录
            lottery.history = [];
        } else {
            // 一番赏重置：重置状态和历史记录
            lottery.state.currentBox = 1;
            lottery.state.remainingInCurrentBox = this.getTotalItemsPerBox(lottery.config.prizes);
            
            // 重置奖项数量到初始状态
            lottery.state.prizes = lottery.config.prizes.map(prize => ({
                ...prize,
                remaining: prize.count
            }));
            
            // 重置LAST赏
            if (lottery.state.lastPrize) {
                lottery.state.lastPrize.remaining = 1;
            }
            
            // 清空历史记录
            lottery.history = [];
        }

        // 保存并重新渲染
        this.saveLotteries();
        this.renderDrawPage();
        
        showNotification('重置成功！抽奖已回到初始状态。', 'success');
    }

    // 渲染抽奖页面
    renderDrawPage() {
        if (!this.currentLottery) return;

        const lottery = this.currentLottery;
        
        // 根据抽奖类型显示或隐藏ALL按钮
        const allBtn = document.querySelector('.all-btn');
        if (allBtn) {
            allBtn.style.display = lottery.type === 'ichiban' ? 'inline-block' : 'none';
        }
        
        if (lottery.type === 'probability') {
            this.renderProbabilityDrawPage();
        } else {
            this.renderIchibanDrawPage();
        }
    }

    // 渲染一番赏抽奖页面
    renderIchibanDrawPage() {
        const lottery = this.currentLottery;
        const isInfinite = lottery.config.totalBoxes === 0;
        const isCompleted = this.isLotteryCompleted(lottery);
        
        // 检查是否需要自动切换到下一箱（无限箱数模式下）
        if (isInfinite && lottery.state.remainingInCurrentBox === 0 && !isCompleted) {
            this.moveToNextBox();
        }
        
        // 更新标题
        document.getElementById('lottery-title').textContent = `🎯 ${lottery.name}`;
        
        // 显示箱子状态（一番赏需要）
        const boxStatus = document.querySelector('.box-status');
        if (boxStatus) {
            boxStatus.style.display = 'flex';
        }
        
        // 更新箱子状态
        const currentBoxInfo = isInfinite ? `第${lottery.state.currentBox}箱` : `第${lottery.state.currentBox}箱/共${lottery.config.totalBoxes}箱`;
        document.getElementById('current-box-info').textContent = currentBoxInfo;
        
        const totalItemsPerBox = this.getTotalItemsPerBox(lottery.config.prizes);
        const remainingInCurrentBox = lottery.state.remainingInCurrentBox;
        document.getElementById('remaining-count').textContent = `${remainingInCurrentBox}/${totalItemsPerBox}`;

        // 渲染剩余奖项
        this.renderRemainingPrizes();
        
        // 渲染抽奖历史
        this.renderDrawHistory();

        // 更新按钮状态
        const drawBtn = document.getElementById('draw-btn');
        const restartBtn = document.getElementById('restart-lottery-btn');
        
        // 检查当前箱是否真正完成（包括LAST赏）
        const isCurrentBoxCompleted = remainingInCurrentBox === 0 && 
            (!lottery.state.lastPrize || lottery.state.lastPrize.remaining === 0);
        
        if (isCompleted) {
            drawBtn.disabled = true;
            drawBtn.textContent = '🎊 抽奖结束';
            drawBtn.className = 'btn btn-secondary btn-large';
            restartBtn.style.display = 'inline-flex';
        } else if (isCurrentBoxCompleted && !isInfinite && lottery.state.currentBox >= lottery.config.totalBoxes) {
            // 只有在非无限箱数模式下，且是最后一箱且当前箱完全抽完时才禁用
            drawBtn.disabled = true;
            drawBtn.textContent = '🎊 抽奖结束';
            drawBtn.className = 'btn btn-secondary btn-large';
            restartBtn.style.display = 'inline-flex';
        } else {
            drawBtn.disabled = false;
            drawBtn.textContent = '🎲 开始抽奖';
            drawBtn.className = 'btn btn-primary btn-large';
            restartBtn.style.display = 'none';
        }
    }

    // 渲染概率抽奖页面
    renderProbabilityDrawPage() {
        const lottery = this.currentLottery;
        
        // 更新标题
        document.getElementById('lottery-title').textContent = `🎯 ${lottery.name}`;
        
        // 隐藏箱子状态（概率抽奖不需要）
        const boxStatus = document.querySelector('.box-status');
        if (boxStatus) {
            boxStatus.style.display = 'none';
        }
        
        // 渲染剩余奖项（概率显示）
        this.renderProbabilityPrizes();
        
        // 渲染抽奖历史
        this.renderDrawHistory();

        // 概率抽奖永远可以抽奖
        const drawBtn = document.getElementById('draw-btn');
        const restartBtn = document.getElementById('restart-lottery-btn');
        
        drawBtn.disabled = false;
        drawBtn.textContent = '🎲 开始抽奖';
        drawBtn.className = 'btn btn-primary btn-large';
        restartBtn.style.display = 'none'; // 概率抽奖不需要重新开始
    }

    // 渲染剩余奖项
    renderRemainingPrizes() {
        const container = document.getElementById('remaining-prizes-list');
        const lottery = this.currentLottery;
        
        const prizes = [...lottery.state.prizes];
        if (lottery.state.lastPrize) {
            prizes.unshift({...lottery.state.lastPrize, isLastPrize: true});
        }

        // 使用统一的排序函数
        const sortedPrizes = this.sortPrizes(prizes);

        container.innerHTML = sortedPrizes.map(prize => {
            const isSoldOut = prize.remaining === 0;
            const cssClass = `prize-display${prize.isLastPrize ? ' last-prize' : ''}${isSoldOut ? ' sold-out' : ''}`;
            
            return `
                <div class="${cssClass}">
                    <span class="prize-level">${prize.level}</span>
                    <span class="prize-name">${prize.name}</span>
                    <span class="prize-count">${prize.remaining}</span>
                </div>
            `;
        }).join('');
    }

    // 渲染概率奖项
    renderProbabilityPrizes() {
        const container = document.getElementById('remaining-prizes-list');
        const lottery = this.currentLottery;
        
        // 按概率从低到高排序
        const sortedPrizes = [...lottery.state.prizes].sort((a, b) => a.probability - b.probability);

        container.innerHTML = sortedPrizes.map(prize => {
            return `
                <div class="prize-display probability-prize">
                    <span class="prize-level">${prize.level}</span>
                    <span class="prize-name">${prize.name}</span>
                    <span class="prize-probability">${prize.probability}%</span>
                </div>
            `;
        }).join('');
    }

    // 执行抽奖
    performDraw() {
        const drawerId = document.getElementById('drawer-id').value.trim() || '匿名OTA';
        const drawCount = parseInt(document.getElementById('draw-count').value) || 1;
        
        if (drawCount <= 0) {
            showNotification('抽奖次数必须大于0！', 'error');
            return;
        }

        const lottery = this.currentLottery;
        
        if (lottery.type === 'probability') {
            this.performProbabilityDraw(drawerId, drawCount);
        } else {
            this.performIchibanDraw(drawerId, drawCount);
        }
    }

    // 执行概率抽奖
    performProbabilityDraw(drawerId, drawCount) {
        const lottery = this.currentLottery;
        
        // 执行抽奖逻辑
        const results = this.drawProbabilityPrizes(drawCount);

        // 记录抽奖历史
        const historyEntry = {
            id: Date.now().toString(),
            drawerId,
            timestamp: new Date().toISOString(),
            results: [...results]
        };

        lottery.history.push(historyEntry);

        // 保存数据
        this.saveLotteries();

        // 显示抽奖结果
        this.showDrawResult(historyEntry.results);

        // 重置抽奖次数为1
        document.getElementById('draw-count').value = 1;

        // 清空抽奖者ID
        document.getElementById('drawer-id').value = '';

        // 更新界面
        this.renderDrawPage();
    }

    // 概率抽奖算法
    drawProbabilityPrizes(count) {
        const lottery = this.currentLottery;
        const prizes = lottery.state.prizes;
        const results = {};

        for (let i = 0; i < count; i++) {
            // 生成0-100的随机数
            const random = Math.random() * 100;
            let cumulative = 0;
            
            // 找到对应的奖项
            for (const prize of prizes) {
                cumulative += prize.probability;
                if (random <= cumulative) {
                    const key = `${prize.level}-${prize.name}`;
                    if (!results[key]) {
                        results[key] = {
                            level: prize.level,
                            name: prize.name,
                            count: 0
                        };
                    }
                    results[key].count++;
                    break;
                }
            }
        }

        return Object.values(results);
    }

    // 执行一番赏抽奖
    performIchibanDraw(drawerId, drawCount) {
        const lottery = this.currentLottery;
        const remainingInBox = lottery.state.remainingInCurrentBox;
        
        if (drawCount > remainingInBox) {
            showNotification(`当前箱只剩${remainingInBox}个奖项，无法抽取${drawCount}个！`, 'error');
            return;
        }

        // 执行抽奖逻辑
        const results = this.drawPrizes(drawCount);
        
        // 检查是否是最后一次抽奖（当前箱抽完）
        const isLastDraw = lottery.state.remainingInCurrentBox === 0;
        let lastPrizeResult = null;
        
        if (isLastDraw && lottery.state.lastPrize && lottery.state.lastPrize.remaining > 0) {
            lastPrizeResult = {
                level: lottery.state.lastPrize.level,
                name: lottery.state.lastPrize.name,
                count: 1,
                isLastPrize: true
            };
            lottery.state.lastPrize.remaining--;
        }

        // 记录抽奖历史
        const historyEntry = {
            id: Date.now().toString(),
            drawerId,
            timestamp: new Date().toISOString(),
            box: lottery.state.currentBox,
            results: [...results],
            isLastDraw
        };

        if (lastPrizeResult) {
            historyEntry.results.push(lastPrizeResult);
        }

        lottery.history.push(historyEntry);

        // 如果当前箱抽完，切换到下一箱
        if (isLastDraw) {
            const isInfinite = lottery.config.totalBoxes === 0;
            if (isInfinite || lottery.state.currentBox < lottery.config.totalBoxes) {
                this.moveToNextBox();
            }
        }

        // 保存数据
        this.saveLotteries();

        // 显示抽奖结果
        this.showDrawResult(historyEntry.results);

        // 重置抽奖次数为1
        document.getElementById('draw-count').value = 1;

        // 清空抽奖者ID
        document.getElementById('drawer-id').value = '';

        // 更新界面
        this.renderDrawPage();
    }

    // 抽奖算法
    drawPrizes(count) {
        const lottery = this.currentLottery;
        const availablePrizes = lottery.state.prizes.filter(prize => prize.remaining > 0);
        
        // 创建奖池
        const prizePool = [];
        availablePrizes.forEach(prize => {
            for (let i = 0; i < prize.remaining; i++) {
                prizePool.push(prize);
            }
        });

        // 随机抽取
        const drawnPrizes = [];
        const results = {};

        for (let i = 0; i < count && prizePool.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * prizePool.length);
            const drawnPrize = prizePool.splice(randomIndex, 1)[0];
            drawnPrizes.push(drawnPrize);

            // 统计结果
            const key = `${drawnPrize.level}-${drawnPrize.name}`;
            if (!results[key]) {
                results[key] = {
                    level: drawnPrize.level,
                    name: drawnPrize.name,
                    count: 0
                };
            }
            results[key].count++;

            // 更新剩余数量
            drawnPrize.remaining--;
        }

        // 更新当前箱剩余数量
        lottery.state.remainingInCurrentBox -= count;

        return Object.values(results);
    }

    // 切换到下一箱
    moveToNextBox() {
        const lottery = this.currentLottery;
        const isInfinite = lottery.config.totalBoxes === 0;
        
        // 无限箱数时总是继续下一箱，有限箱数时检查是否还有下一箱
        if (isInfinite || lottery.state.currentBox < lottery.config.totalBoxes) {
            lottery.state.currentBox++;
            lottery.state.remainingInCurrentBox = this.getTotalItemsPerBox(lottery.config.prizes);
            
            // 重置每箱的奖项数量
            lottery.config.prizes.forEach(originalPrize => {
                const statePrize = lottery.state.prizes.find(p => p.level === originalPrize.level && p.name === originalPrize.name);
                if (statePrize) {
                    statePrize.remaining += originalPrize.count;
                }
            });
            
            // 重置LAST赏（如果有的话）
            if (lottery.state.lastPrize) {
                lottery.state.lastPrize.remaining++;
            }
        }
    }

    // 显示抽奖结果
    showDrawResult(results) {
        const container = document.getElementById('draw-result');
        const lottery = this.currentLottery;
        
        // 获取所有奖项信息用于排序
        const allPrizes = [...lottery.state.prizes];
        if (lottery.state.lastPrize) {
            allPrizes.unshift({...lottery.state.lastPrize, isLastPrize: true});
        }
        
        // 对结果进行排序
        const sortedResults = this.sortResults(results, allPrizes);
        
        container.innerHTML = sortedResults.map(result => `
            <div class="result-item${result.isLastPrize ? ' last-prize' : ''}">
                <span>${result.isLastPrize ? '👑 ' : '🎁 '}${result.level} - ${result.name}</span>
                <span>×${result.count}</span>
            </div>
        `).join('');

        container.classList.add('show');
        
        // 3秒后自动隐藏
        setTimeout(() => {
            container.classList.remove('show');
        }, 3000);
    }

    // 渲染抽奖历史
    renderDrawHistory() {
        const container = document.getElementById('draw-history-list');
        const lottery = this.currentLottery;
        
        if (lottery.history.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #A8857A; padding: 2rem;">暂无抽奖记录</div>';
            return;
        }

        // 找到最近的未撤销记录索引
        let latestActiveIndex = -1;
        for (let i = lottery.history.length - 1; i >= 0; i--) {
            if (!lottery.history[i].revoked) {
                latestActiveIndex = i;
                break;
            }
        }

        container.innerHTML = lottery.history.slice().reverse().map((entry, reversedIndex) => {
            const originalIndex = lottery.history.length - 1 - reversedIndex;
            const isLatestActive = originalIndex === latestActiveIndex;
            const isRevoked = entry.revoked;
            const shouldGrayOut = !isRevoked && latestActiveIndex !== -1 && originalIndex > latestActiveIndex;
            
            // 获取所有奖项信息用于排序
            const allPrizes = [...lottery.state.prizes];
            if (lottery.state.lastPrize) {
                allPrizes.unshift({...lottery.state.lastPrize, isLastPrize: true});
            }
            
            // 对历史记录中的奖项进行排序
            const sortedResults = this.sortResults([...entry.results], allPrizes);
            
            return `
                <div class="history-item${isRevoked ? ' revoked' : ''}">
                    <div class="history-header">
                        <div class="history-drawer-info">
                            <span class="history-drawer-container">
                                <span class="history-drawer" id="drawer-${originalIndex}">${entry.drawerId}</span>
                                <button class="edit-drawer-btn" onclick="lotteryApp.editDrawerId(${originalIndex})" title="编辑粉丝ID">
                                    ✏️
                                </button>
                            </span>
                            ${entry.box ? `<span class="history-box">第${entry.box}箱</span>` : ''}
                            ${entry.isLastDraw ? '<span class="history-status">LAST</span>' : ''}
                            ${isRevoked ? '<span class="history-status">已撤销</span>' : ''}
                        </div>
                        <div class="history-actions">
                            <span class="history-time">${new Date(entry.timestamp).toLocaleString()}</span>
                            ${isLatestActive && !isRevoked ? `<button class="revoke-btn" onclick="lotteryApp.revokeLatestDraw()" title="撤销此次抽奖">🗑️</button>` : ''}
                        </div>
                    </div>
                    <div class="history-prizes">
                        ${sortedResults.map(result => `
                            <span class="history-prize${result.isLastPrize ? ' last-prize' : ''}${shouldGrayOut ? ' grayed' : ''}">
                                ${result.level} - ${result.name} ×${result.count}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // 编辑抽奖者ID
    editDrawerId(historyIndex) {
        const entry = this.currentLottery.history[historyIndex];
        if (!entry || entry.revoked) {
            return;
        }

        const currentId = entry.drawerId;
        const drawerElement = document.getElementById(`drawer-${historyIndex}`);
        
        // 创建输入框替换显示文本
        const inputHtml = `
            <input type="text" 
                   class="edit-drawer-input" 
                   value="${currentId}" 
                   id="edit-input-${historyIndex}"
                   onblur="lotteryApp.saveDrawerId(${historyIndex})"
                   onkeydown="lotteryApp.handleDrawerIdKeydown(event, ${historyIndex})"
                   maxlength="20"
                   placeholder="请输入粉丝ID">
        `;
        
        drawerElement.innerHTML = inputHtml;
        
        // 聚焦并选中输入框内容
        const input = document.getElementById(`edit-input-${historyIndex}`);
        input.focus();
        input.select();
    }

    // 处理粉丝ID输入框的键盘事件
    handleDrawerIdKeydown(event, historyIndex) {
        if (event.key === 'Enter') {
            this.saveDrawerId(historyIndex);
        } else if (event.key === 'Escape') {
            this.cancelEditDrawerId(historyIndex);
        }
    }

    // 保存修改的抽奖者ID
    saveDrawerId(historyIndex) {
        const input = document.getElementById(`edit-input-${historyIndex}`);
        if (!input) return;

        const newId = input.value.trim();
        const entry = this.currentLottery.history[historyIndex];
        
        if (newId === '') {
            showNotification('粉丝ID不能为空', 'error');
            input.focus();
            return;
        }

        if (newId !== entry.drawerId) {
            entry.drawerId = newId;
            
            // 更新当前抽奖记录
            const lotteryIndex = this.lotteries.findIndex(l => l.id === this.currentLottery.id);
            if (lotteryIndex >= 0) {
                this.lotteries[lotteryIndex] = this.currentLottery;
                this.saveLotteries();
            }
        }

        // 重新渲染历史记录
        this.renderDrawHistory();
    }

    // 取消编辑抽奖者ID
    cancelEditDrawerId(historyIndex) {
        const entry = this.currentLottery.history[historyIndex];
        const drawerElement = document.getElementById(`drawer-${historyIndex}`);
        
        if (drawerElement) {
            drawerElement.innerHTML = entry.drawerId;
        }
    }

    // 导出快照JSON
    exportSnapshot() {
        if (!this.currentLottery) return;
        
        // 检查微信环境限制
        if (!window.WeChatHelper.checkDownloadPermission('JSON配置文件')) {
            return;
        }

        const snapshot = {
            lottery: this.currentLottery,
            exportTime: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentLottery.name}_快照_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // 导出CSV
    exportCSV() {
        if (!this.currentLottery) return;
        
        // 检查微信环境限制
        if (!window.WeChatHelper.checkDownloadPermission('CSV记录文件')) {
            return;
        }

        const lottery = this.currentLottery;
        
        let headers, rows;
        
        if (lottery.type === 'probability') {
            // 概率抽奖的CSV格式
            headers = ['抽奖时间', '抽奖者ID', '奖项等级', '奖项名称', '数量'];
            
            rows = lottery.history.flatMap(entry => 
                entry.results.map(result => [
                    new Date(entry.timestamp).toLocaleString(),
                    entry.drawerId,
                    result.level,
                    result.name,
                    result.count
                ])
            );
        } else {
            // 一番赏的CSV格式
            headers = ['抽奖时间', '抽奖者ID', '箱号', '奖项等级', '奖项名称', '数量', '是否LAST赏', '是否最后一抽'];
            
            rows = lottery.history.flatMap(entry => 
                entry.results.map(result => [
                    new Date(entry.timestamp).toLocaleString(),
                    entry.drawerId,
                    entry.box || '',
                    result.level,
                    result.name,
                    result.count,
                    result.isLastPrize ? '是' : '否',
                    entry.isLastDraw ? '是' : '否'
                ])
            );
        }

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${lottery.name}_抽奖记录_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // 设置文件导入
    setupFileImport() {
        // 创建隐藏的文件输入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        // 可以在需要时调用导入功能
        window.importSnapshot = () => {
            fileInput.click();
        };

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const snapshot = JSON.parse(e.target.result);
                        this.importSnapshot(snapshot);
                    } catch (error) {
                        showNotification('文件格式错误！', 'error');
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // 导入快照
    importSnapshot(snapshot) {
        if (!snapshot.lottery) {
            showNotification('快照格式错误！', 'error');
            return;
        }

        // 检查是否已存在相同ID的抽奖
        const existingIndex = this.lotteries.findIndex(l => l.id === snapshot.lottery.id);
        
        if (existingIndex >= 0) {
            if (confirm('已存在相同的抽奖记录，是否覆盖？')) {
                this.lotteries[existingIndex] = snapshot.lottery;
            } else {
                return;
            }
        } else {
            this.lotteries.push(snapshot.lottery);
        }

        this.saveLotteries();
        this.renderLotteryList();
        showNotification('快照导入成功！', 'success');
    }

    // 清空所有抽奖
    clearAllLotteries() {
        this.lotteries = [];
        this.saveLotteries();
        this.renderLotteryList();
    }

    // 重置当前抽奖进度
    resetCurrentLotteryProgress() {
        if (!this.currentLottery) return;
        
        const lottery = this.currentLottery;
        
        // 重置状态
        lottery.state.currentBox = 1;
        lottery.state.remainingInCurrentBox = this.getTotalItemsPerBox(lottery.config.prizes);
        
        // 重置奖项数量
        lottery.state.prizes = lottery.config.prizes.map(prize => ({
            ...prize,
            remaining: prize.count // 每次重置都回到单箱数量
        }));
        
        // 重置LAST赏
        if (lottery.state.lastPrize) {
            lottery.state.lastPrize.remaining = 1; // 每次重置都是1个
        }
        
        // 清空历史记录
        lottery.history = [];
        
        // 保存数据
        this.saveLotteries();
    }

    // 从当前抽奖加载配置
    loadConfigFromCurrentLottery() {
        if (!this.currentLottery) return;
        
        const lottery = this.currentLottery;
        
        // 填充基础配置
        document.getElementById('lottery-name').value = lottery.name;
        document.getElementById('total-boxes').value = lottery.config.totalBoxes;
        document.getElementById('include-last-prize').checked = lottery.config.includeLastPrize;
        
        // 清空现有奖项
        document.getElementById('prizes-container').innerHTML = '';
        
        // 添加普通奖项
        lottery.config.prizes.forEach(() => {
            this.addPrizeItem();
        });
        
        // 填充奖项数据
        const prizeItems = document.querySelectorAll('.prize-item:not(.last-prize)');
        lottery.config.prizes.forEach((prize, index) => {
            if (prizeItems[index]) {
                prizeItems[index].querySelector('[name="prize-level"]').value = prize.level;
                prizeItems[index].querySelector('[name="prize-name"]').value = prize.name;
                prizeItems[index].querySelector('[name="prize-count"]').value = prize.count;
            }
        });
        
        // 添加LAST赏
        this.updateLastPrize(lottery.config.includeLastPrize);
        if (lottery.config.includeLastPrize && lottery.config.lastPrize) {
            const lastPrizeItem = document.querySelector('.prize-item.last-prize');
            if (lastPrizeItem) {
                lastPrizeItem.querySelector('[name="prize-level"]').value = lottery.config.lastPrize.level;
                lastPrizeItem.querySelector('[name="prize-name"]').value = lottery.config.lastPrize.name;
            }
        }
    }

    // 撤销最近的抽奖记录
    revokeLatestDraw() {
        if (!this.currentLottery || this.currentLottery.history.length === 0) return;
        
        const lottery = this.currentLottery;
        
        // 找到最近的未撤销记录
        let latestIndex = -1;
        for (let i = lottery.history.length - 1; i >= 0; i--) {
            if (!lottery.history[i].revoked) {
                latestIndex = i;
                break;
            }
        }
        
        if (latestIndex === -1) {
            showNotification('没有可撤销的记录！', 'error');
            return;
        }
        
        const latestEntry = lottery.history[latestIndex];
        
        if (!confirm(`确定要撤销 ${latestEntry.drawerId} 在第${latestEntry.box}箱的抽奖吗？`)) {
            return;
        }
        
        // 标记为已撤销
        latestEntry.revoked = true;
        latestEntry.revokedAt = new Date().toISOString();
        
        // 恢复奖项数量
        latestEntry.results.forEach(result => {
            if (result.isLastPrize) {
                // 恢复LAST赏
                if (lottery.state.lastPrize) {
                    lottery.state.lastPrize.remaining += result.count;
                }
            } else {
                // 恢复普通奖项
                const statePrize = lottery.state.prizes.find(p => p.level === result.level && p.name === result.name);
                if (statePrize) {
                    statePrize.remaining += result.count;
                }
            }
        });
        
        // 处理箱数回退（如果需要）
        this.handleBoxRollback(latestEntry);
        
        // 保存数据并重新渲染
        this.saveLotteries();
        this.renderDrawPage();
        
        showNotification('撤销成功！', 'success');
    }
    
    // 处理箱数回退逻辑
    handleBoxRollback(revokedEntry) {
        const lottery = this.currentLottery;
        
        // 如果撤销的是上一箱的最后一抽（导致切换箱的抽奖）
        if (revokedEntry.isLastDraw && revokedEntry.box < lottery.state.currentBox) {
            // 回退到上一箱
            lottery.state.currentBox = revokedEntry.box;
            
            // 重新计算当前箱的奖项状态和剩余数量
            this.recalculateBoxState(lottery.state.currentBox);
        } else {
            // 如果是当前箱的抽奖，直接增加剩余数量
            if (revokedEntry.box === lottery.state.currentBox) {
                revokedEntry.results.forEach(result => {
                    if (!result.isLastPrize) {
                        lottery.state.remainingInCurrentBox += result.count;
                    }
                });
            }
        }
    }

    // 重新计算指定箱的状态
    recalculateBoxState(boxNumber) {
        const lottery = this.currentLottery;
        const totalItemsPerBox = this.getTotalItemsPerBox(lottery.config.prizes);
        
        // 重置为原始状态
        lottery.state.prizes = lottery.config.prizes.map(prize => ({
            ...prize,
            remaining: prize.count
        }));
        
        if (lottery.state.lastPrize) {
            lottery.state.lastPrize.remaining = 1;
        }
        
        // 统计该箱已使用的奖项数量（不包括已撤销的）
        let usedInCurrentBox = 0;
        lottery.history.forEach(entry => {
            if (entry.box === boxNumber && !entry.revoked) {
                entry.results.forEach(result => {
                    if (result.isLastPrize) {
                        if (lottery.state.lastPrize) {
                            lottery.state.lastPrize.remaining -= result.count;
                        }
                    } else {
                        const statePrize = lottery.state.prizes.find(p => p.level === result.level && p.name === result.name);
                        if (statePrize) {
                            statePrize.remaining -= result.count;
                            usedInCurrentBox += result.count;
                        }
                    }
                });
            }
        });
        
        lottery.state.remainingInCurrentBox = totalItemsPerBox - usedInCurrentBox;
    }

    // 更新配置总数显示
    updateConfigTotalDisplay() {
        const prizeItems = document.querySelectorAll('.prize-item:not(.last-prize)');
        let totalCount = 0;
        
        prizeItems.forEach(item => {
            const countInput = item.querySelector('[name="prize-count"]');
            const count = parseInt(countInput.value) || 0;
            totalCount += count;
        });
        
        const totalDisplay = document.getElementById('total-items-display');
        const totalCountSpan = document.getElementById('total-items-count');
        
        if (totalCount > 0) {
            totalDisplay.style.display = 'block';
            totalCountSpan.textContent = totalCount;
        } else {
            totalDisplay.style.display = 'none';
        }
    }

    // 更新概率总数显示
    updateProbabilityTotalDisplay() {
        const prizeItems = document.querySelectorAll('.prize-item');
        let totalProbability = 0;
        
        prizeItems.forEach(item => {
            const probabilityInput = item.querySelector('[name="prize-probability"]');
            if (probabilityInput) {
                const probability = parseFloat(probabilityInput.value) || 0;
                totalProbability += probability;
            }
        });
        
        const totalCountSpan = document.getElementById('total-probability-count-main');
        const statusSpan = document.getElementById('probability-status-main');
        
        if (totalCountSpan && statusSpan) {
            totalCountSpan.textContent = totalProbability.toFixed(1);
            
            if (Math.abs(totalProbability - 100) < 0.01) {
                statusSpan.textContent = '✅ 概率正确';
                statusSpan.className = 'probability-status success';
            } else if (totalProbability > 100) {
                statusSpan.textContent = '❌ 概率超过100%';
                statusSpan.className = 'probability-status error';
            } else {
                statusSpan.textContent = '⚠️ 概率不足100%';
                statusSpan.className = 'probability-status warning';
            }
        }
    }

    // 设置抽奖次数为本箱剩余数量
    setDrawCountToAll() {
        if (!this.currentLottery || this.currentLottery.type !== 'ichiban') return;
        
        const remainingCount = this.currentLottery.state.remainingInCurrentBox;
        if (remainingCount > 0) {
            document.getElementById('draw-count').value = remainingCount;
        }
    }

    // 继续创建抽奖（从微信提示或直接调用）
    continueToCreateLottery() {
        this.showPage('lottery-config-page');
        this.resetConfigForm();
    }

    // 继续打开抽奖（从微信提示或直接调用）
    continueToOpenLottery(index) {
        this.currentLottery = this.lotteries[index];
        this.showPage('lottery-draw-page');
        this.renderDrawPage();
    }
}

// 奖项数量调整函数
function adjustPrizeNumber(button, delta) {
    const numberGroup = button.parentElement;
    const input = numberGroup.querySelector('input[name="prize-count"]');
    const currentValue = parseInt(input.value) || 1;
    const min = parseInt(input.min) || 1;
    
    let newValue = currentValue + delta;
    
    // 确保在有效范围内
    if (newValue < min) newValue = min;
    
    input.value = newValue;
    
    // 触发change事件和总数更新
    input.dispatchEvent(new Event('change'));
    if (window.lotteryApp) {
        window.lotteryApp.updateConfigTotalDisplay();
    }
}

// 概率调整函数
function adjustProbabilityNumber(button, delta) {
    const numberGroup = button.parentElement;
    const input = numberGroup.querySelector('input[name="prize-probability"]');
    const currentValue = parseFloat(input.value) || 0;
    const min = parseFloat(input.min) || 0.1;
    const max = parseFloat(input.max) || 100;
    
    let newValue = currentValue + delta;
    
    // 确保在有效范围内
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    
    input.value = newValue.toFixed(1);
    
    // 触发change事件和概率更新
    input.dispatchEvent(new Event('change'));
    if (window.lotteryApp) {
        window.lotteryApp.updateProbabilityTotalDisplay();
    }
}

// 数字调整函数
function adjustNumber(inputId, delta) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value) || 0;
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || Infinity;
    
    let newValue = currentValue + delta;
    
    // 确保在有效范围内
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    
    input.value = newValue;
    
    // 触发change事件
    input.dispatchEvent(new Event('change'));
}

// UUID4生成函数
function generateUUID4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 显示通知函数
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// 显示tooltip函数
function showTooltip(tooltipId) {
    // 隐藏所有tooltip
    document.querySelectorAll('.tooltip-content').forEach(tooltip => {
        tooltip.classList.remove('show');
    });
    
    // 显示指定tooltip
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
        tooltip.classList.add('show');
        
        // 3秒后自动隐藏
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 3000);
    }
}

// 初始化应用
const lotteryApp = new IchibanLotteryApp(); 