const canvas = document.querySelector('#canvas');
/* canvas 24 x 24 box => 3box on top use to show point and modeGame , 
                         1box left and right and bottom use to creat the wall 
                      => land for snake move is grid 20x20 box   */
canvas.width = 528;  // 22 box (box = 24)
canvas.height = 528; // 22 box
const context = canvas.getContext('2d');
const box = 24;     // size of box el

let snake_arr = [{ x: 10 * box, y: 11 * box }]; // array to store position of each part of the snake
// const snake = []
const food = {};

let direction = '';

let gameOver = false;
let speed = 1000;         // = 1s
let score = 0;
let modeGame = 2; // mode game default is mode 1
let mode1 = document.getElementById('mode1');
let mode2 = document.getElementById('mode2');
mode2.checked = true; //value default


//event listener
document.getElementById('reset-button').addEventListener('click', init);

function init() {
  // reset variables
  modeGame = mode1.checked === true ? 1 : 2;
  snake_arr = [{ x: 10 * box, y: 11 * box }];
  speed = 1000;  // 1s
  score = 0;
  direction = '';
};

// function draw score
function drawScore() {
  context.fillStyle = "black";
  context.font = "34px Changa one";
  context.fillText(`Score: ${score}`, 1.5 * box, 2 * box);
  context.fillStyle = 'red';
  context.fillRect(7.3 * box, 1 * box, box, box);
};

// function draw game over
function drawModeGame() {
  context.fillStyle = "black";
  context.font = "34px Changa one";
  context.fillText(`Mode ${modeGame} is active!`, 10.75 * box, 2 * box)
};

// function draw game over
function drawOverGame() {
  alert(`Game Over with ${score} scores !!!`);
  window.location.reload();
}

// function ramdom a food
function randomFood() {
  food.x = Math.floor(Math.random() * 20 + 1) * box;
  food.y = Math.floor(Math.random() * 18 + 3) * box;
};
randomFood(); // creat the first food for the game

// function check if the snake hit the wall
function isHitTHeWall(head) {
  if (head.x < 1 * box || head.x >= 21 * box || head.y < 3 * box || head.y >= 21 * box) return true;
  return false;
};
// function check if the snake hit itself
function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
};

function drawGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  // draw ground game
  context.strokeStyle = 'black';
  context.strokeRect(0, 0, canvas.width, canvas.height);
  // draw score
  drawScore();
  // draw mode game
  drawModeGame();
  // draw land for snake
  context.fillStyle = 'bisque';
  context.fillRect(1 * box, 3 * box, 20 * box, 18 * box);
  context.strokeRect(1 * box, 3 * box, 20 * box, 18 * box);

  // draw the snake
  for (let i = 0; i < snake_arr.length; i++) {
    let s = snake_arr[i];
    // fill color for each part of snake
    if (i == 0) {     // a head of snake
      context.fillStyle = 'blue'; // the color of the head is blue
      context.fillRect(s.x, s.y, box, box);
      //console.log('x,y', s.x, s.y)
    } else {
      context.fillStyle = 'green';
      context.fillRect(s.x, s.y, box, box);
    }

    // stroke for each part of snake
    context.strokeStyle = 'black';
    context.strokeRect(s.x, s.y, box, box)

    // draw food
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, box, box);

  }
  requestAnimationFrame(drawGame);
};

function repeat() {
  for (let i = snake_arr.length - 1; i >= 0; i--) {
    // if the snake eat the food
    if (i === 0 && snake_arr[i].x === food.x && snake_arr[i].y === food.y) {
      score++;              // increase the score for player
      snake_arr.push({});   // add new head to snake_arr
      // speed -= 7;           // reduce time between 2 time drawGame
      randomFood();            // random new position for new food
    }

    let snake_part = snake_arr[i];
    if (i == 0) {   // handle the moving of the head of the snake
      switch (direction) {
        case 'LEFT':
          if (snake_part.x < 2 * box && modeGame != 1) snake_part.x = 20 * box;
          else snake_part.x -= box;
          break;
        case 'UP':
          if (snake_part.y < 4 * box && modeGame != 1) snake_part.y = 20 * box;
          else snake_part.y -= box;
          break;
        case 'RIGHT':
          if (snake_part.x > 19 * box && modeGame != 1) snake_part.x = 1 * box;
          else snake_part.x += box;
          break;
        case 'DOWN':
          if (snake_part.y > 19 * box && modeGame != 1) snake_part.y = 3 * box;
          else snake_part.y += box;
      }

      // check game over depend on modegame
      if (modeGame === 1) {
        if (collision(snake_arr[0], snake_arr) || isHitTHeWall(snake_arr[0])) {
          drawOverGame();
        }
      } else { // modeGame = 2
        if (collision(snake_arr[0], snake_arr)) {
          drawOverGame();
        }
      }

    } else { // the body of the snake moving
      snake_arr[i].x = snake_arr[i - 1].x;
      snake_arr[i].y = snake_arr[i - 1].y;
    }
  }
  setTimeout(repeat, speed);
};

function snakeMove(event) { // use keyboard include ('A,W,D,S' or '4 arow key')
  let key = event.keyCode;

  if ((key === 37 && direction != "RIGHT") || (key === 65 && direction != "RIGHT")) {
    direction = "LEFT";
  } else if ((key === 38 && direction != "DOWN") || (key === 87 && direction != "DOWN")) {
    direction = "UP";
  } else if ((key === 39 && direction != "LEFT") || (key === 68 && direction != "LEFT")) {
    direction = "RIGHT";
  } else if ((key === 40 && direction != "UP") || (key === 83 && direction != "UP")) {
    direction = "DOWN";
  }
};

window.addEventListener('keydown', snakeMove);
setTimeout(repeat, speed);
requestAnimationFrame(drawGame);
