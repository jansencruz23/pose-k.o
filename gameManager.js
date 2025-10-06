class GameManager {
    constructor() {
        this.gameCanvas = null;
        this.gameCtx = null;
        this.player = null;
        this.opponent = null;
        this.gameRunning = false;
        this.lastTime = 0;
        this.arena = null;
        this.selectedCharacter = null;
        this.arenaImages = {};
    }

    async initGame() {
        this.gameCanvas = document.getElementById("gameCanvas");
        this.gameCtx = this.gameCanvas.getContext("2d");

        // Set canvas dimensions
        this.gameCanvas.width = this.gameCanvas.offsetWidth;
        this.gameCanvas.height = this.gameCanvas.offsetHeight;

        // Load arena images
        await this.loadArenaImages();

        // Wait for sprites to load
        await spriteManager.loadSprites();

        // Initialize sound manager and load sounds
        await soundManager.loadSounds();

        // Play character selection music
        soundManager.playLobbyMusic();
    }

    async loadArenaImages() {
        const arenas = ['lab', 'struggle', 'eya'];
        const imagePromises = arenas.map((arena) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve({ arena, img });
                img.onerror = () => {
                    console.error(`Failed to load image for arena: ${arena}`);
                    resolve({ arena, img: null });
                };
                img.src = `assets/arenas/${arena}.jpg`;
            });
        });

        const loadedImages = await Promise.all(imagePromises);
        loadedImages.forEach(({ arena, img }) => {
            this.arenaImages[arena] = img;
        });

        console.log("Arena images loaded:", this.arenaImages);
    }

    startGame(character, arena) {
        document.getElementById("controlScreen").classList.add("hidden");
        this.gameRunning = true;
        this.arena = arena;
        this.selectedCharacter = character;

        // Create player and opponent
        this.player = new Player(300, 300, spriteManager, character);
        this.opponent = new Opponent(420, 300, spriteManager, "tyson");

        this.setOpponentDifficulty(character);

        // Reset health
        this.player.health = 100;
        this.opponent.health = 100;
        document.getElementById("playerHealthBar").style.width = "100%";
        document.getElementById("opponentHealthBar").style.width = "100%";

        // Start background music
        soundManager.playBackgroundMusic(arena);

        // Start game loop
        this.lastTime = performance.now();
        this.gameLoop();
    }

    setOpponentDifficulty(playerCharacter) {
        const difficultyMap = {
            mac: "normal",
            don: "hard",
            king: "easy",
        };

        this.opponent.setDifficulty(difficultyMap[playerCharacter] || "normal");
    }

    gameLoop(timestamp) {
        if (!this.gameRunning) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(deltaTime) {
        this.player.update(deltaTime);
        this.opponent.update(deltaTime);

        this.checkCollisions();

        // Check win/lose conditions
        if (this.player.health <= 0) {
            this.gameRunning = false;
            this.showGameOver("You Lost!");
        } else if (this.opponent.health <= 0) {
            this.gameRunning = false;
            this.showGameOver("You Won!");
        }
    }

    checkCollisions() {
        // Check if player's punch hits opponent
        if (
            (this.player.action === "left punch" ||
                this.player.action === "right punch") &&
            this.opponent.action !== "block" &&
            this.opponent.action !== "dodge"
        ) {
            if (this.player.canRegisterHit()) {
                this.opponent.takeDamage(10);
                document.getElementById("opponentHealthBar").style.width =
                    this.opponent.health + "%";
            }
        }

        // Check if opponent's punch hits player
        if (
            (this.opponent.action === "left punch" ||
                this.opponent.action === "right punch") &&
            this.player.action !== "block" &&
            this.player.action !== "dodge"
        ) {
            if (this.opponent.canRegisterHit()) {
                this.player.takeDamage(15);
                document.getElementById("playerHealthBar").style.width =
                    this.player.health + "%";
            }
        }
    }

    // Show game over message
    showGameOver(message) {
        this.gameRunning = false;

        // Play appropriate sound
        if (message === "You Won!") {
            soundManager.playSound("victory");
        } else {
            soundManager.playSound("defeat");
        }

        // Get the game over screen elements
        const gameOverScreen = document.getElementById("gameOverScreen");
        const gameOverMessage = document.getElementById("gameOverMessage");
        const gameOverTitle = document.getElementById("gameOverTitle");
        const finalPlayerHealth = document.getElementById("finalPlayerHealth");
        const finalOpponentHealth = document.getElementById("finalOpponentHealth");

        if (message === "You Won!") {
            gameOverMessage.textContent = "YOU WIN! ANG GALING";
            gameOverMessage.className = "game-over-message win";
            gameOverTitle.textContent = "VICTORY!";
        } else {
            gameOverMessage.textContent = "YOU LOST! TRY AGAIN";
            gameOverMessage.className = "game-over-message lose";
            gameOverTitle.textContent = "DEFEAT!";
        }

        finalPlayerHealth.textContent = `${this.player.health > 0 ? this.player.health : 0}`;
        finalOpponentHealth.textContent = `${this.opponent.health > 0 ? this.opponent.health : 0}`;

        setTimeout(() => {
            gameOverScreen.classList.remove("hidden");
            soundManager.stopBackgroundMusic();
        }, 500);
    }

    resetGame() {
        this.gameRunning = false;
        this.player = null;
        this.opponent = null;

        // Stop background music
        soundManager.stopBackgroundMusic();

        // Hide all screens
        document.getElementById("gameOverScreen").classList.add("hidden");
        document.getElementById("characterScreen").classList.add("hidden");
        document.getElementById("arenaScreen").classList.add("hidden");

        // Show control screen
        document.getElementById("controlScreen").classList.remove("hidden");

        // Update UI manager state
        if (window.uiManager) {
            window.uiManager.currentScreen = 'control';
        }
    }

    render() {
        // Clear canvas
        this.gameCtx.fillStyle = "#222";
        this.gameCtx.fillRect(
            0,
            0,
            this.gameCanvas.width,
            this.gameCanvas.height
        );

        // Draw arena background
        this.drawArena();

        this.gameCtx.save();
        this.gameCtx.scale(1.5, 1.5);

        // Draw characters
        this.player.draw(this.gameCtx);
        this.opponent.draw(this.gameCtx);

        this.gameCtx.restore();

        // Draw action labels
        this.gameCtx.fillStyle = "white";
        this.gameCtx.font = "16px Arial";
        this.gameCtx.fillText(
            "",
            this.player.x * 1.5,
            this.player.y * 1.5 - 10
        );
        this.gameCtx.fillText(
            "",
            this.opponent.x * 1.5,
            this.opponent.y * 1.5 - 10
        );
    }

    drawArena() {
        const arenaImage = this.arenaImages[this.arena];

        if (arenaImage) {
            this.gameCtx.drawImage(
                arenaImage,
                0,
                0,
                this.gameCanvas.width,
                this.gameCanvas.height
            );
        } else {
            switch (this.arena) {
                case "lab":
                    this.gameCtx.fillStyle = "rgba(30, 60, 120, 0.3)";
                    this.gameCtx.fillRect(
                        0,
                        0,
                        this.gameCanvas.width,
                        this.gameCanvas.height
                    );
                    break;
                case "struggle":
                    // Simple red background for Tokyo
                    this.gameCtx.fillStyle = "rgba(180, 30, 30, 0.3)";
                    this.gameCtx.fillRect(
                        0,
                        0,
                        this.gameCanvas.width,
                        this.gameCanvas.height
                    );
                    break;
                case "eya":
                    // Simple purple background for Vegas
                    this.gameCtx.fillStyle = "rgba(100, 30, 150, 0.3)";
                    this.gameCtx.fillRect(
                        0,
                        0,
                        this.gameCanvas.width,
                        this.gameCanvas.height
                    );
                    break;
            }
        }
    }

    handlePlayerAction(action) {
        if (this.gameRunning && this.player) {
            this.player.updatePose(action);
        }
    }
}

// Create global instance
window.gameManager = new GameManager();
