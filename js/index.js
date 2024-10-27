const toggleButton = document.getElementById("theme-toggle-btn");
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

function updateToggleButton() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  toggleButton.innerText =
    currentTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
}

toggleButton.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateToggleButton();
});

updateToggleButton();
