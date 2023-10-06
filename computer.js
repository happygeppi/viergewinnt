class Computer {
  constructor(depth, game) {
    this.depth = depth;
    this.game = game;

    this.evaluation = {
      draw: 0,
      win: 1000,
      0: 0,
      1: 5 + random(-2, 5),
      2: 20 + random(-5, 15),
      3: 50 + random(-10, 50),
    };
    this.mult = {
      1: 1,
      2: -1,
    };
  }

  getBestMove(board, toMove) {
    const next = this.nextMoves(board, toMove);
    const mult = this.mult[toMove];

    let bestMove = null;
    let bestValue = -Infinity;

    for (const move of next) {
      const value = this.minimax(move, 3 - toMove, 1);
      if (value * mult > bestValue) {
        bestValue = value * mult;
        bestMove = move;
      }
    }

    return { i: bestMove.i, evaluation: bestValue * mult };
  }

  minimax(move, toMove, layer) {
    // move = { board, i, j }

    if (this.game.checkWin(move.board, move.i, move.j))
      return this.mult[move.player] * this.evaluation.win;
    if (this.game.checkDraw(move.board)) return this.evaluation.draw;

    if (layer == this.depth) return this.evaluate(move.board);

    const values = [];
    const next = this.nextMoves(move.board, toMove);

    for (const nextMove of next)
      values.push(this.minimax(nextMove, 3 - toMove, layer + 1));

    return this.minimaxValue(values, this.mult[toMove]);
  }

  minimaxValue(values, mult) {
    let max = -Infinity;
    for (const val of values) if (mult * val > max) max = mult * val;
    return mult * max;
  }

  evaluate(board) {
    let boardValue = 0;

    const offsets = [
      {
        offset: 1,
        from: { x: 0, y: 0 },
        to: { x: this.game.w - 1, y: this.game.h - 4 },
      },
      {
        offset: this.game.h,
        from: { x: 0, y: 0 },
        to: { x: this.game.w - 4, y: this.game.h - 1 },
      },
      {
        offset: this.game.h + 1,
        from: { x: 0, y: 0 },
        to: { x: this.game.w - 4, y: this.game.h - 4 },
      },
      {
        offset: this.game.h - 1,
        from: { x: 3, y: 3 },
        to: { x: this.game.w - 1, y: this.game.h - 1 },
      },
    ];

    for (let player = 1; player <= 2; player++) {
      for (const off of offsets) {
        for (let x = off.from.x; x <= off.to.x; x++) {
          for (let y = off.from.y; y <= off.to.y; y++) {
            let opponentInTheWay = false;
            let index = this.game.h * x + y;
            let counter = 0;
            for (let step = 0; step < 4; step++) {
              if (board[index] == player) counter++;
              else if (board[index] == 3 - player) {
                opponentInTheWay = true;
                break;
              }
              index += off.offset;
            }

            if (!opponentInTheWay)
              boardValue += this.mult[player] * this.evaluation[counter];
          }
        }
      }
    }

    return boardValue;
  }

  nextMoves(board, toMove) {
    const next = [];
    for (let col = 0; col < this.game.w; col++) {
      let j;
      for (j = this.game.h - 1; j >= -1; j--)
        if (board[this.game.h * col + j] === 0) break;

      if (j >= 0) {
        const nextBoard = board.slice();
        nextBoard[this.game.h * col + j] = toMove;
        next.push({ board: nextBoard, i: col, j: j, player: toMove });
      }
    }

    return next;
  }
}
