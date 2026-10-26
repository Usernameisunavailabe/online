import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import {
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Layers,
  Award,
  Clock
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import {
  calculateOverviewMetrics,
  calculateDifficultyBreakdown,
  calculateCompanyReadiness,
  calculateTopicBreakdown,
  calculateWeeklyActivity
} from "../utils/statistics.js";
import { TARGET_COMPANIES } from "../data/companyData.js";
import "../styles/pages/progress.css";

export function ProgressPage() {
  const { questions, activityLog } = useApp();

  const metrics = calculateOverviewMetrics(questions, activityLog);
  const diffStats = calculateDifficultyBreakdown(questions);
  const companyStats = calculateCompanyReadiness(questions, TARGET_COMPANIES);
  const topicStats = calculateTopicBreakdown(questions);
  const weeklyData = calculateWeeklyActivity(activityLog);

  // Difficulty chart data
  const difficultyChartData = [
    {
      name: "Easy",
      solved: diffStats.Easy.solved,
      total: diffStats.Easy.total,
      fill: "var(--diff-easy)"
    },
    {
      name: "Medium",
      solved: diffStats.Medium.solved,
      total: diffStats.Medium.total,
      fill: "var(--diff-med)"
    },
    {
      name: "Hard",
      solved: diffStats.Hard.solved,
      total: diffStats.Hard.total,
      fill: "var(--diff-hard)"
    }
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Progress & Analytics"
        description="Data-driven evaluation of problem coverage, algorithmic taxonomy, and interview target readiness."
      />

      {/* Top Metrics Grid */}
      <div className="progress-metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Solved</div>
          <div className="metric-value-row">
            <span className="metric-number" style={{ color: "var(--accent)" }}>
              {metrics.solved}
            </span>
            <span className="metric-sub">/ {metrics.total}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Completion Rate</div>
          <div className="metric-value-row">
            <span className="metric-number">{metrics.solvedPercentage}%</span>
            <span className="metric-sub">of library</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">In Progress</div>
          <div className="metric-value-row">
            <span className="metric-number" style={{ color: "var(--warning)" }}>
              {metrics.inProgress}
            </span>
            <span className="metric-sub">attempts</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Active Streak</div>
          <div className="metric-value-row">
            <span className="metric-number">{metrics.streak}</span>
            <span className="metric-sub">{metrics.streak === 1 ? "day" : "days"}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="progress-charts-grid">
        {/* Difficulty Breakdown Panel */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              <Award size={15} /> Solved by Difficulty
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Real-time
            </span>
          </div>
          <div className="panel-body">
            <div style={{ height: "160px", marginBottom: "14px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-muted)"
                    fontSize={12}
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
                  <Bar dataKey="solved" radius={[3, 3, 0, 0]} maxBarSize={40}>
                    {difficultyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="progress-diff-card">
              {["Easy", "Medium", "Hard"].map((lvl) => {
                const s = diffStats[lvl];
                const pct = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0;
                return (
                  <div key={lvl} className="diff-stat-item">
                    <div className="diff-stat-header">
                      <span style={{ fontWeight: 500 }}>{lvl}</span>
                      <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                        {s.solved} of {s.total} ({pct}%)
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            lvl === "Easy"
                              ? "var(--diff-easy)"
                              : lvl === "Medium"
                              ? "var(--diff-med)"
                              : "var(--diff-hard)"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Weekly Activity Panel */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              <TrendingUp size={15} /> Weekly Practice Velocity
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Actions logged
            </span>
          </div>
          <div className="panel-body">
            <div style={{ height: "230px" }}>
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
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Company Readiness Table */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">
            <Briefcase size={15} /> Target Company Readiness
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Problems tagged per company
          </span>
        </div>
        <div className="panel-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
            {companyStats.map((c) => (
              <div
                key={c.name}
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "13px" }}>{c.name}</strong>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-secondary)" }}>
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

      {/* Topic Mastery Distribution */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">
            <Layers size={15} /> Topic Coverage Distribution
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Aggregated by taxonomy
          </span>
        </div>
        <div className="panel-body">
          <div className="topic-analytics-grid">
            {topicStats.slice(0, 10).map((t) => (
              <div key={t.topic} className="topic-stat-box">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ fontWeight: 500 }}>{t.topic}</span>
                  <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                    {t.solved} / {t.total} solved
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
