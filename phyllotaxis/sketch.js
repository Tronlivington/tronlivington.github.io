const config = {
  backgroundColour: "#0f0f0f",
  redrawBackground: true,
  uiColour: "rgba(0, 100, 220, 1.0)",
  hideUI: true,
  showFPS: false,

  numericVariable: 50,
  booleanVariable: false,

  divAngle: 137.5,
  c: 5,
  n: 5,
  dotSize: 5,
  hueOffset: 0,
  maxDots: 2000,
  dotCount: 10,

  reactToAudio: true,

};

const ui = [];
let t = 0;

let mic, amplitude, fft;
let audioRunning = false;
const audioEnergies = {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(windowWidth, windowHeight, WEBGL);
  textSize(18);
  background(config.backgroundColour);

  ui.push(new Slider("c", 0, 10, 0.1));
  ui.push(new Slider("divAngle", 137, 138, 0.0001));
  ui.push(new Slider("dotSize", 1, 15, 0.1));
  ui.push(new Checkbox("redrawBackground"));
  ui.push(new Checkbox("reactToAudio"));

  if (config.hideUI) {
    ui.forEach((elem) => elem.hide());
  }

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  initialiseAudioEnergies();

  angleMode(DEGREES);
}


function draw() {
  if (config.redrawBackground) {
    resizeCanvas(windowWidth, windowHeight);
    background(config.backgroundColour);
  }
  
  ui.forEach((elem) => elem.update());
  if (!config.hideUI) {
    ui.forEach((elem) => elem.draw());
  }

  if (config.showFPS) {
    displayFPS(config.uiColour);
  }

  
  if (audioRunning && config.reactToAudio) {
    updateAudioEnergies();
    
    audioAnimate("hueOffset", "highMid", 0, 720, 10);
    audioAnimate("dotCount", "bass", 0, config.maxDots, 50);
    audioAnimate("c", "mid", 4, 12, 1);
    
  }

  oscillate("divAngle", 137.15, 137.85, 0.002);

  translate(width / 2, height / 2);
  rotate(t);
  t += 0.1;
  // scale(2.5)

  colorMode(HSB);
  let points = [];

  for (let n = 0; n < config.dotCount; n++) {
    let phi = n * config.divAngle;
    let r = config.c * sqrt(n);
    let { x, y } = polar2Cart(r, phi);

    let hue = (r + config.hueOffset) % 360;
    points.push({
      x: x,
      y: y,
      hue: hue,
      // size: map(n, 0, config.dotCount, 3, 15)
      size: map(n, 0, config.maxDots, 3, 15)
    });
  }

  for (let point of points) {
    fill(point.hue, 80, 80);
    ellipse(point.x, point.y, point.size, point.size);
  }

}

const oscillate = (valueName, min, max, speed) => {
  setConfigValue(valueName, map(sin(speed * frameCount), -1, 1, min, max));
};

const polar2Cart = (r, angle) => ({
  x: r * cos(angle),
  y: r * sin(angle),
});





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


const audioAnimate = (configProperty, frequencyRange, minValue, maxValue, maxChange) => {
  let vals = audioEnergies[frequencyRange];
  let propVal = map(vals.curr, vals.min, vals.max, minValue, maxValue);
  let change = propVal - config[configProperty];
  if (change > maxChange) {
    propVal = config[configProperty] + maxChange;
  } else if (change < -maxChange) {
    propVal = config[configProperty] - maxChange;
  }
  setConfigValue(configProperty, propVal);
}

const initialiseAudioEnergies = () => {
  audioEnergies.bass = {
    curr: 0,
    min: 0,
    max: 1
  };
  audioEnergies.lowMid = {
    curr: 0,
    min: 0,
    max: 1
  };
  audioEnergies.mid = {
    curr: 0,
    min: 0,
    max: 1
  };
  audioEnergies.highMid = {
    curr: 0,
    min: 0,
    max: 1
  };
  audioEnergies.treble = {
    curr: 0,
    min: 0,
    max: 1
  };
}