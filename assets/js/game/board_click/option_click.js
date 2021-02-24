// Code for picking which piece to put on the board
// ===========================================================

// Piece to be picked
var chosen_piece;

$(document).ready(() => {
  // Pick a piece to put on the board when corresponding option is clicked
  options.addEventListener("click", (event) => {
    let str = event.target.innerHTML;
    chosen_piece = choosePiece(str, benches.black, benches.white);
    if (chosen_piece == undefined) {
      console.log("Piece not found on bench");
      return;
    } else {
      place_queue.push(chosen_piece);
    }
  });
});
