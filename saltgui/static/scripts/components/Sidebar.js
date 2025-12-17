/* Sidebar Component - TEXT ONLY navigation */
/* NO ICONS - Use text labels and typography for emphasis */

import {Utils} from "../Utils.js";

export class Sidebar {

  static init () {
    // Get sidebar element
    const sidebar = document.querySelector(".modern-sidebar");
    if (!sidebar) {
      return;
    }

    // Handle sidebar toggle for mobile
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        Sidebar.toggle();
      });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (pEvent) => {
      const sidebar = document.querySelector(".modern-sidebar");
      const sidebarToggle = document.querySelector(".sidebar-toggle");
      
      if (!sidebar || !sidebarToggle) {
        return;
      }
      
      // Check if click is outside sidebar and toggle button
      if (window.innerWidth < 768 && 
          !sidebar.contains(pEvent.target) && 
          !sidebarToggle.contains(pEvent.target)) {
        Sidebar.hide();
      }
    });

    // Update active nav item based on current page
    Sidebar.updateActiveItem();
  }

  static toggle () {
    const sidebar = document.querySelector(".modern-sidebar");
    const main = document.querySelector(".modern-main");
    
    if (!sidebar) {
      return;
    }
    
    sidebar.classList.toggle("show");
    
    if (main) {
      main.classList.toggle("sidebar-collapsed");
    }
  }

  static show () {
    const sidebar = document.querySelector(".modern-sidebar");
    const main = document.querySelector(".modern-main");
    
    if (sidebar) {
      sidebar.classList.add("show");
    }
    
    if (main) {
      main.classList.remove("sidebar-collapsed");
    }
  }

  static hide () {
    const sidebar = document.querySelector(".modern-sidebar");
    
    if (sidebar && window.innerWidth < 768) {
      sidebar.classList.remove("show");
    }
  }

  static updateActiveItem () {
    // Get current page from hash
    const hash = window.location.hash.replace(/^#/, "") || "dashboard";
    
    // Remove active class from all nav items
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.classList.remove("active");
    });
    
    // Add active class to current page
    const activeItem = document.querySelector(`.nav-item[href="#${hash}"]`);
    if (activeItem) {
      activeItem.classList.add("active");
    }
  }

  static setBadgeCount (pPageName, pCount) {
    const navItem = document.querySelector(`.nav-item[href="#${pPageName}"]`);
    if (!navItem) {
      return;
    }
    
    let badge = navItem.querySelector(".badge-count");
    
    if (pCount > 0) {
      if (!badge) {
        badge = Utils.createSpan("badge-count", String(pCount));
        navItem.appendChild(badge);
      } else {
        badge.textContent = String(pCount);
      }
    } else if (badge) {
      badge.remove();
    }
  }

  static setBadgeType (pPageName, pType) {
    const navItem = document.querySelector(`.nav-item[href="#${pPageName}"]`);
    if (!navItem) {
      return;
    }
    
    const badge = navItem.querySelector(".badge-count");
    if (!badge) {
      return;
    }
    
    // Remove all type classes
    badge.classList.remove("warning", "danger", "success", "info");
    
    // Add new type class
    if (pType) {
      badge.classList.add(pType);
    }
  }
}
