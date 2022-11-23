// Sketch linked to nose.html
let canvas;
let fingerBut, noseBut, phoneBut, clearBut, saveBut, eraseBut, musicBut;
let col, size, shape;
let colorSlider, sizeSlider, shapeSlider;
let playMusic;
let on = false; //the eraser is initially "off"
let video;
let poseNet;
let pose;

function preload() {
  eraseImg = loadImage("./assets/erase.png");
  clearImg = loadImage("./assets/clear.png");
  saveImg = loadImage("./assets/save.png");
  music = loadSound("./assets/music!.mp3");
  musicImage = loadImage("./assets/music.png");
  musicPlayImage = loadImage("./assets/music.jpeg");
}

function setup() {
  canvas = createCanvas(windowWidth * 0.95, windowHeight / 1.7);
  background("white");

  //create a HTML5 <video> element that contains the video feed from a webcam
  video = createCapture(VIDEO);
  //hides the video
  video.hide();

  //create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  //call the function gotPoses()
  poseNet.on("pose", gotPoses);
  //flip the video horizontally for ease of movement
  poseNet.flipHorizontal = 1;

  h1 = createElement("h1", "Let's draw!");
  p = createP("Move your nose");

  //mode buttons
  fingerBut = createButton("");
  fingerBut.addClass("but");
  fingerBut.id("fingerBut");
  fingerBut.touchStarted(touchOpen);

  noseBut = createButton("");
  noseBut.addClass("but");
  noseBut.id("noseBut");
  noseBut.style("background-color", "rgb(245, 244, 176)"); //current page mode
  noseBut.touchStarted(noseOpen);

  phoneBut = createButton("");
  phoneBut.addClass("but");
  phoneBut.id("phoneBut");
  phoneBut.touchStarted(phoneOpen);

  //other buttons
  musicBut = createButton("");
  musicBut.addClass("but");
  musicBut.id("musicBut");
  musicBut.touchStarted(sound);

  saveBut = createButton("");
  saveBut.addClass("but");
  saveBut.id("saveBut");
  saveBut.touchStarted(saveCv);

  eraseBut = createButton("");
  eraseBut.addClass("but");
  eraseBut.id("eraseBut");
  eraseBut.touchStarted(rubber);

  clearBut = createButton("");
  clearBut.addClass("but");
  clearBut.id("clearBut");
  clearBut.touchStarted(clearCanvas);

  //create divisors
  colorDiv = createDiv("Color");
  colorDiv.addClass("back");
  colorDiv.id("color");

  sizeDiv = createDiv("Size");
  sizeDiv.addClass("back");
  sizeDiv.id("size");

  shapeDiv = createDiv("Shape");
  shapeDiv.addClass("back");
  shapeDiv.id("shape");

  // createSlider(min, max, [value], [step])
  colorSlider = createSlider(0, 360, 30, 30);
  colorSlider.addClass("slider");
  colorSlider.id("colorSlider");

  sizeSlider = createSlider(0.1, 0.7, 0.3, 0.1);
  sizeSlider.addClass("slider");
  sizeSlider.id("sizeSlider");

  shapeSlider = createSlider(3, 10, 5, 1);
  shapeSlider.addClass("slider");
  shapeSlider.id("shapeSlider");
}

function modelReady() {
  console.log("poseNet ready");
}

//take the position of the nose from time to time
function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function draw() {
  //brush back
  fill(227);
  noStroke();
  square(0, 0, width / 4, 20);

  //brush writing
  fill("blue");
  textSize(width / 30);
  textFont("Fredoka One");
  text("Your brush", 10, 20);

  //Sliders to choose the brush
  push();
  //color slider
  colorMode(HSB);
  col = colorSlider.value();
  fill(col, 100, 100, 1);

  //size slider; use the HSB system
  size = sizeSlider.value();

  //shape slider
  shape = shapeSlider.value();

  image(video, width - 120, 0, video.width / 5, video.height / 5);

  if (pose) {
    //get the co-ordinated of right and left eye
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    //calculate the distance between the eyes (if the person moves away, the nose is smaller)
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    if (on) {
      fill(255);
      polygon(pose.nose.x, pose.nose.y, d * size * 0.2, shape);
    } else {
      fill(col, 100, 100, 1);
      //the brush consists of a polygon with variable coordinates, radius and number of vertices > polygon(x, y, radius, npoints)
      //the coordinates are those of the detected nose, the size depends on slider and the distance, the shape depends on slider
      polygon(pose.nose.x, pose.nose.y, d * size * 0.2, shape);
    }
    //reference brush
    polygon(40, 50, d * size * 0.2, shape);
  }
  pop();

  //music
  if (playMusic) {
    for (let loop = 0; loop < 100; loop++) {
      musicX = int(random(-10, windowWidth * 0.95)); //x position
      musicY = int(random(-10, windowHeight / 1.7)); //y position
      musicH = int(random(10, 150)); //size
      //create an image of random position and size
      image(musicPlayImage, musicX, musicY, musicH * 1.1, musicH);
      fill(251, 197, 255);
      stroke(0, 0, 255);
      strokeWeight(1.5);
      textSize(20);
      text("press music button again to stop", 10, height - 50);
      textSize(16);
      text("or keep drawing XD", 10, height - 25);
      if (gotPoses) {
        loop = 100;
      }
    }
  }
}

function touchOpen() {
  // Open in the same window the following url:
  window.open("./sketch.html", "_self");
}

function noseOpen() {
  window.open("./nose.html", "_self");
}

function phoneOpen() {
  window.open("./phone.html", "_self");
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

//when the button is pressed, toggles between starting and stopping the music
function sound() {
  if (playMusic) {
    music.pause();
    playMusic = false;
  } else {
    music.loop();
    playMusic = true;
  }
}

//clear the canvas through a white background
function clearCanvas() {
  background(255);
}

//save the current canvas as an image > saveCanvas([filename], [extension])
function saveCv() {
  saveCanvas("myCanvas", "jpg");
}

//toggles the boolean value (from true to false and vice versa)
function rubber() {
  on = !on;
  if (on) {
    //put a blue background on the button when using the eraser (rubber = true)
    eraseBut.style("background-color", "rgb(0,0,255)");
  } else {
    eraseBut.style("background-color", "rgb(245, 244, 176)");
  }
}
