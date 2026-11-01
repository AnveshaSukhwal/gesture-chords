const video = document.getElementById("video");

async function startCamera() {
const stream = await navigator.mediaDevices.getUserMedia({ video: {width: 640, height: 400} });
video.srcObject = stream;
}

startCamera();
