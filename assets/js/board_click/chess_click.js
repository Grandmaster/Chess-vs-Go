// Code that handles the chess click events that happen on the board.
// =============================================================================

// Layer of canvas with the chess pieces
const canvas_chess = document.getElementById("chess_layer");
canvas_chess.width = 750;
canvas_chess.height = 750;
var contxt = canvas_chess.getContext("2d");

// Object that stores chess pieces that can be used on Canvas, by storing the url of the image;
// Pieces made in Krita.
var chess_piece = {
  pawn: "./images/Pawn.png",
};

$(document).ready(() => {
  // Event listener for clicks on the board
  canvas_chess.addEventListener("click", (event) => {
    // Since this is the top layer, pass click event to go_layer with mouse location
    var clickEvent = new MouseEvent("click", {
      clientX: event.clientX,
      clientY: event.clientY,
    });
    canvas_go.dispatchEvent(clickEvent);

    // Finding where on the board the click happened
    let x_point = event.clientX - canvas.offsetLeft;
    let y_point = Math.floor(
      event.clientY - canvas.offsetTop + window.pageYOffset
    );

    // The piece images are drawn from the top-left corner of the squares. So those are the target pixels
    xp = Math.floor(x_point - boxsize / 2);
    yp = Math.floor(y_point - boxsize / 2);
    x_true = 0;
    y_true = 0;

    // Code to find the nearest playable point to the target pixel, if within a certain range. Uses lodash
    x_range = _.range(xp - 20, xp + 21, 1);
    y_range = _.range(yp - 20, yp + 21, 1);
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

    // Placing the relevant piece (a pawn, for now) on the target square
    if (x_true != 0 && y_true != 0) {
      var img = new Image();
      img.onload = () => {
        ctx.drawImage(img, x_true, y_true, boxsize, boxsize);
      };
      img.src = chess_piece.pawn;
      console.log(img);
    }
  });
});
