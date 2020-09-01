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

  redrawBackground: true,
  hideUI: false
};


const particles = [];
const ui = [];


function setup() {

  createCanvas(windowWidth, windowHeight);
  textSize(18);
  background(config.backgroundColour);

  ui.push(new Slider('particleSpeed', -15, 15, 0.1));
  ui.push(new Slider('particleCount', 0, 1000));
  ui.push(new Slider('connectionDistance', 0, 300));
  ui.push(new Slider('connectionStroke', 0, 255));
  ui.push(new Slider('connectionHue', 0, 360));
  ui.push(new Slider('particleHue', 0, 360));
  ui.push(new Checkbox('redrawBackground'));
  ui.push(new Checkbox('showParticles'));
  ui.push(new Checkbox('animateConnectionHue'));

  colorMode(HSB);
  fill(config.particleHue, 100, 100);
  for (let i = 0; i < width * config.particleCount; i++) {
    particles.push(new Particle());
  }

}

let t = 0;

function draw() {

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


const animateConfigValue = (valueName, min, max, speed) => {
  setConfigValue(valueName, map(sin(speed * t), -1, 1, min, max) );
}