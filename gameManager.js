class GameManager {
    constructor() {
        this.gameCanvas = null;
        this.gameCtx = null;
        this.player = null;
        this.opponent = null;
        this.gameRunning = false;
        this.lastTime = 0;
        this.arena = null;
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
        document.getElementById("gameOverlay").classList.add("hidden");
        this.gameRunning = true;
        this.arena = arena;

        // Create player and opponent
        this.player = new Player(100, 300, spriteManager, character);
        //this.opponent = new Opponent(500, 300, spriteManager, 'tyson');

        // Reset health
        this.player.health = 100;
        //this.opponent.health = 100;
        document.getElementById("playerHealthBar").style.width = "100%";
        //document.getElementById('opponentHealthBar').style.width = '100%';

        const opponentNames = {
            mac: "tyson",
            don: "macho man",
            king: "mr. sandman",
        };
        document.querySelector(".opponent-health .health-label").textContent =
            opponentNames[character];

        // Start game loop
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameLoop(timestamp) {
        if (!gameRunning) return;

        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        update(deltaTime);
        render();

        requestAnimationFrame((t) => gameLoop(t));
    }

    update(deltaTime) {
        player.update(deltaTime);
        // Future: Update opponent and other game elements

        // checkCollisions();

        // Check win/lose conditions
    }

    checkCollisions() {}

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
            document.querySelector(".opponent-health .health-label")
                .textContent,
            this.opponent.x,
            this.opponent.y - 10
        );
    }

    handlePlayerAction(action) {
        let playerAction = "idle";

        switch (action) {
            case "left punch":
                playerAction = "left punch";
                break;
            case "right punch":
                playerAction = "right punch";
                break;
            case "block":
                playerAction = "block";
                break;
            case "dodge":
                playerAction = Math.random() > 0.5 ? "dodge" : "dodge";
                break;
        }

        this.player.performAction(playerAction);
    }
}

// Create global instance
window.gameManager = new GameManager();