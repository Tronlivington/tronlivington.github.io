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
    this.captionPosition = createVector(
      this.element.x * 2 + this.element.width,
      this.element.y + 15
    );
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
    this.element = createCheckbox("", config[variableName]);
    this.element.position(130, 20 * this.index);
    this.captionPosition = createVector(
      this.element.x + 40,
      this.element.y + 15
    );
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
    this.element.input(
      () => (config[this.variableName] = this.element.color())
    );
    this.element.position(100, 20 * this.index);
    this.captionPosition = createVector(
      this.element.x + 70,
      this.element.y + 15
    );
  }

  update() {
    // config[this.variableName] = this.element.color();
  }

  draw() {
    this.drawCaption(`${this.variableName}`);
  }

  setValue(value) {
    this.element.color(color(value));
    console.log(this.element.color);
    console.log(this.element.color());
  }
}

// ----------------------- Key Bindings -----------------------
function keyPressed() {
  if (!audioRunning) {
    userStartAudio();
    audioRunning = true;
  }

  switch (keyCode) {
    case 90: // Z - Hide UI
      config.hideUI = !config.hideUI;
      if (config.hideUI) {
        ui.forEach((elem) => elem.hide());
      } else {
        ui.forEach((elem) => elem.show());
      }
      break;

    case 88: // X - Toggle background redraw
      setConfigValue("redrawBackground", !config.redrawBackground);
      break;

    case 67: // C
      break;

    case 86: // V
      break;

    case 66: // b
      break;

    case 82: // R - Reset scaling
      if (visualizer) {
        visualizer.resetScaling();
      }
      break;

    case 32: // Space - Toggle audio visualiser
      toggleConfigValue("reactToAudio");
      break;

    case 70: // F - Fullscreen
      fullscreen(!fullscreen());
      break;

    case 191: // ? - Show controls
      alert(`
      1-9       Apply a preset
      Scroll   ???
      F          Toggle fullscreen
      Z          Toggle UI
      X          Toggle background redraw
      R          Reset frequency scaling
      Space      Toggle Audio Visualiser
      `);
  }

  // Apply Presets on number row
  if (48 < keyCode && keyCode < 60) {
    let presetNumber = keyCode - 49;
    applyPreset(presetNumber);
  }
}

// Set speed with mouse wheel
function mouseWheel(event) {
  setConfigValue("numericValue", config.particleCount - event.delta / 50);
}

function mousePressed() {
  if (!audioRunning) {
    userStartAudio();
    audioRunning = true;
  }
}

// ----------------------- Helper Functions -----------------------
const applyPreset = (index) => {
  let preset = presets[index];
  if (!preset) {
    return;
  }
  for (let variableName in preset) {
    let value = preset[variableName];
    setConfigValue(variableName, value);
  }
};

const setConfigValue = (variableName, value) => {
  let uiElement = ui.filter((elem) => elem.variableName == variableName);
  if (uiElement.length > 0) {
    uiElement.forEach((elem) => elem.setValue(value));
  } else {
    config[variableName] = value;
  }
};

const toggleConfigValue = (variableName) => {
  setConfigValue(variableName, !config[variableName]);
};
