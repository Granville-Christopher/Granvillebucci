const menuButton = document.getElementById("mobile-menu-button");
const menu = document.getElementById("mobile-menu");

// Toggle menu on button click
menuButton.addEventListener("click", function (e) {
  e.stopPropagation(); // prevent event from bubbling to document
  menu.classList.toggle("hidden");
});

// Close menu when clicking outside
document.addEventListener("click", function (e) {
  const isClickInsideMenu = menu.contains(e.target);
  const isClickOnButton = menuButton.contains(e.target);

  if (!isClickInsideMenu && !isClickOnButton) {
    menu.classList.add("hidden"); // hide the menu
  }
});
