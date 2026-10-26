import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  Terminal,
  Bookmark,
  CalendarClock,
  Timer,
  BarChart2,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";

export function Sidebar({ mobileOpen, onCloseMobile }) {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    questions,
    revisions,
    activeProblemId
  } = useApp();

  const bookmarkedCount = questions.filter((q) => q.bookmarked).length;
  const pendingRevisions = revisions.filter((r) => !r.completed).length;

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard
    },
    {
      to: "/problems",
      label: "Problems",
      icon: Code2,
      badge: questions.length
    },
    {
      to: `/workspace/${activeProblemId || "two-sum"}`,
      label: "Workspace",
      icon: Terminal
    },
    {
      to: "/bookmarks",
      label: "Bookmarks",
      icon: Bookmark,
      badge: bookmarkedCount > 0 ? bookmarkedCount : null
    },
    {
      to: "/revision",
      label: "Revision",
      icon: CalendarClock,
      badge: pendingRevisions > 0 ? pendingRevisions : null
    },
    {
      to: "/mock-interviews",
      label: "Mock Interviews",
      icon: Timer
    },
    {
      to: "/progress",
      label: "Progress",
      icon: BarChart2
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings
    }
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <NavLink to="/dashboard" className="brand-wordmark" onClick={onCloseMobile}>
              <span className="brand-dot" />
              <span>practise</span>
            </NavLink>
          )}
          {sidebarCollapsed && (
            <span className="brand-dot" style={{ margin: "0 auto" }} />
          )}

          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={onCloseMobile}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={16} className="nav-icon" />
                {!sidebarCollapsed && (
                  <>
                    <span className="nav-text">{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile" title="Guest Developer (Local Storage Session)">
            <div className="user-avatar">
              <UserCheck size={13} />
            </div>
            {!sidebarCollapsed && (
              <div className="user-info">
                <div className="user-name">Guest Developer</div>
                <div className="user-role">Local Session</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
