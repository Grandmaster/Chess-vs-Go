// Code for picking which piece to put on the board
// ===========================================================

// Piece to be picked
var chosen_piece;

// Object to determine chosen piece
var pieceObj = {
  1: "pawn",
  2: "king",
  3: "knight",
  4: "rook",
  5: "bishop",
  6: "queen",
};

$(document).ready(() => {
  // Pick a piece to put on the board when corresponding option is clicked
  canvas_player.addEventListener("click", (event) => {
    // Finding where on the board the click happened
    var rect = canvas_chess.getBoundingClientRect();
    let y_point = Math.floor(event.clientY - rect.top);

    // Mapping the clicked point to a piece
    let h = canvas_player.height / 6;
    let d = Math.ceil(y_point / h);
    let str = `${color}_${pieceObj[d]}`;
    chosen_piece = choosePiece(str, benches);

    // Visual confirmation of player choice
    let context = canvas_player.getContext("2d");
    context.fillStyle = "lightgreen";
    context.fillRect(0, (d - 1) * h, canvas_player.width, h);
    let img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, (d - 1) * h, canvas_player.width, h);
    };
    img.src = chosen_piece.img;

    // Putting piece in play
    if (chosen_piece == undefined) {
      console.log("Piece not found on bench");
      return;
    } else {
      place_queue.push(chosen_piece);
    }
  });
});
