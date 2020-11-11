// Code for various manipulations of the chess portion of the game
// =========================================================================

// Variable that keeps track of pieces in play
var pieces_in_play = [];

// Function that creates and keeps track of chess pieces added to the board
function placePiece(x, y, piece, type) {
  // Creating new object that represents piece, and putting it in play
  var newpiece = {
    x_pos: x,
    y_pos: y,
    type: type,
  };
  pieces_in_play.push(newpiece);
  console.log(pieces_in_play);

  // Placing the piece on the board
  var img = new Image();
  img.onload = () => {
    ctx.drawImage(img, x, y, boxsize, boxsize);
  };
  img.src = piece;
}
