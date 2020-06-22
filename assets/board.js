// Code that builds the board the game is played on.
const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = 500;
canvas.height = 500;

// Initial data
let context = canvas.getContext("2d");
let margin = 50;

// Building the board
context.strokeStyle = "black";
context.lineWidth = 1;
var boxnum = prompt("How many boxes should be in your grid?");
let boxsize = Math.floor((canvas.width - margin) / boxnum);
console.log(boxnum);
console.log(boxsize);

for (let y = margin / 2; y <= boxsize * boxnum; y += boxsize) {
  for (let x = margin / 2; x <= boxsize * boxnum; x += boxsize) {
    context.strokeRect(x, y, boxsize, boxsize);
  }
}
