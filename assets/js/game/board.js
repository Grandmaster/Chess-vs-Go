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
var boxnum = 8;
var boxsize = (canvas.width - margin) / boxnum;
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Create pattern
let pcan = document.createElement("canvas");
let pcon = pcan.getContext("2d");
pcan.width = (canvas.width - margin) / (boxnum / 2);
pcan.height = pcan.width;

// Design pattern
pcon.strokeStyle = "black";
pcon.lineWidth = 1;
pcon.strokeRect(0, 0, pcan.width / 2, pcan.height / 2);
pcon.strokeRect(0, pcan.height / 2, pcan.width / 2, pcan.height);
pcon.strokeRect(pcan.width / 2, 0, pcan.width / 2, pcan.height / 2);
pcon.strokeRect(pcan.width / 2, pcan.height / 2, pcan.width / 2, pcan.height);
pcon.fillStyle = "rgba(139,69,19,0.5)";
pcon.fillRect(pcan.width / 2, 0, pcan.width / 2, pcan.height / 2);
pcon.fillRect(0, pcan.height / 2, pcan.width / 2, pcan.height);

// Print pattern on board
let pattern = context.createPattern(pcan, "repeat");
context.fillStyle = pattern;
context.fillRect(
  margin / 2,
  margin / 2,
  canvas.width - margin,
  canvas.height - margin
);
