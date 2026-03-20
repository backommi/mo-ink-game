import Ink from '../objects/Ink';
import { createRadialGradient } from '../utils';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        
        this.score = 0;
        this.inkLevel = 0;
        this.maxInkLevel = 100;
        this.isPaused = false;
        this.isPlaying = false;
        
        this.inkDrops = [];
        this.wastedInk = 0;
        this.totalInk = 0;
        
        this.gravity = 300;
        this.moveSpeed = 300;
        this.dropInterval = 1500;
        this.lastDropTime = 0;
        
        this.maxDrops = 10;
    }

    preload() {
        // 预加载资源
        this.load.setBaseURL('assets');
        
        // 创建画布纹理用于墨滴效果
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // 墨滴纹理
        const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(20, 20, 20, 1)');
        gradient.addColorStop(0.5, 'rgba(60, 60, 60, 0.6)');
        gradient.addColorStop(1, 'rgba(100, 100, 100, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);
        
        this.textures.addCanvas('inkDrop', canvas);
        
        // 空白画布纹理
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = 800;
        bgCanvas.height = 600;
        const bgContext = bgCanvas.getContext('2d');
        
        // 纸张纹理
        const paperGradient = bgContext.createLinearGradient(0, 0, 800, 600);
        paperGradient.addColorStop(0, '#f5e6d3');
        paperGradient.addColorStop(0.5, '#e8d5b8');
        paperGradient.addColorStop(1, '#d4c49a');
        
        bgContext.fillStyle = paperGradient;
        bgContext.fillRect(0, 0, 800, 600);
        
        this.textures.addCanvas('paper', bgCanvas);
    }

    create() {
        // 纸张背景
        this.add.image(400, 300, 'paper');
        
        // 创建墨滴显示容器
        this.inkContainer = this.add.container(400, 300);
        
        // 创建墨滴控制条
        this.dropZone = this.add.zone(400, 100, 600, 40).setRectangleDropZone(600, 40);
        
        // 键盘输入
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
        
        // 当前墨滴
        this.currentInk = null;
        
        // 墨滴位置
        this.inkX = 400;
        this.inkY = 100;
        this.inkSpeed = 0;
        
        // UI 更新
        this.updateUI();
        
        // 添加调试文本
        this.debugText = this.add.text(10, 580, '墨染游戏 - 技术Demo', {
            fontSize: '12px',
            color: '#888'
        });
        
        // 游戏开始
        this.isPlaying = true;
    }

    update(time, delta) {
        if (!this.isPlaying || this.isPaused) return;
        
        // 墨滴下落控制
        if (this.keys.left.isDown && this.inkX > 100) {
            this.inkX -= 4;
        }
        if (this.keys.right.isDown && this.inkX < 700) {
            this.inkX += 4;
        }
        
        // 空格键 - 收墨消除
        if (this.keys.space.isDown && this.currentInk && !this.currentInk.isEaten) {
            this.eatInk(time);
            this.keys.space.isDown = false; // 防止连续触发
        }
        
        // 墨滴自动下落
        const speed = this.keys.down.isDown ? 400 : 200;
        this.inkY += speed * (delta / 1000);
        
        // 墨滴触底
        if (this.inkY >= 550) {
            this.dropInk(time);
            this.inkY = 100;
            this.inkX = 400 + (Math.random() - 0.5) * 200;
        }
        
        // 定期生成新墨滴
        if (time - this.lastDropTime > this.dropInterval) {
            this.createNew Ink(time);
            this.lastDropTime = time;
        }
        
        // 更新墨滴显示
        if (this.currentInk) {
            this.currentInk.x = this.inkX;
            this.currentInk.y = this.inkY;
        }
        
        // 检查墨溢
        if (this.wastedInk >= this.maxInkLevel) {
            this.gameOver();
        }
        
        // 更新墨迹程度
        this.inkLevel = Math.min(100, (this.wastedInk / this.maxInkLevel) * 100);
        this.updateUI();
    }

    createNewInk(time) {
        // 如果已有墨滴未处理，先处理
        if (this.currentInk && !this.currentInk.isDropped) {
            return;
        }
        
        const ink = new Ink(this, this.inkX, this.inkY, this.inkContainer);
        this.currentInk = ink;
        this.inkDrops.push(ink);
    }

    dropInk(time) {
        if (!this.currentInk) return;
        
        // 空间不足时的碰撞检测
        const spaceAvailable = this.inkDrops.length < this.maxDrops;
        
        if (!spaceAvailable) {
            // 移除最早的墨滴
            const oldInk = this.inkDrops.shift();
            if (oldInk) {
                this.wastedInk += oldInk.size;
                this.totalInk += oldInk.size;
            }
        }
        
        // 墨滴落地
        this.currentInk.drop();
        this.currentInk.isDropped = true;
        
        // 新墨滴准备
        this.currentInk = new Ink(this, this.inkX, 100, this.inkContainer);
        this.inkDrops.push(this.currentInk);
    }

    eatInk(time) {
        if (!this.currentInk || this.currentInk.isEaten) return;
        
        // 计算分数
        const baseScore = this.currentInk.size * 10;
        const riskMultiplier = 1 + (this.inkLevel / 100);
        const score = Math.floor(baseScore * riskMultiplier);
        
        this.score += score;
        this.wastedInk -= this.currentInk.size * 0.3; // 消除30%的墨迹
        this.wastedInk = Math.max(0, this.wastedInk);
        
        this.currentInk.eat();
        this.currentInk.isEaten = true;
        
        // 播放消除音效
        this.sound.add('eat', { volume: 0.5 }).play();
        
        // 检查连击
        this.checkCombo(time);
    }

    checkCombo(time) {
        // 连击逻辑
        if (this.lastEatTime && time - this.lastEatTime < 2000) {
            this.comboCount = (this.comboCount || 0) + 1;
            this.comboMultiplier = 1 + this.comboCount * 0.1;
        } else {
            this.comboCount = 0;
            this.comboMultiplier = 1;
        }
        
        this.lastEatTime = time;
    }

    updateUI() {
        const scoreEl = document.getElementById('score');
        const inkLevelEl = document.getElementById('ink-level');
        
        if (scoreEl) {
            scoreEl.innerText = `分数: ${this.score}`;
        }
        
        if (inkLevelEl) {
            inkLevelEl.innerText = `墨迹程度: ${Math.floor(this.inkLevel)}%`;
        }
    }

    gameOver() {
        this.isPlaying = false;
        this.isPaused = true;
        
        const gameOverEl = document.getElementById('game-over');
        const finalScoreEl = document.getElementById('final-score-value');
        
        if (gameOverEl && finalScoreEl) {
            finalScoreEl.innerText = this.score;
            gameOverEl.style.display = 'flex';
        }
        
        // 保存最高分
        const highScore = localStorage.getItem('moInkHighScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('moInkHighScore', this.score);
        }
    }

    resetGame() {
        this.score = 0;
        this.inkLevel = 0;
        this.wastedInk = 0;
        this.totalInk = 0;
        this.comboCount = 0;
        this.comboMultiplier = 1;
        this.lastEatTime = 0;
        
        // 清除所有墨滴
        this.inkDrops.forEach(ink => ink.destroy());
        this.inkDrops = [];
        
        // 重置墨滴位置
        this.inkX = 400;
        this.inkY = 100;
        
        // 重新创建初始墨滴
        this.currentInk = new Ink(this, this.inkX, 100, this.inkContainer);
        this.inkDrops.push(this.currentInk);
        
        this.isPlaying = true;
        this.isPaused = false;
        
        const gameOverEl = document.getElementById('game-over');
        if (gameOverEl) {
            gameOverEl.style.display = 'none';
        }
    }
}
