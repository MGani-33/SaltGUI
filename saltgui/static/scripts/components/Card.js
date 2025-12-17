/* Card Component - Modern card layout */
/* NO ICONS - Typography and color-based design */

import {Utils} from "../Utils.js";

export class Card {

  /**
   * Create a basic card
   * @param {string} pTitle - Card title
   * @param {string} pContent - Card content (HTML or text)
   * @returns {HTMLElement} Card element
   */
  static createCard (pTitle = null, pContent = null) {
    const card = Utils.createDiv("card");
    
    if (pTitle) {
      const header = Utils.createDiv("card-header");
      const title = Utils.createElem("h3", "card-title", pTitle);
      header.appendChild(title);
      card.appendChild(header);
    }
    
    if (pContent) {
      const body = Utils.createDiv("card-body");
      
      if (typeof pContent === "string") {
        body.innerHTML = pContent;
      } else {
        body.appendChild(pContent);
      }
      
      card.appendChild(body);
    }
    
    return card;
  }

  /**
   * Create a stat card with icon-less design
   * @param {string} pTitle - Card title
   * @param {string|number} pValue - Stat value
   * @param {string} pChange - Change text (e.g., "+5 from yesterday")
   * @param {string} pType - Card type (success, warning, danger, info)
   * @returns {HTMLElement} Stat card element
   */
  static createStatCard (pTitle, pValue, pChange = null, pType = "info") {
    const card = Utils.createDiv("stat-card");
    card.classList.add(pType);
    
    // Header with status dot
    const header = Utils.createDiv("stat-header");
    
    const dot = Utils.createSpan(`status-dot ${pType}`);
    dot.textContent = "●";
    header.appendChild(dot);
    
    const title = Utils.createElem("h3", "", pTitle);
    header.appendChild(title);
    
    card.appendChild(header);
    
    // Content
    const content = Utils.createDiv("stat-content");
    
    const value = Utils.createElem("p", "stat-value", String(pValue));
    content.appendChild(value);
    
    if (pChange) {
      // Determine change type based on text
      let changeType = "neutral";
      if (pChange.startsWith("+") || pChange.toLowerCase().includes("increase")) {
        changeType = "positive";
      } else if (pChange.startsWith("-") || pChange.toLowerCase().includes("decrease")) {
        changeType = "negative";
      }
      
      const change = Utils.createElem("p", `stat-change ${changeType}`, pChange);
      content.appendChild(change);
    }
    
    card.appendChild(content);
    
    return card;
  }

  /**
   * Add an action button to card header
   * @param {HTMLElement} pCard - Card element
   * @param {string} pButtonText - Button text
   * @param {Function} pOnClick - Click handler
   * @param {string} pButtonClass - Additional button classes
   */
  static addCardAction (pCard, pButtonText, pOnClick, pButtonClass = "btn-secondary btn-sm") {
    let header = pCard.querySelector(".card-header");
    
    if (!header) {
      header = Utils.createDiv("card-header");
      const title = Utils.createElem("h3", "card-title", "");
      header.appendChild(title);
      pCard.insertBefore(header, pCard.firstChild);
    }
    
    const button = Utils.createElem("button", `btn ${pButtonClass}`, pButtonText);
    button.addEventListener("click", pOnClick);
    
    header.appendChild(button);
  }

  /**
   * Add footer to card
   * @param {HTMLElement} pCard - Card element
   * @param {string|HTMLElement} pFooterContent - Footer content
   */
  static addCardFooter (pCard, pFooterContent) {
    const footer = Utils.createDiv("card-footer");
    
    if (typeof pFooterContent === "string") {
      footer.innerHTML = pFooterContent;
    } else {
      footer.appendChild(pFooterContent);
    }
    
    pCard.appendChild(footer);
  }
}
