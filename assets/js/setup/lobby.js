// Javascript file that handles what happens on the lobby page
// =======================================================================

// Getting the messages of the chat from database, and printing them on screen
fetch("/message").then(async (res) => {
  let result = await res.json();
  var chatlist = document.getElementById("chatlist");
  for (let entry of result) {
    let message = `${entry.user}: ${entry.message}`;
    var item = document.createElement("li");
    item.textContent = message;
    chatlist.appendChild(item);
  }
});

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
    fetch("/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: tagname,
        message: input.value,
      }),
    });
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
