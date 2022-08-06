class AudioAnimator {
  constructor(propsObj) {
    this.mic = new p5.AudioIn();
    this.mic.start();
    this.fft = new p5.FFT();
    this.fft.setInput(this.mic);
    this.resetEnergies();
    this.propsObj = propsObj;
    this.animConfig = {};
  }

  resetEnergies() {
    this.energies.bass = {
      curr: 0,
      min: 0,
      max: 1,
    };
    this.energies.lowMid = {
      curr: 0,
      min: 0,
      max: 1,
    };
    this.energies.mid = {
      curr: 0,
      min: 0,
      max: 1,
    };
    this.energies.highMid = {
      curr: 0,
      min: 0,
      max: 1,
    };
    this.energies.treble = {
      curr: 0,
      min: 0,
      max: 1,
    };
  }

  getEnergies() {
    this.fft.analyze();
    for (let range in this.energies) {
      let vals = this.energies[range];
      vals.curr = this.fft.getEnergy(range);
      if (vals.curr > vals.max) { vals.max = vals.curr; }
      if (vals.curr < vals.min) { vals.min = vals.curr; }
    }
  }

  animate() {
    for (let prop in this.animConfig) {
      let propConfig = this.animConfig[prop];
      let vals = this.energies[propConfig.freq];
      let propVal = map(vals.curr, vals.min, vals.max, propConfig.min, propConfig.max);
      setConfigValue(prop, propVal);  // TODO: Rework config/props/ui to encapsulate this function
    }
  }

  update() {
    this.getEnergies();
    this.animate();
  }

  addProp(propertyName, frequencyRange, minValue, maxValue) {
    this.animConfig[propertyName] = {
      "freq": frequencyRange,
      "min": minValue,
      "max": maxValue
    };
  }

}



let animConfig = {
  "propertyName": {
    "freq": "bass",
    "min": 0,
    "max": 100
  }
}