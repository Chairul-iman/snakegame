document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const startButton = document.getElementById('startButton');
  const backgroundColorInput = document.getElementById('backgroundColor');
  const scale = Math.min(window.innerWidth, window.innerHeight) * 0.8 / 20; 
  canvas.width = canvas.height = scale * 20; 
  const rows = canvas.height / scale;
  const columns = canvas.width / scale;
  let snake;
  let food;
  let gameOver = false;
  let gameInterval;
  let touchStartX = 0;
  let touchStartY = 0;

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            snake.changeDirection('Right');
        } else {
            snake.changeDirection('Left');
        }
    } else {
        if (dy > 0) {
            snake.changeDirection('Down');
        } else {
            snake.changeDirection('Up');
        }
    }

    touchStartX = 0;
    touchStartY = 0;
}

  startButton.addEventListener('click', startGame);

  function startGame() {
      snake = new Snake();
      food = new Food();
      food.pickLocation();
      gameOver = false;
      clearInterval(gameInterval); 
      gameInterval = setInterval(updateGame, 150); 
  }

  function updateGame() {
      if (!gameOver) {
          ctx.fillStyle = backgroundColorInput.value;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          food.draw();
          snake.update();
          snake.draw();

          if (snake.eat(food)) {
              food.pickLocation(); 
              snake.grow(); 
          }

          snake.checkCollision();
          document.querySelector('p').innerText = `Score: ${snake.total}`;
      } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#000';
          ctx.font = '30px Arial';
          ctx.fillText('Game Over', canvas.width / 2 - 90, canvas.height / 2);
      }
  }

  class Snake {
      constructor() {
          this.x = 0;
          this.y = 0;
          this.xSpeed = scale * 1;
          this.ySpeed = 0;
          this.total = 0;
          this.tail = [];
      }

      draw() {
          for (let i = 0; i < this.tail.length; i++) {
              ctx.fillStyle = '#333';
              ctx.beginPath();
              ctx.arc(this.tail[i].x + scale / 2, this.tail[i].y + scale / 2, scale / 2, 0, Math.PI * 2);
              ctx.fill();
          }

          ctx.fillStyle = '#333';
          ctx.beginPath();
          ctx.arc(this.x + scale / 2, this.y + scale / 2, scale / 2, 0, Math.PI * 2);
          ctx.fill();
      }

      update() {
          for (let i = 0; i < this.tail.length - 1; i++) {
              this.tail[i] = this.tail[i + 1];
          }

          this.tail[this.total - 1] = { x: this.x, y: this.y };

          this.x += this.xSpeed;
          this.y += this.ySpeed;

          if (this.x >= canvas.width) {
              this.x = 0;
          } else if (this.x < 0) {
              this.x = canvas.width - scale;
          }

          if (this.y >= canvas.height) {
              this.y = 0;
          } else if (this.y < 0) {
              this.y = canvas.height - scale;
          }
      }

      changeDirection(direction) {
          switch (direction) {
              case 'Up':
                  if (this.ySpeed === 0) {
                      this.xSpeed = 0;
                      this.ySpeed = -scale * 1;
                  }
                  break;
              case 'Down':
                  if (this.ySpeed === 0) {
                      this.xSpeed = 0;
                      this.ySpeed = scale * 1;
                  }
                  break;
              case 'Left':
                  if (this.xSpeed === 0) {
                      this.xSpeed = -scale * 1;
                      this.ySpeed = 0;
                  }
                  break;
              case 'Right':
                  if (this.xSpeed === 0) {
                      this.xSpeed = scale * 1;
                      this.ySpeed = 0;
                  }
                  break;
          }
      }

      eat(food) {
          const dx = Math.abs(this.x - food.x);
          const dy = Math.abs(this.y - food.y);
          return dx < scale && dy < scale; 
      }

      grow() {
          this.total++;
      }

      checkCollision() {
          for (let i = 0; i < this.tail.length; i++) {
              if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                  gameOver = true;
                  break;
              }
          }
      }
  }

  class Food {
      constructor() {
          this.pickLocation();
      }

      pickLocation() {
          const row = Math.floor(Math.random() * rows);
          const column = Math.floor(Math.random() * columns);
          this.x = row * scale;
          this.y = column * scale;
      }

      draw() {
          ctx.fillStyle = '#f00';
          ctx.fillRect(this.x, this.y, scale, scale);
      }
  }

  document.addEventListener('keydown', handleKeyDown); 

  function handleKeyDown(event) {
      const direction = event.key.replace('Arrow', '');
      snake.changeDirection(direction);
  }
});
