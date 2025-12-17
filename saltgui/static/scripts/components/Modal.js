/* Modal Component - Modern modal dialogs */
/* NO ICONS - Text-based design */

import {Utils} from "../Utils.js";

export class Modal {

  /**
   * Create and show a modal dialog
   * @param {string} pTitle - Modal title
   * @param {string|HTMLElement} pContent - Modal content
   * @param {Object} pOptions - Modal options
   * @returns {HTMLElement} Modal element
   */
  static show (pTitle, pContent, pOptions = {}) {
    const options = {
      size: "medium", // small, medium, large
      showClose: true,
      buttons: [],
      onClose: null,
      ...pOptions
    };

    // Create backdrop
    const backdrop = Utils.createDiv("modal-backdrop");
    backdrop.id = "modal-backdrop-" + Date.now();
    
    // Create modal content
    const modalContent = Utils.createDiv("modal-content");
    
    if (options.size === "large") {
      modalContent.style.maxWidth = "900px";
    } else if (options.size === "small") {
      modalContent.style.maxWidth = "400px";
    }
    
    // Create header
    const header = Utils.createDiv("modal-header");
    const title = Utils.createElem("h2", "", pTitle);
    header.appendChild(title);
    
    if (options.showClose) {
      const closeBtn = Utils.createElem("button", "close-btn");
      closeBtn.textContent = "×";
      closeBtn.addEventListener("click", () => {
        Modal.close(backdrop, options.onClose);
      });
      header.appendChild(closeBtn);
    }
    
    modalContent.appendChild(header);
    
    // Create body
    const body = Utils.createDiv("modal-body");
    
    if (typeof pContent === "string") {
      body.innerHTML = pContent;
    } else {
      body.appendChild(pContent);
    }
    
    modalContent.appendChild(body);
    
    // Create footer with buttons
    if (options.buttons && options.buttons.length > 0) {
      const footer = Utils.createDiv("modal-footer");
      
      for (const buttonDef of options.buttons) {
        const button = Utils.createElem("button", `btn ${buttonDef.class || "btn-secondary"}`);
        button.textContent = buttonDef.text;
        
        button.addEventListener("click", () => {
          if (buttonDef.onClick) {
            buttonDef.onClick(backdrop);
          }
          if (buttonDef.close !== false) {
            Modal.close(backdrop, options.onClose);
          }
        });
        
        footer.appendChild(button);
      }
      
      modalContent.appendChild(footer);
    }
    
    backdrop.appendChild(modalContent);
    document.body.appendChild(backdrop);
    
    // Show with animation
    setTimeout(() => {
      backdrop.classList.add("show");
      modalContent.classList.add("scale-in");
    }, 10);
    
    // Close on backdrop click
    backdrop.addEventListener("click", (pEvent) => {
      if (pEvent.target === backdrop) {
        Modal.close(backdrop, options.onClose);
      }
    });
    
    // Close on Escape key
    const escapeHandler = (pEvent) => {
      if (pEvent.key === "Escape") {
        Modal.close(backdrop, options.onClose);
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);
    
    return backdrop;
  }

  /**
   * Close a modal
   * @param {HTMLElement} pModal - Modal element to close
   * @param {Function} pOnClose - Callback function
   */
  static close (pModal, pOnClose = null) {
    if (!pModal) {
      return;
    }
    
    const modalContent = pModal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.classList.remove("scale-in");
      modalContent.classList.add("scale-out");
    }
    
    pModal.classList.remove("show");
    
    setTimeout(() => {
      pModal.remove();
      
      if (pOnClose) {
        pOnClose();
      }
    }, 300);
  }

  /**
   * Show a confirmation dialog
   * @param {string} pTitle - Dialog title
   * @param {string} pMessage - Confirmation message
   * @param {Function} pOnConfirm - Callback when confirmed
   * @param {Function} pOnCancel - Callback when cancelled
   */
  static confirm (pTitle, pMessage, pOnConfirm, pOnCancel = null) {
    return Modal.show(pTitle, pMessage, {
      buttons: [
        {
          text: "Cancel",
          class: "btn-secondary",
          onClick: () => {
            if (pOnCancel) {
              pOnCancel();
            }
          }
        },
        {
          text: "Confirm",
          class: "btn-primary",
          onClick: () => {
            if (pOnConfirm) {
              pOnConfirm();
            }
          }
        }
      ]
    });
  }

  /**
   * Show an alert dialog
   * @param {string} pTitle - Dialog title
   * @param {string} pMessage - Alert message
   * @param {string} pType - Alert type (success, warning, danger, info)
   */
  static alert (pTitle, pMessage, pType = "info") {
    const alertDiv = Utils.createDiv(`alert alert-${pType}`);
    alertDiv.textContent = pMessage;
    
    return Modal.show(pTitle, alertDiv, {
      buttons: [
        {
          text: "OK",
          class: "btn-primary"
        }
      ]
    });
  }
}
