var step_count = 0,
  gamestate = 0,
  solving = 0;
var puzzlesolver;
var ret = [1, 2, 3, 0, 4, 5, 6, 0, 7, 8, 9];
var nowarr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var mx = [0, 1, 0, -1, 0],
  my = [0, 0, 1, 0, -1];
function writelog(msg, clearFlag) {
  if (clearFlag) $("#logmsg-msg").html("<div>" + msg + "</div>");
  else $("#logmsg-msg").append("<div>" + msg + "</div>");
}
function swap(a, b) {
  a = $(a);
  b = $(b);
  let tmp = $("<span>").hide();
  a.before(tmp);
  b.before(a);
  tmp.replaceWith(b);
}
function swap_puzzle_arr(a, b) {
  let t = nowarr[a];
  nowarr[a] = nowarr[b];
  nowarr[b] = t;
}
function checksolved() {
  let incorrect_cnt = 0;
  for (let i = 0; i < 9; i++) {
    if (i != nowarr[i] - 1) {
      incorrect_cnt++;
    }
  }
  if (incorrect_cnt == 0) return true;
  else return false;
}
function init() {
  nowarr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  $(".puzzle").html(
    "<div id='puzzle_1' class='puzzle_num' style='background-color: #fa8080;'>1</div><div id='puzzle_2' class='puzzle_num' style='background-color: #FFAB76;'>2</div><div id='puzzle_3' class='puzzle_num' style='background-color: #FFFDA2;'>3</div><div id='puzzle_nl'class='puzzle_num -hidden'>\n</div><div id='puzzle_4'class='puzzle_num' style='background-color: #BAFFB4;'>4</div><div id='puzzle_5'class='puzzle_num' style='background-color: #CFFFDC;'>5</div><div id='puzzle_6'class='puzzle_num' style='background-color: #93FFD8;'>6</div><div id='puzzle_nl'class='puzzle_num -hidden'>\n</div><div id='puzzle_7'class='puzzle_num' style='background-color: #93b4f7;'>7</div><div id='puzzle_8'class='puzzle_num' style='background-color: #F4BEEE;'>8</div><div id='puzzle_mt'class='puzzle_num -empty'></div>"
  );
  $(".puzzle").css({ cursor: "pointer" });
  $("#logmsg-msg").html("");
  shuffle();
  set_game_board();
}
function shuffle() {
  for (let i = 1; i <= 400 + Math.floor(Math.random() * 25); i++) {
    let dir = Math.floor(Math.random() * 4);
    $numEmpty = $(".puzzle_num.-empty");
    let emptyIndex = $numEmpty.index();
    if (dir == 0 && !(emptyIndex - 4 < 0 || ret[emptyIndex - 4] == 0)) {
      let $current_pz = $(
          "#puzzle_" + nowarr[ret[emptyIndex - 4] - 1].toString()
        ),
        num = nowarr[ret[emptyIndex - 4] - 1];
      swap($current_pz, $numEmpty);
      swap_puzzle_arr(ret[emptyIndex - 4] - 1, ret[emptyIndex] - 1);
      if (ret[emptyIndex] == num) $current_pz.css("opacity", "1");
      else $current_pz.css("opacity", "0.5");
    } else if (dir == 1 && !(emptyIndex - 1 < 0 || ret[emptyIndex - 1] == 0)) {
      let $current_pz = $(
          "#puzzle_" + nowarr[ret[emptyIndex - 1] - 1].toString()
        ),
        num = nowarr[ret[emptyIndex - 1] - 1];
      swap($current_pz, $numEmpty);
      swap_puzzle_arr(ret[emptyIndex - 1] - 1, ret[emptyIndex] - 1);
      if (ret[emptyIndex] == num) $current_pz.css("opacity", "1");
      else $current_pz.css("opacity", "0.5");
    } else if (dir == 2 && !(emptyIndex + 1 > 10 || ret[emptyIndex + 1] == 0)) {
      let $current_pz = $(
          "#puzzle_" + nowarr[ret[emptyIndex + 1] - 1].toString()
        ),
        num = nowarr[ret[emptyIndex + 1] - 1];
      swap($current_pz, $numEmpty);
      swap_puzzle_arr(ret[emptyIndex + 1] - 1, ret[emptyIndex] - 1);
      if (ret[emptyIndex] == num) $current_pz.css("opacity", "1");
      else $current_pz.css("opacity", "0.5");
    } else if (dir == 3 && !(emptyIndex + 4 > 10 || ret[emptyIndex + 4] == 0)) {
      let $current_pz = $(
          "#puzzle_" + nowarr[ret[emptyIndex + 4] - 1].toString()
        ),
        num = nowarr[ret[emptyIndex + 4] - 1];
      swap($current_pz, $numEmpty);
      swap_puzzle_arr(ret[emptyIndex + 4] - 1, ret[emptyIndex] - 1);
      if (ret[emptyIndex] == num) $current_pz.css("opacity", "1");
      else $current_pz.css("opacity", "0.5");
    }
  }
}
function set_game_board() {
  let $numEmpty = $(".puzzle_num.-empty");
  // add click response
  $(".puzzle_num").click(function () {
    if (gamestate == 0) return;
    let $this = $(this);
    // check if valid num block to move
    if ($this.is($numEmpty)) {
      writelog("Illegal: Empty block clicked", 1);
      return;
    }
    if (
      ![
        $numEmpty.index() - 4,
        $numEmpty.index() - 1,
        $numEmpty.index() + 1,
        $numEmpty.index() + 4,
      ].includes($this.index())
    ) {
      writelog("Illegal: Cannot be slid to the empty block.", 1);
      return;
    }

    // swap num block with empty block
    swap($this, $numEmpty);
    swap_puzzle_arr(ret[$this.index()] - 1, ret[$numEmpty.index()] - 1);
    if (ret[$this.index()] == nowarr[ret[$this.index()] - 1]) {
      $this.css("opacity", "1");
    } else {
      $this.css("opacity", "0.5");
    }
    if (checksolved() == 1) {
      $("#direction").html(
        "You've solved the puzzle in " +
          (parseInt($("#stp-count").html()) + 1).toString() +
          " step(s)!"
      );
      gamestate = 0;
      solving = 0;
      $(".puzzle").css({ cursor: "not-allowed" });
      writelog("", 1);
      return;
    }
    if (solving) {
      if (!puzzlesolver.check_current_state(nowarr)) {
        writelog("", 1);
        solving = 0;
      } else {
        puzzlesolver.update();
        puzzlesolver.print_solver_info();
      }
    }
    $("#direction").html(
      "You've used <span id='stp-count'>" +
        (parseInt($("#stp-count").html()) + 1).toString() +
        "</span> step(s)."
    );
  });
}
document.addEventListener("DOMContentLoaded", function () {
  // initialize element setup
  $(".puzzle").bind("cut copy paste", function (event) {
    event.preventDefault();
  });
  $(".puzzle").css({ cursor: "not-allowed" });
  $("#new-game").click(function () {
    gamestate = 1; // user is in game
    solving = 0;
    $("#direction").html(
      "You've used " + "<span id='stp-count'>" + "0" + "</span>" + " step(s)!"
    );
    init();
  });
  $("#solve").click(function () {
    if (gamestate == 0) return;
    solving = 1;
    writelog("Solving...", 1);
    puzzlesolver = new PuzzleSolver(nowarr);
    puzzlesolver.astar();
    puzzlesolver.update();
    puzzlesolver.print_solver_info();
  });
});

