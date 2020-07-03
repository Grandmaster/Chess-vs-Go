// Code that handles the click events that happen on the board.
// ================================================================
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
      }
    }
  }
});
