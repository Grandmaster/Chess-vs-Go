// Back-end code that will generate the Go portion of the game state.
const go_state = {};

go_state.connectMessage = function (socket) {
  console.log("You connected!");
  socket.on("disconnect", () => {
    console.log("You disconnected!");
  });
};

module.exports = go_state;
