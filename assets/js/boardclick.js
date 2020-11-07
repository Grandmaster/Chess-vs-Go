// Code that handles the click events that happen on the board.
// ================================================================

$(document).ready(() => {
  // Counter to determine when to switch stone color. Stones are drawn on the fly by canvas
  playcount = 0;
  color = godash.BLACK;

  // Object that stores chess pieces that can be used on Canvas. Pieces retrieved from Font Awesome.
  const chess_pieces = {
    king: "\uf43f",
    queen: "\uf445",
    pawn: "\uf443",
    knight: "\uf441",
    rook: "\uf447",
    bishop: "\uf43a",
  };

  // Object that keeps track of go/weiqi/baduk state of game, courtesy of godash
  var go_board = new godash.Board(9);

  // Event listener for clicks on the board
  canvas.addEventListener("click", (event) => {
    // Finding where on the board the click happened
    let x_point = event.clientX - canvas.offsetLeft;
    let y_point = Math.floor(
      event.clientY - canvas.offsetTop + window.pageYOffset
    );
    x_true = 0;
    y_true = 0;

    // Code to find the nearest playable point to the clicked pixel, if within a certain range. Uses lodash
    x_range = _.range(x_point - 20, x_point + 21, 1);
    y_range = _.range(y_point - 20, y_point + 21, 1);
    for (let x of x_range) {
      for (let y of y_range) {
        if (x % 75 == 0) {
          x_true = x;
        }
        if (y % 75 == 0) {
          y_true = y;
        }
      }
    }

    // Getting index of chosen point to pass to godash.board
    x_i = x_true / 75;
    y_i = y_true / 75;
    var point = new godash.Coordinate(x_i, y_i);

    // Placing a game piece (a stone) on the relevant point
    context.beginPath();
    context.arc(x_true, y_true, boxsize / 3, 0, 2 * Math.PI, true);
    if (playcount % 2 == 0) {
      color = godash.BLACK;
    } else {
      color = godash.WHITE;
    }
    context.fillStyle = color;
    if (x_true != 0 && y_true != 0) context.fill();
    playcount++;
    go_board = godash.addMove(go_board, point, color);
    console.log(go_board.moves.toString());
  });
});
