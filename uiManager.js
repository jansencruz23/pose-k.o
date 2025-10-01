class UIManager {
    constructor() {
        this.currentScreen = 'control';
        this.selectedCharacter = 'mac';
        this.selectedArena = 'wvba';
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
    loadCharacterPreviews() {
        // Load preview images

        // Placeholder only first
        document.getElementById('macPreview').textContent = 'Mac Preview';
        document.getElementById('donPreview').textContent = 'Don Preview';
        document.getElementById('kingPreview').textContent = 'King Preview';

        // Default selection
        this.selectCharacter('mac');
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