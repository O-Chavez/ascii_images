import { AsciiEffect, Cell } from './ascii_effect.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const density = "Ñ@#W$9876543210?!abc;:+=_-,. ";

//  resolution slider
const resolutionSlider = document.getElementById('resolution');
const resolutionLabel = document.getElementById('resolutionLabel');
resolutionSlider.addEventListener('change', handelResolutionSlider);

const webcamRadio = document.getElementById('webcam');
const imgRadio = document.getElementById('img');
const videoRadio = document.getElementById('video');


// // input slider
const inputRadios = document.querySelectorAll('input[name="input"]');
inputRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'img') {
      stopAsciiWebcamFeed();
      displayImage(parseInt(resolutionSlider.value));
    } else if (radio.value === 'webcam') {
      displayAsciiWebcamFeed();
    } else if (radio.value === 'video') {
      stopAsciiWebcamFeed();
      displayVideoAsciiFeed();
    }
  });
});


let videoStream;
function displayAsciiWebcamFeed() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoStream = stream;
          const video = document.createElement('video');
          video.srcObject = stream;
          video.onloadedmetadata = function() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.play();

              const drawFrame = () => {
                const effect = new AsciiEffect(ctx, video, video.videoWidth, video.videoHeight);
                effect.draw(parseInt(resolutionSlider.value) ?? 10);
                requestAnimationFrame(drawFrame);
              };
              requestAnimationFrame(drawFrame);
          };
        })
        .catch(error => {
          console.error('Error loading webcam:', error);
        });
}



function stopAsciiWebcamFeed() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }
}

function displayVideoAsciiFeed(){
  const video = document.createElement('video');
  video.src = 'assets/incense burning.mp4';
  video.onloadedmetadata = function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video.play();

    const drawFrame = () => {
      const effect = new AsciiEffect(ctx, video, video.videoWidth, video.videoHeight);
      effect.draw(parseInt(resolutionSlider.value) ?? 10);
      requestAnimationFrame(drawFrame);
    };
    requestAnimationFrame(drawFrame);

      // add event listener to loop video
  video.addEventListener('ended', function() {
    video.currentTime = 0;
    video.play();
  });
  };
}

function stopVideoAsciiFeed() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }
}

function displayRegularVideoFeed() {
  const video = document.createElement('video');
  video.src = 'assets/incense burning.mp4';
  video.onloadedmetadata = function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video.play();

    const drawFrame = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawFrame);
    }
    requestAnimationFrame(drawFrame);

    // add event listener to loop video
    video.addEventListener('ended', function() {
      video.currentTime = 0;
      video.play();
    }
    );
  };
}

function handelResolutionSlider() {
  const resolution = parseInt(resolutionSlider.value);
  if (resolution === 1) {
    // ----- full resolution -----
    resolutionLabel.innerHTML = 'Original Image';
    if (webcamRadio.checked) {
      // #----- webcam -----#
      console.log('full res webcam');
      stopAsciiWebcamFeed();
      displayDefaultWebcam();

    } else if (imgRadio.checked) {
      // #----- IMG -----#
      ctx.drawImage(defaultImage, 0, 0, canvas.width, canvas.height);
    } else if (videoRadio.checked) {
      console.log('displaying full resolution video');
      // #----- video -----#
      stopVideoAsciiFeed();
      displayRegularVideoFeed();
    }
  } else {
    // ----- ascii resolution -----
    resolutionLabel.innerHTML = 'Resolution: ' + resolution + ' px';
    if (webcamRadio.checked) {
      // #----- webcam -----#

      // displayAsciiWebcamFeed(video, resolution);
      displayAsciiWebcamFeed();
     
    } else if (imgRadio.checked) {
      // #----- IMG -----#
      displayImage(resolution);
    } else if (videoRadio.checked) {
      // #----- video -----#
      stopAsciiWebcamFeed();
      displayVideoAsciiFeed();
    }
  }
}

function displayImage (resolution) {
  // disable video feed if playing
  const video = document.getElementById('webcamVideo');
  if (video) {
   console.log('video', video);
    video.pause();
  }
  // Handle IMG input
  const defaultImage = new Image();
  fetch('assets/default_image.txt')
    .then(response => response.text())
    .then(base64String => {
      defaultImage.src =  base64String;
      let effect;
      defaultImage.onload = function initalize() {
          canvas.width = defaultImage.width;
          canvas.height = defaultImage.height;
          effect = new AsciiEffect(ctx, defaultImage, defaultImage.width, defaultImage.height);
          effect.draw(resolution ?? 10);
      };
    })
    .catch(error => {
      console.error('Error loading image:', error);
    });
}

function displayDefaultWebcam() {
  navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const video = document.createElement('video');
          video.srcObject = stream;
          video.onloadedmetadata = function() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.play();
            const drawFrame = () => {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              requestAnimationFrame(drawFrame);
            };
            requestAnimationFrame(drawFrame);
          };
        })
        .catch(error => {
          console.error('Error loading webcam:', error);
        });
}



displayImage();



