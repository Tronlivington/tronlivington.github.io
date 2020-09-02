const config = {
  particleMaxRadius: 5,
  particleSpeed: 3,
  particleCount: 200,

  connectionDistance: 100,
  connectionStroke: 50,
  colouredConnections: false,
  connectionHue: 0,
  animateConnectionHue: false,

  backgroundColour: "#0f0f0f",

  particleHue: 100,
  particleSaturation: 100,
  particleBrightness: 100,
  showParticles: true,

  uiColour: "rgba(0, 100, 220, 1.0)",
  showFPS: false,

  reactToAudio: true,

  redrawBackground: true,
  hideUI: false,
};


const particles = [];
const ui = [];

const timers = {};

let mic, amplitude, fft;
let audioRunning = false;
const audioEnergies = {}

let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(18);
  background(config.backgroundColour);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  initialiseAudioEnergies();

  ui.push(new Slider("particleSpeed", -15, 15, 0.1));
  ui.push(new Slider("particleCount", 0, 1000));
  ui.push(new Slider("connectionDistance", 0, 300));
  ui.push(new Slider("connectionStroke", 0, 255));
  ui.push(new Slider("connectionHue", 0, 360));
  ui.push(new Slider("particleHue", 0, 360));
  ui.push(new Checkbox("redrawBackground"));
  ui.push(new Checkbox("showParticles"));
  ui.push(new Checkbox("animateConnectionHue"));
  ui.push(new Checkbox("reactToAudio"));
  ui.push(new Checkbox("showFPS"));

  config.hideUI = true;
  ui.forEach((elem) => elem.hide());

  timers["frame"] = new Timer();
  timers["audio"] = new Timer();
  timers["move"] = new Timer();
  timers["connect"] = new Timer();
  timers["displayP"] = new Timer();

  colorMode(HSB);
  fill(config.particleHue, 100, 100);
  for (let i = 0; i < width * config.particleCount; i++) {
    particles.push(new Particle());
  }
}


function draw() {
  timers.frame.start();

  if (config.redrawBackground) {
    resizeCanvas(windowWidth, windowHeight);
    background(config.backgroundColour);
  }

  ui.forEach((elem) => elem.update());

  if (config.showFPS) {
    displayFPS(config.uiColour);
  }

  timers.audio.start();
  if (audioRunning && config.reactToAudio) {
    updateAudioEnergies();
    var maxConnectionDistance =
    (0.0008 * windowWidth * windowHeight) / sqrt(config.particleCount);

    audioAnimate("particleSpeed", "bass", -1, 12);
    audioAnimate("connectionDistance", "highMid", 0, maxConnectionDistance);
    
  }
  timers.audio.stop();

  if (config.animateConnectionHue) {
    animateConfigValue("connectionHue", 1, 360, 2);
  }

  updateParticleCount();

  timers.move.start();
  particles.forEach((particle) => particle.move());
  timers.move.stop();

  timers.connect.start();
  if (config.connectionHue != 0) {
    colorMode(HSB);
    stroke(config.connectionHue, 100, 100);
  } else {
    stroke(config.connectionStroke);
  }
  let distSquared = config.connectionDistance * config.connectionDistance;
  particles.forEach(function (particle, i) {
    particle.connectToNearby(particles.slice(+i + 1), distSquared);
  });
  timers.connect.stop();

  timers.displayP.start();
  if (config.showParticles) {
    noStroke();
    colorMode(HSB);
    fill(config.particleHue, config.particleSaturation, config.particleBrightness);
    particles.forEach(function (particle, i) {
      particle.draw();
    });
  }
  timers.displayP.stop();

  if (!config.hideUI) {
    ui.forEach((elem) => elem.draw());
  }

  t += 0.001;
  timers.frame.stop();
}

function mousePressed() {
  if (!audioRunning) {
    userStartAudio();
    audioRunning = true;
  }
}

const animateConfigValue = (valueName, min, max, speed) => {
  setConfigValue(valueName, map(Math.sin(speed * t), -1, 1, min, max));
};

const updateAudioEnergies = () => {
  fft.analyze();
  for (let range in audioEnergies) {
    let vals = audioEnergies[range];
    vals.curr = fft.getEnergy(range);
    if (vals.curr > vals.max) { vals.max = vals.curr; }
    if (vals.curr < vals.min) { vals.min = vals.curr; }
  }
}


const audioAnimate = (configProperty, frequencyRange, minValue, maxValue) => {
  let vals = audioEnergies[frequencyRange];
  let propVal = map(vals.curr, vals.min, vals.max, minValue, maxValue);
  setConfigValue(configProperty, propVal);
}

const initialiseAudioEnergies = () => {
  audioEnergies.bass = {
    curr: 0,
    min: 0,
    max: 0
  };
  audioEnergies.lowMid = {
    curr: 0,
    min: 0,
    max: 0
  };
  audioEnergies.mid = {
    curr: 0,
    min: 0,
    max: 0
  };
  audioEnergies.highMid = {
    curr: 0,
    min: 0,
    max: 0
  };
  audioEnergies.treble = {
    curr: 0,
    min: 0,
    max: 0
  };
}