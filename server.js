// Code that displays the game via server
var express = require("express");
var path = require("path");
const mongoose = require("mongoose");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var port = 3000;

// Models
const Message = require("./models/chatModel.js");
const Request = require("./models/requestModel.js");

// Using code from assets folder
app.use(express.static("assets"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connecting to database
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/chess-vs-go-chat",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Getting all messages from database
app.get("/message", (req, res) => {
  Message.find({}).then((dbMessages) => {
    res.send(dbMessages);
  });
});

// Getting all requests from database
app.get("/request", (req, res) => {
  Request.find({}).then((dbRequests) => {
    res.send(dbRequests);
  });
});

// Saving chat messages to database
app.post("/message", ({ body }, res) => {
  Message.create(body)
    .then((dbMessage) => {
      res.json(dbMessage);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Saving request to database
app.post("/request", ({ body }, res) => {
  Request.create(body)
    .then((dbRequest) => {
      res.json(dbRequest);
    })
    .catch((err) => {
      res.json(err);
    });
});

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

// Socket connection to allow 2 people to play the game
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  // Handling click events on canvas
  socket.on("canvas click", (x, y) => {
    console.log("click on canvas happened!");
    console.log([x, y]);
    socket.broadcast.emit("return", x, y);
  });
  // Implementing chat in lobby
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
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
