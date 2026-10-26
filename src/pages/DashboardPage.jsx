import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import {
  Code2,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  Target,
  CalendarCheck,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { DifficultyBadge } from "../components/common/DifficultyBadge.jsx";
import { StatusBadge } from "../components/common/StatusBadge.jsx";
import { Button } from "../components/common/Button.jsx";
import {
  calculateOverviewMetrics,
  calculateCompanyReadiness,
  calculateWeeklyActivity
} from "../utils/statistics.js";
import { formatTimeAgo, formatDate } from "../utils/dates.js";
import "../styles/pages/dashboard.css";

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    questions,
    activityLog,
    dailyGoal,
    setDailyGoalTarget,
    revisions,
    activeProblemId,
    setActiveProblemId
  } = useApp();

  const metrics = calculateOverviewMetrics(questions, activityLog);
  const weeklyData = calculateWeeklyActivity(activityLog);
  const topCompanies = ["Google", "Amazon", "Microsoft", "Meta", "Adobe"];
  const companyStats = calculateCompanyReadiness(questions, topCompanies);

  // Determine continue problem: most recent from activity log, or activeProblemId, or first In Progress, or first Todo
  const recentLog = activityLog.find((l) => l.problemId);
  const continueProblem =
    (recentLog && questions.find((q) => q.id === recentLog.problemId)) ||
    questions.find((q) => q.id === activeProblemId) ||
    questions.find((q) => q.status === "In Progress") ||
    questions[0];

  // Upcoming revisions (uncompleted, sorted by scheduledDate)
  const upcomingRevisions = revisions
    .filter((r) => !r.completed)
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
    .slice(0, 4);

  // Goal progress
  const goalPercent = Math.min(
    100,
    Math.round((dailyGoal.completedToday / (dailyGoal.target || 1)) * 100)
  );

  const handleContinue = () => {
    if (continueProblem) {
      setActiveProblemId(continueProblem.id);
      navigate(`/workspace/${continueProblem.id}`);
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard"
        description="Daily workspace overview, practice metrics, and targeted interview readiness."
      />

      {/* Overview Metrics Cards */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card">
          <div className="metric-label">
            <span>Total Available</span>
            <Code2 size={15} style={{ color: "var(--text-muted)" }} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{metrics.total}</span>
            <span className="metric-sub">problems</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <span>Solved</span>
            <CheckCircle2 size={15} style={{ color: "var(--accent)" }} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number" style={{ color: "var(--accent)" }}>
              {metrics.solved}
            </span>
            <span className="metric-sub">({metrics.solvedPercentage}%)</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <span>In Progress</span>
            <Clock size={15} style={{ color: "var(--warning)" }} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number" style={{ color: "var(--warning)" }}>
              {metrics.inProgress}
            </span>
            <span className="metric-sub">attempts</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <span>Current Streak</span>
            <Flame size={15} style={{ color: metrics.streak > 0 ? "var(--warning)" : "var(--text-muted)" }} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{metrics.streak}</span>
            <span className="metric-sub">{metrics.streak === 1 ? "day" : "days"}</span>
          </div>
        </div>
      </div>

      {/* Continue Practising Hero Card */}
      {continueProblem && (
        <div className="continue-card">
          <div className="continue-info">
            <span className="continue-tagline">Resume Practice Session</span>
            <h2 className="continue-title">{continueProblem.title}</h2>
            <div className="continue-meta">
              <DifficultyBadge difficulty={continueProblem.difficulty} />
              <StatusBadge status={continueProblem.status} />
              {(continueProblem.topics || []).slice(0, 3).map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            icon={ArrowRight}
            onClick={handleContinue}
          >
            Continue in Workspace
          </Button>
        </div>
      )}

      {/* Main Grid: Left Column (Activity & Revisions) & Right Column (Goal & Companies) */}
      <div className="dashboard-main-grid">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Weekly Activity Chart */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">
                <TrendingUp size={15} /> Weekly Problem Solving Activity
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Last 7 Days
              </span>
            </div>
            <div className="panel-body" style={{ height: "180px", paddingTop: "10px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border-subtle)" }}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-panel)",
                      borderColor: "var(--border-default)",
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "var(--text-primary)"
                    }}
                    cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--accent)"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Recent Activity</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Latest actions
              </span>
            </div>
            <div className="panel-body" style={{ padding: "10px 14px" }}>
              {activityLog.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "12px", padding: "14px 0", textAlign: "center" }}>
                  No recent activity recorded yet.
                </div>
              ) : (
                <div className="activity-feed">
                  {activityLog.slice(0, 5).map((log) => (
                    <div key={log.id} className="activity-item">
                      <div className="activity-item-left">
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor:
                              log.type === "solved"
                                ? "var(--accent)"
                                : log.type === "revision_completed"
                                ? "var(--info)"
                                : "var(--text-muted)"
                          }}
                        />
                        <div>
                          <strong style={{ color: "var(--text-primary)", marginRight: "6px" }}>
                            {log.problemTitle}
                          </strong>
                          <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                            {log.detail}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        {formatTimeAgo(log.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Daily Goal Card */}
          <div className="goal-card">
            <div className="goal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Target size={15} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: "13px", fontWeight: "600" }}>Daily Goal</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <label htmlFor="daily-target-select" style={{ fontSize: "11px", color: "var(--text-muted)" }}>Target:</label>
                <select
                  id="daily-target-select"
                  className="form-select"
                  value={dailyGoal.target}
                  onChange={(e) => setDailyGoalTarget(e.target.value)}
                  style={{ padding: "2px 6px", fontSize: "11px", width: "auto" }}
                >
                  <option value={1}>1 Problem</option>
                  <option value={2}>2 Problems</option>
                  <option value={3}>3 Problems</option>
                  <option value={5}>5 Problems</option>
                </select>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                <span style={{ color: "var(--text-secondary)" }}>
                  {dailyGoal.completedToday} of {dailyGoal.target} solved today
                </span>
                <span style={{ fontWeight: 600, color: goalPercent === 100 ? "var(--accent)" : "var(--text-primary)" }}>
                  {goalPercent}%
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Company Preparation */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">
                <Briefcase size={14} /> Company Preparation
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/progress")}
                style={{ fontSize: "11px", padding: "2px 6px" }}
              >
                View all
              </Button>
            </div>
            <div className="panel-body">
              <div className="company-grid">
                {companyStats.map((c) => (
                  <div key={c.name} className="company-row">
                    <div className="company-row-header">
                      <span style={{ fontWeight: 500 }}>{c.name}</span>
                      <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                        {c.solved}/{c.total} ({c.percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${c.percentage}%`,
                          backgroundColor:
                            c.percentage > 50
                              ? "var(--accent)"
                              : c.percentage > 0
                              ? "var(--warning)"
                              : "var(--border-default)"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Revisions */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">
                <CalendarCheck size={14} /> Revisions Due Soon
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/revision")}
                style={{ fontSize: "11px", padding: "2px 6px" }}
              >
                Planner
              </Button>
            </div>
            <div className="panel-body" style={{ padding: "8px 12px" }}>
              {upcomingRevisions.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "12px", padding: "10px 0", textAlign: "center" }}>
                  No pending revisions due.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {upcomingRevisions.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 8px",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                          {rev.problemTitle}
                        </div>
                        <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                          Due: {formatDate(rev.scheduledDate)}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setActiveProblemId(rev.problemId);
                          navigate(`/workspace/${rev.problemId}`);
                        }}
                        style={{ padding: "2px 6px", fontSize: "10.5px" }}
                      >
                        Practice
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
