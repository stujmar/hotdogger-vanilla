let canvas = document.getElementById("hotdog");
let ctx = canvas.getContext("2d");
let resources = {
    "dogs": 0,
    "onions": 0,
    "pickles": 0,
    "tomatoes": 0
};

images = {};
imageData = [
  {
    name: "hotdog",
    src: "img/hotdog.webp"
  },
  {
    name: "onion",
    src: "img/onion.webp"
  },
  {
    name: "pickle",
    src: "img/pickle.webp"
  },
  {
    name: "tomatoe",
    src: "img/tomatoe.webp"
  }
]
resourceLocations = {
  "onions": [],
  "pickles": [],
  "tomatoes": []
}

init();
function init(){
    // load images
    for (let i = 0; i < imageData.length; i++) {
        let img = new Image();
        img.src = imageData[i].src;
        images[imageData[i].name] = img;
    }
    // start draw loop
    draw();
}

// Draw canvas height and width
canvas.width = 200;
canvas.height = 400;

// create a draw loop
function draw() {
    ctx.drawImage(images["hotdog"], 0, 0, 200, 400);
    updateResouces();
    drawResource("onion");
    drawResource("pickle");
    drawResource("tomatoe");
    requestAnimationFrame(draw);
}

function updateResouces() {
    if (parseInt(document.getElementById("onions-score").innerHTML) > resources.onions) {
      resourceLocations.onions.push({ x: random(55, 200-75), y: random(55,400-75), r: random(0, 360) });
      resources["onions"] = parseInt(document.getElementById("onions-score").innerHTML)
    }
    if (parseInt(document.getElementById("pickles-score").innerHTML) > resources.pickles) {
      resourceLocations.pickles.push({ x: random(55, 200-75), y: random(55,400-75), r: random(0, 360) });
      resources['pickles'] = parseInt(document.getElementById("pickles-score").innerHTML);
    }
    if (parseInt(document.getElementById("tomatoes-score").innerHTML) > resources.tomatoes) {
      resourceLocations.tomatoes.push({ x: random(55, 200-75), y: random(55,400-75), r: random(0, 360) });
      resources['tomatoes'] = parseInt(document.getElementById("tomatoes-score").innerHTML);
    }
}

// random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function drawResource(res) {
  let resourceLen = resourceLocations[res + "s"].length;
  for (let i = 0; i < resourceLen; i++) {
    let x = Math.floor(resourceLocations[res + "s"][i].x);
    let y = Math.floor(resourceLocations[res + "s"][i].y);
    let r = Math.floor(resourceLocations[res + "s"][i].r);
    let w = 100;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r*Math.PI/180);
    ctx.translate(-x, -y);
    ctx.drawImage(images[res], x, y, 50, 50);
    ctx.restore();
  }
}