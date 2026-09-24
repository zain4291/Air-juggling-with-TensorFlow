# Air Juggler

Air Juggler is a browser-based gesture-controlled game. Use your webcam and hands to keep the ball bouncing for as long as possible.

## How It Works

The game uses TensorFlow.js and MediaPipe Hands to detect up to two hands through your webcam. Detected palms act as paddles that bounce the ball upward. Your score is the number of seconds you survive.

## Requirements

- A modern browser with webcam support
- Camera permission
- A local web server (camera access is generally blocked when opening `index.html` directly as a `file://` URL)
- Internet access on first load for the TensorFlow.js and MediaPipe CDN scripts

## Run Locally

From this directory, start a local server. For example, with Python:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

You can also use another static file server, such as the VS Code Live Server extension.

## Play

1. Open the game and click **Start Game**.
2. Allow camera access when prompted.
3. Wait through the three-second countdown.
4. Move your hands into the camera view to bounce the ball.
5. Keep the ball from falling below the canvas.
6. Click **Play Again** after game over to start a new round.

## Project Structure

- `index.html` - Page markup and CDN dependencies
- `style.css` - Game layout, visual styling, and animations
- `game.js` - Ball physics, collision handling, scoring, rendering, and game state
- `handTracker.js` - Webcam setup and MediaPipe hand detection

## Privacy

The webcam stream is used locally by the browser for hand tracking. This project does not include a server or upload endpoint. Camera access still requires explicit permission from your browser.
