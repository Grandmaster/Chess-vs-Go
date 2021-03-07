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
