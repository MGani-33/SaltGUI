/* global */

import {Panel} from "./Panel.js";

export class DashboardPanel extends Panel {

  constructor () {
    super("dashboard");

    this.addTitle("Dashboard");
    this.addPanelMenu();
    this.addMsg();
  }

  onShow () {
    const container = this.div;

    // Create dashboard grid
    const grid = document.createElement("div");
    grid.className = "dashboard-grid";

    // Get data for cards
    const wheelKeyListAllPromise = this.api.getWheelKeyListAll();
    const wheelMinionsConnectedPromise = this.api.getWheelMinionsConnected();
    const runnerJobsListJobsPromise = this.api.getRunnerJobsListJobs();

    // Create stat cards
    const activeMinionsCard = this._createStatCard("Active Minions", "0", "success", "✓");
    const pendingJobsCard = this._createStatCard("Pending Jobs", "0", "warning", "⏳");
    const failedJobsCard = this._createStatCard("Failed Jobs", "0", "danger", "✗");
    const updatesCard = this._createStatCard("Updates Available", "0", "info", "🔄");

    grid.appendChild(activeMinionsCard);
    grid.appendChild(pendingJobsCard);
    grid.appendChild(failedJobsCard);
    grid.appendChild(updatesCard);

    container.appendChild(grid);

    // Load actual data
    wheelKeyListAllPromise.then((pData) => {
      this._handleMinionsData(pData, activeMinionsCard);
      return true;
    }, () => {
      this._updateStatCardValue(activeMinionsCard, "Error");
      return false;
    });

    wheelMinionsConnectedPromise.then((pData) => {
      this._handleConnectedMinions(pData, activeMinionsCard);
    }, () => {
      // Ignore errors for connected minions
    });

    runnerJobsListJobsPromise.then((pData) => {
      this._handleJobsData(pData, pendingJobsCard, failedJobsCard);
      return true;
    }, () => {
      this._updateStatCardValue(pendingJobsCard, "Error");
      this._updateStatCardValue(failedJobsCard, "Error");
      return false;
    });

    // Create quick actions section
    const actionsSection = this._createQuickActions();
    container.appendChild(actionsSection);

    // Create recent activity section
    const recentActivity = this._createRecentActivity();
    container.appendChild(recentActivity);
  }

  // eslint-disable-next-line class-methods-use-this
  _createStatCard (pTitle, pValue, pType, pIcon) {
    const card = document.createElement("div");
    card.className = "stat-card hover-lift stagger-item";

    const icon = document.createElement("div");
    icon.className = `stat-icon ${pType}`;
    icon.textContent = pIcon;

    const content = document.createElement("div");
    content.className = "stat-content";

    const title = document.createElement("h3");
    title.textContent = pTitle;

    const value = document.createElement("p");
    value.className = "stat-value";
    value.textContent = pValue;

    const change = document.createElement("p");
    change.className = "stat-change";
    change.textContent = "Loading...";

    content.appendChild(title);
    content.appendChild(value);
    content.appendChild(change);

    card.appendChild(icon);
    card.appendChild(content);

    return card;
  }

