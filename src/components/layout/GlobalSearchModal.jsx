import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, CornerDownLeft } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { DifficultyBadge } from "../common/DifficultyBadge.jsx";
import { StatusBadge } from "../common/StatusBadge.jsx";

export function GlobalSearchModal({ isOpen, onClose }) {
  const { questions, setActiveProblemId } = useApp();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? questions.filter((q) => {
        const text = `${q.title} ${q.difficulty} ${(q.topics || []).join(" ")} ${(q.companies || []).join(" ")}`.toLowerCase();
        return text.includes(query.toLowerCase());
      }).slice(0, 8)
    : questions.slice(0, 8);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (problem) => {
    setActiveProblemId(problem.id);
    navigate(`/workspace/${problem.id}`);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: "600px", padding: 0, overflow: "hidden" }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
          <Search size={16} style={{ color: "var(--text-muted)", marginRight: "10px" }} />
          <input
            ref={inputRef}
            type="text"
            className="cmd-search-input"
            placeholder="Type a problem name, topic, or company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ border: "none", padding: 0 }}
          />
          <span className="kbd" style={{ marginLeft: "8px" }}>ESC</span>
        </div>

        <div className="cmd-results-list">
          {filtered.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
              No problems match "{query}"
            </div>
          ) : (
            filtered.map((problem, idx) => (
              <div
                key={problem.id}
                className={`cmd-result-item ${idx === selectedIndex ? "selected" : ""}`}
                onClick={() => handleSelect(problem)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <StatusBadge status={problem.status} />
                  <span className="cmd-result-title">{problem.title}</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {(problem.topics || []).slice(0, 2).map((t) => (
                      <span key={t} className="tag" style={{ fontSize: "10.5px" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="cmd-result-meta">
                  <DifficultyBadge difficulty={problem.difficulty} />
                  {idx === selectedIndex ? (
                    <CornerDownLeft size={13} style={{ color: "var(--accent)" }} />
                  ) : (
                    <ArrowRight size={13} style={{ color: "var(--text-muted)" }} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            padding: "8px 14px",
            backgroundColor: "var(--bg-secondary)",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "var(--text-muted)"
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <span><kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> Navigate</span>
            <span><kbd className="kbd">↵</kbd> Open Problem</span>
          </div>
          <span>Showing {filtered.length} problems</span>
        </div>
      </div>
    </div>
  );
}
