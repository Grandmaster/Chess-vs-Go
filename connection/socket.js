// File to handle connection code with socket.io
// ========================================================

module.exports = async function (io) {
  // Socket connection to allow 2 people to play the game
  io.on("connection", (socket) => {
    socket.on("init", (tagname) => {
      console.log(`${tagname} connected!`);
      socket.on("disconnect", () => {
        console.log(`${tagname} disconnected!`);
      });
    });
    // Implementing chat in lobby
    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });
    // Make request
    socket.on("make request", (user) => {
      socket.broadcast.emit("make request", user);
    });
    // Cancel request
    socket.on("cancel request", (tagname) => {
      socket.broadcast.emit("cancel request", tagname);
    });
    // Create game against other player
    socket.on("create room", (room, name, color) => {
      socket.join(room);
      console.log(`${name} has joined ${room}.`);
      socket.broadcast.emit("enter room", room, color);
    });
    // Enter game against other player
    socket.on("enter room", (room, name) => {
      socket.join(room);
      console.log(`${name} has joined ${room}`);
      io.to(room).emit("join game", room);
    });
    // Sending move to opponent
    socket.on("send move", (goboard, chessboard, benches, room) => {
      console.log("sent move");
      socket.to(room).emit("receive move", goboard, chessboard, benches);
      // io.emit("receive move", goboard, chessboard, benches); <==== This works, but sends to everybody
    });
  });
};
