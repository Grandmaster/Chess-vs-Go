// Code that displays the game via server
var express = require("express");
var path = require("path");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var port = 3000;

// Managing game states
var go = require("./game_state/go_state");

// Using code from assets folder
app.use(express.static("assets"));

// Displaying home page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./index.html"));
});

// Socket connection
io.on("connection", (socket) => {
  go.connectMessage(socket);
});

// Starting server
http.listen(port, () => {
  console.log("App is listening on port 3000");
});
