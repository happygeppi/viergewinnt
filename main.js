const DEPTH = 6;
const WIDTH = 7;
const HEIGHT = 6;

let game;

const random = (a, b) => Math.random() * (b - a) + a;

const InitGame = () => game = new Game(WIDTH, HEIGHT, DEPTH, PLAYERS);

/*

TODO:
if win / loss, also return layer
--> if multiple wins / losses, choose the one that happens earlier / later

*/
