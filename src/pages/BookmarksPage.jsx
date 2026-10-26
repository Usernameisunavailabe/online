import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  Search,
  Trash2,
  Play,
  RotateCcw
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { DifficultyBadge } from "../components/common/DifficultyBadge.jsx";
import { StatusBadge } from "../components/common/StatusBadge.jsx";
import { SearchInput } from "../components/common/SearchInput.jsx";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { DIFFICULTIES } from "../data/companyData.js";
import "../styles/pages/problems.css";

export function BookmarksPage() {
  const navigate = useNavigate();
  const {
    questions,
    toggleBookmark,
    updateProblemStatus,
    setActiveProblemId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const bookmarkedProblems = questions.filter((q) => q.bookmarked);

  const filteredBookmarks = bookmarkedProblems.filter((q) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const inTitle = q.title.toLowerCase().includes(query);
      const inTopics = (q.topics || []).some((t) => t.toLowerCase().includes(query));
      if (!inTitle && !inTopics) return false;
    }
    if (selectedDifficulty !== "All" && q.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const handleOpenWorkspace = (id) => {
    setActiveProblemId(id);
    navigate(`/workspace/${id}`);
  };

  const cycleStatus = (problem) => {
    const sequence = ["Todo", "In Progress", "Solved"];
    const nextIdx = (sequence.indexOf(problem.status) + 1) % sequence.length;
    updateProblemStatus(problem.id, sequence[nextIdx]);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Bookmarks"
        description="Quick access to problems you have flagged for focused review or later attempts."
        actions={
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {bookmarkedProblems.length} bookmarked
          </span>
        }
      />

      {bookmarkedProblems.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarked problems"
          description="Bookmark questions in the problem directory or workspace using the bookmark icon to collect them here."
          actionLabel="Browse Problems"
          onAction={() => navigate("/problems")}
        />
      ) : (
        <>
          <div className="problems-filters-card">
            <div className="filters-row-top">
              <div style={{ flex: 1, minWidth: "240px" }}>
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search bookmarked problems..."
                />
              </div>

              <select
                className="filter-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="All">All Difficulties</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              {(searchQuery || selectedDifficulty !== "All") && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={RotateCcw}
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDifficulty("All");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {filteredBookmarks.length === 0 ? (
            <EmptyState
              title="No bookmarks match your filter"
              description="Try adjusting your search query or difficulty selector."
              actionLabel="Reset Search"
              onAction={() => {
                setSearchQuery("");
                setSelectedDifficulty("All");
              }}
            />
          ) : (
            <div className="problems-table-container">
              <table className="problems-table">
                <thead>
                  <tr>
                    <th style={{ width: "38px", textAlign: "center" }}>#</th>
                    <th style={{ width: "110px" }}>Status</th>
                    <th>Problem</th>
                    <th style={{ width: "100px" }}>Difficulty</th>
                    <th style={{ width: "240px" }}>Topics</th>
                    <th style={{ width: "160px" }}>Companies</th>
                    <th style={{ width: "110px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookmarks.map((prob, idx) => (
                    <tr key={prob.id}>
                      <td style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "11px", fontFamily: "var(--font-mono)" }}>
                        {idx + 1}
                      </td>

                      <td>
                        <StatusBadge
                          status={prob.status}
                          clickable
                          onClick={() => cycleStatus(prob)}
                        />
                      </td>

                      <td>
                        <span
                          className="problem-row-title"
                          onClick={() => handleOpenWorkspace(prob.id)}
                        >
                          {prob.title}
                        </span>
                      </td>

                      <td>
                        <DifficultyBadge difficulty={prob.difficulty} />
                      </td>

                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {(prob.topics || []).slice(0, 2).map((t) => (
                            <span key={t} className="tag" style={{ fontSize: "10.5px" }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {(prob.companies || []).slice(0, 2).map((c) => (
                            <span key={c} className="tag" style={{ color: "var(--accent)", fontSize: "10.5px" }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
                          <button
                            type="button"
                            className="btn-ghost"
                            onClick={() => toggleBookmark(prob.id)}
                            title="Remove Bookmark"
                            style={{ padding: "4px", color: "var(--warning)" }}
                          >
                            <BookmarkCheck size={14} />
                          </button>

                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Play}
                            onClick={() => handleOpenWorkspace(prob.id)}
                            style={{ padding: "3px 8px", fontSize: "11px" }}
                          >
                            Solve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
