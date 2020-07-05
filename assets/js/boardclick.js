// Code that handles the click events that happen on the board.
// ================================================================

// Counter to determine when to switch stone color
playcount = 0;

// Detecting where on the grid the click happened
canvas.addEventListener("click", (event) => {
  console.log([
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop,
  ]);
  for (let point of gridpoints_array) {
    if (
      point[0] - 10 <= event.clientX - canvas.offsetLeft &&
      event.clientX - canvas.offsetLeft <= point[0] + 10
    ) {
      if (
        point[1] - 10 <= event.clientY - canvas.offsetTop &&
        event.clientY - canvas.offsetTop <= point[1] + 10
      ) {
        index = gridpoints_array.indexOf(point);
        labels = gridpoints_labels[index];
        console.log(`You clicked on point (${labels[0]},${labels[1]})`);

        // Placing a game piece (a stone) on the relevant point
        context.beginPath();
        context.arc(point[0], point[1], boxsize / 3, 0, 2 * Math.PI, true);
        if (playcount % 2 == 0) {
          context.fillStyle = "black";
        } else context.fillStyle = "white";

        context.fill();
        playcount++;
      }
    }
  }
});
