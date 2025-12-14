class AudioAnimator {
  decayRate = 0.001;

  constructor(fftSmoothing) {
    this.mic = new p5.AudioIn();
    this.mic.start();
    this.fft = new p5.FFT(fftSmoothing || 0.1);
    this.fft.setInput(this.mic);
    this.amplitude = new p5.Amplitude();
    this.amplitude.setInput(this.mic);

    this.energies = {};
    this.animConfig = {};

    this.resetEnergies();
  }

  resetEnergies() {
    this.energies.bass = {
      curr: 0,
      min: 255,
      max: 0,
    };
    this.energies.lowMid = {
      curr: 0,
      min: 255,
      max: 0,
    };
    this.energies.mid = {
      curr: 0,
      min: 255,
      max: 0,
    };
    this.energies.highMid = {
      curr: 0,
      min: 255,
      max: 0,
    };
    this.energies.treble = {
      curr: 0,
      min: 255,
      max: 0,
    };
    this.energies.amplitude = {
      curr: 0,
      min: 1,
      max: 0,
    };
    this.energies.centroid = {
      curr: 0,
      min: 22050,
      max: 0,
    };
  }

  decayEnergies(decayRate) {
    for (let range in this.energies) {
      let vals = this.energies[range];
      if (range === "amplitude") {
        vals.max = lerp(vals.max, 0, decayRate);
        vals.min = lerp(vals.min, 1, decayRate);
      } else if (range === "centroid") {
        vals.max = lerp(vals.max, 0, decayRate);
        vals.min = lerp(vals.min, 22050, decayRate);
      } else {
        vals.max = lerp(vals.max, 0, decayRate);
        vals.min = lerp(vals.min, 255, decayRate);
      }
    }
  }

  getEnergies() {
    this.fft.analyze();
    for (let range in this.energies) {
      let vals = this.energies[range];

      if (range === "amplitude") {
        vals.curr = this.amplitude.getLevel();
      } else if (range === "centroid") {
        vals.curr = this.fft.getCentroid();
      } else {
        vals.curr = this.fft.getEnergy(range);
      }

      if (vals.curr > vals.max) {
        vals.max = vals.curr;
      }
      if (vals.curr < vals.min) {
        vals.min = vals.curr;
      }
    }
  }

  animate() {
    for (let prop in this.animConfig) {
      let propConfig = this.animConfig[prop];
      let vals = this.energies[propConfig.freq];
      if (vals.min === vals.max) {
        continue; // Avoid division by zero
      }
      let propVal = map(
        vals.curr,
        vals.min,
        vals.max,
        propConfig.min,
        propConfig.max
      );
      // if (isNaN(propVal)) {
      //   console.warn(
      //     `AudioAnimator: propVal for ${prop} is NaN (vals:`,
      //     vals,
      //     ")"
      //   );
      //   continue;
      // }

      // const changeAmount = config[prop] - propVal;
      setConfigValue(prop, propVal);
    }
  }

  update() {
    this.decayEnergies(this.decayRate);
    this.getEnergies();
    this.animate();
  }

  addProp(propertyName, frequencyRange, minValue, maxValue) {
    this.animConfig[propertyName] = {
      freq: frequencyRange,
      min: minValue,
      max: maxValue,
    };
  }

  removeProp(propertyName) {
    delete this.animConfig[propertyName];
  }
}
