// Code that builds the board the game is played on.
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

for (let y = margin / 2; y <= boxsize * boxnum; y += boxsize) {
  for (let x = margin / 2; x <= boxsize * boxnum; x += boxsize) {
    context.strokeRect(x, y, boxsize, boxsize);
    // Adding grid labels on top and bottom of grid
    if (y == margin / 2) {
      context.font = "20px serif";
      context.fillText(alphabet[x_counter], x, y - margin / 4);
      x_counter++;
    } else if (y + boxsize > boxsize * boxnum) {
      context.font = "20px serif";
      context.fillText(alphabet[x_counter], x, y + boxsize + margin / 4);
      x_counter++;
    } else x_counter = 0;

    // Adding grid labels on left and right of grid
    if (x == margin / 2) {
      context.font = "20px serif";
      context.fillText(alphabet[y_counter], x - margin / 4, y);
      console.log(y_counter);
    } else if (x + boxsize > boxsize * boxnum) {
      context.font = "20px serif";
      context.fillText(alphabet[y_counter], x + boxsize + margin / 4, y);
      y_counter++;
      console.log(y_counter);
    }
  }
}
