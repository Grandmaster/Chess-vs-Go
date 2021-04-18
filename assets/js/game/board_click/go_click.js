// Code that handles the go/weiqi/baduk click events that happen on the board.
// ================================================================

// Layer of canvas that will have the go stones
const canvas_go = document.getElementById("go_layer");
canvas_go.width = 750;
canvas_go.height = 750;
var ctx = canvas_go.getContext("2d");

// Go board variable to pass to chess side of the game
var goBoardforChess;

// Initialize socket
var socket = io();

// Getting data from storage
var color = localStorage.getItem("color");
var roomname = localStorage.getItem("game");

$(document).ready(() => {
  // Object that keeps track of go/weiqi/baduk state of game, courtesy of godash
  var go_board = new godash.Board(9);
  goBoardforChess = go_board;

  // Event listener for clicks on the board
  canvas_go.addEventListener("click", (event) => {
    // Since this is the top layer, pass event to chess layer with mouse location,
    // also pass to backend for multiplayer
    var clickEvent = new MouseEvent("click", {
      clientX: event.clientX,
      clientY: event.clientY,
    });
    canvas_chess.dispatchEvent(clickEvent);

    // Finding where on the board the click happened
    var rect = canvas_go.getBoundingClientRect();
    let x_point = Math.floor(event.clientX - rect.left);
    let y_point = Math.floor(event.clientY - rect.top);
    let x_true = 0;
    let y_true = 0;

    // Code to find the nearest playable point to the clicked pixel, if within a certain range. Uses lodash
    let x_range = _.range(x_point - 20, x_point + 21, 1);
    let y_range = _.range(y_point - 20, y_point + 21, 1);
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

    // Getting index of chosen point to pass to godash.board
    let x_i = x_true / 75 - 1;
    let y_i = y_true / 75 - 1;

    // Gameplay on the relevant point
    if (x_i != -1 && y_i != -1) {
      var point = new godash.Coordinate(x_i, y_i);
      let stone = go_board.moves.get(point);

      // Check to see if point is a location the king can move a stone to
      let i = -1;
      for (let j of empties) {
        if (point.x == j.x && point.y == j.y) {
          i = empties.indexOf(j);
        }
      }

      // Check to see if king is present or if the player has moved, if not present or yes do nothing
      if (!kings[color] || moved) {
        console.log("Either put your king on the board, or wait for your turn");
      } else {
        // Capturing a stone with a pawn if all conditions are met
        if (stone !== undefined && stonesCanBeCaptured) {
          let l = pawnLandingSquares(crouchingPiece, [point]);
          let r = pawnCapturesStone(crouchingPiece, go_board, point, l, color);
          go_board = r;

          // Calculating territory controlled by each player, and displaying it
          calculateTerritory(go_board, ctx);

          // Updating chess version of go board for hybrid methods
          goBoardforChess = go_board;

          // Resetting for next instance
          stonesCanBeCaptured = false;
          crouchingPiece = 0;

          // Sending move to opponent, and waiting for reply
          let goBoardforSocket = arrayOfMoves(go_board);
          socket.emit(
            "send move",
            goBoardforSocket,
            pieces_in_play,
            benches,
            roomname
          );
          moved = true;
        } else if (stone !== undefined && stonesCanBeConverted) {
          // Converting a stone with an official if all conditions are met
          let r = officialConvertsStone(
            forcingPiece,
            go_board,
            point,
            color,
            benches
          );
          go_board = r;

          // Calculating territory controlled by each player, and displaying it
          calculateTerritory(go_board, ctx);

          // Updating chess version of go board for hybrid methods
          goBoardforChess = go_board;

          // Resetting for next instance
          stonesCanBeConverted = false;
          forcingPiece = 0;

          // Sending move to opponent, and waiting for reply
          let goBoardforSocket = arrayOfMoves(go_board);
          socket.emit(
            "send move",
            goBoardforSocket,
            pieces_in_play,
            benches,
            roomname
          );
          moved = true;
        } else if (stone !== undefined && stonesCanBeMoved) {
          // Selecting a stone for the king to move
          flyingStone = point;
          currentGoBoard(
            go_board,
            ctx,
            canvas_go.width,
            canvas_go.height,
            boxsize
          );
          displayCaptureStones([point], ctx, "green");
        } else if (stone == undefined && stonesCanBeMoved && i !== -1) {
          // Moving the stone selected by the king to a new spot when all conditions are met
          landingPoint = point;
          let r = kingMovesStones(
            royalPiece,
            go_board,
            flyingStone,
            landingPoint,
            color
          );
          go_board = r;

          // Calculating territory controlled by each player, and displaying it
          calculateTerritory(go_board, ctx);

          // Updating chess version of go board for hybrid methods
          goBoardforChess = go_board;

          // Resetting for next instance
          stonesCanBeMoved = false;
          royalPiece = 0;
          empties = [];

          // Sending move to opponent, and waiting for reply
          let goBoardforSocket = arrayOfMoves(go_board);
          socket.emit(
            "send move",
            goBoardforSocket,
            pieces_in_play,
            benches,
            roomname
          );
          moved = true;
        } else {
          // Placing a stone on the relevant point, if it's empty
          go_board = godash.addMove(go_board, point, color);
          currentGoBoard(
            go_board,
            ctx,
            canvas_go.width,
            canvas_go.height,
            boxsize
          );

          // Calculating territory controlled by each player, and displaying it
          calculateTerritory(go_board, ctx);

          // Updating chess version of go board for hybrid methods
          goBoardforChess = go_board;

          // Updating chess board
          currentChessBoard(
            pieces_in_play,
            contxt,
            canvas_chess.width,
            canvas_chess.height,
            benches
          );

          // Cleanup
          empties = [];

          // Sending move to opponent, and waiting for reply
          let goBoardforSocket = arrayOfMoves(go_board);
          socket.emit(
            "send move",
            goBoardforSocket,
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
  socket.on("receive move", (goboard, chessboard, _rosters) => {
    console.log("move received");
    if (goboard.length > 0) {
      go_board = reconstructBoard(goboard, godash);
      console.log(go_board);
      goBoardforChess = go_board;
      pieces_in_play = chessboard;
      moved = false;
      currentGoBoard(go_board, ctx, canvas_go.width, canvas_go.height, boxsize);
    }
  });
});
