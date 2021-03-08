// Javascript file that handles what happens on the lobby page
// =======================================================================

// Getting the tagname from localStorage
var tagname = localStorage.getItem("tag");
if (tagname !== null) {
  let intro = document.getElementById("intro");
  let introText = intro.innerHTML;
  let introWithName = introText.replace("!", `, ${tagname}!`);
  intro.innerHTML = introWithName;
}

// Implementing chat functionality: sending the message to the server
var socket = io();
var form = document.getElementById("chatline");
var input = document.getElementsByTagName("input")[0];
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value.length > 0) {
    socket.emit("chat message", `${tagname}: ${input.value}`);
    input.value = "";
  }
});

// Receiving the message from the server, and displaying it on page
socket.on("chat message", (msg) => {
  var chatlist = document.getElementById("chatlist");
  var item = document.createElement("li");
  item.textContent = msg;
  chatlist.appendChild(item);
});
