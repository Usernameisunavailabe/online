import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarClock,
  Plus,
  CheckCircle,
  Calendar,
  AlertTriangle,
  Clock,
  Trash2,
  Play,
  RotateCcw
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { Button } from "../components/common/Button.jsx";
import { DifficultyBadge } from "../components/common/DifficultyBadge.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { RevisionModal } from "../components/revisions/RevisionModal.jsx";
import { formatDate, getTodayDateString, getRevisionStatus } from "../utils/dates.js";
import "../styles/pages/revisions.css";

export function RevisionPage() {
  const navigate = useNavigate();
  const {
    revisions,
    completeRevision,
    deleteRevision,
    updateRevision,
    setActiveProblemId
  } = useApp();

  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'due' | 'overdue' | 'upcoming' | 'completed'
  const [modalOpen, setModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const today = getTodayDateString();

  // Categorize
  const overdueCount = revisions.filter(
    (r) => !r.completed && r.scheduledDate < today
  ).length;
  const dueTodayCount = revisions.filter(
    (r) => !r.completed && r.scheduledDate === today
  ).length;
  const upcomingCount = revisions.filter(
    (r) => !r.completed && r.scheduledDate > today
  ).length;
  const completedCount = revisions.filter((r) => r.completed).length;

  const filteredRevisions = revisions.filter((r) => {
    const status = getRevisionStatus(r.scheduledDate, r.completed);
    if (activeFilter === "due") return status === "due_today";
    if (activeFilter === "overdue") return status === "overdue";
    if (activeFilter === "upcoming") return status === "upcoming";
    if (activeFilter === "completed") return status === "completed";
    return true;
  }).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.scheduledDate.localeCompare(b.scheduledDate);
  });

  const handleOpenWorkspace = (problemId) => {
    setActiveProblemId(problemId);
    navigate(`/workspace/${problemId}`);
  };

  const handleReschedule = (rev, newDate) => {
    updateRevision(rev.id, { scheduledDate: newDate, completed: false });
    setRescheduleTarget(null);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Revision Planner"
        description="Spaced repetition tracking to strengthen algorithmic recall and prepare for upcoming interviews."
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setModalOpen(true)}
          >
            Schedule Revision
          </Button>
        }
      />

      {/* Summary statistics */}
      <div className="revision-stats-grid">
        <div className="rev-stat-card">
          <div className="rev-stat-label">Due Today</div>
          <div className="rev-stat-value" style={{ color: dueTodayCount > 0 ? "var(--warning)" : "var(--text-primary)" }}>
            {dueTodayCount}
          </div>
        </div>

        <div className="rev-stat-card">
          <div className="rev-stat-label">Overdue</div>
          <div className="rev-stat-value" style={{ color: overdueCount > 0 ? "var(--danger)" : "var(--text-muted)" }}>
            {overdueCount}
          </div>
        </div>

        <div className="rev-stat-card">
          <div className="rev-stat-label">Upcoming</div>
          <div className="rev-stat-value" style={{ color: "var(--accent)" }}>
            {upcomingCount}
          </div>
        </div>

        <div className="rev-stat-card">
          <div className="rev-stat-label">Completed</div>
          <div className="rev-stat-value" style={{ color: "var(--text-muted)" }}>
            {completedCount}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="tabs-header" style={{ borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
        {[
          { key: "all", label: `All (${revisions.length})` },
          { key: "due", label: `Due Today (${dueTodayCount})` },
          { key: "overdue", label: `Overdue (${overdueCount})` },
          { key: "upcoming", label: `Upcoming (${upcomingCount})` },
          { key: "completed", label: `Completed (${completedCount})` }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-btn ${activeFilter === tab.key ? "active" : ""}`}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Revisions List */}
      {filteredRevisions.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No revisions in this section"
          description="Schedule a problem revision to keep key algorithmic invariants fresh in memory."
          actionLabel="Schedule Problem"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="revisions-list">
          {filteredRevisions.map((rev) => {
            const status = getRevisionStatus(rev.scheduledDate, rev.completed);

            return (
              <div
                key={rev.id}
                className={`revision-card status-${status}`}
              >
                <div className="revision-card-main">
                  <div className="revision-card-title">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => handleOpenWorkspace(rev.problemId)}
                    >
                      {rev.problemTitle}
                    </span>
                    <DifficultyBadge difficulty={rev.difficulty} />
                    {status === "overdue" && (
                      <span className="badge" style={{ color: "var(--danger)", backgroundColor: "var(--danger-bg)" }}>
                        Overdue
                      </span>
                    )}
                    {status === "due_today" && (
                      <span className="badge" style={{ color: "var(--warning)", backgroundColor: "var(--warning-bg)" }}>
                        Due Today
                      </span>
                    )}
                    {status === "completed" && (
                      <span className="badge" style={{ color: "var(--text-muted)" }}>
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="revision-card-meta">
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} /> Scheduled: {formatDate(rev.scheduledDate)}
                    </span>
                  </div>

                  {rev.notes && (
                    <div className="revision-notes-snippet">
                      <strong style={{ color: "var(--text-muted)", fontSize: "11px" }}>Focus: </strong>
                      {rev.notes}
                    </div>
                  )}

                  {rescheduleTarget === rev.id && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                      <label style={{ fontSize: "11px", color: "var(--text-muted)" }}>New Date:</label>
                      <input
                        type="date"
                        className="form-input"
                        defaultValue={rev.scheduledDate}
                        min={today}
                        onChange={(e) => handleReschedule(rev, e.target.value)}
                        style={{ padding: "3px 6px", fontSize: "11.5px", width: "auto" }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRescheduleTarget(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {!rev.completed && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={CheckCircle}
                      onClick={() => completeRevision(rev.id)}
                      title="Mark as completed"
                    >
                      Done
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    icon={Calendar}
                    onClick={() => setRescheduleTarget(rescheduleTarget === rev.id ? null : rev.id)}
                    title="Reschedule"
                  >
                    Reschedule
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={Play}
                    onClick={() => handleOpenWorkspace(rev.problemId)}
                  >
                    Solve
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRevision(rev.id)}
                    title="Delete Reminder"
                    style={{ color: "var(--text-muted)", padding: "4px" }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Modal */}
      <RevisionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
