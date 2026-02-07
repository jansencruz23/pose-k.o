# Pose K.O.

A browser-based boxing game where you control your fighter using real body movements. The game uses your webcam and machine learning to detect punches, blocks, and dodges in real-time.

## What It Does

Pose K.O. turns your living room into a boxing ring. Stand in front of your webcam, throw real punches, and watch your on-screen fighter mirror your moves. The game tracks your body position using TensorFlow.js and translates your movements into in-game actions.

**Controls:**
- Throw a left punch (extend left arm)
- Throw a right punch (extend right arm)
- Block (raise both arms up)
- Dodge (lean left or right)

## Features

- **Real-time pose detection** using TensorFlow.js MoveNet model
- **3 playable characters** - Inigo, Cassie, and Mika, each with different difficulty levels
- **3 arena stages** - Computer Lab, The Struggle, and Eya Building
- **AI opponent** with adaptive difficulty based on character selection
- **Retro arcade aesthetic** with CRT screen effects and pixel-styled fonts
- **Sound effects and background music** for each arena

## Tech Stack

- HTML5 Canvas for game rendering
- Vanilla JavaScript (no frameworks)
- TensorFlow.js for machine learning
- MoveNet (SinglePose Lightning) for pose detection
- CSS with retro arcade styling

## How to Run

1. Clone or download this repository
2. Serve the files using any local web server. For example:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```
3. Open `http://localhost:8000` in your browser
4. Allow camera access when prompted
5. Follow the on-screen instructions to start fighting

## Project Structure

```
├── index.html          # Main game page
├── styles.css          # All styling (retro arcade theme)
├── scripts/
│   ├── app.js          # Main app logic and pose detection
│   ├── gameManager.js  # Game state and loop management
│   ├── player.js       # Player character logic
│   ├── opponent.js     # AI opponent with difficulty levels
│   ├── spriteManager.js# Character sprite handling
│   ├── soundManager.js # Audio playback
│   └── uiManager.js    # UI state management
└── assets/
    ├── sprites/        # Character sprite sheets
    ├── arenas/         # Arena background images
    └── sounds/         # Sound effects and music
```

## Browser Requirements

- Modern browser with WebGL support (Chrome, Firefox, Edge)
- Webcam access
- JavaScript enabled

## Notes

- Works best with good lighting and a clear background
- Position yourself so your upper body is visible in the webcam feed
- The pose detection runs locally in your browser - no data is sent to any server

---

Built as a learning project exploring real-time pose detection in the browser.
