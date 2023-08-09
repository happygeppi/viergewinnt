const data = []; // 0: empty, 1: red, 2: white

let turn = 1;
let over = false;

const clr = [1953, "red", "yellow"];

const html = {
  container: document.getElementById("container"),
  cols: [],
  cells: [],
  throw: null, // cell that is about to be thrown in
};

function Init() {
  CreateHTML();
}

function CreateHTML() {
  for (let col = 0; col < 7; col++) {
    const Col = document.createElement("div");
    Col.classList.add("col");
    html.container.append(Col);
    html.cols.push(Col);
    html.cells.push([]);
    data.push([]);

    Col.addEventListener("click", () => Place(col));
    Col.addEventListener("mouseenter", () => MoveThrow(col));

    for (let cell = 0; cell < 6; cell++) {
      const Cell = document.createElement("div");
      Cell.classList.add("cell");
      Col.append(Cell);
      html.cells[col].push(Cell);
      data[col].push(0);
    }
  }

  CreateThrow();
}

function CreateThrow() {
  html.throw = document.createElement("div");
  html.throw.classList.add("cell");
  html.throw.classList.add(clr[turn]);
  html.throw.id = "throw";
  document.body.append(html.throw);

  const left = html.cells[0][0].getBoundingClientRect().left;
  const bottom = html.container.getBoundingClientRect().bottom;
  html.throw.style.left = `${left}px`;
  html.throw.style.bottom = `${bottom}px`;
}

function MoveThrow(i) {
  const left = html.cells[i][0].getBoundingClientRect().left;
  html.throw.style.left = `${left}px`;
}

function Place(i) {
  if (over) return;

  const col = data[i];
  let Cell, j;
  for (j = 6; j >= -1; j--) if (col[j] === 0) break;
  if (j < 0) return;

  col[j] = turn;

  Cell = html.cells[i][j];

  if (turn == 1) Cell.classList.add("red");
  else Cell.classList.add("yellow");

  html.throw.classList.remove(clr[turn]);
  NextTurn();
  html.throw.classList.add(clr[turn]);
  
  if (CheckFull()) EndScreen(true);
  if (CheckFour()) EndScreen();
}

function NextTurn() {
  return turn = 1 + !(turn - 1);
}

function CheckFour() {
  return CheckVert() || CheckHorz() || CheckDiag();
}

function CheckVert() {
  const red = [1, 1, 1, 1];
  const yellow = [2, 2, 2, 2];
  for (let i = 0; i < 7; i++)
    for (let j = 0; j <= 6 - 4; j++) {
      const slice = data[i].slice(j, j + 4);
      if (slice.matches(red) || slice.matches(yellow)) return true;
    }

  return false;
}

function CheckHorz() {
  const red = [1, 1, 1, 1];
  const yellow = [2, 2, 2, 2];

  for (let j = 0; j < 6; j++)
    for (let i = 0; i <= 7 - 4; i++) {
      let slice = [];
      for (let di = 0; di < 4; di++) slice.push(data[i + di][j]);
      if (slice.matches(red) || slice.matches(yellow)) return true;
    }

  return false;
}

function CheckDiag() {
  const red = [1, 1, 1, 1];
  const yellow = [2, 2, 2, 2];

  for (let i = 0; i <= 7 - 4; i++) {
    for (let j = 0; j <= 6 - 4; j++) {
      let slice1 = [];
      let slice2 = [];
      for (let d = 0; d < 4; d++) {
        slice1.push(data[i + d][j + d]);
        slice2.push(data[6 - i - d][j + d]);
      }
      if (
        slice1.matches(red) ||
        slice1.matches(yellow) ||
        slice2.matches(red) ||
        slice2.matches(yellow)
      )
        return true;
    }
  }

  return false;
}

function CheckFull() {
  for (let i = 0; i < 7; i++)
    for (let j = 0; j < 6; j++) if (data[i][j] == 0) return false;
  return true;
}

function EndScreen(draw = false) {
  if (!draw) {
    const winner = clr[NextTurn()];
    console.log(`Congragulations, ${winner.toUpperCase()} won!`);
    document.body.classList.add(winner);
  } else {
    console.log("It's a draw!");
    document.body.classList.add("draw");
  }
  
  html.throw.remove();
  over = true;
}

Array.prototype.matches = function (arr) {
  if (arr.length != this.length) return false;
  for (let i = 0; i < this.length; i++) if (this[i] != arr[i]) return false;
  return true;
};

Init();