  // eslint-disable-next-line class-methods-use-this
  _updateStatCardValue (pCard, pValue) {
    const valueElement = pCard.querySelector(".stat-value");
    if (valueElement) {
      valueElement.textContent = pValue;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _updateStatCardChange (pCard, pChange) {
    const changeElement = pCard.querySelector(".stat-change");
    if (changeElement) {
      changeElement.textContent = pChange;
    }
  }

  _handleMinionsData (pData, pCard) {
    if (!pData || !pData.return || !pData.return[0] || !pData.return[0].data || !pData.return[0].data.return) {
      this._updateStatCardValue(pCard, "Error");
      this._updateStatCardChange(pCard, "Unable to load data");
      return;
    }

    const keys = pData.return[0].data.return;
    const minionsCount = keys.minions ? keys.minions.length : 0;
    const unacceptedCount = keys.minions_pre ? keys.minions_pre.length : 0;

    this._updateStatCardValue(pCard, minionsCount.toString());
    if (unacceptedCount > 0) {
      this._updateStatCardChange(pCard, `${unacceptedCount} pending keys`);
    } else {
      this._updateStatCardChange(pCard, "All keys accepted");
    }
  }

  _handleConnectedMinions (pData, pCard) {
    if (!pData || !pData.return || !pData.return[0] || !pData.return[0].data || !pData.return[0].data.return) {
      return;
    }

    const connected = pData.return[0].data.return;
    const connectedCount = Array.isArray(connected) ? connected.length : 0;
    
    const currentValue = parseInt(pCard.querySelector(".stat-value").textContent, 10);
    if (connectedCount < currentValue) {
      this._updateStatCardChange(pCard, `${currentValue - connectedCount} offline`);
    }
  }

  _handleJobsData (pData, pPendingCard, pFailedCard) {
    if (!pData || !pData.return || !pData.return[0]) {
      this._updateStatCardValue(pPendingCard, "Error");
      this._updateStatCardValue(pFailedCard, "Error");
      return;
    }

    const jobs = pData.return[0];
    let pendingCount = 0;
    let failedCount = 0;

    for (const jobId in jobs) {
      const job = jobs[jobId];
      if (!job) {
        continue;
      }

      // Count running/pending jobs
      if (job.Result && typeof job.Result === "object") {
        // eslint-disable-next-line arrow-body-style
        const hasRunning = Object.values(job.Result).some((val) => {
          return typeof val === "string" && val.includes("running");
        });
        if (hasRunning) {
          pendingCount += 1;
        }
      }

      // Count failed jobs (simplified check)
      const hasFailed = JSON.stringify(job).toLowerCase().includes("false") ||
                       JSON.stringify(job).toLowerCase().includes("fail");
      if (hasFailed) {
        failedCount += 1;
      }
    }

    this._updateStatCardValue(pPendingCard, pendingCount.toString());
    this._updateStatCardChange(pPendingCard, pendingCount === 0 ? "All jobs completed" : "Currently running");

    this._updateStatCardValue(pFailedCard, failedCount.toString());
    this._updateStatCardChange(pFailedCard, failedCount === 0 ? "No failures" : "Needs attention");
  }

  _createQuickActions () {
    const section = document.createElement("div");
    section.style.marginTop = "var(--spacing-8)";

    const title = document.createElement("h2");
    title.textContent = "Quick Actions";
    title.style.fontSize = "var(--font-size-2xl)";
    title.style.fontWeight = "var(--font-weight-bold)";
    title.style.marginBottom = "var(--spacing-4)";
    title.style.color = "var(--color-gray-900)";
    section.appendChild(title);

    const actionsGrid = document.createElement("div");
    actionsGrid.className = "dashboard-grid";

    const actions = [
      {href: "#minions", icon: "🖥️", text: "View Minions"},
      {href: "#keys", icon: "🔑", text: "Manage Keys"},
      {href: "#jobs", icon: "💼", text: "View Jobs"},
      {icon: "▶", onClick: () => this._showCommandBox(), text: "Run Command"}
    ];

    for (const action of actions) {
      const card = document.createElement("div");
      card.className = "card hover-lift";
      card.style.cursor = "pointer";
      card.style.textAlign = "center";
      card.style.padding = "var(--spacing-8) var(--spacing-6)";

      const icon = document.createElement("div");
      icon.textContent = action.icon;
      icon.style.fontSize = "var(--font-size-4xl)";
      icon.style.marginBottom = "var(--spacing-3)";

      const text = document.createElement("div");
      text.textContent = action.text;
      text.style.fontSize = "var(--font-size-lg)";
      text.style.fontWeight = "var(--font-weight-medium)";
      text.style.color = "var(--color-gray-900)";

      card.appendChild(icon);
      card.appendChild(text);

      if (action.onClick) {
        card.addEventListener("click", action.onClick);
      } else if (action.href) {
        card.addEventListener("click", () => {
          window.location.hash = action.href;
        });
      }

      actionsGrid.appendChild(card);
    }

    section.appendChild(actionsGrid);
    return section;
  }

  // eslint-disable-next-line class-methods-use-this
  _showCommandBox () {
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true
    });
    const cmdButton = document.getElementById("button-manual-run");
    if (cmdButton) {
      cmdButton.dispatchEvent(event);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _createRecentActivity () {
    const section = document.createElement("div");
    section.style.marginTop = "var(--spacing-8)";

    const title = document.createElement("h2");
    title.textContent = "Recent Activity";
    title.style.fontSize = "var(--font-size-2xl)";
    title.style.fontWeight = "var(--font-weight-bold)";
    title.style.marginBottom = "var(--spacing-4)";
    title.style.color = "var(--color-gray-900)";
    section.appendChild(title);

    const card = document.createElement("div");
    card.className = "card";
    card.style.padding = "var(--spacing-6)";

    const message = document.createElement("p");
    message.textContent = "Recent job activity will be displayed here.";
    message.style.color = "var(--color-gray-600)";
    message.style.textAlign = "center";
    message.style.padding = "var(--spacing-8) 0";

    card.appendChild(message);
    section.appendChild(card);

    return section;
  }
}
