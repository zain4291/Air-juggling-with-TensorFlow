// Hand tracking state
let detector = null;
let video = null;
let isDetecting = false;
let sendHandsCallback = null;

/**
 * Setup hand tracking with MediaPipe Hands
 * @param {HTMLVideoElement} videoElement - Video element for webcam
 * @param {Function} sendHands - Called with hand positions [{x, y}]
 */
async function setupHandTracking(videoElement, sendHands) {
  video = videoElement;
  sendHandsCallback = sendHands;

  try {
    // Request webcam access using getUserMedia
    const stream = await navigator.mediaDevices.getUserMedia({video: {width: 640, height: 480}});

    //Connect webcam stream to video element
    video.srcObject = stream;
    await video.play();

    // Configure and load the model
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const configDetector = {
      runtime: "mediapipe",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
      maxHands: 2,
      modelType: "full",
    };

    // Create the detector
    detector = await window.handPoseDetection.createDetector(model, configDetector);
    

    console.log("Hand tracking initialized successfully");
    return true;
  } catch (error) {
    console.error("Error setting up hand tracking:", error);
    alert(
      "Could not access webcam. Please ensure you have granted camera permissions.",
    );
    return false;
  }
}

/**
 * Start hand detection loop
 */
function startDetection() {
  if (!detector || !video) {
    console.error("Hand tracking not initialized");
    return;
  }

  isDetecting = true;
  detectHands();
}

/**
 * Stop hand detection loop
 */
function stopDetection() {
  isDetecting = false;
}

/**
 * Detect hands and call sendHandsCallback with positions
 */
async function detectHands() {
  if (!isDetecting) return;

  try {
    // Run hand detection on current video frame:
    const hands = await detector.estimateHands(video);


    // Update hand landmarks to canvas coordinates
    const handPositions = hands.map((hand) => {
      // Get the palm base landmark and convert to palm center
      const palmBase = [0, 5, 9, 13, 17].map((i) => hand.keypoints[i]);
      const avgPalmX = palmBase.reduce((sum, kp) => sum + kp.x, 0) / palmBase.length;
      const avgPalmY = palmBase.reduce((sum, kp) => sum + kp.y, 0) / palmBase.length;
      return {
        x: video.videoWidth - avgPalmX, // Mirror horizontally
        y: avgPalmY,
      };
    });


    // Call sendHandsCallback with the newly calculated hand positions
    if (sendHandsCallback) {
      sendHandsCallback(handPositions);
    }



  } catch (error) {
    console.error("Error detecting hands:", error);
  }

  // Continue detection loop (~30 FPS)
  setTimeout(() => detectHands(), 33);
}

// Export functions (if using modules, otherwise they're global)
window.handTracking = {
  setupHandTracking,
  startDetection,
  stopDetection,
};