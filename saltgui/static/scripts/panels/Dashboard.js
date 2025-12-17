/* Dashboard Panel - Modern Overview Panel */
/* NO ICONS - Text and color-based design with status dots */

import {Card} from "../components/Card.js";
import {Panel} from "./Panel.js";
import {Utils} from "../Utils.js";

export class DashboardPanel extends Panel {

  constructor () {
    super("dashboard");

    this.addTitle("Dashboard");
    this.div.classList.add("modern-content");
    
    // Create dashboard grid for stat cards
    this.dashboardGrid = Utils.createDiv("dashboard-grid");
    this.div.appendChild(this.dashboardGrid);
    
    // Create quick actions section
    this.quickActionsSection = Utils.createDiv("dashboard-section");
    this.div.appendChild(this.quickActionsSection);
    
    // Create recent activity section
    this.activitySection = Utils.createDiv("dashboard-section");
    this.div.appendChild(this.activitySection);
    
    // Create system alerts section
    this.alertsSection = Utils.createDiv("dashboard-section");
    this.div.appendChild(this.alertsSection);
  }

  onShow () {
    this.updateStatistics();
    this.renderQuickActions();
    this.renderRecentActivity();
    this.renderSystemAlerts();
  }

  updateStatistics () {
    // Clear existing cards
    this.dashboardGrid.innerHTML = "";
    
    // Get statistics from API (mock data for now)
    const stats = this._getStatistics();
    
    // Create stat cards
    const activeMinionsCard = Card.createStatCard(
      "Active Minions",
      stats.activeMinions,
      stats.activeMinionsChange,
      "success"
    );
    this.dashboardGrid.appendChild(activeMinionsCard);
    
    const pendingJobsCard = Card.createStatCard(
      "Pending Jobs",
      stats.pendingJobs,
      stats.pendingJobsChange,
      "warning"
    );
    this.dashboardGrid.appendChild(pendingJobsCard);
    
    const failedJobsCard = Card.createStatCard(
      "Failed Jobs",
      stats.failedJobs,
      stats.failedJobsChange,
      "danger"
    );
    this.dashboardGrid.appendChild(failedJobsCard);
    
    const updatesCard = Card.createStatCard(
      "Updates Available",
      stats.updatesAvailable,
      stats.updatesChange,
      "info"
    );
    this.dashboardGrid.appendChild(updatesCard);
  }

  renderQuickActions () {
    this.quickActionsSection.innerHTML = "";
    
    const title = Utils.createElem("h2", "dashboard-section-title", "Quick Actions");
    this.quickActionsSection.appendChild(title);
    
    const actionsGrid = Utils.createDiv("quick-actions");
    
    // Create quick action buttons - TEXT ONLY
    const actions = [
      {action: "run-command", description: "Execute commands on minions", text: "Run Command"},
      {action: "deploy-state", description: "Apply Salt states", text: "Deploy State"},
      {action: "update-packages", description: "Update system packages", text: "Update Packages"},
      {action: "view-logs", description: "Check system logs", text: "View Logs"}
    ];
    
    for (const action of actions) {
      const btn = Utils.createElem("button", "quick-action-btn");
      
      const label = Utils.createSpan("quick-action-label", action.text);
      const desc = Utils.createSpan("quick-action-description", action.description);
      
      btn.appendChild(label);
      btn.appendChild(desc);
      
      btn.addEventListener("click", () => {
        this._handleQuickAction(action.action);
      });
      
      actionsGrid.appendChild(btn);
    }
    
    this.quickActionsSection.appendChild(actionsGrid);
  }

