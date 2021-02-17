// Code that displays the game via server
var express = require("express");
var path = require("path");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var port = 3000;

// Using code from assets folder
app.use(express.static("assets"));

// Serving tactile.js, for tiling canvas
app.get("/js/util/tactile.js", (req, res) => {
  res.sendFile(path.join(__dirname, "./node_modules/tactile-js/tactile.js"));
});

// Serving socket.io, for multiplayer functionality
app.get("/socket/socket.io.js", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./node_modules/socket.io-client/dist/socket.io.js")
  );
});

// Socket connection to allow 2 people to play the game
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Displaying home page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./index.html"));
});

// Starting server
http.listen(port, () => {
  console.log("App is listening on port 3000");
});
