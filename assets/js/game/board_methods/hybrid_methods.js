// Javascript file for handling interactions between the two layers of the game, the chess and go layers.
//================================================================================================================

// Socket global variable
var socket = io();

// Boolean that determines whether player has moved
var moved = false;

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

// Function to return stones at corners
function getStonesOnSquare(corners, board) {
  let s = [];
  corners.forEach((corner) => {
    s.push(board.moves.get(corner));
  });
  return s;
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
function pawnCapturesStone(piece, board, target, landing) {
  board = godash.removeStone(board, target);
  let xn = landing[0][0];
  let yn = landing[0][1];
  movePiece(piece, xn, yn);
  currentChessBoard(
    pieces_in_play,
    contxt,
    canvas_chess.width,
    canvas_chess.height,
    benches
  );
  currentGoBoard(board, ctx, canvas_go.width, canvas_go.height, boxsize);
  return board;
}

// In this game, when an official (except the king) having moved lands on a square with enemy stones on its vertices, it can
// convert one of them to a stone of its own color
function officialConvertsStone(piece, board, target, team, benches) {
  board = godash.removeStone(board, target);
  board = godash.placeStone(board, target, team, false);
  currentGoBoard(board, ctx, canvas_go.width, canvas_go.height, boxsize);
  currentChessBoard(
    pieces_in_play,
    contxt,
    canvas_chess.width,
    canvas_chess.height,
    benches
  );
  return board;
}

// In this game, when the king having moved lands on a square with friendly stones on its vertices and at least one
// empty vertex, it can move a friendly stone from its position to an empty vertex on the square it landed on
function kingMovesStones(piece, board, target, vacancy, team) {
  board = godash.removeStone(board, target);
  board = godash.addMove(board, vacancy, team);
  currentGoBoard(board, ctx, canvas_go.width, canvas_go.height, boxsize);
  currentChessBoard(
    pieces_in_play,
    contxt,
    canvas_chess.width,
    canvas_chess.height,
    benches
  );

  // Resetting for next instance
  flyingStone = "undefined";
  landingPoint = "undefined";
  royalPiece = 0;
  return board;
}

// In this game, stones can, in certain configurations, restrict the movement of enemy pieces (except the
// knight). This function deals with the restriction of pawns and kings
function stonesRestrictPawnAndKing(piece, board, range, context) {
  let x = piece.x_pos;
  let y = piece.y_pos;
  let color = piece.type.slice(0, 5);
  let type = piece.type.slice(6);
  let ecolor = switchColor(color);
  let corners = stonesCornerSquare([x, y]);
  let stones = [];
  // This goes in the order: tl, tr, bl, br
  for (let c of corners) {
    stone = board.moves.get(c);
    stones.push(stone);
  }

  // Boolean for the diagonal squares, to help in restricting king moves. The booleans become
  // true when the diagonal squares have been removed from the range of the king
  let diagonal = {
    tl: false,
    tr: false,
    bl: false,
    br: false,
  };

  // Stopping the pawn/king from making lateral moves, and also stopping the king
  // from making diagonal moves, based on certain stone arrangements
  if (stones[0] == ecolor && stones[1] == ecolor) {
    let i = findSquare(x, y - 1, range);
    let sq = range.splice(i, 1).flat();
    shadedPattern(context, sq, ecolor);
    if (type == "king" && stones[2] == ecolor && !diagonal.tl) {
      let j = findSquare(x - 1, y - 1, range);
      sq_j = range.splice(j, 1).flat();
      shadedPattern(context, sq_j, ecolor);
      diagonal.tl = true;
      console.log("tl");
    }
    if (type == "king" && stones[3] == ecolor && !diagonal.tr) {
      let j = findSquare(x + 1, y - 1, range);
      sq_j = range.splice(j, 1).flat();
      shadedPattern(context, sq_j, ecolor);
      diagonal.tr = true;
      console.log("tr");
    }
  }
  if (stones[2] == ecolor && stones[3] == ecolor) {
    let i = findSquare(x, y + 1, range);
    let sq = range.splice(i, 1).flat();
    shadedPattern(context, sq, ecolor);
    if (type == "king" && stones[1] == ecolor && !diagonal.br) {
      let j = findSquare(x + 1, y + 1, range);
      sq_j = range.splice(j, 1).flat();
      shadedPattern(context, sq_j, ecolor);
      diagonal.br = true;
      console.log("br");
    }
    if (type == "king" && stones[0] == ecolor && !diagonal.bl) {
      let j = findSquare(x - 1, y + 1, range);
      sq_j = range.splice(j, 1).flat();
      shadedPattern(context, sq_j, ecolor);
      diagonal.bl = true;
      console.log("bl");
    }
  }
  if (stones[0] == ecolor && stones[2] == ecolor) {
    let i = findSquare(x - 1, y, range);
    let sq = range.splice(i, 1).flat();
    shadedPattern(context, sq, ecolor);
  }
  if (stones[1] == ecolor && stones[3] == ecolor) {
    let i = findSquare(x + 1, y, range);
    let sq = range.splice(i, 1).flat();
    shadedPattern(context, sq, ecolor);
  }
}

// In this game, chess pieces other than the king can only be brought to the field by dropping
// them in zones that are under the control of the player. This function takes in the
// field variable created by calculateTerritory.
// It wouldn't be an exaggeration to say this function is the lynchpin of this app
function displayZones(board, field, context) {
  // Generating range for chess board
  var rx = Array.from({ length: 8 }, (_, i) => i + 1);
  var ry = rx;
  var range = [];
  for (let i of rx) {
    for (let j of ry) {
      range.push([i, j]);
    }
  }
  let regions = {};
  // Break parameter
  let b = 0;
  while (b < 2) {
    let color = b % 2 == 0 ? "black" : "white";
    let area;
    let ecolor = switchColor(color);
    let zones = [];
    // Pulling regions of territory from the field
    if (color == "black") {
      area = field.filter((elem) => {
        return elem[0] > 0 && elem[1] == 0;
      });
    } else if (color == "white") {
      area = field.filter((elem) => {
        return elem[0] == 0 && elem[1] > 0;
      });
    }
    area = area.flat().filter((elem) => {
      return typeof elem !== "number";
    });
    // Getting info from corners of each square
    for (let square of range) {
      let corners = stonesCornerSquare(square);
      let stones = [];
      for (let c of corners) {
        let stone = board.moves.get(c);
        stones.push(stone);
      }
      // Go to next square if one of the corners contains an enemy stone
      if (stones.includes(ecolor)) continue;

      // Check if empty nodes belong to territory of player
      if (stones.includes(undefined)) {
        let emptynodes = stones.flatMap((stone, i) => {
          return stone === undefined ? i : [];
        });
        let f = 0;
        for (let i of emptynodes) {
          let c = corners[i];
          for (let z of area) {
            let coord = z;
            if (coord.x == c.x && coord.y == c.y) {
              f++;
            }
          }
        }
        // Go to next square if some empty nodes are in neutral territory
        if (f !== emptynodes.length) continue;
        // Finally, if all empty nodes belong to territory of player, add square to zones
        if (f == emptynodes.length) zones.push(square);
      }

      // Add square to zones if the previous two cases don't apply i.e. if
      // all the corners contain stones belonging to the player
      if (!stones.includes(ecolor) && !stones.includes(undefined)) {
        zones.push(square);
      }
    }
    // Displaying zones
    for (let sq of zones) {
      honeycombPattern(context, sq, color);
    }
    // Variable to return
    switch (color) {
      case "black":
        regions.black = zones;
        break;
      case "white":
        regions.white = zones;
    }
    b++;
  }
  return regions;
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

// Function to draw zone pattern on canvas, implemented by tiling.js
var honeycombPattern;
