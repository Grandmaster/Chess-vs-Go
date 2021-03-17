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
};
