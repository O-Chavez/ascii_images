import { AsciiEffect, Cell } from './ascii_effect.js';

// Get DOM elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const resolutionSlider = document.getElementById('resolution');
const resolutionLabel = document.getElementById('resolutionLabel');
const webcamRadio = document.getElementById('webcam');
const imgRadio = document.getElementById('img');
const videoRadio = document.getElementById('video');

// Variables for image and video
let defaultImage = new Image();
let video = null;

// Event listeners
resolutionSlider.addEventListener('input', handleResolutionSlider);
webcamRadio.addEventListener('change', handleInputRadioChange);
imgRadio.addEventListener('change', handleInputRadioChange);
videoRadio.addEventListener('change', handleInputRadioChange);

// Initialize default image
initDefaultImage();

async function initDefaultImage() {
  try {
    const response = await fetch('assets/default_image.txt');
    const base64String = await response.text();
    defaultImage.src = base64String;
  } catch (error) {
    console.error('Error loading image:', error);
  }
}

// Handle resolution slider change
function handleResolutionSlider() {
  const resolution = parseInt(resolutionSlider.value);
  if (resolution === 1) {
    resolutionLabel.innerHTML = 'Original Image';
    handleInputRadioChange();
  } else {
    resolutionLabel.innerHTML = `Resolution: ${resolution} px`;
    handleInputRadioChange();
  }
}

// Handle input radio change
function handleInputRadioChange() {
  if (webcamRadio.checked) {
    if (resolutionSlider.value < 5) {
      resolutionLabel.innerHTML = 'Original Image';
      displayDefaultWebcam();
    } else {
      displayAsciiWebcamFeed();
    }
  } else if (imgRadio.checked) {
    displayImage();
  } else if (videoRadio.checked) {
    if (resolutionSlider.value < 5) {
      resolutionLabel.innerHTML = 'Original Image';
      displayRegularVideoFeed();
    } else {
      displayVideoAsciiFeed();
    }
  }
}

// Handle webcam display
function displayDefaultWebcam() {
  handleWebcamDisplay('webcamVideo', (effect) => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  });
}

function displayAsciiWebcamFeed() {
  handleWebcamDisplay('asciiWebcamVideo', (effect) => {
    effect.draw(parseInt(resolutionSlider.value) || 10);
  });
}

function handleWebcamDisplay(id, drawFunction) {
  if (!video || video.id !== id) {
    stopVideoFeed();
    video = document.createElement('video');
    video.src = 'assets/campfire.mp4';
    video.id = id;
  }
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video = document.createElement('video');
      video.srcObject = stream;
      video.id = id;
      video.onloadedmetadata = function () {
        setCanvasDimensions(video.videoWidth, video.videoHeight);
        video.play();

        const lastTime = 0;
        const fps = 30;
        const interval = 1000 / fps;

        const drawFrame = (currentTime) => {
          const deltaTime = currentTime - lastTime;
          if (deltaTime >= interval) {
            drawFunction(
              new AsciiEffect(
                ctx,
                video,
                video.videoWidth ?? 640,
                video.videoHeight ?? 480
              )
            );
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

// Handle video display
function displayRegularVideoFeed() {
  handleVideoDisplay('regularVideo', () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  });
}

function displayVideoAsciiFeed() {
  handleVideoDisplay('asciiVideo', (effect) => {
    effect.draw(parseInt(resolutionSlider.value) || 10);
  });
}

function handleVideoDisplay(id, drawFunction) {
  if (!video || video.id !== id) {
    stopVideoFeed();
    video = document.createElement('video');
    video.src = 'assets/campfire.mp4';
    video.id = id;
  }

  video.onloadedmetadata = function () {
    setCanvasDimensions(video.videoWidth, video.videoHeight);
    video.play();

    const drawFrame = () => {
      drawFunction(
        new AsciiEffect(ctx, video, video.videoWidth, video.videoHeight)
      );
      requestAnimationFrame(drawFrame);
    };

    requestAnimationFrame(drawFrame);
  };
}

// Handle image display
function displayImage() {
  handleImageDisplay((effect) => {
    effect.draw(parseInt(resolutionSlider.value) || 10);
  });
}

async function handleImageDisplay(drawFunction) {
  stopVideoFeed();
  try {
    const response = await fetch('assets/default_image.txt');
    const base64String = await response.text();
    defaultImage.src = base64String;
    defaultImage.onload = function initalize() {
      setCanvasDimensions(defaultImage.width, defaultImage.height);
      drawFunction(
        new AsciiEffect(
          ctx,
          defaultImage,
          defaultImage.width,
          defaultImage.height
        )
      );
    };
  } catch (error) {
    console.error('Error loading image:', error);
  }
}

// Set canvas dimensions
function setCanvasDimensions(width, height) {
  canvas.width = width;
  canvas.height = height;
}

function stopVideoFeed() {
  if (video) {
    console.log('Stopping video feed', video.id);
    video.pause();
    video.remove();
    video = null;
  }
}

// Initial setup
function initialSetup() {
  displayImage();
}

initialSetup();
