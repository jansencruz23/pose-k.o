    let gameCanvas, gameCtx;
let player;
let gameRunning = false;
let lastTime = 0;

// Initialize the game
async function initGame() {
    document.getElementById('startBtn').addEventListener('click', startGame);

    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas.getContext('2d');
    
    // Set canvas dimensions
    gameCanvas.width = gameCanvas.offsetWidth;
    gameCanvas.height = gameCanvas.offsetHeight;

    // Wait for sprites to load
    await spriteManager.loadSprites();

    // Create player and opponent
    player = new Player(100, 300, spriteManager);
    console.log(player);
}

// Start the game
function startGame() {
    document.getElementById('gameOverlay').classList.add('hidden');
    gameRunning = true;

    // Reset health for both characters
    player.health = 100;

    // Update health bars
    document.getElementById('playerHealthBar').style.width = '100%';

    lastTime = performance.now();
    gameLoop();
}

// Main game loop - runs every frame
function gameLoop(timestamp) {
    if (!gameRunning) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

// Update game state
function update(deltaTime){
    player.update(deltaTime);
    // Future: Update opponent and other game elements

    // checkCollisions();

    // Check win/lose conditions
}

function checkCollisions() {}

function render() {
    // Clear canvas
    gameCtx.fillStyle = '#222';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw boxing ring
    gameCtx.strokeStyle = '#8B4513';
    gameCtx.lineWidth = 4;
    gameCtx.strokeRect(50, 200, gameCanvas.width - 100, 300);

    // Draw characters
    player.draw(gameCtx);
    // Future: Draw opponent and other game elements

    // Draw character labels
    gameCtx.fillStyle = '#fff';
    gameCtx.font = '16px Arial';
    gameCtx.fillText('PLAYER', player.x, player.y - 10);
    // Future: Draw opponent label
}

function handlePlayerAction(action) {
    let playerAction = 'idle';

    switch(action) {
        case 'left punch':
            playerAction = 'left punch';
            break;
        case 'right punch':
            playerAction = 'right punch';
            break;
        case 'block':
            playerAction = 'block';
            break;
        case 'dodge':
            playerAction = Math.random() > 0.5 ? 'dodge' : 'dodge';
            break;
    }

    player.performAction(playerAction);
}