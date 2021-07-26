// Code that handles the chess click events that happen on the board.
// =============================================================================

// Layer of canvas with the chess pieces
const canvas_chess = document.getElementById("chess_layer");
canvas_chess.width = canvas.width;
canvas_chess.height = canvas.width;
var contxt = canvas_chess.getContext("2d");

// Object that stores chess pieces that can be used on Canvas, by storing the url of the image;
// Pieces made in Krita.
const chess_pieces = {
  black_pawn: "./images/pieces/Pawn - black.png",
  white_pawn: "./images/pieces/Pawn - white.png",
  black_king: "./images/pieces/King - black.png",
  white_king: "./images/pieces/King - white.png",
  black_knight: "./images/pieces/Knight - black.png",
  white_knight: "./images/pieces/Knight - white.png",
  black_rook: "./images/pieces/Rook - black.png",
  white_rook: "./images/pieces/Rook - white.png",
  black_bishop: "./images/pieces/Bishop - black.png",
  white_bishop: "./images/pieces/Bishop - white.png",
  black_queen: "./images/pieces/Queen - black.png",
  white_queen: "./images/pieces/Queen - white.png",
};

// Options of piece to put on board
var options = document.getElementById("choice");

// Fill benches
var benches = fillBench(chess_pieces);

// Variable to determine if player/enemy has made their initial move
var firstmove = false;
var efirstmove = false;

// Variable to render go board as array for socket.io
var boardForSocket;

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
var turn = localStorage.getItem("order");
var tagname = localStorage.getItem("tag");
socket.emit("game start", roomname);

renderBenches(benches, canvas_player, canvas_enemy, color);

// Running turn timer
var time = 90000;
var etime = 90000; // milliseconds for the entire turn, equal to 1:30 mins
var names = $("h1 > span");
let t1 = names[0];
let t2 = names[2];
var timer;
var etimer;
if (t1.id == tagname) {
  timer = t1;
  etimer = t2;
} else {
  timer = t2;
  etimer = t1;
}
var turntimer = setInterval(function () {
  // Handling your turn
  timeKeeper(timer, time);
  var test = nextTurn(time, moved, turntimer, enemyturntimer, false, timer);
  if ((turn == "second" || moved) && !test) {
    ctx.font = "85px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "green";
    ctx.fillText(
      "Opponent's turn...",
      canvas_chess.width / 2,
      canvas_chess.height / 2
    );
    time = 90000;
    turn = null;
    timer.textContent = "(1:30)";
    moved = true;
  } else if (!moved) {
    time -= 1000;
  }
}, 1000);
var enemyturntimer = setInterval(function () {
  // Handling enemy turn
  timeKeeper(etimer, etime);
  nextTurn(etime, moved, enemyturntimer, turntimer, true, etimer);
  if (turn == "first" || !moved) {
    etime = 90000;
    turn = null;
    etimer.textContent = "(1:30)";
  } else if (moved) {
    etime -= 1000;
  }
}, 1000);

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
        if (x % boxsize == 0) {
          x_true = x;
        }
        if (y % boxsize == 0) {
          y_true = y;
        }
      }
    }

    // Getting index of chosen square, for movement
    let x_i = x_true / boxsize;
    let y_i = y_true / boxsize;
    let arr = [x_i, y_i];
    var c = 0;

    // Do nothing if player does not have a king on the board (unless it is the first move) or
    // if the player has already moved
    if ((!kings[color] && firstmove) || moved) {
      console.log("Either put your king on the board, or wait for your turn.");
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
          let captest = false;
          for (let capture of captures) {
            if (sameSquare(arr, capture)) {
              var p = findPiece(x_i, y_i, pieces_in_play);
              capturePiece(p, pieces_in_play, benches);
              pmoves = pmoves.concat(captures);
              captest = true;
              break;
            }
          }
          for (let move of pmoves) {
            if (sameSquare(move, arr)) {
              var piece = move_queue[0];
              movePiece(piece, x_i, y_i, goBoardforChess, captest);
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
                moved = true;
              }

              c++;
              break;
            }
          }
          // Sending move to opponent, and waiting for reply
          boardForSocket = arrayOfMoves(goBoardforChess);
          socket.emit(
            "send move",
            boardForSocket,
            pieces_in_play,
            benches,
            roomname
          );
        }

        // Place piece if the first two cases don't apply, and place_queue is not empty
        if (c == 0 && place_queue.length !== 0) {
          piece = place_queue.pop();
          var type = piece.type.slice(6);
          if (type !== "king" && type !== "pawn") {
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
          } else if (!firstmove && type == "pawn") {
            console.log("Your first move must place the king on the board.");
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
          boardForSocket = arrayOfMoves(goBoardforChess);
          socket.emit(
            "send move",
            boardForSocket,
            pieces_in_play,
            benches,
            roomname
          );
          moved = true;
        }
      }
    }
  });

  // Receiving move from opponent
  socket.on("receive move", (_goboard, chessboard, rosters) => {
    console.log("move received");
    pieces_in_play = chessboard;
    benches = rosters;
    moved = false;
    currentChessBoard(
      pieces_in_play,
      contxt,
      canvas_chess.width,
      canvas_chess.height,
      benches
    );
    efirstmove = true;
  });
});
