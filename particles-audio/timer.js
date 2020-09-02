class Timer {
  from = null;
  hist = [];
  count = 0;

  constructor() {
  }

  start() {
    this.from = millis();
  }

  stop() {
    let elapsed = millis() - this.from;
    this.hist[this.count++ % 500] = elapsed;
  }

  avg() {
    let average = this.hist.reduce( (a, b) => (a || 0) + (b || 0), 0 ) / this.hist.length;
    return Math.round(1000 * average);
  }
}