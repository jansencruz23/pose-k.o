
class SpriteManager {
    constructor() {
        this.sprites = {};
        this.loaded = false;
    }

    async loadSprites() {
        const player_img = new Image();
        await new Promise((resolve) => {
            player_img.onload = resolve;
            player_img.src = 'assets/sprites/little_mac.png';
        });

        // Create sprite animations 
        this.spriteAnimations = {
            idle: {
                frames: [
                    new Sprite(player_img, 28, 10, 72, 161),
                    new Sprite(player_img, 98, 10, 72, 161)
                ],
                currentFrame: 0,
                frameCount: 2,
                frameDuration: 200,
                lastFrameTime: 0
            },
            leftJab: {
                frames: [
                    new Sprite(player_img, 168, 480, 72, 161)
                ],
                currentFrame: 0,
                frameCount: 1,
                frameDuration: 200,
                lastFrameTime: 0
            },
            rightJab: {
                frames: [
                    new Sprite(player_img, 238, 842, 72, 161)
                ],
                currentFrame: 0,
                frameCount: 1,
                frameDuration: 200,
                lastFrameTime: 0
            },
            block: {
                frames: [
                    new Sprite(player_img, 98, 309, 72, 161)
                ],
                currentFrame: 0,
                frameCount: 1,
                frameDuration: 200,
                lastFrameTime: 0
            },
            dodge: {
                frames: [
                    new Sprite(player_img, 88, 171, 72, 161),
                ],
                currentFrame: 0,
                frameCount: 1,
                frameDuration: 200,
                lastFrameTime: 0
            },
            hit: {
                frames: [
                    new Sprite(player_img, 170, 400, 72, 161)
                ],
                currentFrame: 0,
                frameCount: 1,
                frameDuration: 200,
                lastFrameTime: 0
            }
        };

        this.loaded = true;
        console.log("Sprites loaded");
    }

    getAnimation(character, name) {
        if (character === 'mac'){
            return this.spriteAnimations[name];
        }

        return null;
    }

    updateAnimation(animation, timestamp) {
        if (!animation) return;

        if (timestamp - animation.lastFrameTime > animation.frameDuration) {
            animation.lastFrameTime = timestamp;
            animation.currentFrame = (animation.currentFrame + 1) % animation.frameCount;
        }
    }
}

const spriteManager = new SpriteManager();