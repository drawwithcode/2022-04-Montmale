// Sketch linked to phone.html
let canvas;
let fingerBut, noseBut, phoneBut, clearBut, saveBut, eraseBut, musicBut;
let col, size, shape;
let colorSlider, sizeSlider, shapeSlider;
let playMusic;
let on = false; //the eraser is initially "off"

//coordinates of the shape
let x = 150;
let y = 150;
//initial speed
let velx = 0;
let vely = 0;

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

  h1 = createElement("h1", "Let's draw!");
  p = createP("rotate the phone");

  //mode buttons
  fingerBut = createButton("");
  fingerBut.addClass("but");
  fingerBut.id("fingerBut");
  fingerBut.touchStarted(touchOpen);

  noseBut = createButton("");
  noseBut.addClass("but");
  noseBut.id("noseBut");
  noseBut.touchStarted(noseOpen);

  phoneBut = createButton("");
  phoneBut.addClass("but");
  phoneBut.id("phoneBut");
  phoneBut.style("background-color", "rgb(245, 244, 176)"); //current page mode
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

  sizeSlider = createSlider(3, 27, 15, 3);
  sizeSlider.addClass("slider");
  sizeSlider.id("sizeSlider");

  shapeSlider = createSlider(3, 10, 5, 1);
  shapeSlider.addClass("slider");
  shapeSlider.id("shapeSlider");
}

function draw() {
  //the speed vector varies according to the rotation
  vely = constrain(rotationX, -1.5, 1.5);
  velx = constrain(rotationY, -1.5, 1.5);

  //add the speed to the current position of the shape
  x += velx;
  y += vely;

  // keep on screen
  if (x > width) {
    x = 0;
  } else if (x < 0) {
    x = width;
  }
  if (y > height) {
    y = 0;
  } else if (y < 0) {
    y = height;
  }

  //brush back
  fill(227);
  noStroke();
  square(0, 0, width / 4, 20);

  //brush writing
  fill(0, 0, 255);
  textSize(width / 30);
  textFont("Fredoka One");
  text("Your brush", 10, 20);

  //Sliders to choose the brush
  push();
  //color slider; use the HSB system
  colorMode(HSB);
  col = colorSlider.value();
  fill(col, 100, 100, 1);

  //size slider
  size = sizeSlider.value();

  //shape slider
  shape = shapeSlider.value();

  //the brush consists of a polygon with variable coordinates, radius and number of vertices > polygon(x, y, radius, npoints)
  polygon(40, 50, size, shape);

  polygon(x, y, size, shape);
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
      if (touchMoved) {
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

function touchStarted() {
  for (let i = 0; i < touches.length; i++) {
    if (on) {
      fill(255);
      polygon(touches[i].x, touches[i].y, size, shape);
    }
  }
}

function touchMoved() {
  for (let i = 0; i < touches.length; i++) {
    if (on) {
      fill(255);
      polygon(touches[i].x, touches[i].y, size, shape);
    }
  }
}

// ask for permissions on iOS
function touchEnded(event) {
  // check that those functions exist
  // if they exist it means we are
  // on iOS and we can request the permissions
  if (DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
    DeviceOrientationEvent.requestPermission();
  }
}

// do this prevent default touch interaction
function mousePressed() {
  return false;
}

document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});
