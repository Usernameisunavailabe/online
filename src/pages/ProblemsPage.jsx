import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
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
import { RevisionModal } from "../components/revisions/RevisionModal.jsx";
import { TARGET_COMPANIES, TOPICS, DIFFICULTIES, STATUSES } from "../data/companyData.js";
import "../styles/pages/problems.css";

export function ProblemsPage() {
  const navigate = useNavigate();
  const {
    questions,
    toggleBookmark,
    updateProblemStatus,
    setActiveProblemId
  } = useApp();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Sorting: field + order
  const [sortField, setSortField] = useState("id"); // 'title' | 'difficulty' | 'acceptanceRate' | 'status' | 'id'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'

  // Revision modal target
  const [revisionModalProblem, setRevisionModalProblem] = useState(null);

  // Difficulty order mapping for sorting
  const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };

  // Filtered & Sorted list
  const filteredProblems = useMemo(() => {
    return questions.filter((q) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = q.title.toLowerCase().includes(query);
        const inTopics = (q.topics || []).some((t) => t.toLowerCase().includes(query));
        const inCompanies = (q.companies || []).some((c) => c.toLowerCase().includes(query));
        if (!inTitle && !inTopics && !inCompanies) return false;
      }

      // Difficulty
      if (selectedDifficulty !== "All" && q.difficulty !== selectedDifficulty) {
        return false;
      }

      // Topic
      if (selectedTopic !== "All" && !(q.topics || []).includes(selectedTopic)) {
        return false;
      }

      // Company
      if (selectedCompany !== "All" && !(q.companies || []).includes(selectedCompany)) {
        return false;
      }

      // Status
      if (selectedStatus !== "All" && q.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortField === "title") {
        cmp = a.title.localeCompare(b.title);
      } else if (sortField === "difficulty") {
        cmp = (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0);
      } else if (sortField === "acceptanceRate") {
        cmp = (a.acceptanceRate || 0) - (b.acceptanceRate || 0);
      } else if (sortField === "status") {
        cmp = (a.status || "").localeCompare(b.status || "");
      } else {
        cmp = 0;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [
    questions,
    searchQuery,
    selectedDifficulty,
    selectedTopic,
    selectedCompany,
    selectedStatus,
    sortField,
    sortOrder
  ]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty("All");
    setSelectedTopic("All");
    setSelectedCompany("All");
    setSelectedStatus("All");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedDifficulty !== "All" ||
    selectedTopic !== "All" ||
    selectedCompany !== "All" ||
    selectedStatus !== "All";

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
        title="Problem Directory"
        description="Comprehensive repository of core data structure and algorithm interview questions."
      />

      {/* Filters Toolbar */}
      <div className="problems-filters-card">
        <div className="filters-row-top">
          <div style={{ flex: 1, minWidth: "240px" }}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title, topic, or company tag..."
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
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

            <select
              className="filter-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <option value="All">All Topics</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="All">All Companies</option>
              {TARGET_COMPANIES.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                icon={RotateCcw}
                onClick={clearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div className="results-meta-bar">
        <span>Showing {filteredProblems.length} of {questions.length} problems</span>
        {hasActiveFilters && (
          <span style={{ color: "var(--accent)" }}>Filtered results</span>
        )}
      </div>

      {/* Desktop Table View */}
      {filteredProblems.length === 0 ? (
        <EmptyState
          title="No matching problems"
          description="None of our DSA problems match your currently applied search query or filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <>
          <div className="problems-table-container">
            <table className="problems-table">
              <thead>
                <tr>
                  <th style={{ width: "38px", textAlign: "center" }}>#</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("status")}
                    style={{ width: "110px" }}
                  >
                    Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("title")}
                  >
                    Problem Title {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("difficulty")}
                    style={{ width: "100px" }}
                  >
                    Difficulty {sortField === "difficulty" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ width: "220px" }}>Topics</th>
                  <th style={{ width: "180px" }}>Companies</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("acceptanceRate")}
                    style={{ width: "90px" }}
                  >
                    Acceptance {sortField === "acceptanceRate" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ width: "100px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((prob, idx) => (
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
                        {(prob.topics || []).length > 2 && (
                          <span className="tag" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                            +{(prob.topics || []).length - 2}
                          </span>
                        )}
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

                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", color: "var(--text-secondary)" }}>
                      {prob.acceptanceRate || 65}%
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => toggleBookmark(prob.id)}
                          title={prob.bookmarked ? "Remove Bookmark" : "Bookmark"}
                          style={{ padding: "4px", color: prob.bookmarked ? "var(--warning)" : "var(--text-muted)" }}
                        >
                          {prob.bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                        </button>

                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => setRevisionModalProblem(prob)}
                          title="Schedule Revision"
                          style={{ padding: "4px", color: "var(--text-muted)" }}
                        >
                          <CalendarPlus size={14} />
                        </button>

                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Play}
                          onClick={() => handleOpenWorkspace(prob.id)}
                          style={{ padding: "3px 8px", fontSize: "11px" }}
                        >
                          Code
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="problems-mobile-list">
            {filteredProblems.map((prob) => (
              <div key={prob.id} className="problem-mobile-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span
                    className="problem-row-title"
                    style={{ fontSize: "14px", fontWeight: "600" }}
                    onClick={() => handleOpenWorkspace(prob.id)}
                  >
                    {prob.title}
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => toggleBookmark(prob.id)}
                      style={{ padding: "4px", color: prob.bookmarked ? "var(--warning)" : "var(--text-muted)" }}
                    >
                      {prob.bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <DifficultyBadge difficulty={prob.difficulty} />
                  <StatusBadge
                    status={prob.status}
                    clickable
                    onClick={() => cycleStatus(prob)}
                  />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {prob.acceptanceRate}%
                  </span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {(prob.topics || []).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {(prob.companies || []).map((c) => (
                      <span key={c} className="tag" style={{ color: "var(--accent)" }}>{c}</span>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={Play}
                    onClick={() => handleOpenWorkspace(prob.id)}
                  >
                    Solve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Revision Modal */}
      <RevisionModal
        isOpen={Boolean(revisionModalProblem)}
        onClose={() => setRevisionModalProblem(null)}
        initialProblem={revisionModalProblem}
      />
    </div>
  );
}
