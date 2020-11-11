// Code for various manipulations of the chess portion of the game
// =========================================================================

// Variable that keeps track of pieces in play
var pieces_in_play = [];

// Keeping track of possible moves, in case player wants to move existing piece
var queue = [];

// Function that constructs the board on canvas from internal state
function currentChessBoard(piece_array, context, width, height) {
  context.clearRect(0, 0, width, height);

  // Display each piece in the array on canvas, at relevant squares
  piece_array.forEach((val) => {
    var img = new Image();
    img.onload = () => {
      context.drawImage(img, val.x_pos * 75, val.y_pos * 75, boxsize, boxsize);
    };
    img.src = val.img;
  });
}

// Function that creates and keeps track of chess pieces added to the board
function placePiece(x, y, piece, type) {
  // Creating new object that represents piece, and putting it in play
  var newpiece = {
    x_pos: x,
    y_pos: y,
    type: type,
    img: piece,
  };
  pieces_in_play.push(newpiece);
}

// Function that highlights possible locations to move existing piece on board
function possibleMoves(piece_obj) {
  // In this game, pawns can make one move in any cardinal direction, not just forward.

  // All possible locations the piece can move to (pawn)
  var xp = [piece_obj.x_pos - 1, piece_obj.x_pos + 1];
  var yp = [piece_obj.y_pos - 1, piece_obj.y_pos + 1];
  var moves = [];

  // Highlighting the squares that the piece can move to
  for (let x of xp) {
    x_point = x * boxsize;
    y_point = piece_obj.y_pos * boxsize;
    contxt.fillStyle = "green";
    contxt.fillRect(x_point, y_point, boxsize, boxsize);
    moves.push([x, piece_obj.y_pos]);
  }
  for (let y of yp) {
    y_point = y * boxsize;
    x_point = piece_obj.x_pos * boxsize;
    contxt.fillStyle = "green";
    contxt.fillRect(x_point, y_point, boxsize, boxsize);
    moves.push([piece_obj.x_pos, y]);
  }

  // Storing options in queue
  queue.push(piece_obj);
  queue.push(moves);
}
// Function that moves a piece already on the board (pawns only, for now)
function movePiece(piece_obj, x_new, y_new) {
  piece_obj.x_pos = x_new;
  piece_obj.y_pos = y_new;
}
