export default class Ink extends Phaser.GameObjects.Container {
    constructor(scene, x, y, container) {
        super(scene, x, y);
        
        this.scene = scene;
        this.container = container;
        
        this.size = 20 + Math.random() * 30;
        this.isDropped = false;
        this.isEaten = false;
        this.isSpreading = false;
        
        // 墨滴颜色（深灰到黑色）
        this.color = Math.random() > 0.7 ? '#2b2b2b' : '#1a1a1a';
        
        // 创建墨滴视觉效果
        this.createInkVisual();
        
        // 添加到场景容器
        this.container.add(this);
    }

    createInkVisual() {
        // 墨滴主体
        const inkCircle = this.scene.add.circle(0, 0, this.size, 0x222222);
        inkCircle.setAlpha(0.9);
        this.add(inkCircle);
        
        // 墨滴边缘（晕染效果）
        const edges = [];
        const edgeCount = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < edgeCount; i++) {
            const angle = (i / edgeCount) * Math.PI * 2;
            const radius = this.size * (0.8 + Math.random() * 0.4);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const edge = this.scene.add.circle(x, y, this.size * 0.4, 0x333333);
            edge.setAlpha(0.6);
            edges.push(edge);
        }
        
        // 添加扩散动画
        this.scene.tweens.add({
            targets: edges,
            alpha: 0,
            duration: 2000,
            ease: 'Sine.easeInOut',
            delay: 500,
            yoyo: true
        });
    }

    drop() {
        this.isDropped = true;
        
        // 落地效果
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            ease: 'Back.out',
            yoyo: true,
            onComplete: () => {
                this.isSpreading = true;
                this.startSpreading();
            }
        });
    }

    startSpreading() {
        // 墨迹扩散
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0.8,
            duration: 2000,
            ease: 'Sine.easeInOut'
        });
    }

    eat() {
        this.isEaten = true;
        
        // 消除动画
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 0,
            duration: 500,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.destroy();
            }
        });
        
        // 消除粒子效果
        this.createEatParticles();
    }

    createEatParticles() {
        const particles = this.scene.add.particles(0, 0, 'inkDrop', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            lifeSpan: 500,
            blendMode: 'ADD',
            quantity: 10,
            emitting: false
        });
        
        particles.explode(500);
        
        this.scene.time.delayedCall(500, () => {
            particles.destroy();
        });
    }
}
