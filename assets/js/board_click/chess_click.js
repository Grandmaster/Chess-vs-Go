// Code that handles the chess click events that happen on the board.
// =============================================================================

// Layer of canvas with the chess pieces
const canvas_chess = document.getElementById("chess_layer");
canvas_chess.width = 750;
canvas_chess.height = 750;
var contxt = canvas_chess.getContext("2d");

$(document).ready(() => {
  // Event listener for clicks on the board
  canvas_chess.addEventListener("click", (event) => {
    let x_point = event.clientX - canvas.offsetLeft;
    let y_point = Math.floor(
      event.clientY - canvas.offsetTop + window.pageYOffset
    );
    console.log([x_point, y_point]);
  });
});
