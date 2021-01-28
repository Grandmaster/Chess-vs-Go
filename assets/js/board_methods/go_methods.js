// Code for various manipulations of the go/baduk/weiqi portion of the game
// ============================================================================

// Function that displays board on canvas. Takes in godash.Board and context for html5 canvas
function currentGoBoard(board, context, width, height, boxsize) {
  // Clearing the board for each state update
  context.clearRect(0, 0, width, height);

  // Placing a stone on the relevant point on the board for each stone in input board
  board.moves.forEach((val, key) => {
    context.beginPath();
    context.arc(
      (key.x + 1) * boxsize,
      (key.y + 1) * boxsize,
      boxsize / 3,
      0,
      2 * Math.PI,
      true
    );
    context.fillStyle = val;
    context.fill();
  });
}

// Range of indices for calculating territory.
var range = generateRange();

// Function that calculates transient territory controlled by each player using flood fill algorithm
function calculateTerritory(board) {
  // This should only run when there are stones of either color on the board
  if (board.moves.size < 2) {
    return "need stones of both colors";
  }

  // Territory array init
  let arr = [0, 0];

  // Parent array
  let field = [];

  // Goes through every point in the range
  while (range.length !== 0) {
    let index = range[0];
    let point = new godash.Coordinate(index[0], index[1]);
    floodPull(board, point, arr[0], arr[1], arr, range);
    field.push(arr);
    arr = [0, 0];
    // Determine total # of coordinates visited
    let l = 0;
    for (let r of field) {
      l += r.length - 2;
      l += r[0] + r[1];
    }
    // This helps to keep accurate count of stones, which helps calculate territory
    if (l < 81) restoreCoord(stoneDump, range);
    stoneDump = [];
  }

  console.log(field);

  // Cleaning up the parent array
  field = field.filter((arr) => {
    return arr.length > 2;
  });

  console.log(field);

  // Repopulate range for next use of calculateTerritory
  range = generateRange();
}

// Function that creates range of indices to calculate territory. For now, assumes 9x9 board
function generateRange() {
  // Range of indices for points on the board
  var rx = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  var ry = rx;
  var rp = [];

  for (let i of rx) {
    for (let j of ry) {
      rp.push([i, j]);
    }
  }

  return rp;
}

// Array of stone locations
var stoneDump = [];

// Function that implements the actual flood fill algorithm in calculating territory.
// For this function, in the 'territory array', the first 2 numbers are how many black and white stones the
// algorithm has encountered, which will be used to determine ownership of territory
function floodPull(board, c, b, w, t, r) {
  // Stop if the coordinate is out of range, or if it has been visited already
  if (c.x < 0 || c.x > 8 || c.y < 0 || c.y > 8) return;
  if (findCoord(c, r) == -1) return;
  let stone = board.moves.get(c);

  // Stop if the function lands on a stone
  if (stone == "black") {
    t[0]++;
    stoneDump.push(c);
    removeCoord(c, r);
    return;
  } else if (stone == "white") {
    t[1]++;
    stoneDump.push(c);
    removeCoord(c, r);
    return;
  } else {
    // If the above two cases do not apply, add the point to the 'territory array' and continue
    t.push(c);
    removeCoord(c, r);
  }

  // Generating new co-ordinates
  let c_right = new godash.Coordinate(c.x + 1, c.y);
  let c_left = new godash.Coordinate(c.x - 1, c.y);
  let c_up = new godash.Coordinate(c.x, c.y - 1);
  let c_down = new godash.Coordinate(c.x, c.y + 1);

  // Recursion
  floodPull(board, c_right, b, w, t, r);
  floodPull(board, c_left, b, w, t, r);
  floodPull(board, c_up, b, w, t, r);
  floodPull(board, c_down, b, w, t, r);
}

// Function that takes in a coordinate and returns its index in the range of locations, if it is there
function findCoord(c, r) {
  var l = [c.x, c.y];
  var ind = -1;
  for (let i of r) {
    if (l[0] == i[0] && l[1] == i[1]) {
      ind = r.indexOf(i);
    }
  }
  return ind;
}

// Function that takes in a coordinate and removes it from the range of locations, if it's there
function removeCoord(c, r) {
  let ind = findCoord(c, r);
  if (ind !== -1) r.splice(ind, 1);
}

// Function that adds coordinates in an array to the range of locations. To be used to put stone locations back
// into the range, to help determine ownership of territory
function restoreCoord(c_arr, r) {
  for (let c of c_arr) {
    let l = [c.x, c.y];
    r.push(l);
  }
}
