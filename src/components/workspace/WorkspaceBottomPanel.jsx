import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Terminal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Clock,
  Cpu
} from "lucide-react";

export function WorkspaceBottomPanel({
  testCases = [],
  selectedTestCaseIndex,
  onSelectTestCase,
  customInput,
  onCustomInputChange,
  executionResult,
  collapsed,
  onToggleCollapse
}) {
  const [activeTab, setActiveTab] = useState("testcases"); // 'testcases' | 'results' | 'stdout'

  const currentTestCase = testCases[selectedTestCaseIndex] || testCases[0];

  return (
    <div
      className="workspace-bottom-panel"
      style={{ height: collapsed ? "36px" : "220px" }}
    >
      <div className="console-header" onClick={onToggleCollapse}>
        <div className="console-tabs" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`console-tab-btn ${activeTab === "testcases" ? "active" : ""}`}
            onClick={() => {
              if (collapsed) onToggleCollapse();
              setActiveTab("testcases");
            }}
          >
            Test Cases ({testCases.length})
          </button>
          <button
            type="button"
            className={`console-tab-btn ${activeTab === "results" ? "active" : ""}`}
            onClick={() => {
              if (collapsed) onToggleCollapse();
              setActiveTab("results");
            }}
          >
            Execution Result {executionResult ? "•" : ""}
          </button>
          <button
            type="button"
            className={`console-tab-btn ${activeTab === "stdout" ? "active" : ""}`}
            onClick={() => {
              if (collapsed) onToggleCollapse();
              setActiveTab("stdout");
            }}
          >
            Output & Logs
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {executionResult && !collapsed && (
            <span
              style={{
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: executionResult.success ? "var(--accent)" : "var(--warning)"
              }}
            >
              {executionResult.success ? (
                <CheckCircle size={12} />
              ) : (
                <AlertCircle size={12} />
              )}
              {executionResult.success
                ? "Backend Executed"
                : executionResult.error?.status || "Service Unavailable"}
            </span>
          )}

          <button
            type="button"
            className="btn-ghost"
            style={{ padding: "4px", color: "var(--text-muted)" }}
            aria-label={collapsed ? "Expand console" : "Collapse console"}
          >
            {collapsed ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="console-body">
          {activeTab === "testcases" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "10px" }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {testCases.map((tc, idx) => (
                  <button
                    key={tc.id || idx}
                    type="button"
                    className={`btn btn-sm ${
                      selectedTestCaseIndex === idx ? "btn-secondary" : "btn-ghost"
                    }`}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      borderColor: selectedTestCaseIndex === idx ? "var(--accent)" : undefined
                    }}
                    onClick={() => onSelectTestCase(idx)}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {currentTestCase && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", flex: 1 }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                      Input:
                    </div>
                    <div
                      style={{
                        padding: "8px",
                        backgroundColor: "var(--bg-panel)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "11.5px",
                        whiteSpace: "pre-wrap"
                      }}
                    >
                      {currentTestCase.input}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                      Expected Output:
                    </div>
                    <div
                      style={{
                        padding: "8px",
                        backgroundColor: "var(--bg-panel)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "11.5px",
                        color: "var(--accent)",
                        whiteSpace: "pre-wrap"
                      }}
                    >
                      {currentTestCase.expected}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <details style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                  <summary style={{ cursor: "pointer", userSelect: "none" }}>
                    Custom Test Input
                  </summary>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Enter custom parameter values (one per line)..."
                    value={customInput}
                    onChange={(e) => onCustomInputChange(e.target.value)}
                    style={{ marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "11.5px" }}
                  />
                </details>
              </div>
            </div>
          )}

          {activeTab === "results" && (
            <div>
              {!executionResult ? (
                <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                  Run your code to inspect execution status and test results.
                </div>
              ) : executionResult.success ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                      Status: {executionResult.data.status}
                    </span>
                    {executionResult.data.executionTimeMs && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)" }}>
                        <Clock size={12} /> {executionResult.data.executionTimeMs} ms
                      </span>
                    )}
                    {executionResult.data.memoryUsageKb && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)" }}>
                        <Cpu size={12} /> {Math.round(executionResult.data.memoryUsageKb / 1024)} MB
                      </span>
                    )}
                  </div>
                  <pre style={{ whiteSpace: "pre-wrap", color: "var(--text-primary)" }}>
                    {executionResult.data.stdout || "No standard output."}
                  </pre>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: "var(--bg-panel)",
                    border: "1px solid rgba(216, 180, 119, 0.3)",
                    borderRadius: "var(--radius-sm)",
                    padding: "12px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--warning)", fontWeight: 600, marginBottom: "6px" }}>
                    <Info size={14} />
                    {executionResult.error.message}
                  </div>
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      fontSize: "11.5px",
                      color: "var(--text-secondary)",
                      lineHeight: "1.5"
                    }}
                  >
                    {executionResult.error.detail}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === "stdout" && (
            <div>
              <pre
                style={{
                  color: executionResult?.data?.stderr ? "var(--danger)" : "var(--text-secondary)",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.5"
                }}
              >
                {executionResult?.data?.stdout || executionResult?.data?.stderr || "No terminal logs generated for this session."}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
