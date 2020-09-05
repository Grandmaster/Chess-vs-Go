// Code that builds the board the game is played on.
// ==================================================================
const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = 600;
canvas.height = 600;

// Initial data
let context = canvas.getContext("2d");
let margin = 100;
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Building the board
context.strokeStyle = "black";
context.lineWidth = 1;
var boxnum = prompt("How many boxes should be in your grid?");
let boxsize = Math.floor((canvas.width - margin) / boxnum);
console.log(boxnum);
console.log(boxsize);
x_counter = 0;
y_counter = 0;
gridpoints_array = [];
gridpoints_labels = [];

for (let y = margin / 2; y <= boxsize * boxnum; y += boxsize) {
  for (let x = margin / 2; x <= boxsize * boxnum; x += boxsize) {
    context.strokeRect(x, y, boxsize, boxsize);
    gridpoints_array.push([x, y]);
    gridpoints_labels.push([alphabet[x_counter], alphabet[y_counter]]);

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
      y_counter++;
    }

    x_counter++;
  }
}

console.log(gridpoints_array);
// console.log(gridpoints_labels);
