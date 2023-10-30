export class Cell {
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

export class AsciiEffect {
  #imageCellArray = [];
  #pixels = [];
  #ctx;
  #width;
  #height;
  // #density = '@#W$?%:_,. ';

  constructor(ctx, input, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.#ctx.drawImage(input, 0, 0, this.#width, this.#height);
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
    if (g > 20) return "."
    if (g > 20) return "."
    if (g > 20) return "."
    else return '.';
  }
  
  // #convertToSymbol(g) {
  //   const densityIndex = Math.floor((g / 255) * (this.#density.length - 1));
  //   return this.#density[densityIndex];
  // }

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