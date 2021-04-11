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

// Same as above, but with requests
fetch("/request").then(async (res) => {
  let result = await res.json();
  let gamelist = document.getElementById("gamelist");
  for (let entry of result) {
    let req = document.createElement("li");
    let link = document.createElement("span");
    req.textContent = `${entry.user} wants to play a `;
    link.textContent = "game";
    link.id = `${entry.user}`;
    req.append(link);
    gamelist.appendChild(req);
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
socket.on("connect", () => {
  socket.emit("init", tagname);
});
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

// Creating a game request when the request game button is clicked on
let requestButton = document.getElementById("request");
requestButton.addEventListener("click", () => {
  if (requestButton.id == "request") {
    if (requestMade == true) return;
    let gamelist = document.getElementById("gamelist");
    let req = document.createElement("li");
    let link = document.createElement("span");
    req.textContent = `${tagname} wants to play a `;
    link.textContent = "game";
    link.id = `${tagname}`;
    req.append(link);
    gamelist.appendChild(req);
    requestMade = true;
    requestCancelled = false;

    // Changing button nature, to allow user to cancel request
    requestButton.innerHTML = "Cancel request";
    requestButton.id = "cancel";
    requestButton.classList.remove("is-primary");
    requestButton.classList.add("is-danger");

    // Saving request in server
    fetch("/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: tagname,
      }),
    });

    // Making request visible to other users
    socket.emit("make request", tagname);
  } else if (requestButton.id == "cancel") {
    if (requestCancelled) return;

    // Removing request from server
    fetch(`/request/${tagname}`, {
      method: "DELETE",
    });

    // Changing the button back
    requestButton.innerHTML = "Request Game";
    requestButton.classList.remove("is-danger");
    requestButton.classList.add("is-primary");
    requestButton.id = "request";

    // Removing the request from the page
    let link = document.getElementById(tagname);
    let req = link.parentElement;
    req.remove();

    // Using connection to remove request on all users' pages
    socket.emit("cancel request", tagname);

    // Prevent multiple instances
    requestCancelled = true;
    requestMade = false;
  }
});

// Variable to prevent multiple requests per person per page
let requestMade = false;
let requestCancelled = false;

// Removing request of other users
socket.on("cancel request", (user) => {
  let link = document.getElementById(user);
  let req = link.parentElement;
  req.remove();
});

// Adding requests of other users
socket.on("make request", (user) => {
  let gamelist = document.getElementById("gamelist");
  let req = document.createElement("li");
  let link = document.createElement("span");
  req.textContent = `${user} wants to play a `;
  link.textContent = "game";
  link.id = `${user}`;
  req.append(link);
  gamelist.appendChild(req);

  // Add click event for game link, to begin the game
  link.addEventListener("click", () => {
    let chosenColor = Math.random() < 0.5 ? "white" : "black";
    localStorage.setItem("color", chosenColor);
    socket.emit("create room", `${user} vs ${tagname}`, tagname, chosenColor);
  });
});

// Removing request when leaving the lobby
window.addEventListener("beforeunload", () => {
  fetch(`/request/${tagname}`, {
    method: "DELETE",
  });
});

// Entering room created by other users for game
socket.on("enter room", (room, color) => {
  let strarr = room.split(" ");
  let namechk = strarr[0];
  if (namechk == tagname) {
    if (color == "white") localStorage.setItem("color", "black");
    else if (color == "black") localStorage.setItem("color", "white");
    socket.emit("enter room", room, tagname);
  }
});

// Going to play game against other player
socket.on("join game", (gamename) => {
  localStorage.setItem("game", gamename);
  window.open("/game.html", "_self");
});