const toph = 0;
const parent = (i) => ((i + 1) >>> 1) - 1;
const left = (i) => (i << 1) + 1;
const right = (i) => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[toph];
  }
  push(...values) {
    values.forEach((value) => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > toph) {
      this._swap(toph, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[toph] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > toph && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = toph;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild =
        right(node) < this.size() && this._greater(right(node), left(node))
          ? right(node)
          : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}
class PuzzleState {
  constructor(chessBoard, x, y, step, path) {
    this.chessBoard = [...chessBoard];
    this.path = [...path];
    this.x = x;
    this.y = y;
    this.state = this.cal_state();
    this.step = step;
    this.evaluate = this.cal_evaluate();
  }
  swap(pos1, pos2) {
    let t = this.chessBoard[pos1];
    this.chessBoard[pos1] = this.chessBoard[pos2];
    this.chessBoard[pos2] = t;
    this.evaluate = this.cal_evaluate();
    this.state = this.cal_state();
  }
  cal_state() {
    var state_str = "";
    for (let i = 0; i < 9; i++) {
      state_str += this.chessBoard[i].toString();
    }
    return parseInt(state_str);
  }
  number_to_pos(x) {
    let coorx = (x - 1) / 3,
      coory = (x - 1) % 3;
    return [coorx, coory];
  }
  cal_evaluate() {
    var est = 0;
    for (let i = 0; i < 9; i++)
      if (nowarr[i] != 0) {
        let pos1 = this.number_to_pos(nowarr[i]);
        let pos2 = this.number_to_pos(i + 1);
        est += Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
      }
    return est;
  }
}
class PuzzleSolver {
  constructor(initarr) {
    this.arr = [...initarr];
    this.step = 0;
    this.ans = 0;
    this.original_x = 0;
    this.original_y = 0;
    this.current_x = 0;
    this.current_y = 0;
    let arr_position = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.arr[arr_position] == 9) {
          this.original_x = this.current_x = i;
          this.original_y = this.current_y = j;
        }
        arr_position += 1;
      }
    }
    self.original_state = new PuzzleState(
      this.arr,
      this.original_x,
      this.original_y,
      0,
      []
    );
  }
  ArraytoChessBoard(arr) {
    let board = [],
      arr_position = 0;
    for (let i = 0; i < 3; i++) {
      board[i] = [];
      for (let j = 0; j < 3; j++) {
        board[i][j] = arr[arr_position];
        arr_position += 1;
      }
    }
    return board;
  }
  astar() {
    var state_record = new Map();
    const pq = new PriorityQueue(
      (a, b) => -(a.step + a.evaluate) > -(b.step + b.evaluate)
    );
    pq.push(self.original_state);
    if (self.original_state.evaluate == 0) {
      writelog("The puzzle has already been solved.", 1);
      return;
    }
    while (!pq.isEmpty()) {
      let current_state = JSON.parse(JSON.stringify(pq.peek()));
      pq.pop();
      for (let i = 1; i <= 4; i++) {
        let dx = current_state.x + mx[i],
          dy = current_state.y + my[i];
        if (dx >= 0 && dy >= 0 && dx <= 2 && dy <= 2) {
          let next_state = new PuzzleState(
            current_state.chessBoard,
            dx,
            dy,
            current_state.step + 1,
            current_state.path
          );
          next_state.swap(current_state.x * 3 + current_state.y, dx * 3 + dy);
          next_state.path.push(i);
          if (!state_record[next_state.state]) {
            state_record[next_state.state] = 1;
            pq.push(next_state);
            if (next_state.state == 123456789) {
              this.ans = next_state;
            }
          }
        }
      }
    }
  }
  check_current_state(arr) {
    for (let i = 0; i < 9; i++) {
      if (arr[i] != this.arr[i]) return false;
    }
    return true;
  }
  update() {
    if (this.step == this.ans.step) return;
    this.original_x = this.current_x;
    this.original_y = this.current_y;
    this.current_x += mx[this.ans.path[this.step]];
    this.current_y += my[this.ans.path[this.step]];
    let t = this.arr[this.current_x * 3 + this.current_y];
    this.arr[this.current_x * 3 + this.current_y] =
      this.arr[this.original_x * 3 + this.original_y];
    this.arr[this.original_x * 3 + this.original_y] = t;
    this.step += 1;
    return;
  }
  puzzle_stringify(num) {
    if (num == 9) return " ";
    else return num.toString();
  }
  print_solver_info() {
    writelog((this.ans.step - this.step + 1).toString() + " step(s) left.", 1);
    writelog(
      "Slide block " +
        Number(this.arr[this.original_x * 3 + this.original_y]) +
        " to the space by clicking it.",
      0
    );
    writelog("+-+-+-+", 0);
    for (let i = 0; i < 3; i++) {
      writelog(
        "|" +
          this.puzzle_stringify(this.arr[i * 3]) +
          "|" +
          this.puzzle_stringify(this.arr[i * 3 + 1]) +
          "|" +
          this.puzzle_stringify(this.arr[i * 3 + 2]) +
          "|",
        0
      );
      writelog("+-+-+-+", 0);
    }
  }
}
