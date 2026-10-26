import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Menu,
  Play,
  Settings as SettingsIcon,
  ChevronRight,
  Command
} from "lucide-react";
import { SearchInput } from "../common/SearchInput.jsx";
import { Button } from "../common/Button.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function Topbar({ onOpenMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeProblemId,
    questions,
    setSearchModalOpen
  } = useApp();

  // Determine breadcrumb
  const path = location.pathname;
  let pageTitle = "Dashboard";
  let subTitle = null;

  if (path.startsWith("/problems")) {
    pageTitle = "Problems";
  } else if (path.startsWith("/workspace")) {
    pageTitle = "Workspace";
    const currentQ = questions.find((q) => q.id === activeProblemId);
    if (currentQ) {
      subTitle = currentQ.title;
    }
  } else if (path.startsWith("/bookmarks")) {
    pageTitle = "Bookmarks";
  } else if (path.startsWith("/revision")) {
    pageTitle = "Revision Planner";
  } else if (path.startsWith("/mock-interviews")) {
    pageTitle = "Mock Interviews";
  } else if (path.startsWith("/progress")) {
    pageTitle = "Progress & Analytics";
  } else if (path.startsWith("/settings")) {
    pageTitle = "Settings";
  }

  // Find most recent uncompleted or active problem
  const continueProblem =
    questions.find((q) => q.id === activeProblemId) ||
    questions.find((q) => q.status === "In Progress") ||
    questions[0];

  const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent);
  const shortcutHint = isMac ? "⌘K" : "Ctrl+K";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="sidebar-toggle-btn mobile-menu-btn"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          style={{ display: "none" }}
        >
          <Menu size={18} />
        </button>

        <nav aria-label="Breadcrumb" className="topbar-breadcrumb">
          <span className="topbar-breadcrumb-title">{pageTitle}</span>
          {subTitle && (
            <>
              <ChevronRight size={13} style={{ color: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-secondary)" }}>{subTitle}</span>
            </>
          )}
        </nav>
      </div>

      <div className="topbar-search-container">
        <SearchInput
          value=""
          onChange={() => setSearchModalOpen(true)}
          onFocus={() => setSearchModalOpen(true)}
          placeholder="Search problems... (⌘K)"
          shortcutHint={shortcutHint}
        />
      </div>

      <div className="topbar-right">
        {continueProblem && !path.startsWith("/workspace") && (
          <Button
            variant="primary"
            size="sm"
            icon={Play}
            onClick={() => navigate(`/workspace/${continueProblem.id}`)}
            title={`Continue: ${continueProblem.title}`}
          >
            Practice
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/settings")}
          aria-label="Settings"
          title="Open Settings"
          style={{ padding: "6px" }}
        >
          <SettingsIcon size={16} />
        </Button>
      </div>
    </header>
  );
}
