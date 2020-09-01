
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
  },

  coherence: 0.5,
  separation: 0.5,
  alignment: 0.5,

  turnSpeed: 0.001,
  boidCount: 1000,

};

const ui = [];
let t = 0;
let audioRunning = false;
let bassEnergy, lowMidEnergy, midEnergy, highMidEnergy, trebleEnergy;

let boids = [];

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

  for (let i = 0; i < config.boidCount; i++) {
    boids.push(new Boid());
  }

}

let flockCentroid;
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


  // CONTENTS
  flockCentroid = getFlockCentroid(boids);

  boids.forEach( boid => {
    boid.update();
    boid.show();
  });

  // CONTENTS


  ui.forEach(elem => elem.update());

  if (!config.hideUI) {
    ui.forEach(elem => elem.draw());
  }

}


const animateConfigValue = (valueName, min, max, speed) => {
  setConfigValue(valueName, map(sin(speed * t), -1, 1, min, max) );
}