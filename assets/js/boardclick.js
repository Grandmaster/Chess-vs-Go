// Code that handles the click events that happen on the board.
// ================================================================

// Layer of canvas that will have the go stones
const canvas_go = document.getElementById("go_layer");
canvas_go.width = 750;
canvas_go.height = 750;
var ctx = canvas_go.getContext("2d");

$(document).ready(() => {
  // Black goes first
  color = godash.BLACK;

  // Object that stores chess pieces that can be used on Canvas, by storing the url of the image;
  // Pieces made in Krita.
  const chess_pieces = {
    pawn: "./images/Pawn.png",
  };

  // Object that keeps track of go/weiqi/baduk state of game, courtesy of godash
  var go_board = new godash.Board(9);

  // Event listener for clicks on the board
  canvas_go.addEventListener("click", (event) => {
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
    x_i = x_true / 75 - 1;
    y_i = y_true / 75 - 1;
    var point = new godash.Coordinate(x_i, y_i);

    // Placing a game piece (a stone) on the relevant point
    go_board = godash.addMove(go_board, point, color);
    if (x_true != -1 && y_true != -1) {
      currentGoBoard(go_board, ctx, canvas_go.width, canvas_go.height, boxsize);
      var img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 350, 350, 70, 70);
      };
      img.src = chess_pieces.pawn;
      console.log(img);
    }
    color = godash.oppositeColor(color);
  });
});
