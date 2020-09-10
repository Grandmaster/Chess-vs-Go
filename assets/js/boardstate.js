// Code that keeps track of the state of the board game, by manipulating data in a matrix
// =============================================================================================

$(document).ready(() => {
  console.log("The window is ready!");
  // Total game state as an array
  let elementnum = 2 * parseInt(boxnum) + 1;
  console.log(elementnum);
  let gamestate = [];
  let row = new Array(elementnum).fill(0);
  for (let i = 0; i < elementnum; i++) {
    gamestate.push(row);
  }
  console.log(gamestate);
});
