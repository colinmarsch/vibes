const THEME_KEY = "seattle-run-club-shuffle-theme";
const themeToggle = document.getElementById("theme-toggle");

function getPreferredTheme() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);

  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "Switch to light" : "Switch to dark";
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }
}

const initialTheme = localStorage.getItem(THEME_KEY) || getPreferredTheme();
setTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, nextTheme);
    setTheme(nextTheme);
  });
}
