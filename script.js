import { AsciiEffect, Cell } from './ascii_effect.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

//  resolution slider
const resolutionSlider = document.getElementById('resolution');
const resolutionLabel = document.getElementById('resolutionLabel');
resolutionSlider.addEventListener('input', handelResolutionSlider);
const webcamRadio = document.getElementById('webcam');
const imgRadio = document.getElementById('img');
const videoRadio = document.getElementById('video');

let defaultImage = new Image();
let video = null;

initDefaultImage();

// input options
const inputRadios = document.querySelectorAll('input[name="input"]');
inputRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.value === 'img') {
      stopVideoFeed();
      displayImage();
    } else if (radio.value === 'webcam') {
      if (
        video.id === 'asciiVideo' ||
        video.id === 'regularVideo' ||
        video.id === 'webcamVideo'
      ) {
        stopVideoFeed();
        displayAsciiWebcamFeed();
      }
    } else if (radio.value === 'video') {
      displayVideoAsciiFeed();
    }
  });
});

function initDefaultImage() {
  fetch('assets/default_image.txt')
    .then((response) => response.text())
    .then((base64String) => {
      defaultImage.src = base64String;
    })
    .catch((error) => {
      console.error('Error loading image:', error);
    });
}

function handelResolutionSlider() {
  const resolution = parseInt(resolutionSlider.value);
  if (resolution === 1) {
    // ----- full resolution -----
    resolutionLabel.innerHTML = 'Original Image';
    if (webcamRadio.checked) {
      // #----- webcam -----#
      displayDefaultWebcam();
    } else if (imgRadio.checked) {
      // #----- IMG -----#
      ctx.drawImage(defaultImage, 0, 0, canvas.width, canvas.height);
    } else if (videoRadio.checked) {
      // #----- video -----#
      displayRegularVideoFeed();
    }
  } else {
    // ----- ascii resolution -----
    resolutionLabel.innerHTML = 'Resolution: ' + resolution + ' px';
    if (webcamRadio.checked) {
      // #----- webcam -----#
      if (resolution < 5) {
        resolutionLabel.innerHTML = 'Original Image';
        displayDefaultWebcam();
      } else {
        displayAsciiWebcamFeed();
      }
    } else if (imgRadio.checked) {
      // #----- IMG -----#
      displayImage();
    } else if (videoRadio.checked) {
      // #----- video -----#
      if (resolution < 5) {
        resolutionLabel.innerHTML = 'Original Image';
        displayRegularVideoFeed();
      } else {
        if (video.id == 'regularVideo') {
          displayVideoAsciiFeed();
        }
      }
    }
  }
}

function displayVideoAsciiFeed() {
  if (
    video !== null &&
    (video.id === 'regularVideo' ||
      video.id === 'webcamVideo' ||
      video.id === 'asciiWebcamVideo')
  ) {
    stopVideoFeed();
  }
  assignVideoToCanvas('asciiVideo');
}

function assignVideoToCanvas(id) {
  video = document.createElement('video');
  video.src = 'assets/campfire.mp4';
  video.id = id;
  video.onloadedmetadata = function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video.play();

    const drawFrame = () => {
      if (id === 'asciiVideo') {
        const effect = new AsciiEffect(
          ctx,
          video,
          video.videoWidth,
          video.videoHeight
        );
        effect.draw(parseInt(resolutionSlider.value) ?? 10);
      } else {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      requestAnimationFrame(drawFrame);
    };
    requestAnimationFrame(drawFrame);
  };
  // add event listener to loop video
  // video.addEventListener('ended', function () {
  //   video.currentTime = 0;
  //   video.play();
  // });
}

function displayRegularVideoFeed() {
  if (
    video !== null &&
    (video.id === 'asciiVideo' ||
      video.id === 'webcamVideo' ||
      video.id === 'asciiWebcamVideo')
  ) {
    stopVideoFeed();
  }
  assignVideoToCanvas('regularVideo');
}

function stopVideoFeed() {
  if (video) {
    console.log('stopping video feed', video.id);
    video.pause();
    video.remove();
    video = null;
  }
}

function displayImage() {
  // disable video feed if playing
  if (video) {
    stopVideoFeed();
  }
  // Handle IMG input
  fetch('assets/default_image.txt')
    .then((response) => response.text())
    .then((base64String) => {
      defaultImage.src = base64String;
      let effect;
      defaultImage.onload = function initalize() {
        canvas.width = defaultImage.width;
        canvas.height = defaultImage.height;
        effect = new AsciiEffect(
          ctx,
          defaultImage,
          defaultImage.width,
          defaultImage.height
        );
        effect.draw(parseInt(resolutionSlider.value) ?? 10);
      };
    })
    .catch((error) => {
      console.error('Error loading image:', error);
    });
}

function displayAsciiWebcamFeed() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video = document.createElement('video');
      video.srcObject = stream;
      video.id = 'asciiWebcamVideo';
      video.onloadedmetadata = function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.play();

        let lastTime = 0;
        const fps = 30; // set the desired fps
        const interval = 1000 / fps;
        const drawFrame = (currentTime) => {
          const deltaTime = currentTime - lastTime;
          if (deltaTime >= interval) {
            lastTime = currentTime;
            const effect = new AsciiEffect(
              ctx,
              video,
              video.videoWidth,
              video.videoHeight
            );
            effect.draw(parseInt(resolutionSlider.value) ?? 10);
          }
          requestAnimationFrame(drawFrame);
        };
        requestAnimationFrame(drawFrame);
      };
    })
    .catch((error) => {
      console.error('Error loading webcam:', error);
    });
}

function displayDefaultWebcam() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video = document.createElement('video');
      video.srcObject = stream;
      video.id = 'webcamVideo';
      video.onloadedmetadata = function () {
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
    .catch((error) => {
      console.error('Error loading webcam:', error);
    });
}

displayImage();
