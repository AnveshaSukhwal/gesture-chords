import { FilesetResolver, HandLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/vision_bundle.mjs";

const video = document.getElementById("video");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

async function start() {
const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1250, height: 1000 } });
video.srcObject = stream;
await video.play();
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
// Add this before initializing your Wasm module to silence specific logs
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes("OpenGL error checking is disabled")) return;
  originalWarn.apply(console, args);
};
const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
const handLandmarker = await HandLandmarker.createFromOptions(vision, {
baseOptions: {
modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
delegate: "GPU"
},
runningMode: "VIDEO",
numHands: 2
});

function loop() {
const result = handLandmarker.detectForVideo(video, performance.now());
ctx.clearRect(0, 0, canvas.width, canvas.height);
for (const hand of result.landmarks) {
for (const p of hand) {
ctx.beginPath();
ctx.arc((1-p.x) * canvas.width, p.y * canvas.height, 5, 0, 2 * Math.PI);
ctx.fillStyle = "lime";
ctx.fill();
}
}
requestAnimationFrame(loop);
}
loop();
}

start();
