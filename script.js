const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 650;
document.body.appendChild(canvas);

let perm = [];
while (perm.length < 255) {
  perm.push(Math.floor(Math.random() * 255));
}

const lerp = (a, b, t) => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2;
const noise = (x) => {
  x = (x * 0.02) % 255;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
};

const player = new (function () {
  this.reset = () => {
    this.x = canvas.width / 10;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.rSpeed = 0;
  };

  this.reset();
  this.img = new Image();
  this.img.src = "bike.png";
  this.draw = function () {
    const p1 = canvas.height - noise(t + this.x) * 0.26;
    const p2 = canvas.height - noise(t + 5 + this.x) * 0.26;

    let grounded = 0;

    if (p1 - 15 > this.y) this.ySpeed += 0.1;
    else {
      this.ySpeed -= this.y - (p1 - 15);
      this.y = p1 - 15;
      grounded = 1;
    }

    if (playing || (grounded && Math.abs(this.rot) > Math.PI * 0.5)) {
      playing = false;
      this.rSpeed = 0;
      k.ArrowUp = 0.2;
      this.x -= speed * 2;
    }

    const angle = Math.atan(p2 - 30 - this.y, 8);
    this.y += this.ySpeed;

    if (grounded && playing) {
      this.rot -= (this.rot - angle) * 0.2;
      this.rSpeed -= angle - this.rot;
    }
    this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;

    this.rot -= this.rSpeed * 0.1;
    if (this.rot > Math.PI) this.rot = -Math.PI;
    if (this.rot < -Math.PI) this.rot = Math.PI;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.drawImage(this.img, -15, -15, 30, 30);
    ctx.restore();
  };
})();

let t = 0;
let speed = 0;
let playing = true;
const k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
function loop() {
  if (player.x < 0) player.reset();
  speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
  t += 15 * speed;
  ctx.fillStyle = "#19f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  for (let i = 0; i < canvas.width; i++)
    ctx.lineTo(i, canvas.height - noise(t + i) * 0.25);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.fill();

  player.draw();
  requestAnimationFrame(loop);
}
onkeydown = (d) => (k[d.key] = 1);
onkeyup = (d) => (k[d.key] = 0);

loop();