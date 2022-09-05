let canvas = document.getElementById("hotdog");
let ctx = canvas.getContext("2d");
let resources = {
    "dogs": 0,
    "onions": 0
};

images = {};
imageData = [
  {
    name: "hotdog",
    src: "img/hotdog.webp"
  },
  {
    name: "onion",
    src: "img/onion.png"
  }
]
resourceLocations = {
  "onions": []
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
    for (let i = 0; i < resourceLocations.onions.length; i++) {
      ctx.fill = "rbg(255, 155, 155)";
      let x = Math.floor(resourceLocations.onions[i].x);
      let y = Math.floor(resourceLocations.onions[i].y);
      let r = Math.floor(resourceLocations.onions[i].r);
      let w = 100;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(r*Math.PI/180);
      ctx.translate(-x, -y);
      ctx.drawImage(images["onion"], x, y, 50, 50);
      ctx.restore();
    }
    requestAnimationFrame(draw);
}

function updateResouces() {
    if (parseInt(document.getElementById("onions-score").innerHTML) > resources.onions) {
      console.log("adding onion location");
      resourceLocations.onions.push({ x: random(50, 200-75), y: random(50,400-75), r: random(0, 360) });
      resources = {
          "dogs": parseInt(document.getElementById("total").innerHTML),
          "onions": parseInt(document.getElementById("onions-score").innerHTML)
      }
    }
}

// random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}