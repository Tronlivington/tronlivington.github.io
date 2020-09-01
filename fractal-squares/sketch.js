// Song: Legacy by Ezgod

const config = {
  backgroundColour: "#0f0f0f",
  redrawBackground: true,
  uiColour: "rgba(0, 100, 220, 1.0)",
  hideUI: true,

  numericVariable: 50,
  booleanVariable: false,

  reactToAudio: true,

  ranges: {
    bass: {
      low: 60,
      high: 200,
    },
    mid: {
      low: 0,
      high: 140
    },
    highMid: {
      low: 0,
      high: 110
    }
  },

  startingSize: 100,
  minSize: 8,
  sizeRatio: 0.5,
  offset: 20,
};

const ui = [];
let t = 0;
let audioRunning = false;
let audioEnergy = {};
let a = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(18);
  background(config.backgroundColour);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  smooth(1);

  ui.push(new Slider("startingSize", 0, 600, 1));
  ui.push(new Slider("sizeRatio", 0, 0.5, 0.01));
  ui.push(new Slider("offset", 0, 100, 1));
  ui.push(new Checkbox("booleanVariable"));

  config.hideUI = true;
  if (config.hideUI) {
    ui.forEach((elem) => elem.hide());
  }
}

function draw() {
  if (config.redrawBackground) {
    resizeCanvas(windowWidth, windowHeight);
    background(config.backgroundColour);
  }

  if (!config.hideUI) {
    ui.forEach((elem) => elem.draw());
  }

  translate(width / 2, height / 2);


  if (audioRunning && config.reactToAudio) {
    fft.analyze();
    audioEnergy = {
      bass: fft.getEnergy("bass"),
      lowMid: fft.getEnergy("lowMid"),
      mid: fft.getEnergy("mid"),
      highMid: fft.getEnergy("highMid"),
      treble: fft.getEnergy("treble")
    };

    animateAudio("startingSize", "mid", 0, 500);
    animateAudio("sizeRatio", "bass", 0, 0.5);
    a += map(audioEnergy.highMid, config.ranges.highMid.low, config.ranges.highMid.high, -0.01, 0.05);
    // a += 0.1;
    rotate(a);

  }

  if (config.animateConnectionHue) {
    animateOscillator("numericVariable", 1, 360, 2);
  }
  t += 0.001;



  // CONTENTS

  rectMode(CENTER);
  // translate(width / 2, height / 2);


  makeSquare(config.startingSize);

  // END CONTENTS


  ui.forEach((elem) => elem.update());
}


const animateOscillator = (valueName, min, max, speed) => {
  setConfigValue(valueName, map(sin(speed * t), -1, 1, min, max));
};


const animateAudio = (configPropertyName, audioEnergyName, min, max) => {
  setConfigValue(
    configPropertyName,
    map(audioEnergy[audioEnergyName], config.ranges[audioEnergyName].low, config.ranges[audioEnergyName].high, min, max)
  );
}


const makeSquare = (size) => {
  stroke(0);
  colorMode(HSB);
  let hue = map(size, config.minSize, config.startingSize, 0, 255);
  fill(hue, 255, 255, 1);
  let newSize = size * config.sizeRatio;
  if (newSize > config.minSize) {
    push();
    translate(-size / 2 - config.offset, -size / 2 - config.offset);
    makeSquare(newSize);
    pop();
    push();
    translate(size / 2 + config.offset, -size / 2 - config.offset);
    makeSquare(newSize);
    pop();
    push();
    translate(size / 2 + config.offset, size / 2 + config.offset);
    makeSquare(newSize);
    pop();
    push();
    translate(-size / 2 - config.offset, size / 2 + config.offset);
    makeSquare(newSize);
    pop();
  }
  // ellipse(0, 0, size, size)
  rect(0, 0, size, size);
};