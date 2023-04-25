class Branch {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.dir = p5.Vector.sub(end, start);
  }
  
  show() {
    // stroke(255);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }

  growBranch(angle, branchLengthRatio) {
    let branchVector = this.dir.copy().rotate(angle).mult(branchLengthRatio);
    let newEnd = branchVector.add(this.end);
    let newBranch = new Branch(this.end, newEnd);
    return newBranch;
  }
}


class Tree {
  branches = [];

  constructor(rootStart, rootEnd, branchAngle, branchLengthRatio) {
    this.root = new Branch(rootStart, rootEnd);
    this.branches = [this.root];
    for (var i = 0; i < maxBranches; i++) {
      if (this.branches[i] === undefined) {
        continue;
      }
      
      let randomisedBranchAngle = branchAngle + ((Math.random() - 0.5) * config.angleDivergence);
      let randomisedBranchLength = branchLengthRatio + ((Math.random() - 0.5) * config.lengthDivergence);

      if (Math.random() < config.spawnChance) {
        this.branches.push(this.branches[i].growBranch(randomisedBranchAngle, randomisedBranchLength));
      }
      if (Math.random() < config.spawnChance) {
        this.branches.push(this.branches[i].growBranch(-randomisedBranchAngle, randomisedBranchLength));
      }
    }
  }

  show() {
    for (let branch of this.branches) {
      branch.show();
    }
  }
}