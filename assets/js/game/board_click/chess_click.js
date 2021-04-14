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

// Variable to determine if player has moved already
var moved_chess = moved;
var firstmove = false;

// Initialize socket
var socket = io();

// Display benches on page
const canvas_player = document.getElementById("your_bench");
const canvas_enemy = document.getElementById("enemy_bench");
canvas_player.width = 200;
canvas_enemy.width = 200;
canvas_player.height = 700;
canvas_enemy.height = 700;

// Getting data from storage, and joining game room with other player
var color = localStorage.getItem("color");
var roomname = localStorage.getItem("game");
socket.emit("game start", roomname);

renderBenches(benches, canvas_player, canvas_enemy, color);

$(document).ready(() => {
  // Event listener for clicks on the board
  canvas_chess.addEventListener("click", (event) => {
    // Finding where on the board the click happened
    var rect = canvas_chess.getBoundingClientRect();
    let x_point = Math.floor(event.clientX - rect.left);
    let y_point = Math.floor(event.clientY - rect.top);

    // The piece images are drawn from the top-left corner of the squares. So those are the target pixels
    let xp = Math.floor(x_point - boxsize / 2);
    let yp = Math.floor(y_point - boxsize / 2);
    let x_true = 0;
    let y_true = 0;

    // Code to find the nearest playable point to the target pixel, if within a certain range. Uses lodash
    let x_range = _.range(xp - 20, xp + 21, 1);
    let y_range = _.range(yp - 20, yp + 21, 1);
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
    let x_i = x_true / 75;
    let y_i = y_true / 75;
    let arr = [x_i, y_i];
    var c = 0;

    // Do nothing if player do not have a king on the board (unless it is the first move) or
    // if the player has already moved
    if ((!kings[color] && firstmove) || moved_chess) {
      console.log(`${color} lost already.`);
    } else {
      if (x_true != 0 && y_true != 0) {
        // Populate move_queue with possible moves and captures if existing piece is clicked on, and move_queue is empty
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
          let pmoves = move_queue[1];
          let captures = move_queue[2];
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
              // Sending move to opponent, and waiting for reply
              socket.emit(
                "send move",
                goBoardforChess,
                pieces_in_play,
                benches,
                roomname
              );
              moved_chess = true;
              c++;
            }
          }
        }
      }

      // Place piece if the first two cases don't apply, and place_queue is not empty
      if (c == 0 && place_queue.length !== 0) {
        piece = place_queue.pop();
        var type = piece.type.slice(6);
        if (type !== "king") {
          let land = displayZones(goBoardforChess, field, contxt)[color];
          let check = false;
          for (let sq of land) {
            if (sameSquare(sq, [x_i, y_i])) {
              placePiece(x_i, y_i, piece.img, piece.type, benches);
              check = true;
              break;
            }
          }
          if (!check) console.log("Not a valid landing zone");
        } else {
          placePiece(x_i, y_i, piece.img, piece.type, benches);
          kings[color] = true;
          firstmove = true;
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
        // Sending move to opponent, and waiting for reply
        socket.emit(
          "send move",
          goBoardforChess,
          pieces_in_play,
          benches,
          roomname
        );
        moved_chess = true;
      }
    }
  });

  // Receiving move from opponent
  socket.on("receive move", (goboard, chessboard, rosters) => {
    console.log("move received");
    goBoardforChess = goboard;
    pieces_in_play = chessboard;
    benches = rosters;
    moved_chess = false;
    currentChessBoard(
      pieces_in_play,
      contxt,
      canvas_chess.width,
      canvas_chess.height,
      benches
    );
  });
});
