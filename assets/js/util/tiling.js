// Javascript file to hold tiling code
// ===================================================================

// Data for creating player zones via tiling, courtesy of tactile-js
import { TilerTheCreator } from "./TilerTheCreator.js";

// Function to keep honeycombPattern from spilling out of the squares
function noSpill(xs, ys, p) {
  let x = p[0];
  let y = p[1];
  if ((x > xs + boxsize || x < xs) && (y > ys + boxsize || y < ys)) {
    return [];
  } else {
    if (x > xs + boxsize) {
      x = xs + boxsize;
    } else if (x < xs) x = xs;
    if (y > ys + boxsize) {
      y = ys + boxsize;
    } else if (y < ys) y = ys;
    return [x, y];
  }
}

// honeycombPattern from hybrid_methods.js
honeycombPattern = function (context, square, color) {
  let x = square[0] * boxsize;
  let y = square[1] * boxsize;
  context.strokeStyle = color;
  context.lineWidth = 0.85;
  let honeycomb = new TilerTheCreator({
    width: boxsize * 2,
    height: boxsize * 3,
    type: 1,
  });
  honeycomb.readyToTile();
  let hexagons = honeycomb.getPolygonsFromRegion();
  hexagons.forEach((hexagon) => {
    let start = hexagon.shift();
    start[0] += x;
    start[1] += y;
    start = noSpill(x, y, start);
    context.beginPath();
    if (start.length !== 0) {
      context.moveTo(start[0], start[1]);
    }
    hexagon.forEach((point) => {
      point[0] += x;
      point[1] += y;
      point = noSpill(x, y, point);
      if (point.length !== 0) {
        context.lineTo(point[0], point[1]);
      }
    });
    context.closePath();
    context.stroke();
  });
};
