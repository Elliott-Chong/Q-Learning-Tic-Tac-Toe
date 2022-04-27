let values = new Map();
function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}
function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

let deepcopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const train = (n) => {
  let symbol = { 0: "X", 1: "O" };
  for (let i = 0; i < n; i++) {
    console.log(`Training AI on its ${i + 1} game`);
    let board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    let player = 0;
    let last = {
      0: { state: null, action: null },
      1: { state: null, action: null },
    };
    while (true) {
      let state = deepcopy(board);
      let best_move = choose_best_move(state);
      if (!best_move) {
        console.log(state);
      }
      last[player].state = deepcopy(state);
      last[player].action = deepcopy(best_move);
      let [row, col] = best_move;

      // update the board
      board[row][col] = symbol[player];
      // switch the player
      player = player == 1 ? 0 : 1;
      let new_state = deepcopy(board);

      if (check(board) == "X" || check(board) == "O") {
        update_q(state, new_state, best_move, 5);
        update_q(last[player].state, new_state, last[player].action, -5);
        break;
      } else if (check(board) == "tie") {
        update_q(last[player].state, new_state, last[player].action, 1);
        break;
      } else if (last[player].state && last[player].action) {
        update_q(last[player].state, new_state, last[player].action, 0);
      }
    }
  }

  console.log(values);
};

const update_q = (old_state, new_state, action, reward) => {
  // console.log(
  //   "old_state",
  //   old_state,
  //   "new_state",
  //   new_state,
  //   "action",
  //   action,
  //   "reward",
  //   reward
  // );
  let learning_rate = 0.5;
  let best_future_reward = -Infinity;
  let old_value = get_value(serialize(old_state, action));

  for (let move of get_possible_moves(new_state)) {
    if (get_value(serialize(new_state, move)) > best_future_reward) {
      best_future_reward = get_value(serialize(new_state, move));
    }
  }

  if (get_possible_moves(new_state).length == 0) {
    best_future_reward = 0;
  }

  let new_q =
    old_value + learning_rate * (reward + best_future_reward - old_value);
  set_value(serialize(old_state, action), new_q);
};

const choose_best_move = (state) => {
  let epsilon = 0.5;
  let best_score = -Infinity;
  let best_move = null;
  let all_possible_moves = get_possible_moves(state);
  for (let move of all_possible_moves) {
    let val = get_value(serialize(state, move));
    if (val > best_score) {
      best_move = move;
      best_score = val;
    }
  }
  if (Math.random() < epsilon) {
    best_move =
      all_possible_moves[Math.floor(Math.random() * all_possible_moves.length)];
  }
  return best_move;
};

const serialize = (state, action) => {
  let idk = [];
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[0].length; j++) {
      if (state[i][j] == "") {
        idk.push("n");
      } else {
        idk.push(state[i][j]);
      }
    }
  }
  idk = idk.join("_");
  return idk + "-" + action.join("_");
};

const get_possible_moves = (state) => {
  let possible_moves = [];
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[0].length; j++) {
      if (state[i][j] == "") {
        possible_moves.push([i, j]);
      }
    }
  }
  return possible_moves;
};

const deserialize = (str) => {
  let dstate = [];
  let state = str.split("-")[0];
  let index = 0;
  let row = [];
  for (let elt of state.split("_")) {
    index++;
    if (elt == "n") row.push("");
    else {
      row.push(elt);
    }
    if (index == 3) {
      index = 0;
      dstate.push(row);
      row = [];
    }
  }
  return dstate;
};

const get_value = (key) => {
  // if (values.has(key)) {
  //   return values.get(key);
  // } else {
  //   return 0;
  // }
  return computed_q.get(key);
};

const set_value = (key, value) => {
  values.set(key, value);
};

const check = (board) => {
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
