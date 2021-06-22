// Javascript file that handles chat between players during a game
// ============================================================================

// Retrieve variables from localStorage
var tagname = localStorage.getItem("tag");
var roomname = localStorage.getItem("game");

// Sending message from submitted form to opponent
var form = document.getElementById("chatline");
var input = document.getElementsByTagName("input")[0];
form.addEventListener("submit", (event) => {
  event.preventDefault();
  var chatlist = document.getElementById("chatlist");
  var item = document.createElement("li");
  item.textContent = `${tagname}: ${input.value}`;
  chatlist.appendChild(item);
  if (input.value.length > 0) {
    socket.emit("game chat message", `${tagname}: ${input.value}`, roomname);
    input.value = "";
  }
});

// Receiving message from opponent, and displaying it
socket.on("message", (msg) => {
  var chatlist = document.getElementById("chatlist");
  var item = document.createElement("li");
  item.textContent = msg;
  chatlist.appendChild(item);
});
