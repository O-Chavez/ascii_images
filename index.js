const density = "Ñ@#W$9876543210?!abc;:+=-,._ ";

let gloria;

function preload() {
  gloria = loadImage("assets/Statue_of_liberty_01.jpg");
}

function setup() {
  noCanvas();
  gloria.loadPixels();
  for (let j = 0; j < gloria.height; j++) {
    let row = "";
    for (let i = 0; i < gloria.width; i++) {
      const pixelIndex = (i + j * gloria.width) * 4;
      const r = gloria.pixels[pixelIndex + 0];
      const g = gloria.pixels[pixelIndex + 1];
      const b = gloria.pixels[pixelIndex + 2];

      const avg = (r + g + b) / 3;

      const len = density.length;
      const charIndex = floor(map(avg, 0, 255, len, 0));

      const c = density.charAt(charIndex);
      if (c == " ") row += "&nbsp;";
      else row += c;
    }
    createDiv(row);
  }
}