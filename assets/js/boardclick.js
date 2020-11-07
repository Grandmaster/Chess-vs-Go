// Code that handles the click events that happen on the board.
// ================================================================

// Counter to determine when to switch stone color. Stones are drawn on the fly by canvas
playcount = 0;

// Object that stores chess pieces that can be used on Canvas. Pieces retrieved from Font Awesome.
const chess_pieces = {
  king: "\uf43f",
  queen: "\uf445",
  pawn: "\uf443",
  knight: "\uf441",
  rook: "\uf447",
  bishop: "\uf43a",
};

// Event listener for clicks on the board
canvas.addEventListener("click", (event) => {
  // Finding where on the board the click happened
  let x_point = event.clientX - canvas.offsetLeft;
  let y_point = event.clientY - canvas.offsetTop;
  console.log([x_point, y_point]);

  // Placing a game piece (a stone) on the relevant point
  context.beginPath();
  context.arc(x_point, y_point, boxsize / 3, 0, 2 * Math.PI, true);
  if (playcount % 2 == 0) {
    context.fillStyle = "black";
  } else context.fillStyle = "white";
  context.fill();
  playcount++;
});
