// Code for various manipulations of the chess portion of the game
// =========================================================================

// Variable that keeps track of pieces in play
var pieces_in_play = [];

// Keeping track of possible moves, in case player wants to move existing piece or place a piece
var move_queue = [];
var place_queue = [];

// Variable to keep track of the kings of both players, as their death ends the game
var kings = {
  black: false,
  white: false,
};

// Variable to keep track of whether the players have started the game
var firstmove = {
  black: false,
  white: false,
};

// Function that constructs the board on canvas from internal state
function currentChessBoard(piece_array, context, width, height, benches) {
  context.clearRect(0, 0, width, height);
  let arr = [];

  // Remove all pieces that are in zones of opposite color
  piece_array.forEach((val) => {
    let regions = displayZones(goBoardforChess, field, context);
    let deadPiece = false;
    let color = val.type.slice(0, 5);
    let ecolor = switchColor(color);
    let ezones = regions[ecolor];
    let ebench = benches[ecolor];
    let sq = [val.x_pos, val.y_pos];
    ezones.forEach((square) => {
      if (sameSquare(sq, square)) {
        deadPiece = true;
        delete val.x_pos;
        delete val.y_pos;
        val.type = val.type.replace(color, ecolor);
        val.img = val.img.replace(color, ecolor);
        ebench[val.type.slice(6)].amount++;
        if (val.type.slice(6) == "king") {
          kings[color] = false;
        }
      }
    });
    if (!deadPiece) arr.push(val);
  });
  piece_array = arr;

  // Display each piece in the array on canvas, at relevant squares
  piece_array.forEach((val, ind) => {
    // Draw piece on board
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
function placePiece(x, y, piece, type, benches) {
  // Removing the corresponding piece from the bench
  let color = type.slice(0, 5);
  let t = type.slice(6);
  benches[color][t].amount--;

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
function possibleMoves(piece_obj, game_array, board) {
  // In this game, pawns can make one move in any cardinal direction, not just forward.

  // All possible locations the piece can move to
  range = generateMoves(
    piece_obj,
    [piece_obj.x_pos, piece_obj.y_pos],
    game_array,
    board
  );
  var moves = [];
  var captures = [];
  var color = piece_obj.type.slice(0, 5);
  var type = piece_obj.type.slice(6);

  // Taking stone restrictions into account
  if (type == "king" || type == "pawn") {
    stonesRestrictPawnAndKing(piece_obj, board, range, contxt);
  }

  // Removing squares occupied by allies from the range
  range = range.filter((square) => {
    let x = square[0];
    let y = square[1];
    let test = true;
    let standing_piece = findPiece(x, y, game_array);
    if (typeof standing_piece !== "undefined") {
      let standing_color = standing_piece.type.slice(0, 5);
      if (color == standing_color) test = false;
    }
    return test;
  });

  // Removing squares occupied by any piece if the moving piece is a pawn, because
  // it cannot capture with its normal moves. Also, highlights the stones the pawn
  // can capture, if any
  if (type == "pawn") {
    range = range.filter((square) => {
      let x = square[0];
      let y = square[1];
      let test = true;
      let standing_piece = findPiece(x, y, game_array);
      if (typeof standing_piece !== "undefined") {
        test = false;
      }
      return test;
    });
    targetStones = [];
    let stones = stonesCornerSquare([piece_obj.x_pos, piece_obj.y_pos]);
    for (let c of stones) {
      let stone = board.moves.get(c);
      if (typeof stone !== "undefined" && stone !== color) {
        targetStones.push(c);
        stonesCanBeCaptured = true;
        crouchingPiece = piece_obj;
      }
    }
  }

  // Highlighting the squares that the piece can move to
  for (let square of range) {
    x_point = square[0] * boxsize;
    y_point = square[1] * boxsize;
    contxt.fillStyle = "green";
    contxt.fillRect(x_point, y_point, boxsize, boxsize);
    var present_piece = findPiece(square[0], square[1], game_array);
    if (typeof present_piece !== "undefined") {
      renderPiece(present_piece, contxt);
      contxt.fillStyle = "red";
      contxt.fillRect(x_point, y_point, boxsize, boxsize);
      captures.push([square[0], square[1]]);
    }
    moves.push([square[0], square[1]]);
  }

  // Storing options in move_queue
  move_queue.push(piece_obj);
  move_queue.push(moves);
  move_queue.push(captures);
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

  // Locations the pawn can capture to, via means of capturing a stone
  let s = pawnLandingSquares(piece_obj, targetStones);
  s.forEach((element) => {
    captures.push(element);
  });
  displayCaptureStones(targetStones, ctx, "red");

  // Adding captures to move_queue
  move_queue.pop();
  move_queue.push(captures);
}
// Function that moves a piece already on the board
function movePiece(piece_obj, x_new, y_new, board) {
  piece_obj.x_pos = x_new;
  piece_obj.y_pos = y_new;
  move_queue = [];
  let type = piece_obj.type.slice(6);
  let color = piece_obj.type.slice(0, 5);
  // Clear the board for easier reading
  currentGoBoard(
    goBoardforChess,
    ctx,
    canvas_go.width,
    canvas_go.height,
    boxsize
  );
  // If it's an official, check to see if there are any stones it can convert
  if (type !== "pawn" && type !== "king") {
    let cs = stonesCornerSquare([x_new, y_new]);
    naiveStones = [];
    for (let c of cs) {
      let s = board.moves.get(c);
      if (typeof s !== "undefined" && s !== color) {
        naiveStones.push(c);
        stonesCanBeConverted = true;
        forcingPiece = piece_obj;
      }
    }
    displayCaptureStones(naiveStones, ctx, "red");
  } else if (type == "king") {
    // If it's the king, check to see if there are any stones it can move
    let cs = stonesCornerSquare([x_new, y_new]);
    flyingStones = [];
    empties = [];
    for (let c of cs) {
      let s = board.moves.get(c);
      if (typeof s == "undefined") {
        empties.push(c);
      } else if (typeof s !== "undefined" && s == color) {
        flyingStones.push(c);
        royalPiece = piece_obj;
      }
    }
    if (empties.length > 0 && flyingStones.length > 0) stonesCanBeMoved = true;
    displayCaptureStones(flyingStones, ctx, "red");
  }
}

// Function that captures a piece if moved onto by another, and puts the captured piece
// in the opposing bench
function capturePiece(piece, array, benches) {
  var type = piece.type.slice(6);
  var color = piece.type.slice(0, 5);
  delete piece.x_pos;
  delete piece.y_pos;
  var ecolor = switchColor(color);
  piece.img = piece.img.replace(color, ecolor);
  piece.type = piece.type.replace(color, ecolor);
  benches[ecolor][type].amount++;
  if (piece.type.slice(6) == "king") {
    kings[color] = false;
  }
}

// Function that determines if kings are alive, and ends the game if not
function livingKing(array, color) {
  for (let piece of array) {
    if (piece.type.slice(6) == "king" && piece.type.slice(0, 5) == color) {
      kings[color] = false;
      break;
    }
  }
  if (!kings[color]) {
    console.log(`${color} loses!`);
  }
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

// Function that returns a square from a range
function findSquare(x, y, range) {
  var result = range.find((element) => {
    return element[0] == x && element[1] == y;
  });
  return range.indexOf(result);
}

// Function that determines if two square point to the same place on the board
function sameSquare(sq1, sq2) {
  return sq1[0] == sq2[0] && sq1[1] == sq2[1];
}

// Function that displays choice of piece to insert on bench
function choosePiece(piece, benches) {
  var choice = piece.replace(/ /, "_");
  var color = choice.slice(0, 5);
  var type = choice.slice(6);
  return benches[color][type].data;
}

// Function that fills the bench of each player
// TODO: Change implementation of benches from array to object
function fillBench(pieces) {
  // There should be 8 pawns, 2 officials of each type, 1 queen and 1 king on a bench

  var black_bench = {};
  var white_bench = {};

  for (let name in pieces) {
    var piece = {
      type: name,
      img: pieces[name],
    };
    var type = name.slice(6);
    switch (name) {
      case "black_pawn":
        black_bench[type] = {
          data: piece,
          amount: 8,
        };
        break;
      case "white_pawn":
        white_bench[type] = {
          data: piece,
          amount: 8,
        };
        break;
      case "black_bishop":
      case "black_knight":
      case "black_rook":
        black_bench[type] = {
          data: piece,
          amount: 2,
        };
        break;
      case "white_knight":
      case "white_rook":
      case "white_bishop":
        white_bench[type] = {
          data: piece,
          amount: 2,
        };
        break;
      case "black_king":
      case "black_queen":
        black_bench[type] = {
          data: piece,
          amount: 1,
        };
        break;
      case "white_king":
      case "white_queen":
        white_bench[type] = {
          data: piece,
          amount: 1,
        };
        break;
    }
  }
  return {
    black: black_bench,
    white: white_bench,
  };
}

// Function to render benches on the page
function renderBenches(benches, playerCanvas, enemyCanvas) {
  let playerContext = playerCanvas.getContext("2d");
  let enemyContext = enemyCanvas.getContext("2d");

  // Create pattern to fill player canvas
  let patternCanvas = document.createElement("canvas");
  let patternContext = patternCanvas.getContext("2d");
  patternCanvas.width = playerCanvas.width;
  patternCanvas.height = playerCanvas.height / 6;
  let w = patternCanvas.width;
  let h = patternCanvas.height;

  // Design pattern
  patternContext.strokeStyle = "black";
  patternContext.lineWidth = 1;
  patternContext.strokeRect(0, 0, patternCanvas.width, patternCanvas.height);
  patternContext.beginPath();
  patternContext.arc(w * (2 / 3), h, h / 5, 0, Math.PI, true);
  patternContext.fill();

  // Printing pattern on bench canvases
  let playerPattern = playerContext.createPattern(patternCanvas, "repeat-y");
  playerContext.fillStyle = playerPattern;
  playerContext.fillRect(0, 0, playerCanvas.width, playerCanvas.height);
  let enemyPattern = enemyContext.createPattern(patternCanvas, "repeat-y");
  enemyContext.fillStyle = enemyPattern;
  enemyContext.fillRect(0, 0, enemyCanvas.width, enemyCanvas.height);

  // Putting images of pieces on the benches
  let benchkeys = Object.keys(benches.white);
  for (let i = 0; i <= 5; i++) {
    let t = benchkeys[i];
    // Player
    let imgp = new Image();
    imgp.onload = () => {
      playerContext.drawImage(
        imgp,
        0,
        (i * playerCanvas.height) / 6,
        playerCanvas.width,
        playerCanvas.height / 6
      );
    };
    imgp.src = benches.white[t].data.img;
    // Enemy
    let imge = new Image();
    imge.onload = () => {
      enemyContext.drawImage(
        imge,
        0,
        (i * enemyCanvas.height) / 6,
        enemyCanvas.width,
        enemyCanvas.height / 6
      );
    };
    imge.src = benches.black[t].data.img;
  }
}

// Function that generates the possible moves a piece can make, given its location
function generateMoves(piece, location, game_array, board) {
  var name = piece.type.slice(6);
  var color = piece.type.slice(0, 5);
  var x = location[0];
  var y = location[1];
  switch (name) {
    case "pawn":
      return (range = [
        [x - 1, y],
        [x + 1, y],
        [x, y + 1],
        [x, y - 1],
      ]);
    case "knight":
      return (range = [
        [x + 1, y + 2],
        [x - 1, y + 2],
        [x + 1, y - 2],
        [x - 1, y - 2],
        [x + 2, y + 1],
        [x + 2, y - 1],
        [x - 2, y + 1],
        [x - 2, y - 1],
      ]);
    case "king":
      return (range = [
        [x - 1, y],
        [x - 1, y - 1],
        [x - 1, y + 1],
        [x, y - 1],
        [x, y + 1],
        [x + 1, y + 1],
        [x + 1, y],
        [x + 1, y - 1],
      ]);
    case "rook":
    case "bishop":
    case "queen":
      return (range = rangedOfficialMoves(
        name,
        location,
        game_array,
        board,
        color
      ));
  }
}

// Function that generates the moves for the bishop, rook and queen
function rangedOfficialMoves(name, location, game_array, board, color) {
  switch (name) {
    // Bishop's case
    case "bishop":
      return bishopRange(location, game_array, board, color);
    // Rook's case
    case "rook":
      return rookRange(location, game_array, board, color);

    // Queen's case; moves are combination of rook and bishop moves
    case "queen":
      arr1 = bishopRange(location, game_array, board, color);
      arr2 = rookRange(location, game_array, board, color);
      return arr1.concat(arr2);
  }
}

// Function that calculates the range of moves for the rook
function rookRange(location, game_array, board, color) {
  var x = location[0];
  var y = location[1];
  var ecolor = switchColor(color);
  var xr = _.range(1, 9);
  var yr = _.range(1, 9);
  var xi = xr.indexOf(x);
  var yi = yr.indexOf(y);
  var arr = [];
  var xb = 0;
  var yb = 0;

  // Code to prevent rook from jumping over pieces to its left, which
  // also implements stone restriction
  for (let i = xr[xi - 1]; i >= 1; i--) {
    var piece_block = findPiece(i, y, game_array);
    let corners = stonesCornerSquare([i, y]);
    let stones = getStonesOnSquare(corners, board);
    if (stones[1] == ecolor && stones[3] == ecolor) {
      xb = i + 1;
      shadedPattern(contxt, [i, y], ecolor);
    }
    if (typeof piece_block !== "undefined") xb = i;
    if (xb !== 0) break;
  }
  var xbi = xr.indexOf(xb);
  xr.splice(0, xbi);
  xb = 0;
  xi = xr.indexOf(x);

  // Same as above, but with pieces and stones to its right
  for (let i = xr[xi + 1]; i <= 8; i++) {
    var piece_block = findPiece(i, y, game_array);
    let corners = stonesCornerSquare([i, y]);
    let stones = getStonesOnSquare(corners, board);
    if (stones[0] == ecolor && stones[2] == ecolor) {
      xb = i - 1;
      shadedPattern(contxt, [i, y], ecolor);
    }
    if (typeof piece_block !== "undefined") xb = i;
    if (xb !== 0) break;
  }
  xbi = xr.indexOf(xb);
  if (xb !== 0) xr.splice(xbi + 1, xr.length - xbi);
  xb = 0;
  xi = xr.indexOf(x);

  // Same as above, but with pieces and stones above it
  for (let j = yr[yi - 1]; j >= 1; j--) {
    var piece_block = findPiece(x, j, game_array);
    let corners = stonesCornerSquare([x, j]);
    let stones = getStonesOnSquare(corners, board);
    if (stones[2] == ecolor && stones[3] == ecolor) {
      yb = j + 1;
      shadedPattern(contxt, [x, j], ecolor);
    }
    if (typeof piece_block !== "undefined") yb = j;
    if (yb !== 0) break;
  }
  ybi = yr.indexOf(yb);
  yr.splice(0, ybi);
  yb = 0;
  yi = yr.indexOf(y);

  // Same as above, but with pieces and stones below it
  for (let j = yr[yi + 1]; j <= 8; j++) {
    var piece_block = findPiece(x, j, game_array);
    let corners = stonesCornerSquare([x, j]);
    let stones = getStonesOnSquare(corners, board);
    if (stones[0] == ecolor && stones[1] == ecolor) {
      yb = j - 1;
      shadedPattern(contxt, [x, j], ecolor);
    }
    if (typeof piece_block !== "undefined") yb = j;
    if (yb !== 0) break;
  }
  ybi = yr.indexOf(yb);
  if (yb !== 0) yr.splice(ybi + 1, yr.length - ybi);
  yb = 0;
  yi = yr.indexOf(y);

  xr.splice(xi, 1);
  yr.splice(yi, 1);
  for (let i of yr) {
    arr.push([x, i]);
  }
  for (let j of xr) {
    arr.push([j, y]);
  }
  return arr;
}

// Function that calculates the range of moves for the bishop
function bishopRange(location, game_array, board, color) {
  var x = location[0];
  var y = location[1];
  var arr = [];
  var ecolor = switchColor(color);

  // break parameter
  var b = 0;

  var xb = x;
  var yb = y;
  while (xb > 1 && yb > 1) {
    xb -= 1;
    yb -= 1;
    arr.push([xb, yb]);
    let corners = stonesCornerSquare([xb, yb]);
    let stones = getStonesOnSquare(corners, board);
    if (stones[0] == ecolor) {
      b++;
      shadedPattern(contxt, [xb - 1, yb - 1], ecolor);
    }
    for (let piece of game_array) {
      if (piece.x_pos == xb && piece.y_pos == yb) {
        b++;
      }
    }
    if (b > 0) break;
  }
  var xc = x;
  var yc = y;
  b = 0;
  while (xc < 8 && yc < 8) {
    xc += 1;
    yc += 1;
    arr.push([xc, yc]);
    let corners = stonesCornerSquare([xc, yc]);
    let stones = getStonesOnSquare(corners, board);
    if (stones[3] == ecolor) {
      b++;
      shadedPattern(contxt, [xc + 1, yc + 1], ecolor);
    }
    for (let piece of game_array) {
      if (piece.x_pos == xc && piece.y_pos == yc) {
        b++;
      }
    }
    if (b > 0) break;
  }
  var xd = x;
  var yd = y;
  b = 0;
  while (xd > 1 && yd < 8) {
    xd -= 1;
    yd += 1;
    arr.push([xd, yd]);
    let corners = stonesCornerSquare([xd, yd]);
    let stones = getStonesOnSquare(corners, board);
    if (stones[2] == ecolor) {
      b++;
      shadedPattern(contxt, [xd - 1, yd + 1], ecolor);
    }
    for (let piece of game_array) {
      if (piece.x_pos == xd && piece.y_pos == yd) {
        b++;
      }
    }
    if (b > 0) break;
  }
  var xe = x;
  var ye = y;
  b = 0;
  while (xe < 8 && ye > 1) {
    xe += 1;
    ye -= 1;
    arr.push([xe, ye]);
    let corners = stonesCornerSquare([xe, ye]);
    let stones = getStonesOnSquare(corners, board);
    if (stones[1] == ecolor) {
      b++;
      shadedPattern(contxt, [xe + 1, ye - 1], ecolor);
    }
    for (let piece of game_array) {
      if (piece.x_pos == xe && piece.y_pos == ye) {
        b++;
      }
    }
    if (b > 0) break;
  }
  return arr;
}
