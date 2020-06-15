// Code that builds the board the game is played on.
let context = document.getElementsByTagName("canvas")[0].getContext("2d");
let a = [100, 200];
let b = [200, 100];
let i = 0;
let j = 0;
context.strokeStyle = "blue";
context.lineWidth = 10;
change = setInterval(() => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.strokeRect(100, 100, a[i], b[i]);
  if (i == 0) i = 1;
  else if (i == 1) i = 0;
  j++;
  if (j > 5) {
    clearInterval(change);
  }
}, 3000);
