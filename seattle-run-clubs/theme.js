const THEME_KEY = "seattle-run-clubs-theme";
const themeToggle = document.getElementById("theme-toggle");

function getPreferredTheme() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function setTheme(theme) {
  if (theme === "light") {
    document.body.removeAttribute("data-theme");
  } else {
    document.body.setAttribute("data-theme", "dark");
  }

  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "Dark mode" : "Light mode";
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
