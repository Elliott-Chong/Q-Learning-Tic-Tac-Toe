let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];

const players = ["O", "X"];
let gameOver = false;
let player;
let xRow = [0, 0, 0];
let oRow = [0, 0, 0];
let xCol = [0, 0, 0];
let oCol = [0, 0, 0];
let xDiag = 0;
let oDiag = 0;
let xAntiDiag = 0;
let oAntiDiag = 0;

function setup() {
    createCanvas(600, 600);
    player = 1;
    human = 1;
    let desc = createDiv(
        "This is a demostration of the minimax algorithm, an adversarial search algorithm."
    );
    let desc1 = createDiv(
        "Implemented with p5.js, this was part of my CS50 AI assignment."
    );
    console.log(desc);
    desc.elt.style.fontSize = "1.5rem";
    desc.elt.style.fontWeight = "600";
    desc1.elt.style.fontSize = "1.5rem";
    desc1.elt.style.fontWeight = "600";
    let credits = createDiv();
    credits = credits.elt;
    credits.innerHTML =
        "Sources: <a style='text-decoration:none;' href='https://en.wikipedia.org/wiki/Minimax'>Wikipedia</a>, <a style='text-decoration:none;' href='https://www.youtube.com/watch?v=trKjYdBASyQ&ab_channel=TheCodingTrain'>The Coding Train</a>";
    credits.style.fontSize = "1.5rem";
}
const sleep = async(ms) => new Promise((resolve) => setTimeout(resolve, ms));

function mouseClicked() {
    if (gameOver || player !== human) return;
    let x = floor(map(mouseX, 0, 600, 0, 3));
    let y = floor(map(mouseY, 0, 600, 0, 3));
    if (x >= board.length || x < 0 || y >= board.length || y < 0) return;
    if (board[y][x] !== "") return;
    record(x, y);
    if (!gameOver) {
        robot();
    }
}
const robot = async() => {
    //   await sleep(random(200, 1000));
    await sleep(100);
    let bestScore = -Infinity;
    let move = { x: 0, y: 0 };
    let all = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] !== "") continue;
            board[i][j] = players[player];
            let score = minimax(board, 0, (isMaximising = false));
            all.push({ i, j, score });
            board[i][j] = "";
            if (score > bestScore) {
                bestScore = score;
                move.x = j;
                move.y = i;
            }
        }
    }
    console.log(all);
    record(move.x, move.y);
};

const record = (x, y) => {
    if (board[y][x] !== "") {
        return;
    }
    board[y][x] = players[player];
    if (check()) {
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
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
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
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                line(
                    width / 6,
                    i * (width / 3) + width / 6,
                    (width * 5) / 6,
                    i * (width / 3) + width / 6
                );
                break;
            }
        }

        if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            line(width / 6, height / 6, (5 * width) / 6, (5 * height) / 6);
        }

        if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            line((5 * width) / 6, height / 6, width / 6, (5 * height) / 6);
        }
    }
}