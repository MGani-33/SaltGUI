/* Badge Component - TEXT ONLY with colored dots */
/* NO ICONS - Typography and color-based status indicators */

import {Utils} from "../Utils.js";

export class Badge {

  /**
   * Create a status badge with text label
   * @param {string} pText - Badge text (e.g., "Active", "Pending", "Failed")
   * @param {string} pType - Badge type (success, warning, danger, info, primary, secondary)
   * @returns {HTMLElement} Badge element
   */
  static createBadge (pText, pType = "secondary") {
    const badge = Utils.createSpan("badge");
    badge.classList.add(pType);
    badge.textContent = pText;
    return badge;
  }

  /**
   * Create a status indicator with colored dot and text
   * @param {string} pText - Status text (e.g., "Active", "Running")
   * @param {string} pType - Dot color type (success, warning, danger, info)
   * @param {boolean} pPulse - Whether to add pulse animation
   * @returns {HTMLElement} Status indicator element
   */
  static createStatusIndicator (pText, pType = "success", pPulse = false) {
    const indicator = Utils.createSpan("status-indicator");
    
    // Create colored dot (only allowed visual element)
    const dot = Utils.createSpan(`status-dot ${pType}`);
    dot.textContent = "●";
    
    if (pPulse) {
      dot.classList.add("pulse");
    }
    
    // Create text label
    const text = Utils.createSpan("status-text", pText);
    
    indicator.appendChild(dot);
    indicator.appendChild(text);
    
    return indicator;
  }

  /**
   * Create a count badge (for sidebar navigation)
   * @param {number} pCount - Count number
   * @param {string} pType - Badge type (success, warning, danger, info)
   * @returns {HTMLElement} Count badge element
   */
  static createCountBadge (pCount, pType = null) {
    const badge = Utils.createSpan("count-badge", String(pCount));
    
    if (pType) {
      badge.classList.add(pType);
    }
    
    return badge;
  }

  /**
   * Create a tag element (for filtering, categories, etc.)
   * @param {string} pText - Tag text
   * @param {boolean} pRemovable - Whether tag can be removed
   * @param {Function} pOnRemove - Callback when tag is removed
   * @returns {HTMLElement} Tag element
   */
  static createTag (pText, pRemovable = false, pOnRemove = null) {
    const tag = Utils.createSpan("tag", pText);
    
    if (pRemovable) {
      const removeBtn = Utils.createSpan("tag-remove");
      removeBtn.textContent = "×";
      
      if (pOnRemove) {
        removeBtn.addEventListener("click", (pEvent) => {
          pEvent.stopPropagation();
          pOnRemove(tag);
        });
      }
      
      tag.appendChild(removeBtn);
    }
    
    return tag;
  }

  /**
   * Get badge type from minion status
   * @param {string} pStatus - Minion status (up, down, etc.)
   * @returns {string} Badge type
   */
  static getBadgeTypeFromStatus (pStatus) {
    const statusLower = (pStatus || "").toLowerCase();
    
    if (statusLower.includes("up") || statusLower.includes("active") || statusLower.includes("success")) {
      return "success";
    }
    if (statusLower.includes("down") || statusLower.includes("failed") || statusLower.includes("error")) {
      return "danger";
    }
    if (statusLower.includes("pending") || statusLower.includes("waiting") || statusLower.includes("running")) {
      return "warning";
    }
    if (statusLower.includes("info") || statusLower.includes("new")) {
      return "info";
    }
    
    return "secondary";
  }
}
