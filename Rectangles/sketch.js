
const config = {

  backgroundColour: '#0f0f0f',
  redrawBackground: true,
  uiColour: 'rgba(0, 100, 220, 1.0)',
  hideUI: true,

  numericVariable: 50,
  booleanVariable: false,
  
  reactToAudio: false,

  ranges: {
    bass: {
      high: 200,
      low: 60
    }
  }
};

const ui = [];
let t = 0;
let audioRunning = false;
let bassEnergy, lowMidEnergy, midEnergy, highMidEnergy, trebleEnergy;

function setup() {

  createCanvas(windowWidth, windowHeight);
  textSize(18);
  background(config.backgroundColour);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);

  ui.push(new Slider('numericVariable', -15, 15, 0.1));
  ui.push(new Checkbox('booleanVariable'));

  config.hideUI = true;
  if (config.hideUI) {
    ui.forEach( elem => elem.hide() );
  }

}


function draw() {

  if (audioRunning && config.reactToAudio) {
    let spectrum = fft.analyze();
    bassEnergy = fft.getEnergy('bass');
    lowMidEnergy = fft.getEnergy('lowMid');
    midEnergy = fft.getEnergy('mid');
    highMidEnergy = fft.getEnergy('highMid');
    trebleEnergy = fft.getEnergy('treble');

    setConfigValue('numericVariable', map(bassEnergy, config.ranges.bass.low, config.ranges.bass.high, 0, 15));
  }

  if (config.animateConnectionHue) {
    animateConfigValue('numericVariable', 1, 360, 2);
  }
  t += 0.001;

  if (config.redrawBackground) {
    resizeCanvas(windowWidth, windowHeight);
    background(config.backgroundColour);
  }


  // ------------------------------- CONTENTS -------------------------------

  rectMode(CENTER);

  let boxSize = 30;
  let boxSpace = 5;
  let boxCountX = floor(width/(boxSize+boxSpace));
  let boxCountY = floor(height/(boxSize+boxSpace));
  for (var i = 0; i < boxCountX; i++) {
    for (var j = 0; j < boxCountY; j++) {
      push();

      rotate(map(2*t*(i+j), 0, 10, 0, PI));
      translate(map(j*sin(t), -1, 1, 0, boxSize + boxSpace), map(i*sin(t), -1, 1, 0, boxSize + boxSpace))

      rect(0, 0, boxSize, boxSize);
      pop();
      translate(0, boxSize + boxSpace);
    }
    translate(boxSize + boxSpace, -boxCountY * (boxSize + boxSpace));
  }

  // translate(width/2, height/2);
  // rectMode(CENTER);

  // let boxWidth = map(sin(t), -1, 1, 10, boxSize);
  // let boxHeight = map(sin(t+HALF_PI), -1, 1, 10, boxSize);
  
  // rect(0, 0, boxWidth, boxHeight);


  // ------------------------------- /CONTENTS -------------------------------


  ui.forEach(elem => elem.update());

  if (!config.hideUI) {
    ui.forEach(elem => elem.draw());
  }

}


const animateConfigValue = (valueName, min, max, speed) => {
  setConfigValue(valueName, map(sin(speed * t), -1, 1, min, max) );
}