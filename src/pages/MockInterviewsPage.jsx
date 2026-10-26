import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  Timer,
  Play,
  CheckCircle,
  AlertTriangle,
  History,
  Building,
  Award,
  Layers,
  StopCircle,
  FileCheck
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { Button } from "../components/common/Button.jsx";
import { DifficultyBadge } from "../components/common/DifficultyBadge.jsx";
import { StatusBadge } from "../components/common/StatusBadge.jsx";
import { ConfirmDialog } from "../components/common/ConfirmDialog.jsx";
import { WorkspaceBottomPanel } from "../components/workspace/WorkspaceBottomPanel.jsx";
import { executeCode } from "../services/executionService.js";
import { TARGET_COMPANIES, TOPICS, DIFFICULTIES } from "../data/companyData.js";
import { formatDate } from "../utils/dates.js";
import "../styles/pages/mockInterviews.css";

export function MockInterviewsPage() {
  const {
    questions,
    preferences,
    interviewHistory,
    saveInterviewSession,
    logActivity,
    updateProblemStatus
  } = useApp();

  // Wizard state: 'setup' | 'active' | 'completed'
  const [sessionPhase, setSessionPhase] = useState("setup");

  // Setup options
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [selectedDifficulty, setSelectedDifficulty] = useState("Any");
  const [selectedTopic, setSelectedTopic] = useState("Any");
  const [selectedCompany, setSelectedCompany] = useState("Any");

  // Active session data
  const [assignedProblems, setAssignedProblems] = useState([]);
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [sessionCode, setSessionCode] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState(
    preferences.preferredLanguage || "javascript"
  );
  const [endTime, setEndTime] = useState(null);
  const [timeLeftSec, setTimeLeftSec] = useState(0);
  const [confirmFinishOpen, setConfirmFinishOpen] = useState(false);

  // Bottom panel state in interview
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  // Completed session review data
  const [completionData, setCompletionData] = useState(null);
  const [personalNotes, setPersonalNotes] = useState("");
  const [selfReportedSolved, setSelfReportedSolved] = useState({});

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (sessionPhase === "active" && endTime) {
      interval = setInterval(() => {
        const remainingMs = endTime - Date.now();
        if (remainingMs <= 0) {
          setTimeLeftSec(0);
          clearInterval(interval);
          handleFinishSession(true); // timed out
        } else {
          setTimeLeftSec(Math.floor(remainingMs / 1000));
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionPhase, endTime]);

  const handleStartSession = () => {
    // Pick 1 or 2 matching problems
    let pool = questions.filter((q) => {
      if (selectedDifficulty !== "Any" && q.difficulty !== selectedDifficulty) return false;
      if (selectedTopic !== "Any" && !(q.topics || []).includes(selectedTopic)) return false;
      if (selectedCompany !== "Any" && !(q.companies || []).includes(selectedCompany)) return false;
      return true;
    });

    if (pool.length === 0) pool = questions; // fallback to any question

    // Shuffle and pick 1-2
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, Math.min(2, shuffled.length));

    const initialCode = {};
    picked.forEach((p) => {
      initialCode[p.id] = (p.starterCode && p.starterCode[selectedLanguage]) || "";
    });

    const targetEnd = Date.now() + durationMinutes * 60 * 1000;
    setAssignedProblems(picked);
    setActiveProblemIdx(0);
    setSessionCode(initialCode);
    setEndTime(targetEnd);
    setTimeLeftSec(durationMinutes * 60);
    setSelfReportedSolved({});
    setSessionPhase("active");
  };

  const handleFinishSession = (autoFinished = false) => {
    const elapsedSec = Math.max(
      1,
      durationMinutes * 60 - timeLeftSec
    );
    const solvedCount = Object.values(selfReportedSolved).filter(Boolean).length;

    const sessionSummary = {
      id: `int-${Date.now()}`,
      timestamp: new Date().toISOString(),
      durationMinutes,
      elapsedSeconds: elapsedSec,
      targetDifficulty: selectedDifficulty,
      targetCompany: selectedCompany,
      targetTopic: selectedTopic,
      problems: assignedProblems.map((p) => ({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        selfReportedSolved: Boolean(selfReportedSolved[p.id])
      })),
      solvedCount,
      totalCount: assignedProblems.length,
      autoFinished,
      notes: personalNotes
    };

    saveInterviewSession(sessionSummary);
    logActivity(
      "interview_completed",
      assignedProblems[0]?.id || "",
      `Mock Interview (${durationMinutes}m)`,
      `Solved ${solvedCount}/${assignedProblems.length} assigned problems`
    );

    // Also mark individual solved problems
    assignedProblems.forEach((p) => {
      if (selfReportedSolved[p.id]) {
        updateProblemStatus(p.id, "Solved");
      }
    });

    setCompletionData(sessionSummary);
    setSessionPhase("completed");
    setConfirmFinishOpen(false);
  };

  const handleRunCode = async () => {
    const currP = assignedProblems[activeProblemIdx];
    if (!currP) return;

    setExecuting(true);
    if (consoleCollapsed) setConsoleCollapsed(false);

    const testInput =
      (currP.testCases && currP.testCases[selectedTestCaseIdx]?.input) || "";

    const res = await executeCode({
      problemId: currP.id,
      language: selectedLanguage,
      sourceCode: sessionCode[currP.id] || "",
      testInput
    });

    setExecuting(false);
    setExecutionResult(res);
  };

  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // 1. SETUP VIEW
  if (sessionPhase === "setup") {
    return (
      <div className="page-container">
        <PageHeader
          title="Mock Interviews"
          description="Simulate realistic, timed technical coding rounds under real-world interview constraints."
        />

        <div className="mock-setup-grid">
          {/* Setup Configuration Form */}
          <div className="setup-form-card">
            <h2 style={{ fontSize: "15px", fontWeight: "600", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
              Interview Session Setup
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label className="form-label">Duration</label>
                <select
                  className="form-select"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                >
                  <option value={30}>30 Minutes (1 problem)</option>
                  <option value={45}>45 Minutes (Standard technical round)</option>
                  <option value={60}>60 Minutes (Deep dive session)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Target Difficulty</label>
                <select
                  className="form-select"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="Any">Any Difficulty</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Topic Focus (Optional)</label>
                <select
                  className="form-select"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  <option value="Any">Mixed / Comprehensive</option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Target Company (Optional)</label>
                <select
                  className="form-select"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  <option value="Any">General Tech Standards</option>
                  {TARGET_COMPANIES.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-secondary)",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
                fontSize: "12px",
                lineHeight: 1.5,
                color: "var(--text-secondary)"
              }}
            >
              <strong style={{ color: "var(--text-primary)" }}>Session Rules:</strong>
              <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
                <li>Timer ticks continuously once started.</li>
                <li>Write clean code, analyze complexity, and test edge cases.</li>
                <li>When finished, provide self-reported correctness and reflection notes.</li>
              </ul>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={Play}
              onClick={handleStartSession}
              style={{ marginTop: "8px" }}
            >
              Start Timed Interview
            </Button>
          </div>

          {/* Past History */}
          <div className="history-card">
            <h3 style={{ fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <History size={14} /> Interview History ({interviewHistory.length})
            </h3>

            {interviewHistory.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: "12px", textAlign: "center", padding: "24px 0" }}>
                No past interview sessions yet. Complete your first session to view analytics.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "380px", overflowY: "auto" }}>
                {interviewHistory.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "10px",
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <strong style={{ color: "var(--text-primary)" }}>
                        {item.targetCompany !== "Any" ? item.targetCompany : "General"} Round
                      </strong>
                      <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                        {item.solvedCount}/{item.totalCount} solved
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {formatDate(item.timestamp)} • {Math.round(item.elapsedSeconds / 60)}m elapsed
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE SESSION VIEW
  if (sessionPhase === "active") {
    const currentProblem = assignedProblems[activeProblemIdx];

    return (
      <div className="workspace-page">
        {/* Active HUD */}
        <div className="interview-hud" style={{ borderRadius: 0, borderTop: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              Mock Interview in Progress
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              {assignedProblems.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  className={`btn btn-sm ${activeProblemIdx === idx ? "btn-secondary" : "btn-ghost"}`}
                  onClick={() => setActiveProblemIdx(idx)}
                  style={{
                    borderColor: activeProblemIdx === idx ? "var(--accent)" : undefined
                  }}
                >
                  Problem {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className={`timer-display ${timeLeftSec < 300 ? "timer-low" : ""}`}>
              <Timer size={16} />
              <span>{formatTimer(timeLeftSec)}</span>
            </div>

            <Button
              variant="danger"
              size="sm"
              icon={StopCircle}
              onClick={() => setConfirmFinishOpen(true)}
            >
              Finish Interview
            </Button>
          </div>
        </div>

        {/* Workspace Split */}
        {currentProblem && (
          <div className="workspace-split-container">
            {/* Left Problem View */}
            <div className="workspace-left-pane">
              <div className="workspace-left-content">
                <div style={{ marginBottom: "12px" }}>
                  <h1 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>
                    {currentProblem.title}
                  </h1>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <DifficultyBadge difficulty={currentProblem.difficulty} />
                    {(currentProblem.topics || []).map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: "13px", lineHeight: "1.6", whiteSpace: "pre-wrap", marginBottom: "18px" }}>
                  {currentProblem.description}
                </div>

                {currentProblem.examples && (
                  <div style={{ marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                      Examples
                    </h3>
                    {currentProblem.examples.map((ex, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          padding: "10px",
                          borderRadius: "var(--radius-sm)",
                          marginBottom: "8px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "11.5px"
                        }}
                      >
                        <div><span style={{ color: "var(--text-muted)" }}>Input:</span> {ex.input}</div>
                        <div><span style={{ color: "var(--text-muted)" }}>Output:</span> <span style={{ color: "var(--accent)" }}>{ex.output}</span></div>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    marginTop: "20px",
                    padding: "12px",
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)"
                  }}
                >
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12.5px" }}>
                    <input
                      type="checkbox"
                      checked={Boolean(selfReportedSolved[currentProblem.id])}
                      onChange={(e) =>
                        setSelfReportedSolved({
                          ...selfReportedSolved,
                          [currentProblem.id]: e.target.checked
                        })
                      }
                    />
                    <span>I have verified and completed this solution</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Editor */}
            <div className="workspace-right-pane">
              <div className="workspace-editor-header">
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {selectedLanguage} editor
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Play}
                  onClick={handleRunCode}
                  loading={executing}
                >
                  Run Tests
                </Button>
              </div>

              <div className="monaco-editor-wrapper">
                <Editor
                  height="100%"
                  language={selectedLanguage}
                  value={sessionCode[currentProblem.id] || ""}
                  onChange={(val) =>
                    setSessionCode({
                      ...sessionCode,
                      [currentProblem.id]: val || ""
                    })
                  }
                  theme={preferences.theme === "light" ? "vs" : "vs-dark"}
                  options={{
                    fontSize: preferences.fontSize || 14,
                    tabSize: preferences.tabSize || 2,
                    wordWrap: preferences.wordWrap || "on",
                    minimap: { enabled: false },
                    automaticLayout: true
                  }}
                />
              </div>

              <WorkspaceBottomPanel
                testCases={currentProblem.testCases || []}
                selectedTestCaseIndex={selectedTestCaseIdx}
                onSelectTestCase={setSelectedTestCaseIdx}
                customInput=""
                onCustomInputChange={() => {}}
                executionResult={executionResult}
                collapsed={consoleCollapsed}
                onToggleCollapse={() => setConsoleCollapsed(!consoleCollapsed)}
              />
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={confirmFinishOpen}
          onClose={() => setConfirmFinishOpen(false)}
          onConfirm={() => handleFinishSession(false)}
          title="Finish Interview Session?"
          message="Are you sure you want to finish this mock interview? Your session performance will be calculated and saved."
          confirmLabel="Finish Session"
          confirmVariant="primary"
        />
      </div>
    );
  }

  // 3. COMPLETION RECAP VIEW
  if (sessionPhase === "completed" && completionData) {
    return (
      <div className="page-container">
        <div className="completion-container">
          <div style={{ textAlign: "center" }}>
            <Award size={36} style={{ color: "var(--accent)", margin: "0 auto 8px" }} />
            <h1 style={{ fontSize: "18px", fontWeight: "700" }}>
              Interview Session Completed
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {completionData.autoFinished
                ? "Time expired. Review your session breakdown below."
                : "Great effort under timed pressure. Here is your round summary."}
            </p>
          </div>

          <div className="completion-stats-grid">
            <div className="completion-stat-box">
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Duration</div>
              <div style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                {Math.round(completionData.elapsedSeconds / 60)} / {completionData.durationMinutes} min
              </div>
            </div>

            <div className="completion-stat-box">
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Solved</div>
              <div style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)", marginTop: "4px" }}>
                {completionData.solvedCount} of {completionData.totalCount}
              </div>
            </div>

            <div className="completion-stat-box">
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Completion Rate</div>
              <div style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                {Math.round((completionData.solvedCount / (completionData.totalCount || 1)) * 100)}%
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>Assigned Problems:</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {completionData.problems.map((prob) => (
                <div
                  key={prob.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 500 }}>{prob.title}</span>
                    <DifficultyBadge difficulty={prob.difficulty} />
                  </div>
                  <span style={{ fontSize: "12px", color: prob.selfReportedSolved ? "var(--accent)" : "var(--text-muted)" }}>
                    {prob.selfReportedSolved ? "Solved" : "Unfinished"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Session Reflection & Takeaways</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="What went well? Where did you lose time or miss an edge case?"
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button
              variant="primary"
              onClick={() => {
                setSessionPhase("setup");
                setCompletionData(null);
                setPersonalNotes("");
              }}
            >
              Start New Interview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
