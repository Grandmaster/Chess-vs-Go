// Javascript file to handle user interaction with home page
// ====================================================================

// Redirecting the user to the lobby with their entered tagname
let form = document.getElementsByTagName("form")[0];
console.log(form);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let tagname = document.getElementById("gamename").value;
  localStorage.setItem("tag", tagname);
  window.open("/lobby.html", "_self");
});
