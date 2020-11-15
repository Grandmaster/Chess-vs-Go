// Code for various manipulations of the chess portion of the game
// =========================================================================

// Variable that keeps track of pieces in play
var pieces_in_play = [];

// Keeping track of possible moves, in case player wants to move existing piece or place a piece
var move_queue = [];
var place_queue = [];

// Function that constructs the board on canvas from internal state
function currentChessBoard(piece_array, context, width, height) {
  context.clearRect(0, 0, width, height);

  // Display each piece in the array on canvas, at relevant squares
  piece_array.forEach((val) => {
    renderPiece(val, context);
  });
}

// Function that draws the image of the piece on the canvas
function renderPiece(piece_obj, context) {
  var img = new Image();
  img.onload = () => {
    context.drawImage(
      img,
      piece_obj.x_pos * boxsize,
      piece_obj.y_pos * boxsize,
      boxsize,
      boxsize
    );
  };
  img.src = piece_obj.img;
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
function possibleMoves(piece_obj, game_array) {
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
    var present_piece = findPiece(x, piece_obj.y_pos, game_array);
    if (typeof present_piece !== "undefined") {
      renderPiece(present_piece, contxt);
    }
    moves.push([x, piece_obj.y_pos]);
  }
  for (let y of yp) {
    y_point = y * boxsize;
    x_point = piece_obj.x_pos * boxsize;
    contxt.fillStyle = "green";
    contxt.fillRect(x_point, y_point, boxsize, boxsize);
    var present_piece = findPiece(piece_obj.x_pos, y, game_array);
    if (typeof present_piece !== "undefined") {
      renderPiece(present_piece, contxt);
    }
    moves.push([piece_obj.x_pos, y]);
  }

  // Storing options in move_queue
  move_queue.push(piece_obj);
  move_queue.push(moves);
}

// Function that highlights possible captures by chosen pawns (different than movement for pawns only)
function possiblePawnCaptures(piece_obj, game_array) {
  // In this game, pawns can capture both forward and backward

  // All possible locations the pawn can capture to, highlighted in red
  var xp = [piece_obj.x_pos - 1, piece_obj.x_pos + 1];
  var yp = [piece_obj.y_pos - 1, piece_obj.y_pos + 1];
  var captures = [];
  for (let x of xp) {
    for (let y of yp) {
      for (let piece of game_array) {
        if (
          piece.x_pos == x &&
          piece.y_pos == y &&
          piece_obj.type !== piece.type
        ) {
          x_point = x * boxsize;
          y_point = y * boxsize;
          contxt.fillStyle = "red";
          contxt.fillRect(x_point, y_point, boxsize, boxsize);
          var present_piece = findPiece(x, y, game_array);
          if (typeof present_piece !== "undefined") {
            renderPiece(piece, contxt);
          }
          captures.push([x, y]);
        }
      }
    }
  }
  // Adding captures to move_queue
  move_queue.push(captures);
}
// Function that moves a piece already on the board
function movePiece(piece_obj, x_new, y_new) {
  piece_obj.x_pos = x_new;
  piece_obj.y_pos = y_new;
}

// Function that captures a piece if moved onto by another
function capturePiece(piece, array) {
  var l = array.indexOf(piece);
  array.splice(l, 1);
}

// Function that switches the color of play
function switchColor(color) {
  switch (color) {
    case "black":
      return "white";
    case "white":
      return "black";
  }
}

// Function that returns a specific piece given its location
function findPiece(x, y, array) {
  return array.find((element) => {
    return element.x_pos == x && element.y_pos == y;
  });
}

// Function that displays choice of piece to insert on bench
function choosePiece(piece, bbench, wbench) {
  var choice = piece.replace(/ /, "_");
  var color = choice.slice(0, 5);
  switch (color) {
    case "black":
      return bbench.find((element) => {
        return element.type == choice;
      });
    case "white":
      return wbench.find((element) => {
        return element.type == choice;
      });
  }
}

// Function that fills the bench of each player
function fillBench(pieces) {
  // There should be 8 pawns, 2 officials of each type, 1 queen and 1 king on a bench

  var black_bench = [];
  var white_bench = [];

  for (let name in pieces) {
    var piece = {
      type: name,
      img: pieces[name],
    };
    switch (name) {
      case "black_pawn":
        black_bench = black_bench.concat(Array(8).fill(piece));
        break;
      case "white_pawn":
        white_bench = white_bench.concat(Array(8).fill(piece));
        break;
      case "black_king":
        black_bench.push(piece);
        break;
      case "white_king":
        white_bench.push(piece);
    }
  }
  return {
    black: black_bench,
    white: white_bench,
  };
}
