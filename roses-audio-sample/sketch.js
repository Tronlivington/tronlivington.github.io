const config = {
  backgroundColour: "#0f0f0f",
  redrawBackground: true,
  uiColour: "rgba(0, 100, 220, 1.0)",
  hideUI: true,

  numericVariable: 50,
  booleanVariable: false,

  reactToAudio: true,

  n: 10,
  d: 49,
  yRotation: 0,
  scale: 200,

  showRose: false,
  showMaurerRose: true,
  zScale: 1,
  rotate: false,
  popOut: false,
  fill: true,
  triangleStrip: true,

  oscillateN: false,
  oscillateD: false,
};

const ui = [];
let font;
let audioAnimator;
let audioRunning = false;
let song;

function preload() {
  font = loadFont('Roboto-Regular.ttf');
  song = loadSound('nc17.mp3');
}

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight, WEBGL);
  textSize(18);
  textFont(font);
  background(config.backgroundColour);

  ui.push(new Slider("n", 1, 60, 1));
  ui.push(new Slider("d", 1, 360, 1));
  ui.push(new Slider("zScale", 0, 1, 0.01));
  ui.push(new Checkbox("showRose"));
  ui.push(new Checkbox("showMaurerRose"));
  ui.push(new Checkbox("rotate"));
  ui.push(new Checkbox("popOut"));
  ui.push(new Checkbox("fill"));
  ui.push(new Checkbox("triangleStrip"));
  ui.push(new Checkbox("oscillateN"));
  ui.push(new Checkbox("oscillateD"));
  ui.push(new Checkbox("reactToAudio"));

  if (config.hideUI) {
    ui.forEach((elem) => elem.hide());
  }

  audioAnimator = new AudioAnimator(0.2);
  audioAnimator.addProp("n", "highMid", 1, 50, 8);
  audioAnimator.addProp("d", "lowMid", 20, 359, 15);
  audioAnimator.addProp("scale", "treble", 150, 250);

}

let points = 10000;


function draw() {
  // orbitControl();

  if (config.redrawBackground) {
    if (width != windowWidth || height != windowHeight) {
      resizeCanvas(windowWidth, windowHeight);
    }
    background(config.backgroundColour);
  }

  ui.forEach((elem) => elem.update());

  if (!config.hideUI) {
    ui.forEach((elem) => elem.draw());
  }

  if (config.oscillateN) {
    oscillate("n", 1, 30, 0.0005);
  }
  if (config.oscillateD) {
    oscillate("d", 0, 360, 0.00005);
  }

  if (config.reactToAudio) {
    audioAnimator.update();
  }

  // Remove any deadzones from d
  if (config.d % 90 === 0) {
    config.d += 1;
  }
  // CONTENTS
  // translate(width / 2, height / 2);
  angleMode(DEGREES);
  noFill();


  if (config.rotate) {
    config.yRotation += 0.5;
  }
  // rotateX(45);
  rotateY(config.yRotation);
  // rotateZ(offset);

  if (config.popOut) {
    translate(0, 0, config.scale/2);
  }

  // Maurer Rose
  if (config.showMaurerRose) {

    // stroke(0);
    stroke(255);
    strokeWeight(1);
    // strokeWeight(3);

    if (config.fill) {
      fill(0);
      // fill(100);
      // fill(250);
    } else {
      noFill();
    }

    if (config.triangleStrip) {
      // beginShape(TRIANGLE_FAN);
      beginShape(TRIANGLE_STRIP);
    } else {
      beginShape();
    }
    for (let i = 0; i < 361; i++) {
      let k = i * config.d;
      let r = config.scale * sin(config.n * k);
      let angle = k;
      let { x, y } = p2c(r, angle);
      let z = config.zScale;
      if (config.popOut) {
        z *= (1 - Math.abs(r));
      } else {
        z *= r;
      }
      vertex(x, y, z);
    }
    endShape();
  }

  // Rose
  if (config.showRose) {
    stroke(255, 0, 0, 255);
    noFill();
    strokeWeight(3);
    beginShape();
    for (let i = 0; i < 361; i++) {
      let k = i;
      let r = config.scale * sin(config.n * k);
      let angle = k;
      let { x, y } = p2c(r, angle);
      let z = config.zScale;
      if (config.popOut) {
        z *= (1 - Math.abs(r));
      } else {
        z *= r;
      }
      vertex(x, y, z);
    }
    endShape();
  }
}

const p2c = (r, angle) => ({
  x: r * cos(angle),
  y: r * sin(angle),
});


const oscillate = (prop, min, max, speed) => {
  setConfigValue(prop, map(Math.sin(speed * frameCount), -1, 1, min, max));
}

function mousePressed() {
  if (!song.isPlaying()) {
    song.play()
  }
}