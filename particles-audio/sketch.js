
const config = {

  particleMaxRadius: 3,
  particleSpeed: 3,
  particleCount: 200,

  connectionDistance: 100,
  connectionStroke: 50,
  colouredConnections: false,
  connectionHue: 0,
  animateConnectionHue: false,

  backgroundColour: '#0f0f0f',

  particleHue: 100,
  particleSaturation: 100,
  particleBrightness: 100,
  showParticles: true,

  uiColour: 'rgba(0, 100, 220, 1.0)',

  reactToAudio: true,

  redrawBackground: true,
  hideUI: false,

  ranges: {
    bass: {
      low: 90,
      high: 220
    },
    highMid: {
      low: 0,
      high: 110
    }
  },

  
};


const particles = [];
const ui = [];
let mic, amplitude, fft;
let audioRunning = false;

function setup() {

  createCanvas(windowWidth, windowHeight);
  textSize(18);
  background(config.backgroundColour);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);

  ui.push(new Slider('particleSpeed', -15, 15, 0.1));
  ui.push(new Slider('particleCount', 0, 1000));
  ui.push(new Slider('connectionDistance', 0, 300));
  ui.push(new Slider('connectionStroke', 0, 255));
  ui.push(new Slider('connectionHue', 0, 360));
  ui.push(new Slider('particleHue', 0, 360));
  ui.push(new Checkbox('redrawBackground'));
  ui.push(new Checkbox('showParticles'));
  ui.push(new Checkbox('animateConnectionHue'));
  ui.push(new Checkbox('reactToAudio'));

  config.hideUI = true;
  ui.forEach( elem => elem.hide() );

  colorMode(HSB);
  fill(config.particleHue, 100, 100);
  for (let i = 0; i < width * config.particleCount; i++) {
    particles.push(new Particle());
  }

}

let t = 0;
let bassEnergy;
let lowMidEnergy;
let midEnergy;
let highMidEnergy;
let trebleEnergy;

function draw() {

  if (audioRunning && config.reactToAudio) {
    let spectrum = fft.analyze();
    bassEnergy = fft.getEnergy('bass');
    lowMidEnergy = fft.getEnergy('lowMid');
    midEnergy = fft.getEnergy('mid');
    highMidEnergy = fft.getEnergy('highMid');
    trebleEnergy = fft.getEnergy('treble');

    var maxConnectionDistance = 0.0012 * windowWidth * windowHeight / sqrt(config.particleCount);
    
    setConfigValue('particleSpeed', map(bassEnergy, config.ranges.bass.low, config.ranges.bass.high, 0, 15));
    setConfigValue('connectionDistance', map(highMidEnergy, config.ranges.highMid.low, config.ranges.highMid.high, 0, maxConnectionDistance));
    // setConfigValue('particleCount', map(highMidEnergy, 0, 120, 10, 500));

  }

  if (config.animateConnectionHue) {
    animateConfigValue('connectionHue', 1, 360, 2);
  }
  t += 0.001;

  if (config.redrawBackground) {
    resizeCanvas(windowWidth, windowHeight);
    background(config.backgroundColour);
  }

  updateParticleCount();

  particles.forEach( particle => particle.move() );
  particles.forEach( function(particle, i) {
    particle.connectToNearby(particles.slice(+i+1));
    particle.draw();
  });

  ui.forEach(elem => elem.update());

  if (!config.hideUI) {
    ui.forEach(elem => elem.draw());
  }

}

function mousePressed() {
  if (!audioRunning) {
    userStartAudio();
    audioRunning = true;
  }
}

const animateConfigValue = (valueName, min, max, speed) => {
  setConfigValue(valueName, map(sin(speed * t), -1, 1, min, max) );
}