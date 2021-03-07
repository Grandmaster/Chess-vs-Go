// Javascript file that handles what happens on the lobby page
// =======================================================================

// Getting the tagname from localStorage
var tagname = localStorage.getItem("tag");
if (tagname !== null) {
  console.log(`Welcome back, ${tagname}!`);
}
