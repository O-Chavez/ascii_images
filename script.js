const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


const density = "Ñ@#W$9876543210?!abc;:+=-,._ ";

const image1 = new Image();
fetch('assets/default_image.txt')
  .then(response => response.text())
  .then(base64String => {
    image1.src =  base64String;
    
  })
  .catch(error => {
    console.error('Error loading image:', error);
  });

//  resolution slider
const resolutionSlider = document.getElementById('resolution');
const resolutionLabel = document.getElementById('resolutionLabel');
resolutionSlider.addEventListener('change', handelResolutionSlider);


// // input slider
const inputRadios = document.querySelectorAll('input[name="input"]');

inputRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'img') {
      console.log('img');
      // Handle IMG input
    } else if (radio.value === 'webcam') {
      console.log('webcam');
      // Handle webcam input
      // ...
    }
  });
});

class Cell {
  constructor(x, y, symbol, color){
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.color = color;
  }

  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.fillText(this.symbol, this.x, this.y,)
  }
}

class AsciiEffect {
  #imageCellArray = [];
  #pixels = [];
  #ctx;
  #width;
  #height;

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
    this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
  }

  #convertToSymbol(g){
    if (g > 250) return "@"
    if (g > 240) return "@"
    if (g > 220) return "#"
    if (g > 200) return "W"
    if (g > 180) return "$"
    if (g > 160) return "?"
    if (g > 140) return "%"
    if (g > 120) return ":"
    if (g > 100) return ";"
    if (g > 80) return "_"
    if (g > 60) return ","
    if (g > 40) return "."
    if (g > 20) return " "
    else return '';
  }

  #scanImage(cellSize) {
    this.#imageCellArray = [];
    for (let y = 0; y < this.#pixels.height; y += cellSize) {
      for (let x = 0; x < this.#pixels.width; x += cellSize){
        const posX = x * 4;
        const posY = y * 4;
        const pos = (posY * this.#pixels.width) + posX;

        if(this.#pixels.data[pos + 3] > 128) {
          const red = this.#pixels.data[pos];
          const green = this.#pixels.data[pos + 1];
          const blue = this.#pixels.data[pos + 2];
          const total = red + green + blue;
          const averageColorValue = total / 3;
          const color = "rgb(" + red + "," + green + "," + blue + ")";
          const symbol = this.#convertToSymbol(averageColorValue);
          this.#imageCellArray.push(new Cell(x,y, symbol, color));
        }
      }
    }
  }

  #drawAscii() {
    this.#ctx.clearRect(0 , 0, this.#width, this.#height);
    for (let i = 0; i < this.#imageCellArray.length; i++) {
      this.#imageCellArray[i].draw(this.#ctx);
      
    }
  }

  draw(cellSize){
    this.#scanImage(cellSize);
    this.#drawAscii();
  }
}

function handelResolutionSlider() {
  if (resolutionSlider.value == 1) {
    resolutionLabel.innerHTML = 'Original Image';
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  } else {
    resolutionLabel.innerHTML = 'Resolution: ' + resolutionSlider.value + ' px'
    effect.draw(parseInt(resolutionSlider.value));
  }
}

function handelInputChange() {
  console.log('input changed', selectedInput)
  // if (resolutionSlider.value == 1) {

  // } else {
  // }
}

let effect;
image1.onload = function initalize() {
    canvas.width = image1.width;
    canvas.height = image1.height;
    effect = new AsciiEffect(ctx, image1.width, image1.height);
    effect.draw(10);
}



