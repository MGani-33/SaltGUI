/* global */

export class Modal {

  constructor (pId, pOptions = {}) {
    this.id = pId;
    this.options = {
      closeOnBackdrop: pOptions.closeOnBackdrop !== false,
      closeOnEscape: pOptions.closeOnEscape !== false,
      size: pOptions.size || "md",
      ...pOptions
    };

    this.overlay = null;
    this.content = null;
    this.isOpen = false;

    this._create();
    this._attachEventListeners();
  }

  _create () {
    // Create overlay
    this.overlay = document.createElement("div");
    this.overlay.className = `modal-overlay modal-${this.options.size}`;
    this.overlay.id = this.id;

    // Create content
    this.content = document.createElement("div");
    this.content.className = "modal-content";

    this.overlay.appendChild(this.content);
    document.body.appendChild(this.overlay);
  }

  _attachEventListeners () {
    // Close on backdrop click
    if (this.options.closeOnBackdrop) {
      this.overlay.addEventListener("click", (pClickEvent) => {
        if (pClickEvent.target === this.overlay) {
          this.close();
        }
      });
    }

    // Close on escape key
    if (this.options.closeOnEscape) {
      document.addEventListener("keydown", (pKeyEvent) => {
        if (pKeyEvent.key === "Escape" && this.isOpen) {
          this.close();
        }
      });
    }
  }

  setHeader (pTitle, pShowCloseButton = true) {
    const header = document.createElement("div");
    header.className = "modal-header";

    const title = document.createElement("h2");
    title.textContent = pTitle;
    header.appendChild(title);

    if (pShowCloseButton) {
      const closeButton = document.createElement("button");
      closeButton.className = "modal-close";
      closeButton.textContent = "×";
      closeButton.addEventListener("click", () => this.close());
      header.appendChild(closeButton);
    }

    // Remove existing header if present
    const existingHeader = this.content.querySelector(".modal-header");
    if (existingHeader) {
      existingHeader.remove();
    }

    this.content.insertBefore(header, this.content.firstChild);
    return header;
  }

  setBody (pContent) {
    let body = this.content.querySelector(".modal-body");
    if (!body) {
      body = document.createElement("div");
      body.className = "modal-body";

      const footer = this.content.querySelector(".modal-footer");
      if (footer) {
        this.content.insertBefore(body, footer);
      } else {
        this.content.appendChild(body);
      }
    }

    if (typeof pContent === "string") {
      body.innerHTML = pContent;
    } else if (pContent instanceof HTMLElement) {
      body.innerHTML = "";
      body.appendChild(pContent);
    }

    return body;
  }

  setFooter (pButtons) {
    let footer = this.content.querySelector(".modal-footer");
    if (!footer) {
      footer = document.createElement("div");
      footer.className = "modal-footer";
      this.content.appendChild(footer);
    }

    footer.innerHTML = "";

    for (const buttonConfig of pButtons) {
      const button = document.createElement("button");
      button.className = `btn ${buttonConfig.className || "btn-secondary"}`;
      button.textContent = buttonConfig.text;

      if (buttonConfig.onClick) {
        button.addEventListener("click", buttonConfig.onClick);
      }

      if (buttonConfig.close) {
        button.addEventListener("click", () => this.close());
      }

      footer.appendChild(button);
    }

    return footer;
  }

  open () {
    this.isOpen = true;
    this.overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    if (this.options.onOpen) {
      this.options.onOpen(this);
    }
  }

  close () {
    this.isOpen = false;
    this.overlay.classList.remove("active");
    document.body.style.overflow = "";

    if (this.options.onClose) {
      this.options.onClose(this);
    }
  }

  toggle () {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  destroy () {
    if (this.overlay && this.overlay.parentElement) {
      this.overlay.parentElement.removeChild(this.overlay);
    }
    this.isOpen = false;
  }

  getBody () {
    return this.content.querySelector(".modal-body");
  }

  getFooter () {
    return this.content.querySelector(".modal-footer");
  }
}
