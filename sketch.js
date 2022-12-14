// Sketch linked to sketch.html
let canvas;
let fingerBut, noseBut, phoneBut, clearBut, saveBut, eraseBut, musicBut;
let col, size, shape;
let colorSlider, sizeSlider, shapeSlider;
let playMusic;
let on = false; //the eraser is initially "off"

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
  background(255);

  //title & subtitle
  h1 = createElement("h1", "Let's draw!");
  p = createP("Tap the screen");

  //mode buttons
  fingerBut = createButton("");
  fingerBut.addClass("but");
  fingerBut.id("fingerBut");
  fingerBut.style("background-color", "rgb(245, 244, 176)"); //current page mode
  fingerBut.touchStarted(touchOpen);

  noseBut = createButton("");
  noseBut.addClass("but");
  noseBut.id("noseBut");
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

  sizeSlider = createSlider(3, 27, 15, 3);
  sizeSlider.addClass("slider");
  sizeSlider.id("sizeSlider");

  shapeSlider = createSlider(3, 10, 5, 1);
  shapeSlider.addClass("slider");
  shapeSlider.id("shapeSlider");
}

function draw() {
  //brush back
  fill(227);
  noStroke();
  square(0, 0, width / 4, 15);

  //brush writing
  fill("blue");
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

  //reference brush
  //it consists of a polygon with variable coordinates, radius and number of vertices > polygon(x, y, radius, npoints)
  polygon(40, 50, size, shape);
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
  // Open in the same window the following url
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
      //erase
      fill(255);
      //the polygon is located in the touch coordinates, its size and shape are defined by the sliders
      polygon(touches[i].x, touches[i].y, size, shape);
    } else {
      //draw by creating polygons
      push();
      colorMode(HSB);
      fill(col, 100, 100, 1);
      //the color is defined by the slider
      polygon(touches[i].x, touches[i].y, size, shape);
      pop();
    }
  }
}

function touchMoved() {
  for (let i = 0; i < touches.length; i++) {
    if (on) {
      fill(255);
      polygon(touches[i].x, touches[i].y, size, shape);
    } else {
      push();
      colorMode(HSB);
      fill(col, 100, 100, 1);
      polygon(touches[i].x, touches[i].y, size, shape);
      pop();
    }
  }
}

// do this prevent default touch interaction
function mousePressed() {
  return false;
}

document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});
