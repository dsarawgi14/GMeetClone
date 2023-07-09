let audiomuted = false;
let videomuted = false;

const buttons = document.querySelectorAll('.togglebtn');
buttons.forEach(button => {
    button.addEventListener('click', function() {
    if(button.id === "mute-audio") {
        audiomuted = !audiomuted;
    } else {
        videoTrack.enabled = videomuted;
        videomuted = !videomuted;
        document.getElementById("overlay").classList.toggle('videomuted');
    }
    this.classList.toggle('clicked');
    });
});

const myVideo = document.getElementById("user-video");
myVideo.muted = true;
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    myVideo.srcObject = stream;
    myVideo.addEventListener('loadedmetadata', () => {
        myVideo.play();
    })
    videoTrack = stream.getVideoTracks()[0];
});