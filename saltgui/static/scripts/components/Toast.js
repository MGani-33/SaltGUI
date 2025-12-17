/* global */

export class Toast {

  static container = null;

  static init () {
    // Create toast container if it doesn't exist
    if (!Toast.container) {
      Toast.container = document.createElement("div");
      Toast.container.className = "toast-container";
      document.body.appendChild(Toast.container);
    }
  }

  static show (pMessage, pType = "info", pDuration = 5000) {
    Toast.init();

    const toast = document.createElement("div");
    toast.className = `toast toast-${pType}`;

    const icon = Toast._getIcon(pType);
    const iconElement = document.createElement("div");
    iconElement.className = "toast-icon";
    iconElement.textContent = icon;

    const content = document.createElement("div");
    content.className = "toast-content";

    const title = document.createElement("div");
    title.className = "toast-title";
    title.textContent = Toast._getTitle(pType);

    const message = document.createElement("div");
    message.className = "toast-message";
    message.textContent = pMessage;

    content.appendChild(title);
    content.appendChild(message);

    const closeButton = document.createElement("button");
    closeButton.className = "toast-close";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => {
      Toast._remove(toast);
    });

    toast.appendChild(iconElement);
    toast.appendChild(content);
    toast.appendChild(closeButton);

    Toast.container.appendChild(toast);

    // Auto remove after duration
    if (pDuration > 0) {
      setTimeout(() => {
        Toast._remove(toast);
      }, pDuration);
    }

    return toast;
  }

  static success (pMessage, pDuration = 5000) {
    return Toast.show(pMessage, "success", pDuration);
  }

  static error (pMessage, pDuration = 7000) {
    return Toast.show(pMessage, "error", pDuration);
  }

  static warning (pMessage, pDuration = 6000) {
    return Toast.show(pMessage, "warning", pDuration);
  }

  static info (pMessage, pDuration = 5000) {
    return Toast.show(pMessage, "info", pDuration);
  }

  static _remove (pToast) {
    pToast.classList.add("removing");
    setTimeout(() => {
      if (pToast.parentElement) {
        pToast.parentElement.removeChild(pToast);
      }
    }, 300); // Match animation duration
  }

  static _getIcon (pType) {
    const icons = {
      "success": "✓",
      "error": "✗",
      "warning": "⚠",
      "info": "ℹ"
    };
    return icons[pType] || icons.info;
  }

  static _getTitle (pType) {
    const titles = {
      "success": "Success",
      "error": "Error",
      "warning": "Warning",
      "info": "Info"
    };
    return titles[pType] || titles.info;
  }

  static clear () {
    if (Toast.container) {
      Toast.container.innerHTML = "";
    }
  }
}
