const config = {};

let vertices;
let scale = 100;

function setup() {
  createCanvas(800, 800);
  vertices = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1,  -1],
    [-1,  1, -1],
    [-1,  1, 1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1,  1],
  ]
  // vertices = [
  //   createVector(-1, -1), createVector(1, -1),
  //   createVector(-1, 1),  createVector(1, 1)
  // ];
}

function draw() {
  let completion = frameCount / parseFloat(300);
  // completion = completion % 1;
  render(completion);
}

const render = (completion) => {

  background(50);
  translate(width/2, height/2);
  stroke(255);
  noFill();

  let rotated = vertices.map( v => rotateZ(v, completion * TWO_PI));
  beginShape();
  // for (let v of vertices) {
  for (let v of rotated) {
    vertex(v[0] * scale, v[1] * scale);
  }
  endShape();
}



// Matrix shit

const matMul = (mat1, mat2) => {
  let result = [];
  for (let r1 in mat1) {
    result.push([]);
    for (let c2 in mat2) {
      let val = 0;
      for (let c1 in mat1[r1]) {
        val += mat1[r1][c1] * mat2[c1][c2];
      }
      result[r1].push(val);
    }
  }
  return result;
}


const getRotationMatrix = (axis, theta) => {
  switch (axis) {
    case 'X':
      return [
        [1, 0, 0],
        [0, cos(theta), -sin(theta)],
        [0, sin(theta), cos(theta)]
      ];
    case 'Y':
      return [
        [cos(theta), 0, -sin(theta)],
        [0, 1, 0],
        [sin(theta), 0, cos(theta)]
      ];
    case 'Z':
      return [
        [cos(theta), -sin(theta), 0],
        [sin(theta), cos(theta), 0],
        [0, 0, 1]
      ];
  }
}

const rotateX = (vect, angle) => {
  let rotMat = getRotationMatrix('X', angle);
  return matMul(rotMat, vect);
}

const rotateY = (vect, angle) => {
  let rotMat = getRotationMatrix('Y', angle);
  return matMul(rotMat, vect);
}

const rotateZ = (vect, angle) => {
  let rotMat = getRotationMatrix('Z', angle);
  console.log(matMul(rotMat, v2m(vect)))
  noLoop();
  return matMul(rotMat, vect);
}

const v2m = (v) => {
  return [
    [v[0]],
    [v[1]],
    [v[2]],
  ]
}