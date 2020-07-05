// Code that displays the game via server
var express = require("express");
var path = require("path");
var app = express();
var port = 3000;

// Using code from assets folder
app.use(express.static("assets"));

// Displaying home page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./index.html"));
});

// Starting server
app.listen(port, () => {
  console.log("App is listening on port 3000");
});
