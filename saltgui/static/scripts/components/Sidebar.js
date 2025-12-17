/* global */

export class Sidebar {

  static isCollapsed = false;
  static isMobileOpen = false;

  static init () {
    const toggleBtn = document.getElementById("sidebar-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        Sidebar.toggle();
      });
    }

    // Handle mobile menu
    const layout = document.querySelector(".modern-layout");
    const sidebar = document.querySelector(".modern-sidebar");

    if (sidebar && layout) {
      // Close sidebar when clicking outside on mobile
      document.addEventListener("click", (e) => {
        if (window.innerWidth <= 768 && Sidebar.isMobileOpen) {
          if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            Sidebar.closeMobile();
          }
        }
      });
    }

    // Handle nav item clicks
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Remove active class from all items
        navItems.forEach((i) => i.classList.remove("active"));
        // Add active class to clicked item
        item.classList.add("active");

        // Close mobile menu when item is clicked
        if (window.innerWidth <= 768) {
          Sidebar.closeMobile();
        }
      });
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        Sidebar.closeMobile();
      }
    });
  }

  static toggle () {
    const layout = document.querySelector(".modern-layout");
    if (window.innerWidth <= 768) {
      Sidebar.toggleMobile();
    } else {
      Sidebar.isCollapsed = !Sidebar.isCollapsed;
      if (Sidebar.isCollapsed) {
        layout.classList.add("sidebar-collapsed");
      } else {
        layout.classList.remove("sidebar-collapsed");
      }
      // Save preference
      localStorage.setItem("saltgui-sidebar-collapsed", Sidebar.isCollapsed);
    }
  }

  static toggleMobile () {
    Sidebar.isMobileOpen = !Sidebar.isMobileOpen;
    const sidebar = document.querySelector(".modern-sidebar");
    if (Sidebar.isMobileOpen) {
      sidebar.classList.add("mobile-open");
    } else {
      sidebar.classList.remove("mobile-open");
    }
  }

  static closeMobile () {
    Sidebar.isMobileOpen = false;
    const sidebar = document.querySelector(".modern-sidebar");
    if (sidebar) {
      sidebar.classList.remove("mobile-open");
    }
  }

  static restoreState () {
    const collapsed = localStorage.getItem("saltgui-sidebar-collapsed") === "true";
    if (collapsed && window.innerWidth > 768) {
      Sidebar.isCollapsed = true;
      const layout = document.querySelector(".modern-layout");
      if (layout) {
        layout.classList.add("sidebar-collapsed");
      }
    }
  }

  static setActive (pPath) {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      const href = item.getAttribute("href");
      if (href && href.replace("#", "") === pPath) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  static updateBadge (pPath, pCount, pType = "danger") {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      const href = item.getAttribute("href");
      if (href && href.replace("#", "") === pPath) {
        let badge = item.querySelector(".badge");
        if (pCount > 0) {
          if (!badge) {
            badge = document.createElement("span");
            badge.className = `badge ${pType}`;
            item.appendChild(badge);
          }
          badge.textContent = pCount;
          badge.className = `badge ${pType}`;
        } else if (badge) {
          badge.remove();
        }
      }
    });
  }
}
