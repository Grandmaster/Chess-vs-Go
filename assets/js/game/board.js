// Code that builds the board the game is played on.
// ==================================================================
const canvas = document.getElementById("base_layer");
canvas.width = 750;
canvas.height = 750;

// Game title
let gamename = localStorage.getItem("game");
if (gamename !== null) {
  let title = document.getElementById("game title");
  title.innerHTML = gamename;
}

// Initial data
let context = canvas.getContext("2d");
let margin = 150;
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Building the board
context.strokeStyle = "black";
context.lineWidth = 1;
var boxnum = 8;
var boxsize = (canvas.width - margin) / boxnum;
let x_counter = 0;
let y_counter = 0;
let y_count_prev = y_counter;
let alt_counter = 0;
let gridpoints_array = [];
let gridpoints_labels = [];

// Function to help change color of squares
function flip(counter, val1, val2) {
  if (counter == val1) {
    return val2;
  } else if (counter == val2) {
    return val1;
  }
}

for (let y = margin / 2; y <= boxsize * boxnum; y += boxsize) {
  for (let x = margin / 2; x <= boxsize * boxnum; x += boxsize) {
    if (y_count_prev !== y_counter) {
      alt_counter = flip(alt_counter, 0, 1);
      y_count_prev = y_counter;
    }
    if (alt_counter == 0) {
      context.strokeRect(x, y, boxsize, boxsize);
      alt_counter = flip(alt_counter, 0, 1);
    } else if (alt_counter == 1) {
      context.fillStyle = "rgba(139,69,19,0.5)";
      context.fillRect(x, y, boxsize, boxsize);
      context.strokeRect(x, y, boxsize, boxsize);
      alt_counter = flip(alt_counter, 0, 1);
    }
    gridpoints_array.push([x, y]);
    gridpoints_labels.push([alphabet[x_counter], alphabet[y_counter]]);
    context.fillStyle = "black";

    // Adding grid point labels on top and bottom of grid
    if (y == margin / 2) {
      context.font = "20px serif";
      context.fillText(alphabet[x_counter], x - 5, y - margin / 4);
    } else if (y + boxsize > boxsize * boxnum) {
      context.font = "20px serif";
      context.fillText(alphabet[x_counter], x - 5, y + boxsize + margin / 4);
      gridpoints_array.push([x, y + boxsize]);
    }

    // Adding grid point labels on left and right of grid
    if (x == margin / 2) {
      x_counter = 0;
      context.font = "20px serif";
      context.fillText(alphabet[y_counter], x - margin / 4, y + 5);
    } else if (x + boxsize > boxsize * boxnum) {
      context.font = "20px serif";
      context.fillText(alphabet[y_counter], x + boxsize + margin / 4, y + 5);
      gridpoints_array.push([x + boxsize, y]);
      y_count_prev = y_counter;
      y_counter++;
    }

    x_counter++;
  }
}

// console.log(gridpoints_array);
