const config = {
  backgroundColour: "#0f0f0f",
  redrawBackground: true,
  uiColour: "rgba(0, 100, 220, 1.0)",
  hideUI: false,

  numericVariable: 50,
  booleanVariable: false,

  reactToAudio: false,

  n: 10,
  d: 49,

  showRose: false,
  showMaurerRose: true,
  zScale: 1,
  rotate: true,
  popOut: false,
  fill: true,
  triangleStrip: true,

  oscillateN: false,
  oscillateD: false,
};

const ui = [];
let font;

function preload() {
  font = loadFont('Roboto-Regular.ttf');
}

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight, WEBGL);
  textSize(18);
  textFont(font);
  background(config.backgroundColour);

  ui.push(new Slider("n", 1, 30, 1));
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

  if (config.hideUI) {
    ui.forEach((elem) => elem.hide());
  }

}

let scale = 200;
let points = 10000;


let offset = 0;
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
    oscillate("n", 1, 30, 0.002);
  }
  if (config.oscillateD) {
    oscillate("d", 0, 360, 0.00005);
  }

  // CONTENTS
  // translate(width / 2, height / 2);
  angleMode(DEGREES);
  noFill();


  if (config.rotate) {
    offset += 0.5;
  }
  // rotateX(45);
  rotateY(offset);
  // rotateZ(offset);

  if (config.popOut) {
    translate(0, 0, scale/2);
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
      let r = scale * sin(config.n * k);
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
      let r = scale * sin(config.n * k);
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