
const config = {

  backgroundColour: '#0f0f0f',
  redrawBackground: true,
  uiColour: 'rgba(0, 100, 220, 1.0)',
  hideUI: false,

  numericVariable: 50,
  booleanVariable: false,
  
  reactToAudio: false,

  n: 7,
  d: 49,

  showRose: false,
};

const ui = [];

function setup() {

  createCanvas(windowWidth, windowHeight);
  textSize(18);
  background(config.backgroundColour);


  ui.push(new Slider('n', 1, 30, 1));
  ui.push(new Slider('d', 1, 360, 1));
  ui.push(new Checkbox('showRose'));

  if (config.hideUI) {
    ui.forEach( elem => elem.hide() );
  }

}


let scale = 200;
let points = 10000;

function draw() {
  if (config.redrawBackground) {
    resizeCanvas(windowWidth, windowHeight);
    background(config.backgroundColour);
  }


  ui.forEach(elem => elem.update());

  if (!config.hideUI) {
    ui.forEach(elem => elem.draw());
  }

  // CONTENTS
  translate(width/2, height/2);
  angleMode(DEGREES);
  noFill();
  
  
  // Maurer Rose
  stroke(255);
  beginShape();
  for (let i = 0; i < 361; i++) {
    let k = i * config.d;
    let r = scale * sin(config.n * k);
    let angle = k;
    let {x, y} = p2c(r, angle);
    vertex(x, y);
  }
  endShape();

  // Rose
  if (config.showRose) {
    stroke(0, 255, 0, 255);
    let maxTheta = 180 * config.d;
    beginShape();
    for (let i = 0; i < points; i++) {
      let k = config.n / config.d;
      let theta = maxTheta * i / points;
      let r = scale * sin(config.n * theta);
      let {x, y} = p2c(r, theta);
      vertex(x, y);
    }
    endShape();
  }

}


const p2c = (r, angle) => ({
  x: r * cos(angle),
  y: r * sin(angle)
});