  renderRecentActivity () {
    this.activitySection.innerHTML = "";
    
    const title = Utils.createElem("h2", "dashboard-section-title", "Recent Activity");
    this.activitySection.appendChild(title);
    
    const timeline = Utils.createDiv("activity-timeline");
    
    // Get recent activity (mock data for now)
    const activities = this._getRecentActivity();
    
    for (const activity of activities) {
      const item = Utils.createDiv("timeline-item");
      
      // Marker with colored dot
      const marker = Utils.createDiv(`timeline-marker ${activity.type}`);
      item.appendChild(marker);
      
      // Content
      const content = Utils.createDiv("timeline-content");
      
      const actTitle = Utils.createDiv("timeline-title", activity.title);
      const actDesc = Utils.createDiv("timeline-description", activity.description);
      const actTime = Utils.createDiv("timeline-time", activity.time);
      
      content.appendChild(actTitle);
      content.appendChild(actDesc);
      content.appendChild(actTime);
      
      item.appendChild(content);
      timeline.appendChild(item);
    }
    
    this.activitySection.appendChild(timeline);
  }

  renderSystemAlerts () {
    this.alertsSection.innerHTML = "";
    
    const title = Utils.createElem("h2", "dashboard-section-title", "System Alerts");
    this.alertsSection.appendChild(title);
    
    const alertsContainer = Utils.createDiv("system-alerts");
    
    // Get system alerts (mock data for now)
    const alerts = this._getSystemAlerts();
    
    for (const alert of alerts) {
      const alertDiv = Utils.createDiv(`system-alert ${alert.type}`);
      
      const content = Utils.createDiv("alert-content");
      const alertTitle = Utils.createDiv("alert-title", alert.title);
      const alertMessage = Utils.createDiv("alert-message", alert.message);
      
      content.appendChild(alertTitle);
      content.appendChild(alertMessage);
      alertDiv.appendChild(content);
      
      // Dismiss button - TEXT ONLY
      const dismissBtn = Utils.createElem("button", "alert-dismiss");
      dismissBtn.textContent = "×";
      dismissBtn.addEventListener("click", () => {
        alertDiv.style.display = "none";
      });
      
      alertDiv.appendChild(dismissBtn);
      alertsContainer.appendChild(alertDiv);
    }
    
    this.alertsSection.appendChild(alertsContainer);
  }

  // Methods below will use 'this' when integrated with API
  /* eslint-disable class-methods-use-this */

  _getStatistics () {
    // Get actual statistics from Router/API using this.api
    // For now, return mock data
    // TODO: Integrate with actual API when available
    const mockData = {
      activeMinions: 150,
      activeMinionsChange: "+5 from yesterday",
      failedJobs: 3,
      failedJobsChange: "Same as yesterday",
      pendingJobs: 12,
      pendingJobsChange: "-3 from yesterday",
      updatesAvailable: 47,
      updatesChange: "New this week"
    };
    return mockData;
  }

  _getRecentActivity () {
    // Get actual recent activity from API using this.api
    // For now, return mock data
    // TODO: Integrate with actual API when available
    const mockData = [
      {
        description: "Successfully updated 23 packages on web-server-01",
        time: "2 minutes ago",
        title: "Package Update Completed",
        type: "success"
      },
      {
        description: "db-server-05 connected to Salt master",
        time: "15 minutes ago",
        title: "New Minion Connected",
        type: "info"
      },
      {
        description: "State apply failed on app-server-03",
        time: "1 hour ago",
        title: "Job Failed",
        type: "danger"
      }
    ];
    return mockData;
  }

  _getSystemAlerts () {
    // Get actual system alerts from API using this.api
    // For now, return mock data
    // TODO: Integrate with actual API when available
    const mockData = [
      {
        message: "12 security updates are pending for your minions",
        title: "Security Updates Available",
        type: "warning"
      },
      {
        message: "3 minions are not responding to ping requests",
        title: "Critical Alert",
        type: "danger"
      }
    ];
    return mockData;
  }

  _handleQuickAction (pAction) {
    // Handle quick action click
    // TODO: Use this.router for navigation when fully integrated
    switch (pAction) {
    case "run-command":
      // Trigger command box
      const event = new CustomEvent("show-command-box");
      document.dispatchEvent(event);
      break;
    case "deploy-state":
      // Navigate to state management
      window.location.hash = "#minions";
      break;
    case "update-packages":
      // Navigate to package management
      window.location.hash = "#packages";
      break;
    case "view-logs":
      // Navigate to events/logs
      window.location.hash = "#events";
      break;
    }
  }
  /* eslint-enable class-methods-use-this */
}
