const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");

const blockWidth = 100;
const blockHeight = 20;

let timerId;
let score = 0;

const playGroundWidth = 560;
const playGroundHeight = 300;
const ballSize = 20;

const userStartPosition = [230, 10];
let userCurrentPos = userStartPosition;

const ballStartPosition = [270, 40];
let ballCurrentPosition = ballStartPosition;
let xDirection = 4;
let yDirection = 4;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

const blocks = [];

function createBlocks() {
  const xValues = [10, 120, 230, 340, 450];
  const yValues = [270, 240, 210];

  for (let i = 0; i < 15; i++) {
    if (i < 5) {
      blocks.push(new Block(xValues[i], yValues[0]));
    } else if (i < 10) {
      let xIndex = i - 5;
      blocks.push(new Block(xValues[xIndex], yValues[1]));
      xIndex++;
    } else {
      let xIndex = i - 10;
      blocks.push(new Block(xValues[xIndex], yValues[2]));
      xIndex++;
    }
  }
}

function addBlocks() {
  createBlocks();
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px"; //x-axis
    block.style.bottom = blocks[i].bottomLeft[1] + "px"; //y-axis
    grid.appendChild(block);
  }
}

addBlocks();

//create user
const user = document.createElement("div");
user.classList.add("user");
drawUser();

grid.appendChild(user);

//draw user
function drawUser() {
  user.style.left = userCurrentPos[0] + "px";
  user.style.bottom = userCurrentPos[1] + "px";
}

//move user
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (userCurrentPos[0] > 0) {
        userCurrentPos[0] -= 10;
        drawUser();
        break;
      }
      break;
    case "ArrowRight":
      if (userCurrentPos[0] < playGroundWidth - blockWidth) {
        userCurrentPos[0] += 10;
        drawUser();
        break;
      }
      break;
    default:
      break;
  }
}

document.addEventListener("keydown", moveUser);

//add ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}

timerId = setInterval(moveBall, 30);

function checkForCollisions() {
  console.log(ballCurrentPosition);
  console.log(userCurrentPos);
  console.log(ballCurrentPosition[0] >= userCurrentPos[0]);
  console.log(ballCurrentPosition[0] <= userCurrentPos[0] + blockWidth);
  console.log(ballCurrentPosition[1] <= userCurrentPos[1] + blockHeight);

  //block collisions
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] >= blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] <= blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] >=
        blocks[i].bottomLeft[1] - blockHeight - ballSize &&
      ballCurrentPosition[1] >= blocks[i].topLeft[1] - blockHeight - ballSize
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.textContent = score;

      //check win
      if (blocks.length === 0) {
        clearInterval(timerId);
        scoreDisplay.textContent = "You win!!! Score: " + score;
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  //wall collisions
  if (
    ballCurrentPosition[0] >= playGroundWidth - ballSize ||
    ballCurrentPosition[1] >= playGroundHeight - ballSize ||
    ballCurrentPosition[0] <= 0
  ) {
    changeDirection();
  }

  //user collisions
  if (
    ballCurrentPosition[0] >= userCurrentPos[0] &&
    ballCurrentPosition[0] <= userCurrentPos[0] + blockWidth &&
    ballCurrentPosition[1] <= userCurrentPos[1] + blockHeight
  ) {
    changeDirection();
  }

  //check game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = "YOU LOSE";
    document.removeEventListener("keydown", moveUser);
    return;
  }
}

function changeDirection() {
  if (xDirection === 4 && yDirection === 4) {
    yDirection = -1 * yDirection;
    return;
  }
  if (xDirection === 4 && yDirection === -4) {
    xDirection = -1 * xDirection;
    return;
  }
  if (xDirection === -4 && yDirection === 4) {
    xDirection = -1 * xDirection;
    return;
  }
  if (xDirection === -4 && yDirection === -4) {
    yDirection = -1 * yDirection;
    return;
  }
}
