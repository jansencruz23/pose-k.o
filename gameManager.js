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
    }

    async initGame() {
        this.gameCanvas = document.getElementById("gameCanvas");
        this.gameCtx = this.gameCanvas.getContext("2d");

        // Set canvas dimensions
        this.gameCanvas.width = this.gameCanvas.offsetWidth;
        this.gameCanvas.height = this.gameCanvas.offsetHeight;

        // Wait for sprites to load
        await spriteManager.loadSprites();
    }

    startGame(character, arena) {
        document.getElementById("controlScreen").classList.add("hidden");
        this.gameRunning = true;
        this.arena = arena;
        this.selectedCharacter = character;

        // Create player and opponent
        this.player = new Player(100, 300, spriteManager, character);
        this.opponent = new Opponent(500, 300, spriteManager, "tyson");

        this.setOpponentDifficulty(character);

        // Reset health
        this.player.health = 100;
        this.opponent.health = 100;
        document.getElementById("playerHealthBar").style.width = "100%";
        document.getElementById("opponentHealthBar").style.width = "100%";

        const opponentNames = {
            mac: "tyson",
            don: "tyson",
            king: "tyson",
        };
        //document.querySelector(".opponent-health .health-label").textContent =
        //    opponentNames[character];

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
            
            if (this.player.canRegisterHit()){
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
        setTimeout(() => {
            alert(message);
            // Reset to control screen
            document.getElementById('controlScreen').classList.remove('hidden');
            uiManager.currentScreen = 'control';
        }, 500);
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

        // Draw ring
        this.gameCtx.strokeStyle = "#8B4513";
        this.gameCtx.lineWidth = 4;
        this.gameCtx.strokeRect(50, 200, this.gameCanvas.width - 100, 300);

        // Draw characters
        this.player.draw(this.gameCtx);
        this.opponent.draw(this.gameCtx);

        // Draw action labels
        this.gameCtx.fillStyle = "white";
        this.gameCtx.font = "16px Arial";
        this.gameCtx.fillText("You", this.player.x, this.player.y - 10);
        this.gameCtx.fillText(
            'Dodo',
            this.opponent.x,
            this.opponent.y - 10
        );
    }

    drawArena() {
        switch (this.arena) {
            case "wvba":
                this.gameCtx.fillStyle = "rgba(30, 60, 120, 0.3)";
                this.gameCtx.fillRect(
                    0,
                    0,
                    this.gameCanvas.width,
                    this.gameCanvas.height
                );
                break;
            case "tokyo":
                // Simple red background for Tokyo
                this.gameCtx.fillStyle = "rgba(180, 30, 30, 0.3)";
                this.gameCtx.fillRect(
                    0,
                    0,
                    this.gameCanvas.width,
                    this.gameCanvas.height
                );
                break;
            case "vegas":
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

    handlePlayerAction(action) {
        if (this.gameRunning && this.player) {
            this.player.updatePose(action);
        }
    }
}

// Create global instance
window.gameManager = new GameManager();
