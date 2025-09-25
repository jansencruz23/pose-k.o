let video, poseCanvas, poseCtx, gameCanvas, gameCtx;
let detector;
let gameRunning = false;
let currentPose = 'idle';
let cameraActive = false;

// Initialize when page loads
window.addEventListener('load', init);

// Initialize the application
async function init() {
    // Get DOM elements
    video = document.getElementById('video');
    poseCanvas = document.getElementById('poseCanvas');
    poseCtx = poseCanvas.getContext('2d');
    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas.getContext('2d');

    // Set canvas dimensions
    gameCanvas.width = gameCanvas.offsetWidth;
    gameCanvas.height = gameCanvas.offsetHeight;

    // Add event listeners
    document.getElementById('cameraBtn').addEventListener('click', toggleCamera);
    document.getElementById('startBtn').addEventListener('click', startGame);
}

// Toggle camera on/off
async function toggleCamera() {
    const cameraBtn = document.getElementById('cameraBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (!cameraActive) {
        try {
            // Disable button and show loading
            cameraBtn.disabled = true;
            loadingIndicator.classList.remove('hidden');

            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });

            // Set video source
            video.srcObject = stream;

            // Wait for video to be ready
            await new Promise((resolve) => {
                video.onloadedmetadata = () => resolve(video);
            });

            // Set canvas dimensions to match video
            poseCanvas.width = video.videoWidth;
            poseCanvas.height = video.videoHeight;

            // Load pose detection model
            //await loadPoseModel();

            // Start pose detection
            //detectPose();

            // Update UI
            cameraActive = true;
            cameraBtn.textContent = 'Stop Camera';
            cameraBtn.style.background = "#ff4500";
            cameraBtn.style.color = "#000";
            cameraBtn.disabled = false;
            loadingIndicator.classList.add('hidden');

        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access the camera. Please allow camera access and try again.');
            cameraBtn.disabled = false;
            loadingIndicator.classList.add('hidden');
        }
    } else {
        // Stop camera
        const stream = video.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }

        // Clear canvas
        poseCtx.clearRect(0, 0, poseCanvas.width, poseCanvas.height);

        // Update UI
        cameraActive = false;
        cameraBtn.textContent = 'Start Camera';
        cameraBtn.style.background = '#333';
        cameraBtn.style.color = '#ffaa00';

        // Reset pose status
        document.getElementById('poseStatus').textContent = 'IDLE';
        document.querySelectorAll('.pose-item').forEach(item => item.classList.remove('active'));
    }
}

document.getElementById('startBtn').addEventListener('click', function () {
    document.getElementById('gameOverlay').classList.add('hidden');
})