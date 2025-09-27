class Player {
    constructor(x, y, spriteManager) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 120;
        this.health = 100;
        this.action = 'idle';
        this.actionTime = 0;
        this.spriteManager = spriteManager;
        this.facing = 'right';
        this.currentAnimation = null;
    }

    update(deltaTime) {
        if (this.actionTime > 0) {
            this.actionTime -= deltaTime;
            if (this.actionTime <= 0) {
                this.action = 'idle';
            }
        }

        // Get the current animation based on action
        this.currentAnimation = this.spriteManager.getAnimation('mac', this.getActionName());

        // Update animation frames
        if (this.currentAnimation) {
            this.spriteManager.updateAnimation(this.currentAnimation, performance.now());
        }
    }

    // Map animation name 
    getActionName() {
        switch(this.action) {
            case 'idle': return 'idle';
            case 'left punch': return 'leftJab';
            case 'right punch': return 'rightJab';
            case 'block': return 'block';
            case 'dodge': return 'dodge';
            case 'hit': return 'hit';
            default: return 'idle';
        }
    }

    draw(ctx) {
        if (!this.currentAnimation) return;

        // Get current frame
        const frame = this.currentAnimation.frames[this.currentAnimation.currentFrame];

        if (frame) {
            ctx.save();
 
            // Move origin to center of player
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

            // Flip context if facing left
            if (this.facing === 'left') {
                ctx.scale(-1, 1);
            }

            // Draw the sprite frame 
            frame.draw(ctx, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else {
            ctx.fillStyle = '#ff6600';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            // Draw head
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y - 20, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    performAction(action) {
        this.action = action;
        this.actionTime = 500;
    }

    takeDamage(amount) {
        this.health -= amount;
        this.action = 'hit';
        this.actionTime = 300;
    }
}