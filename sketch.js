let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let restartBtn;

let customWidth;

const players = ["O", "X"];
let gameOver = false;
let player;

function setup() {
  customWidth = window.innerWidth / 1.5 > 600 ? 600 : window.innerWidth / 1.5;
  createCanvas(customWidth, customWidth);
  player = 1;
  human = 1;
  restartBtn = createButton("Restart");
  let desc = createDiv("Q-Learning");

  let desc1 = createDiv(
    "Implemented with p5.js, this was part of my CS50 AI assignment."
  );

  // desc.elt.style.fontSize = "1.5rem";
  // desc.elt.style.fontWeight = "600";
  // desc1.elt.style.fontSize = "1.5rem";
  // desc1.elt.style.fontWeight = "600";
  let credits = createDiv();
  credits = credits.elt;
  credits.innerHTML =
    "Sources: <a style='text-decoration:none;' href='https://en.wikipedia.org/wiki/Minimax'>Wikipedia</a>, <a style='text-decoration:none;' href='https://www.youtube.com/watch?v=trKjYdBASyQ&ab_channel=TheCodingTrain'>The Coding Train</a>";
  restartBtn = restartBtn.elt;
  restartBtn.addEventListener("click", () => {
    player = 1;
    board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    gameOver = false;
  });
  let credit = createDiv(
    'Source Code: <a style="text-decoration: none;" target="_blank" href = "https://github.com/Elliott-Chong/minimax-Tic-Tac-Toe" >Elliott Chong</a>'
  );
}
const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function mousePressed() {
  if (gameOver || player !== human) return;
  let x = floor(map(mouseX, 0, customWidth, 0, 3));
  let y = floor(map(mouseY, 0, customWidth, 0, 3));
  if (x >= board.length || x < 0 || y >= board.length || y < 0) return;
  if (board[y][x] !== "") return;
  record(x, y);
  if (!gameOver) {
    robot();
  }
}
const robot = async () => {
  //   await sleep(random(200, 1000));
  await sleep(random(200, 600));
  best_score = -Infinity;
  best_move = null;
  for (let action of get_possible_moves(board)) {
    if (get_value(serialize(board, action)) > best_score) {
      best_move = action;
      best_score = get_value(serialize(board, action));
    }
  }

  record(best_move[1], best_move[0]);
};

const record = (x, y) => {
  if (board[y][x] !== "") {
    return;
  }
  board[y][x] = players[player];
  if (check(board)) {
    gameOver = true;
    return;
  }
  player = abs(player - 1);
};

function draw() {
  strokeCap(SQUARE);
  background(0);
  strokeWeight(width / 50);
  stroke(255);
  //   grid lines
  line(0, height / 3, width, height / 3);
  line(0, (height * 2) / 3, width, (height * 2) / 3);
  line(width / 3, 0, width / 3, height);
  line((width * 2) / 3, 0, (width * 2) / 3, height);
  const twidth = width / 3;
  const theight = height / 3;
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board.length; x++) {
      if (board[y][x] === players[0]) {
        noFill();
        ellipse(
          twidth * x + width / 6,
          theight * y + height / 6,
          (width * 2) / 9
        );
      } else if (board[y][x] === players[1]) {
        line(
          twidth * x + width / 18,
          theight * y + width / 18,
          twidth * x + twidth - width / 18,
          theight * y + theight - width / 18
        );
        line(
          twidth * x + twidth - width / 18,
          theight * y + width / 18,
          twidth * x + width / 18,
          theight * y + theight - width / 18
        );
      }
    }
  }
  if (gameOver) {
    stroke(0, 255, 0);
    strokeWeight(10);
    //   console.log(oRow, oCol, oDiag, oAntiDiag);

    for (let i = 0; i < board.length; i++) {
      if (
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i] &&
        board[0][i] !== ""
      ) {
        line(
          i * (width / 3) + width / 6,
          height / 6,
          i * (width / 3) + width / 6,
          5 * (height / 6)
        );
        break;
      }
    }

    for (let i = 0; i < board.length; i++) {
      // row
      if (
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2] &&
        board[i][0] != ""
      ) {
        line(
          width / 6,
          i * (width / 3) + width / 6,
          (width * 5) / 6,
          i * (width / 3) + width / 6
        );
        break;
      }
    }

    if (
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[0][0] != ""
    ) {
      line(width / 6, height / 6, (5 * width) / 6, (5 * height) / 6);
    }

    if (
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0] &&
      board[1][1] != ""
    ) {
      line((5 * width) / 6, height / 6, width / 6, (5 * height) / 6);
    }
  }
}
