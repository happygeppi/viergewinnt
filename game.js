class Game {
  constructor(w, h, depth, players) {
    this.w = w;
    this.h = h;
    this.board = this.initBoard();

    this.move = { i: null, j: null };
    this.turn = 1;
    this.over = false;

    this.depth = depth;
    this.players = players;
    this.initPlayers();

    this.createHTML();
  }

  initBoard() {
    return new Array(this.w * this.h).fill(0);
  }

  initPlayers() {
    if (this.players[1].player == "human") {
      this.humanPlayer = this.players[1].player;
      this.players[2].player = new Computer(this.depth, this);
      this.computerPlayer = this.players[2].player;
    } else {
      this.humanPlayer = this.players[2].player;
      this.players[1].player = new Computer(this.depth, this);
      this.computerPlayer = this.players[1].player;
    }

    if (this.players[1].player == this.computerPlayer) this.computerMove();
  }

  createHTML() {
    this.html = {
      container: document.createElement("div"),
      cols: [],
      cells: [],
      throw: null,
    };

    this.html.container.id = "container";
    document.body.append(this.html.container);

    if (this.players[this.turn].player == "human")
      this.html.container.classList.add("players-turn");
    else this.html.container.classList.remove("players-turn");

    for (let col = 0; col < 7; col++) {
      const Col = document.createElement("div");
      Col.classList.add("col");
      this.html.container.append(Col);
      this.html.cols.push(Col);
      this.html.cells.push([]);

      Col.addEventListener("click", () => this.place(col));

      for (let cell = 0; cell < 6; cell++) {
        const Cell = document.createElement("div");
        Cell.classList.add("cell");
        Col.append(Cell);
        this.html.cells[col].push(Cell);
      }
    }
  }

  computerMove() {
    setTimeout(() => {
      const nextMove = this.computerPlayer.getBestMove(this.board, this.turn);
      console.log(nextMove.evaluation);
      this.place(nextMove.i, true);
    }, 200);
  }

  place(i, computer = false) {
    if (this.over) return;
    if (!computer && this.players[this.turn].player != "human") return;

    this.move.i = i;
    this.updateBoard();

    if (this.move.j < 0) return;
    if (this.move.j == 0) this.computerPlayer.depth++;

    this.updateHTML();

    if (this.checkWin(this.board, this.move.i, this.move.j))
      return this.endScreen();
    if (this.checkDraw(this.board)) return this.endScreen(true);

    this.nextTurn();

    if (computer) return;
    setTimeout(() => this.computerMove(), 200);
  }

  updateBoard() {
    for (this.move.j = this.h - 1; this.move.j >= -1; this.move.j--)
      if (this.board[this.h * this.move.i + this.move.j] === 0) break;

    if (this.move.j < 0) return;

    this.board[this.h * this.move.i + this.move.j] = this.turn;
  }

  updateHTML() {
    let Cell = this.html.cells[this.move.i][this.move.j];
    Cell.style.setProperty("--color", this.players[this.turn].color);
    Cell.classList.add("placed");

    if (this.players[3 - this.turn].player == "human")
      this.html.container.classList.add("players-turn");
    else this.html.container.classList.remove("players-turn");
  }

  nextTurn() {
    return (this.turn = 3 - this.turn);
  }

  checkWin(board, i, j) {
    const index = this.h * i + j;
    const player = board[index];

    const offsets = [
      {
        offset: { i: 0, j: 1 },
        start: { i, j },
        end: (_i, _j) => _j >= game.h - 1,
      },
      {
        offset: { i: 1, j: 0 },
        start: { i: Math.max(0, i - 3), j: j },
        end: (_i, _j) => _i >= game.w - 1,
      },
      {
        offset: { i: 1, j: 1 },
        start: { i: i - 3, j: j - 3 },
        end: (_i, _j) => _i >= game.w - 1 || _j >= game.h - 1,
      },
      {
        offset: { i: 1, j: -1 },
        start: { i: i - 3, j: j + 3 },
        end: (_i, _j) => _i >= game.w - 1 || _j <= 0,
      },
    ];

    for (const off of offsets)
      if (this.checkFour(board, player, off.start, off.end, off.offset))
        return true;

    return false;
  }

  checkFour(board, player, start, end, offset) {
    let inRow = 0;
    let attempts = 0;

    let i = start.i;
    let j = start.j;

    do {
      while (
        (i < 0 && offset.i > 0) ||
        (j < 0 && offset.j > 0) ||
        (j > this.h - 1 && offset.j < 0)
      ) {
        i += offset.i;
        j += offset.j;
      }

      if (board[this.h * i + j] == player) inRow++;
      else inRow = 0;

      if (inRow == 4) return true;
      if (end(i, j)) return false;

      i += offset.i;
      j += offset.j;

      attempts++;
      if (attempts == 20) return console.log("klappt nicht", offset);
    } while (true);
  }

  checkDraw(board) {
    for (let cell = 0; cell < this.w * this.h; cell++)
      if (board[cell] == 0) return false;
    return true;
  }

  endScreen(draw = false) {
    this.over = true;

    if (!draw) {
      console.log(`Congragulations, player ${this.turn} won!`);
      document.body.style.backgroundColor = this.players[this.turn].color;
      return;
    }

    console.log("It's a draw!");
    document.body.style.backgroundColor = COLORS.draw;
  }
}
