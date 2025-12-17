/* global */

export class ThemeManager {

  static init () {
    // Get saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem("saltgui-theme") || "light";
    ThemeManager.setTheme(savedTheme);

    // Listen for theme toggle button clicks
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        ThemeManager.toggleTheme();
      });
    }

    // Listen for system theme changes if using system preference
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (localStorage.getItem("saltgui-theme") === "system") {
          ThemeManager.setTheme("system");
        }
      });
    }
  }

  static setTheme (pTheme) {
    let actualTheme = pTheme;

    // Handle system preference
    if (pTheme === "system") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        actualTheme = "dark";
      } else {
        actualTheme = "light";
      }
    }

    // Apply theme to document
    if (actualTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    // Save preference
    localStorage.setItem("saltgui-theme", pTheme);

    // Update toggle button if exists
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      if (actualTheme === "dark") {
        themeToggle.textContent = "☀️"; // Sun for dark mode
      } else {
        themeToggle.textContent = "🌙"; // Moon for light mode
      }
    }
  }

  static toggleTheme () {
    const currentTheme = localStorage.getItem("saltgui-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    ThemeManager.setTheme(newTheme);
  }

  static getTheme () {
    return localStorage.getItem("saltgui-theme") || "light";
  }
}
