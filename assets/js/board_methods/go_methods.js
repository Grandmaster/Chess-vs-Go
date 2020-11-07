// Code for various manipulations of the go/baduk/weiqi portion of the game
// ============================================================================

// Function that displays board on canvas. Takes in godash.Board and context for html5 canvas
function currentGoBoard(board, context, boxsize) {
  // Placing a stone on the relevant point on the board for each stone in input board
  board.moves.forEach((val, key) => {
    context.beginPath();
    context.arc(
      key.x * boxsize,
      key.y * boxsize,
      boxsize / 3,
      0,
      2 * Math.PI,
      true
    );
    context.fillStyle = val;
    context.fill();
  });
  console.log(board.toString());
}
