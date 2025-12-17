/* Toast Notification Component - TEXT ONLY */
/* NO ICONS - Use color and typography for emphasis */

import {Utils} from "../Utils.js";

export class Toast {

  static show (pMessage, pType = "info", pDuration = 4000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = Utils.createDiv("toast-container", "", "toast-container");
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = Utils.createDiv("toast");
    toast.classList.add(`toast-${pType}`, "toast-slide-in");

    // Add status dot (only allowed visual element besides text)
    const statusDot = Utils.createSpan(`status-dot ${pType}`);
    statusDot.textContent = "●";
    toast.appendChild(statusDot);

    // Add message
    const message = Utils.createSpan("toast-message", pMessage);
    toast.appendChild(message);

    // Add close button (text only)
    const closeBtn = Utils.createSpan("toast-close");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => {
      Toast._removeToast(toast);
    });
    toast.appendChild(closeBtn);

    // Add to container
    toastContainer.appendChild(toast);

    // Auto remove after duration
    if (pDuration > 0) {
      setTimeout(() => {
        Toast._removeToast(toast);
      }, pDuration);
    }

    return toast;
  }

  static _removeToast (pToast) {
    pToast.classList.remove("toast-slide-in");
    pToast.classList.add("toast-slide-out");
    
    setTimeout(() => {
      pToast.remove();
      
      // Remove container if no toasts left
      const toastContainer = document.getElementById("toast-container");
      if (toastContainer && toastContainer.children.length === 0) {
        toastContainer.remove();
      }
    }, 300);
  }

  static success (pMessage, pDuration = 4000) {
    return Toast.show(pMessage, "success", pDuration);
  }

  static error (pMessage, pDuration = 4000) {
    return Toast.show(pMessage, "danger", pDuration);
  }

  static warning (pMessage, pDuration = 4000) {
    return Toast.show(pMessage, "warning", pDuration);
  }

  static info (pMessage, pDuration = 4000) {
    return Toast.show(pMessage, "info", pDuration);
  }
}
