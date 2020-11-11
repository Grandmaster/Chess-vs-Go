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
    contxt.drawImage(img, x * 75, y * 75, boxsize, boxsize);
  };
  img.src = piece;
}

// Function that highlights possible locations to move existing piece on board
function possibleMoves(piece_obj) {
  // In this game, pawns can make one move in any cardinal direction, not just forward.

  // All possible locations the piece can move to (pawn)
  var xp = [piece_obj.x_pos - 1, piece_obj.x_pos + 1];
  var yp = [piece_obj.y_pos - 1, piece_obj.y_pos + 1];

  // Highlighting the squares that the piece can move to
  for (let x of xp) {
    for (let y of yp) {
      x_point = x * boxsize;
      y_point = y * boxsize;
      context.fillStyle = "green";
      context.fillRect(x_point, y_point, boxsize, boxsize);
    }
  }
}
// Function that moves a piece already on the board (pawns only, for now)
function movePiece(piece_obj, x_new, y_new) {}
