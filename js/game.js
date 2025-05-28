const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Imagens
const bg = new Image();
bg.src = 'img/background.png';

const vader = new Image();
vader.src = 'img/vader.png';

const pipeImg = new Image();
pipeImg.src = 'img/pipe.png';

// Variáveis
const bird = {
  x: 50,
  y: 150,
  width: 50,
  height: 50,
  gravity: 0.5,
  lift: -9,
  velocity: 0,
};

const pipeWidth = 60;
const gap = 160;
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function reset() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  somMarcha.currentTime = 0;
  somMarcha.play();
  loop();
}

function drawBird() {
  ctx.drawImage(vader, bird.x - bird.width / 2, bird.y - bird.height / 2, bird.width, bird.height);
}

function drawPipe(pipe) {
  ctx.drawImage(pipeImg, pipe.x, pipe.top - pipeImg.height, pipeWidth, pipeImg.height);
  ctx.drawImage(pipeImg, pipe.x, pipe.top + gap, pipeWidth, pipeImg.height);
}

function drawScore() {
  ctx.fillStyle = '#FF0000';
  ctx.font = 'bold 32px Arial';
  ctx.fillText(`Pontos: ${score}`, 10, 50);
}

function drawExplosion() {
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, 30 + Math.random() * 10, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.fill();
}

function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height / 2 >= canvas.height) {
    bird.y = canvas.height - bird.height / 2;
    triggerGameOver();
  }

  if (bird.y - bird.height / 2 <= 0) {
    bird.y = bird.height / 2;
    bird.velocity = 0;
  }

  if (frame % 100 === 0) {
    const top = Math.random() * (canvas.height / 2) + 50;
    pipes.push({ x: canvas.width, top: top, passed: false });
  }

  pipes.forEach((pipe) => {
    pipe.x -= 2;

    if (
      bird.x + bird.width / 2 > pipe.x &&
      bird.x - bird.width / 2 < pipe.x + pipeWidth &&
      (bird.y - bird.height / 2 < pipe.top ||
        bird.y + bird.height / 2 > pipe.top + gap)
    ) {
      triggerGameOver();
    }

    if (!pipe.passed && pipe.x + pipeWidth < bird.x - bird.width / 2) {
      score++;
      pipe.passed = true;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
  frame++;
}

function triggerGameOver() {
  if (!gameOver) {
    gameOver = true;
    somMarcha.pause();
    somExplosao.play();
    somObiWan.play();
  }
}

function draw() {
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  drawBird();
  pipes.forEach(drawPipe);
  drawScore();
}

function loop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(loop);
  } else {
    draw();
    drawExplosion();
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 42px Arial';
    ctx.fillText('ACABOU, ANAKIN!', 30, 250);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Pontos: ${score}`, 150, 310);
    ctx.fillText('Pressione ESPAÇO para reiniciar', 40, 360);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (gameOver) {
      reset();
    } else {
      bird.velocity = bird.lift;
      somPulo.currentTime = 0;
      somPulo.play();
    }
  }
});

somMarcha.play();
loop();
