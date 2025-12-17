/* ThemeManager - Handle light/dark mode toggle */
/* NO ICONS - Text-based toggle */

export class ThemeManager {

  static init () {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("saltgui-theme") || "light";
    ThemeManager.setTheme(savedTheme);

    // Add event listener for theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        ThemeManager.toggleTheme();
      });
    }
  }

  static setTheme (pTheme) {
    const body = document.body;
    
    if (pTheme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
    
    // Save preference
    localStorage.setItem("saltgui-theme", pTheme);
  }

  static toggleTheme () {
    const body = document.body;
    const currentTheme = body.classList.contains("dark-mode") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    ThemeManager.setTheme(newTheme);
  }

  static getCurrentTheme () {
    return document.body.classList.contains("dark-mode") ? "dark" : "light";
  }
}
