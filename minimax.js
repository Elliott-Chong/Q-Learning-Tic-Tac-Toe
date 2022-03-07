let checked = 0;
const minimax = (board, depth, isMaximising, alpha, beta) => {
    const lookUpScores = {
        X: -1,
        O: 1,
        tie: 0,
    };
    let winner = check();
    //   console.log(lookUpScores[winner]);
    let value;
    let score;
    if (winner) return lookUpScores[winner];
    if (isMaximising) {
        value = -Infinity;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] !== "") continue;
                checked++;
                board[i][j] = "O";
                score = minimax(board, 0, (isMaximising = false), alpha, beta);
                alpha = Math.max(alpha, score);
                board[i][j] = "";
                if (score >= value) {
                    value = score;
                }
                if (alpha >= beta) break;
            }
            if (alpha >= beta) break;
        }
        return value;
    } else if (!isMaximising) {
        value = Infinity;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] !== "") continue;
                checked++;
                board[i][j] = "X";
                score = minimax(board, 0, (isMaximising = true), alpha, beta);
                beta = Math.min(beta, score);
                board[i][j] = "";
                if (score <= value) {
                    value = score;
                }
                if (alpha >= beta) break;
            }
            if (alpha >= beta) break;
        }
        return value;
    }
};

const check = () => {
    let winner = null;
    for (let i = 0; i < board.length; i++) {
        // row
        if (
            board[i][0] === board[i][1] &&
            board[i][1] === board[i][2] &&
            board[i][0] !== ""
        ) {
            winner = board[i][0];
            return winner;
        }
    }
    //col
    for (let i = 0; i < board.length; i++) {
        if (
            board[0][i] === board[1][i] &&
            board[1][i] === board[2][i] &&
            board[0][i] !== ""
        ) {
            winner = board[0][i];
            return winner;
        }
    }
    //diag
    if (
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2] &&
        board[1][1] !== ""
    ) {
        winner = board[1][1];
        return winner;
    }
    //antidiag
    if (
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0] &&
        board[1][1] !== ""
    ) {
        winner = board[1][1];
        return winner;
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (!board[i][j]) {
                return winner;
            }
        }
    }
    return "tie";
};