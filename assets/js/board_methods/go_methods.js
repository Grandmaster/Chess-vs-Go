// Code for various manipulations of the go/baduk/weiqi portion of the game
// ============================================================================

// Function that displays board on canvas. Takes in godash.Board and context for html5 canvas
function currentGoBoard(board, context, width, height, boxsize) {
  // Clearing the board for each state update
  context.clearRect(0, 0, width, height);

  // Placing a stone on the relevant point on the board for each stone in input board
  board.moves.forEach((val, key) => {
    context.beginPath();
    context.arc(
      (key.x + 1) * boxsize,
      (key.y + 1) * boxsize,
      boxsize / 3,
      0,
      2 * Math.PI,
      true
    );
    context.fillStyle = val;
    context.fill();
  });
}

// TODO: Function that calculates transient territory controlled by each player using flood fill algorithm
function calculateTerritory(board) {
  if (board.moves.size == 0) {
    return "no stones on board";
  }
  // Range of indices for points on the board
  var rx = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  var ry = rx;
  var rp = [];

  for (let i of rx) {
    for (let j of ry) {
      rp.push([i, j]);
    }
  }
}
