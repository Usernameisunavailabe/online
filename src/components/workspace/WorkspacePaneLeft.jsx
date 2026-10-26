import React, { useState } from "react";
import { BookOpen, FileText, CheckCircle2, Bookmark, BookmarkCheck, CalendarPlus } from "lucide-react";
import { DifficultyBadge } from "../common/DifficultyBadge.jsx";
import { StatusBadge } from "../common/StatusBadge.jsx";
import { Button } from "../common/Button.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function WorkspacePaneLeft({
  problem,
  onScheduleRevision
}) {
  const [activeTab, setActiveTab] = useState("description"); // 'description' | 'editorial' | 'notes'
  const { notes, saveNote, toggleBookmark, updateProblemStatus } = useApp();

  const currentNote = notes[problem.id] || "";

  const cycleStatus = () => {
    const sequence = ["Todo", "In Progress", "Solved"];
    const nextIdx = (sequence.indexOf(problem.status) + 1) % sequence.length;
    updateProblemStatus(problem.id, sequence[nextIdx]);
  };

  return (
    <div className="workspace-left-pane">
      <div className="workspace-pane-tabs">
        <button
          type="button"
          className={`workspace-pane-tab ${activeTab === "description" ? "active" : ""}`}
          onClick={() => setActiveTab("description")}
        >
          <BookOpen size={13} />
          Description
        </button>
        <button
          type="button"
          className={`workspace-pane-tab ${activeTab === "editorial" ? "active" : ""}`}
          onClick={() => setActiveTab("editorial")}
        >
          <CheckCircle2 size={13} />
          Editorial
        </button>
        <button
          type="button"
          className={`workspace-pane-tab ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          <FileText size={13} />
          Personal Notes {currentNote ? "•" : ""}
        </button>
      </div>

      <div className="workspace-left-content">
        {activeTab === "description" && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "12px" }}>
              <div>
                <h1 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "6px" }}>
                  {problem.title}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <DifficultyBadge difficulty={problem.difficulty} />
                  <StatusBadge status={problem.status} clickable onClick={cycleStatus} />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    Acceptance: {problem.acceptanceRate || 65}%
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "4px" }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(problem.id)}
                  title={problem.bookmarked ? "Remove Bookmark" : "Bookmark Problem"}
                  style={{ color: problem.bookmarked ? "var(--warning)" : "var(--text-muted)" }}
                >
                  {problem.bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onScheduleRevision}
                  title="Schedule Revision"
                  style={{ color: "var(--text-muted)" }}
                >
                  <CalendarPlus size={16} />
                </Button>
              </div>
            </div>

            {/* Topics & Companies */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
              {(problem.topics || []).map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
              {(problem.companies || []).map((c) => (
                <span key={c} className="tag" style={{ color: "var(--accent)" }}>
                  {c}
                </span>
              ))}
            </div>

            {/* Problem Description */}
            <div style={{ fontSize: "13.5px", lineHeight: "1.65", color: "var(--text-primary)", whiteSpace: "pre-wrap", marginBottom: "20px" }}>
              {problem.description}
            </div>

            {/* Examples */}
            {problem.examples && problem.examples.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.03em", color: "var(--text-secondary)" }}>
                  Examples
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {problem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        padding: "12px"
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "6px" }}>
                        Example {idx + 1}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Input: </span>
                        <span>{ex.input}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", marginBottom: ex.explanation ? "4px" : "0" }}>
                        <span style={{ color: "var(--text-muted)" }}>Output: </span>
                        <span style={{ color: "var(--accent)" }}>{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
                          <span style={{ color: "var(--text-muted)" }}>Explanation: </span>
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div>
                <h3 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.03em", color: "var(--text-secondary)" }}>
                  Constraints
                </h3>
                <ul style={{ paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {problem.constraints.map((c, i) => (
                    <li key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-secondary)" }}>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "editorial" && (
          <div className="editorial-section">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600" }}>
                Editorial: {problem.title}
              </h2>
            </div>

            {problem.editorial ? (
              <>
                <div className="editorial-block">
                  <div className="editorial-block-title">Intuition & Mental Model</div>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                    {problem.editorial.intuition}
                  </p>
                </div>

                <div className="editorial-block">
                  <div className="editorial-block-title">Brute Force Approach</div>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                    {problem.editorial.bruteForce || "Exhaustive search of all permutations or combinations."}
                  </p>
                </div>

                <div className="editorial-block">
                  <div className="editorial-block-title">Optimal Approach</div>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                    {problem.editorial.optimalApproach}
                  </p>

                  <div className="complexity-grid">
                    <div className="complexity-card">
                      <div className="complexity-label">Time Complexity</div>
                      <div className="complexity-value">{problem.editorial.timeComplexity}</div>
                    </div>
                    <div className="complexity-card">
                      <div className="complexity-label">Space Complexity</div>
                      <div className="complexity-value">{problem.editorial.spaceComplexity}</div>
                    </div>
                  </div>
                </div>

                {problem.editorial.edgeCases && (
                  <div className="editorial-block">
                    <div className="editorial-block-title">Critical Edge Cases</div>
                    <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                      {problem.editorial.edgeCases}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                No editorial written for this problem yet.
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div>
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600" }}>Personal Problem Notes</h3>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Auto-saved to local workspace
              </span>
            </div>
            <textarea
              className="form-textarea"
              rows={16}
              placeholder="Record your takeaways, edge cases you missed, or alternate approaches..."
              value={currentNote}
              onChange={(e) => saveNote(problem.id, e.target.value)}
              style={{ fontFamily: "var(--font-mono)", fontSize: "12.5px", lineHeight: "1.6" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
