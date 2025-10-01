class UIManager {
    constructor() {
        this.currentScreen = 'control';
        this.selectedCharacter = 'mac';
        this.selectedArena = 'wvba';
        this.previewCanvases = {};
        this.previewAnimations = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Start button on control screen
        document.getElementById('startBtn').addEventListener('click', () => {
            this.showCharacterScreen();
        });

        // Character selection buttons
        document.querySelectorAll('.character-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectCharacter(option.dataset.character);
            });
        });

        // Character select button
        document.getElementById('characterSelectBtn').addEventListener('click', () => {
            this.showArenaScreen();
        });

        // Arena selection
        document.querySelectorAll('.arena-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectArena(option.dataset.arena);
            });
        });

        // Arena select button
        document.getElementById('arenaSelectBtn').addEventListener('click', () => {
            this.startGame();
        });

        document.querySelectorAll('.character-option').forEach(option => {
            option.addEventListener('mouseenter', () => {
                this.previewAnimations[option.dataset.character].animation =
                    spriteManager.getAnimation(option.dataset.character, 'leftJab');
            });
        });

        document.querySelectorAll('.character-option').forEach(option => {
            option.addEventListener('mouseleave', () => {
                this.previewAnimations[option.dataset.character].animation =
                    spriteManager.getAnimation(option.dataset.character, 'idle');
            });
        });
    }

    // Show the character selection screen
    showCharacterScreen() {
        document.getElementById('controlScreen').classList.add('hidden');
        document.getElementById('characterScreen').classList.remove('hidden');
        this.currentScreen = 'character';

        // Load character previews
        this.loadCharacterPreviews();
    }

    // Show the arena selection screen
    showArenaScreen() {
        document.getElementById('characterScreen').classList.add('hidden');
        document.getElementById('arenaScreen').classList.remove('hidden');
        this.currentScreen = 'arena';

        // Load arena previews
        this.loadArenaPreviews();
    }

    // Start the game
    startGame() {
        document.getElementById('arenaScreen').classList.add('hidden');
        this.currentScreen = 'game';

        // Initialize the game
        if (window.gameManager) {
            window.gameManager.startGame(this.selectedCharacter, this.selectedArena);
        }
    }

    // Select a character
    selectCharacter(character) {
        this.selectedCharacter = character;

        // Update UI to reflect selection
        document.querySelectorAll('.character-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`.character-option[data-character="${character}"]`).classList.add('selected');
    }

    // Select an arena
    selectArena(arena) {
        this.selectedArena = arena;

        // Update UI to reflect selection
        document.querySelectorAll('.arena-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`.arena-option[data-arena="${arena}"]`).classList.add('selected');
    }
 
    // Load character previews
    async loadCharacterPreviews() {
        if (!spriteManager.loaded) {
            await spriteManager.loadSprites();
        }

        const characters = ['mac', 'don', 'king'];
        
        for (const character of characters) {
            const canvasId = `${character}Preview`;
            const canvas = document.getElementById(canvasId);

            if (canvas) {
                // Store canvas and context
                this.previewCanvases[character] = {
                    element: canvas,
                    context: canvas.getContext('2d')
                };

                this.previewAnimations[character] = {
                    animation: spriteManager.getAnimation(character, 'idle'),
                    lastFrameTime: 0
                };

                // Start animation loop
                this.animateCharacterPreview(character);
            }
        }

        // Default selection
        this.selectCharacter('mac');
    }

    // Animate character preview
    animateCharacterPreview(character) {
        if (!this.previewCanvases[character] || !this.previewAnimations[character]) return;

        const canvas = this.previewCanvases[character].element;
        const ctx = this.previewCanvases[character].context;
        const animationState = this.previewAnimations[character];

        // Animation loop
        const animate = (timestamp) => {
            // Stop animate after leaving character screen
            if (this.currentScreen !== 'character') return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update animation
            if (animationState.animation) {
                spriteManager.updateAnimation(animationState.animation, timestamp);

                // Get current frame
                const frame = animationState.animation.frames[animationState.animation.currentFrame];

                if (frame) {
                    // Calculate scaling to fit canvas
                    const scale = Math.min(
                        canvas.width / frame.width,
                        canvas.height / frame.height
                    ) * 1; // 80% of canvas size

                    const scaledWidth = frame.width * scale;   
                    const scaledHeight = frame.height * scale;

                    // Draw frame centered
                    const x = (canvas.width - scaledWidth);
                    const y = (canvas.height - scaledHeight);
                    frame.draw(ctx, x, y, scaledWidth, scaledHeight);
                }
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    stopPreviewAnimations() {
        Object.values(this.previewCanvases).forEach(canvas => {
            if (canvas && canvas.context){
                canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
            }
        });

        this.previewCanvases = {};
        this.previewAnimations = {};
    }

    // Load arena previews
    loadArenaPreviews() {
        // Load preview images

        // Placeholder only first
        document.getElementById('wvbaPreview').textContent = 'WVBA Preview';
        document.getElementById('tokyoPreview').textContent = 'Dojo Preview';
        document.getElementById('vegasPreview').textContent = 'Vegas Preview';

        // Default selection
        this.selectArena('wvba');
    }
}

// Global instance
const uiManager = new UIManager();