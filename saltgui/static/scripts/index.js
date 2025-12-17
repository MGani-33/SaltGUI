/* global */

/* istanbul ignore file */
import {Router} from "./Router.js";
import {Sidebar} from "./components/Sidebar.js";
import {ThemeManager} from "./utils/ThemeManager.js";

window.addEventListener("load", () => {
  // Initialize Router
  new Router();
  
  // Initialize modern UI components
  Sidebar.init();
  ThemeManager.init();
  
  // Connect run command button to existing command box
  const runCommandBtn = document.getElementById("run-command-btn");
  const buttonManualRun = document.getElementById("button-manual-run");
  if (runCommandBtn && buttonManualRun) {
    runCommandBtn.addEventListener("click", () => {
      buttonManualRun.click();
    });
  }
});

/* eslint-disable func-names */
// Make sure the errors are shown during regression testing
window.onerror = function (msg, url, lineNo, columnNo, error) {
  /* eslint-disable no-console */
  console.log("JS Error:" + msg + ",error:" + error + ",url:" + url + "@" + lineNo + ":" + columnNo);
  /* eslint-enable no-console */
  if (error && error.stack) {
    /* eslint-disable no-console */
    console.log("Stack:" + error.stack);
    /* eslint-enable no-console */
  }
  return false;
};

// simple polyfill solution
if (!Object.fromEntries) {
  Object.fromEntries = function (pairs) {
    const obj = {};
    for (const pair of pairs) {
      obj[pair[0]] = pair[1];
    }
    return obj;
  }
}
/* eslint-enable func-names */
