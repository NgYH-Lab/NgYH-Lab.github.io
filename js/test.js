//ref https://openprocessing.org/sketch/974696

let video;
let poseNet;
let pose;
let h;
let l;
let img;

function preload() {
  img = loadImage("nosepen.png");
}

function setup() {
  let theCanvas = createCanvas(640, 480);
  video = createCapture(VIDEO);

  theCanvas.parent("p5-container");
  video.parent("p5-container");

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
  colorMode(HSL);
  angleMode(DEGREES);
  noStroke();
  let saveButton = createButton("Save");
  saveButton.size(100, 20);
  saveButton.position(0, 0);
  saveButton.mousePressed(saveImage);

  let clearButton = createButton("Clear");
  clearButton.size(100, 20);
  clearButton.position(0, 30);
  clearButton.mousePressed(clearCanvas);
  image(img, 0, 0);
  h = floor(random(361));
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log("poseNet ready!");
  clear();
}

function draw() {
  translate(video.width, 0);
  scale(-1, 1);

  // fake the nose angle by getting the angle between the eyes. it's shaky though
  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    let ang = atan2(eyeR.x - eyeL.x, eyeR.y - eyeL.y);
    ang = floor(ang);

    l = map(d, 40, 200, 0, 100);

    if (h >= 360) {
      h = 0;
    } else {
      h += frameCount % 2;
    }

    if (pose.rightWrist.y <= height) {
      noErase();
      noFill();
    } else if (pose.leftWrist.y <= height) {
      erase();
    } else {
      noErase();
      fill(h, 80, l, 10);
    }

    push();
    translate(pose.nose.x, pose.nose.y);
    rotate(ang * -1);
    ellipse(d / 4, -d / 5, d / 3);
    ellipse(d / 4, d / 5, d / 3);
    pop();
  }
}

function saveImage() {
  save(
    "img_" +
      month() +
      "-" +
      day() +
      "_" +
      hour() +
      "-" +
      minute() +
      "-" +
      second() +
      ".jpg"
  );
}

function clearCanvas() {
  clear();
}

let sketch = function (p) {
  p.setup = function () {
    let paletteCanvas = p.createCanvas(100, 100);
    paletteCanvas.parent("instructions");
    p.colorMode(p.HSL);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(h, 80, 50);
    p.text("Current\nHue", p.width / 2, p.height / 2);
  };
};
new p5(sketch);
