// Code that handles the chess click events that happen on the board.
// =============================================================================

// Layer of canvas with the chess pieces
const canvas_chess = document.getElementById("chess_layer");
canvas_chess.width = 750;
canvas_chess.height = 750;
var contxt = canvas_chess.getContext("2d");

// Object that stores chess pieces that can be used on Canvas, by storing the url of the image;
// Pieces made in Krita.
const chess_pieces = {
  black_pawn: "./images/Pawn - black.png",
  white_pawn: "./images/Pawn - white.png",
  black_king: "./images/King - black.png",
  white_king: "./images/King - white.png",
  black_knight: "./images/Knight - black.png",
  white_knight: "./images/Knight - white.png",
  black_rook: "./images/Rook - black.png",
  white_rook: "./images/Rook - white.png",
  black_bishop: "./images/Bishop - black.png",
  white_bishop: "./images/Bishop - white.png",
  black_queen: "./images/Queen - black.png",
  white_queen: "./images/Queen - white.png",
};

// Options of piece to put on board
var options = document.getElementById("choice");

// Fill benches
var benches = fillBench(chess_pieces);

$(document).ready(() => {
  // Black goes first, for now
  var color = "black";

  // Event listener for clicks on the board
  canvas_chess.addEventListener("click", (event) => {
    // Finding where on the board the click happened
    var rect = canvas_chess.getBoundingClientRect();
    let x_point = Math.floor(event.clientX - rect.left);
    let y_point = Math.floor(event.clientY - rect.top);

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

    // Getting index of chosen square, for movement
    x_i = x_true / 75;
    y_i = y_true / 75;
    arr = [x_i, y_i];

    // Placing the relevant piece on the target square
    if (x_true != 0 && y_true != 0) {
      // Populate move_queue with possible moves and captures if existing piece is clicked on, and move_queue is empty
      var c = 0;
      if (move_queue.length == 0) {
        for (let piece of pieces_in_play) {
          if (piece.x_pos == x_i && piece.y_pos == y_i) {
            possibleMoves(piece, pieces_in_play, goBoardforChess);
            var piecetype = piece.type.slice(6);
            if (piecetype == "pawn") {
              possiblePawnCaptures(piece, pieces_in_play);
            }
            c++;
          }
        }
      }

      // Move existing piece and/or capture, if move_queue is not empty
      if (move_queue.length != 0 && c == 0) {
        pmoves = move_queue[1];
        captures = move_queue[2];
        for (let capture of captures) {
          if (sameSquare(arr, capture)) {
            var p = findPiece(x_i, y_i, pieces_in_play);
            capturePiece(p, pieces_in_play, benches);
            pmoves = pmoves.concat(captures);
          }
        }
        for (let move of pmoves) {
          if (sameSquare(move, arr)) {
            var piece = move_queue[0];
            movePiece(piece, x_i, y_i, goBoardforChess);
            currentChessBoard(
              pieces_in_play,
              contxt,
              canvas_chess.width,
              canvas_chess.height,
              benches
            );
            if (naiveStones.length == 0 && flyingStones.length == 0) {
              currentGoBoard(
                goBoardforChess,
                ctx,
                canvas_go.width,
                canvas_go.height,
                boxsize
              );
            }
            color = switchColor(color);
            c++;
          }
        }
      }

      // Display piece options if player wants to place a piece on an empty square
      if (c == 0 && place_queue.length == 0) {
        options.style.display = "block";
        options.style.left = x_i;
        options.style.top = y_i;
      }

      // Place piece if the first two cases don't apply, and place_queue is not empty
      if (c == 0 && place_queue.length !== 0) {
        var piece = place_queue.pop();
        switch (color) {
          case "black":
            placePiece(x_i, y_i, piece.img, piece.type);
            break;

          case "white":
            placePiece(x_i, y_i, piece.img, piece.type);
        }
        currentChessBoard(
          pieces_in_play,
          contxt,
          canvas_chess.width,
          canvas_chess.height,
          benches
        );
        currentGoBoard(
          goBoardforChess,
          ctx,
          canvas_go.width,
          canvas_go.height,
          boxsize
        );

        // Switch color after every move
        color = switchColor(color);
      }
      console.log(benches);
    }
  });
});
