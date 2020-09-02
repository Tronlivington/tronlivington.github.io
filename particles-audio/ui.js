// ----------------------- UI Element Classes -----------------------
class UiElement {
  constructor(variableName) {
    this.variableName = variableName;
    this.index = ui.length + 1;
  }

  hide() {
    this.element.hide();
  }

  show() {
    this.element.show();
  }

  drawCaption(caption) {
    noStroke();
    fill(config.uiColour);
    text(caption, this.captionPosition.x, this.captionPosition.y);
  }
}


class Slider extends UiElement {
  constructor(variableName, minVal, maxVal, step = 1) {
    super(variableName);
    this.element = createSlider(minVal, maxVal, config[variableName], step);
    this.element.position(20, 20 * this.index);
    this.captionPosition = createVector(this.element.x * 2 + this.element.width, this.element.y + 15);
  }

  update() {
    config[this.variableName] = this.element.value();
  }

  draw() {
    this.drawCaption(`${this.variableName}: ${this.element.value()}`);
  }

  setValue(value) {
    this.element.value(value);
  }
}


class Checkbox extends UiElement {
  constructor(variableName) {
    super(variableName);
    this.element = createCheckbox('', config[variableName]);
    this.element.position(130, 20 * this.index);
    this.captionPosition = createVector(this.element.x + 40, this.element.y + 15);
  }

  invertCheck() {
    this.element.checked(false);
  }

  update() {
    config[this.variableName] = this.element.checked();
  }

  draw() {
    this.drawCaption(`${this.variableName}`);
  }

  setValue(value) {
    this.element.checked(value);
  }
}


class ColourPicker extends UiElement {
  constructor(variableName) {
    super(variableName);
    // noStroke();
    this.element = createColorPicker(config[variableName]);
    this.element.input( () => config[this.variableName] = this.element.color() );
    this.element.position(100, 20 * this.index);
    this.captionPosition = createVector(this.element.x + 70, this.element.y + 15);
  }

  update() {
    // config[this.variableName] = this.element.color();
  }

  draw() {
    this.drawCaption(`${this.variableName}`);
  }

  setValue(value) {
    this.element.color(color(value));
  }
}


// ----------------------- Key Bindings -----------------------
function keyPressed() {
  if (!audioRunning) {
    userStartAudio();
    audioRunning = true;
  }

  switch (keyCode) {
    case 90: // Hide UI on z
      config.hideUI = !config.hideUI;
      if (config.hideUI) {
        ui.forEach( elem => elem.hide() );
      } else {
        ui.forEach( elem => elem.show() );
      }
      break;

    case 88: // Toggle background redraw on x
      setConfigValue('redrawBackground', !config.redrawBackground);
      break;
    
    case 67: // Set random particle colour on c
      setConfigValue('particleHue', 360*random());
      break;

    case 86: // Toggle show particles on v
      toggleConfigValue('showParticles');
      break;

    case 66: // b
      break;

    case 32: // Toggle audio visualiser on Space
      toggleConfigValue('reactToAudio');
      break;

    case 70: // Fullscreen on f
      fullscreen(!fullscreen());
      break;

    case 82: // Reset audio levels on R
      initialiseAudioEnergies();
      break;

    case 191: // Show controls on ?
      alert(`
      1-9       Apply a preset
      Scroll   Change particle speed
      F          Toggle fullscreen
      R          Reset audio levels
      Z          Toggle UI
      X          Toggle background redraw
      C          Set a random particle colour
      Space          Toggle react to audio
      `);
  }

  // Apply Presets on number row
  if  (48 < keyCode && keyCode < 60 ) {
    let presetNumber = keyCode - 49;
    applyPreset(presetNumber);
  }
}

// Set speed with mouse wheel
function mouseWheel(event) {
  setConfigValue('particleCount', config.particleCount - event.delta/50);
}


// ----------------------- Helper Functions -----------------------
const applyPreset = (index) => {
  let preset = presets[index];
  if (!preset) { return; }
  for (let variableName in preset) {
    let value = preset[variableName];
    setConfigValue(variableName, value);
  }
}

const setConfigValue = (variableName, value) => {
  let uiElement = ui.filter( elem => elem.variableName == variableName );
  if (uiElement.length > 0) {
    uiElement.forEach( elem => elem.setValue(value) );
  } else {
    config[variableName] = value;
  }
}

const toggleConfigValue = (variableName) => {
  setConfigValue(variableName, !config[variableName]);
}


let frames = [];
const displayFPS = (colour) => {
  frames[frameCount % 60] = frameRate();
  let fps = frames.reduce( (a, b) => (a || 0) + (b || 0), 0 ) / frames.length;
  fill(colour);
  text(floor(fps), width - 30, 30);
}