// Javascript file for handling interactions between the two layers of the game, the chess and go layers.
//================================================================================================================

// Need to kill the king when he wanders into enemy territory
// Square counts as under a player's territory if, for each of its four corners:
// - It is occupied by a player's stone, or
// - The point is empty, but falls under territory (go) controlled by the player

// Boolean that determines whether there is an opportunity for a pawn to capture a stone
var stonesCanBeCaptured = false;

// Boolean that determines whether there is an opportunity for an official to convert a stone
var stonesCanBeConverted = false;

// Boolean that determines whether there is an opportunity for the king to move a stone
var stonesCanBeMoved = false;

// Stones the pawn can capture
var targetStones = [];

// Stones the official can convert
var naiveStones = [];

// Stones the king can move
var flyingStones = [];

// Points the king can move stones to
var empties = [];

// Stone selected by king
var flyingStone;

// Point selected by king
var landingPoint;

// Pawn that is in position to capture
var crouchingPiece;

// Official that is in position to convert
var forcingPiece;

// King that is in position to shift stones
var royalPiece;

// Function to locate stones on the vertices of a given square
function stonesCornerSquare(square) {
  let x = square[0];
  let y = square[1];
  // Coordinates of corners of square, from go canvas layer
  let tl = new godash.Coordinate(x - 1, y - 1);
  let tr = new godash.Coordinate(x, y - 1);
  let bl = new godash.Coordinate(x - 1, y);
  let br = new godash.Coordinate(x, y);
  return [tl, tr, bl, br];
}

// Function to locate square pawn would move to if it captures stone. Takes target stone coords
function pawnLandingSquares(piece, targets) {
  let arr = [];
  let x = piece.x_pos;
  let y = piece.y_pos;
  targets.forEach((element) => {
    let xc = element.x;
    let yc = element.y;
    // Using corners of square to locate diagonal squares
    if (xc == x - 1 && yc == y - 1) {
      arr.push([x - 1, y - 1]);
    } else if (xc == x && yc == y - 1) {
      arr.push([x + 1, y - 1]);
    } else if (xc == x - 1 && yc == y) {
      arr.push([x - 1, y + 1]);
    } else if (xc == x && yc == y) {
      arr.push([x + 1, y + 1]);
    }
  });
  return arr;
}

// Function to display the fact that certain stones are available for capture or conversion
function displayCaptureStones(targets, context, color) {
  targets.forEach((element) => {
    let x = (element.x + 1) * boxsize;
    let y = (element.y + 1) * boxsize;
    context.beginPath();
    context.arc(x, y, boxsize / 5, 0, 2 * Math.PI, true);
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.stroke();
  });
}

// In this game, pawns can kill stones by capturing them, which moves the pawn to the square diagonal to
// its previous square, connected by the stone
function pawnCapturesStone(piece, board, target, landing, team) {
  board = godash.removeStone(board, target);
  let color = piece.type.slice(0, 5);
  currentGoBoard(board, ctx, canvas_go.width, canvas_go.height, boxsize);
  let xn = landing[0][0];
  let yn = landing[0][1];
  movePiece(piece, xn, yn);
  currentChessBoard(
    pieces_in_play,
    contxt,
    canvas_chess.width,
    canvas_chess.height
  );
  team = godash.oppositeColor(color);
  return [board, team];
}

// In this game, when an official (except the king) having moved lands on a square with enemy stones on its vertices, it can
// convert one of them to a stone of its own color
function officialConvertsStone(piece, board, target, team) {
  let color = piece.type.slice(0, 5);
  board = godash.removeStone(board, target);
  board = godash.placeStone(board, target, color, false);
  currentGoBoard(board, ctx, canvas_go.width, canvas_go.height, boxsize);
  currentChessBoard(
    pieces_in_play,
    contxt,
    canvas_chess.width,
    canvas_chess.height
  );
  team = godash.oppositeColor(color);
  return [board, team];
}

// In this game, when the king having moved lands on a square with friendly stones on its vertices and at least one
// empty vertex, it can move a friendly stone from its position to an empty vertex on the square it landed on
function kingMovesStones(piece, board, target, vacancy, team) {
  let color = piece.type.slice(0, 5);
  board = godash.removeStone(board, target);
  board = godash.addMove(board, vacancy, color);
  currentGoBoard(board, ctx, canvas_go.width, canvas_go.height, boxsize);
  currentChessBoard(
    pieces_in_play,
    contxt,
    canvas_chess.width,
    canvas_chess.height
  );
  team = godash.oppositeColor(color);

  // Resetting for next instance
  flyingStone = "undefined";
  landingPoint = "undefined";
  royalPiece = 0;
  return [board, team];
}

// In this game, stones can, in certain configurations, restrict the movement of enemy pieces (except the
// knight). This function deals with the restriction of pawns and kings
function stonesRestrictKing(piece, board, range) {
  let x = piece.x_pos;
  let y = piece.y_pos;
  let color = piece.type.slice(0, 5);
  let corners = stonesCornerSquare([x, y]);
  let stones = [];
  // This goes in the order: tl, tr, bl, br
  for (let c of corners) {
    stone = board.moves.get(c);
    stones.push(stone);
  }
}

// Function to draw shaded pattern on canvas
function shadedPattern(context, square, color) {
  // Create a pattern, offscreen
  var patternCanvas = document.createElement("canvas");
  var patternContext = patternCanvas.getContext("2d");
  patternCanvas.width = boxsize / 8;
  patternCanvas.height = boxsize / 8;

  // Creating pattern
  patternContext.strokeStyle = color;
  patternContext.fillStyle = color;
  patternContext.lineWidth = 3;
  patternContext.beginPath();
  patternContext.moveTo(boxsize / 8, 0);
  patternContext.lineTo(0, boxsize / 8);
  patternContext.stroke();
  patternContext.beginPath();
  patternContext.moveTo(boxsize / 30, 0);
  patternContext.lineTo(0, boxsize / 30);
  patternContext.lineTo(0, 0);
  patternContext.closePath();
  patternContext.fill();
  patternContext.beginPath();
  patternContext.moveTo(boxsize / 8, boxsize / 8 - boxsize / 30);
  patternContext.lineTo(boxsize / 8 - boxsize / 30, boxsize / 8);
  patternContext.lineTo(boxsize / 8, boxsize / 8);
  patternContext.closePath();
  patternContext.fill();

  // Printing pattern on chess layer
  let x = square[0] * boxsize;
  let y = square[1] * boxsize;
  let pattern = context.createPattern(patternCanvas, "repeat");
  context.fillStyle = pattern;
  context.fillRect(x, y, boxsize, boxsize);
}
