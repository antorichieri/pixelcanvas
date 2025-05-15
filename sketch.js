let carrier; 
let modulator; 
let fft; 
let waveform; 

let size = 30; 
let cols, rows;
let grid = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight * 0.6);

  cols = floor(width / size);
  rows = floor(height / size);

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0; 
    }
  }

  carrier = new p5.Oscillator(); 
  carrier.freq(340);
  carrier.amp(0); 
  carrier.start();

  modulator = new p5.Oscillator('triangle');
  modulator.disconnect(); 
  modulator.freq(5);
  modulator.amp(1);
  modulator.start();

  fft = new p5.FFT();

  frameRate(20); 
}

function draw() {
  background(0); 

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * size;
      let y = j * size;
      let d = dist(mouseX, mouseY, x + size / 2, y + size / 2);

      if (d < size * 2) {
        grid[i][j] = 255;
      }

      fill(255, grid[i][j]); 
      stroke(200); 
      rect(x, y, size, size);

      grid[i][j] -= 10; 
      if (grid[i][j] < 0) {
        grid[i][j] = 0;
      }
    }
  }

  let modFreq = map(mouseY, 0, height, 20, 0); 
  modulator.freq(modFreq);

  let modAmp = map(mouseX, 0, width, 0, 1); 
  modulator.amp(modAmp, 0.01); 

  waveform = fft.waveform();

  drawWaveform();
  drawText(modFreq, modAmp);
}

function drawWaveform() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    stroke(255, 200, 0); 
    strokeWeight(3); 
  } else {
    stroke(240); 
    strokeWeight(2); 
  }

  noFill();
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height); 
    vertex(x, y);
  }
  endShape();
}

function drawText(modFreq, modAmp) {
  strokeWeight(1);
  fill(240);
  textSize(16);
  text('Frecuencia del Modulador: ' + modFreq.toFixed(2) + ' Hz', 20, 20);
  text('Amplitud del Modulador: ' + modAmp.toFixed(2), 20, 40);
}

function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
  carrier.amp(modulator.scale(-1, 1, 1, -1), 0.1);
}
