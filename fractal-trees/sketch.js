
let minBranchLength = 3;

// let maxBranches = 1025;
let maxBranches = 513;

let branchAngleSlider, branchLengthRatioSlider;


const config = {
  backgroundColour: "#0f0f0f",
  redrawBackground: true,
  uiColour: "rgba(0, 100, 220, 1.0)",
  hideUI: true,

  numericVariable: 50,
  booleanVariable: false,

  reactToAudio: true,

  rotate: false,

  ranges: {
    bass: {
      low: 60,
      high: 200,
    },
    lowMid: {
      low: 0,
      high: 150
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

  initialBranchLength: 150,
  branchAngle: 1,
  branchLengthRatio: 0.67,
  treeCount: 4,
  hue: 0,
};


const ui = [];
let t = 0;
let audioRunning = false;
let audioEnergy = {};
let a = 0;

let rootStart, rootEnd;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  smooth(1);

  ui.push(new Slider("branchAngle", 0, PI, 0.01));
  ui.push(new Slider("branchLengthRatio", 0, 0.75, 0.01));
  ui.push(new Slider("treeCount", 1, 4, 1));
  ui.push(new Checkbox("reactToAudio"));
  ui.push(new Checkbox("rotate"));


  config.hideUI = true;
  if (config.hideUI) {
    ui.forEach((elem) => elem.hide());
  }

  rootStart = createVector(-config.initialBranchLength/2, 0);
  rootEnd = createVector(config.initialBranchLength/2, 0);

}


function draw() {

  resizeCanvas(windowWidth, windowHeight);
  background(config.backgroundColour);

  if (!config.hideUI) {
    ui.forEach((elem) => elem.draw());
  }

  translate(width/2, height/2);
  
  if (audioRunning && config.reactToAudio) {
    fft.analyze();
    audioEnergy = {
      bass: fft.getEnergy("bass"),
      lowMid: fft.getEnergy("lowMid"),
      mid: fft.getEnergy("mid"),
      highMid: fft.getEnergy("highMid"),
      treble: fft.getEnergy("treble")
    };

    animateAudio("branchAngle", "mid", PI, 0);
    animateAudio("branchLengthRatio", "bass", 0, 0.75);
    animateAudio("hue", "lowMid", 0, 255);

    a += map(audioEnergy.highMid, config.ranges.highMid.low, config.ranges.highMid.high, -0.01, 0.05);

    if (config.rotate) {
      rotate(a);
    }
  }

  if (config.animateConnectionHue) {
    animateOscillator("hue", 1, 360, 2);
  }
  t += 0.001;


  let tree = new Tree(rootStart, rootEnd, config.branchAngle, config.branchLengthRatio);

  stroke(config.hue, 255, 255, 1);
  tree.show();
  if (config.treeCount > 1) {
    rotate(PI);
    tree.show();
  }
  if (config.treeCount > 2) {
    rotate(HALF_PI);
    tree.show();
  }
  if (config.treeCount > 3) {
    rotate(PI);
    tree.show();
  }

  ui.forEach((elem) => elem.update());

}


const animateOscillator = (valueName, min, max, speed) => {
  setConfigValue(valueName, map(Math.sin(speed * t), -1, 1, min, max));
};

const animateAudio = (configPropertyName, audioEnergyName, min, max) => {
  setConfigValue(
    configPropertyName,
    map(audioEnergy[audioEnergyName], config.ranges[audioEnergyName].low, config.ranges[audioEnergyName].high, min, max)
  );
}