// Code that keeps track of the state of the board game, by manipulating data in a matrix
$(document).ready(() => {
  console.log("The window is ready!");
  // Game state as an array
  let pointnum = parseInt(boxnum) + 1;
  let stonestate = [];
  let row = new Array(pointnum).fill(0);
  for (let i = 0; i < pointnum; i++) {
    stonestate.push(row);
  }
  console.log(stonestate);
});
