// Code that displays the game via server
var express = require("express");
var path = require("path");
const mongoose = require("mongoose");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var port = 3000;

// Using code from assets folder
app.use(express.static("assets"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
require("./routes/apiRoutes.js")(app);

// Connection
require("./connection/socket.js")(io);

// Connecting to database
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/chess-vs-go-chat",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Serving tactile.js, for tiling canvas
app.get("/js/game/util/tactile.js", (req, res) => {
  res.sendFile(path.join(__dirname, "./node_modules/tactile-js/tactile.js"));
});

// Serving socket.io, for multiplayer functionality
app.get("/socket/socket.io.js", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./node_modules/socket.io-client/dist/socket.io.js")
  );
});

// Serving home page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./assets/html/home.html"));
});

// Serving html pages
app.get("/:page", function (req, res) {
  let page = req.params["page"];
  if (page.slice(-4) == "html") {
    res.sendFile(path.join(__dirname, `./assets/html/${page}`));
  }
});

// Starting server
http.listen(port, () => {
  console.log("App is listening on port 3000");
});
