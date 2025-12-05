const Video = document.getElementById("video");
const videoBtn = document.getElementById("videoBtn");
const stopVideoBtn = document.getElementById("stopVideoBtn");

videoBtn.addEventListener("click", async () => {
  cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
  Video.srcObject = cameraStream;
});

stopVideoBtn.addEventListener("click", () => {
  if (cameraStream) {
    // Stop all tracks (turns camera off)
    cameraStream.getTracks().forEach(track => track.stop());

    Video.srcObject = null;
    cameraStream = null;
  }
});
