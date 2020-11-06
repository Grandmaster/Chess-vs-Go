// Code that keeps track of the state of the board game, by manipulating data in a matrix
// =============================================================================================

$(document).ready(() => {
  console.log("The window is ready!");

  // Go game state as an array
  let pointnum = boxnum + 1;
  let gostate = [];
  let go_row = new Array(pointnum).fill(0);
  for (let i = 0; i < pointnum; i++) {
    gostate.push(go_row);
  }

  // Chess game state as an array
  let gridnum = boxnum;
  let chessstate = [];
  let chess_row = new Array(gridnum).fill(0);
  for (let i = 0; i < gridnum; i++) {
    chessstate.push(chess_row);
  }

  // Function to build total game state from chess and go game states
  function TotalGameState(go_state, chess_state) {
    let gamestate = [];
    for (let i = 0; i <= pointnum - 1; i++) {
      gamestate.push(go_state[i]);
      if (i <= chess_state.length - 1) {
        gamestate.push(chess_state[i]);
      }
    }
    return gamestate;
  }

  let computedGameState = TotalGameState(gostate, chessstate);
  console.log(computedGameState);

  // godash test
  console.log(godash);
});
