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
            cameraActive = true;
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
            await loadPoseModel();

            // Start pose detection
            detectPose();

            // Update UI
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

async function loadPoseModel() {
    // Load the MoveNet model
    detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        }
    );
    console.log('Pose detection model loaded.');
}

async function detectPose() {
    if (!detector || !video || !cameraActive) return;

    try {
        // Estimate poses
        const poses = await detector.estimatePoses(video);

        // Clear canvas
        poseCtx.clearRect(0, 0, poseCanvas.width, poseCanvas.height);

        if (poses.length > 0) {
            const pose = poses[0];

            // Draw skeleton
            drawPose(pose);

            // Detect action
            const action = detectAction(pose);

            // Update pose status
            if (action !== currentPose) {
                currentPose = action;
                document.getElementById('poseStatus').textContent = action.toUpperCase();

                // Update pose indicators
                document.querySelectorAll('.pose-item').forEach(item => item.classList.remove('active'));

                if (action === 'left_punch'){
                    document.getElementById('pose-left').classList.add('active');
                } else if (action === 'right_punch'){
                    document.getElementById('pose-right').classList.add('active');
                } else if (action === 'block'){
                    document.getElementById('pose-block').classList.add('active');
                } else if (action === 'dodge'){
                    document.getElementById('pose-dodge').classList.add('active');
                }
            }

            if (gameRunning) {
                handlePlayerAction(action);
            }
        }
    } catch (error) {
        console.error('Pose detection error:', error);
    }

    requestAnimationFrame(detectPose);
}

function drawPose(pose) {
    const keypoints = pose.keypoints;

    // Draw keypoints
    keypoints.forEach(keypoint => {
        if (keypoint.score > 0.3) {
            poseCtx.beginPath();
            poseCtx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
            poseCtx.fillStyle = '#ffaa00';
            poseCtx.fill();
        }
    });

    // Draw skeleton
    const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
    
    adjacentKeyPoints.forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];
        
        if (kp1.score > 0.3 && kp2.score > 0.3) {
            poseCtx.beginPath();
            poseCtx.moveTo(kp1.x, kp1.y);
            poseCtx.lineTo(kp2.x, kp2.y);
            poseCtx.lineWidth = 2;
            poseCtx.strokeStyle = '#ff6600';
            poseCtx.stroke();
        }
    });
}

function detectAction(pose) {
    const keypoints = pose.keypoints;

    // Get key points
    const leftWrist = keypoints.find(kp => kp.name === 'left_wrist');
    const rightWrist = keypoints.find(kp => kp.name === 'right_wrist');
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const nose = keypoints.find(kp => kp.name === 'nose');

    // Check confidence scores
    if (leftWrist.score < 0.5 || rightWrist.score <0.5 ||
        leftShoulder.score < 0.5 || rightShoulder.score < 0.5) {
        return 'idle';
    }

    // Calculate positions relative to shoulders
    const leftWristRelY = leftWrist.y - leftShoulder.y;
    const rightWristRelY = rightWrist.y - rightShoulder.y;
    const leftWristRelX = leftWrist.x - leftShoulder.x;
    const rightWristRelX = rightWrist.x - rightShoulder.x;

    // Detect actions based on pose
    if (leftWristRelY < -20 && rightWristRelY > 20) {
        return 'left_punch'; // Left hand up, right hand down
    } else if (rightWristRelY < -50 && leftWristRelY > 20) {
        return 'right_punch'; // Right hand up, left hand down
    } else if (leftWristRelY < -30 && rightWristRelY < -30) {
        return 'block'; // Both hands up
    } else if (nose.x < leftShoulder.x - 30) {
        return 'dodge_left'; // Head moved left
    } else if (nose.x > rightShoulder.x + 30) {
        return 'dodge_right'; // Head moved right
    } 

    return 'idle';
}

document.getElementById('startBtn').addEventListener('click', function () {
    document.getElementById('gameOverlay').classList.add('hidden');
})