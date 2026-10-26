import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, FolderGit2, BookOpen } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { WorkspacePaneLeft } from "../components/workspace/WorkspacePaneLeft.jsx";
import { WorkspacePaneRight } from "../components/workspace/WorkspacePaneRight.jsx";
import { AIAssistantPanel } from "../components/ai/AIAssistantPanel.jsx";
import { GitHubPublishModal } from "../components/workspace/GitHubPublishModal.jsx";
import { RevisionModal } from "../components/revisions/RevisionModal.jsx";
import { Button } from "../components/common/Button.jsx";
import "../styles/pages/workspace.css";

export function WorkspacePage() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const {
    questions,
    activeProblemId,
    setActiveProblemId,
    getDraft
  } = useApp();

  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [gitHubModalOpen, setGitHubModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);

  // Determine current problem
  const targetId = problemId || activeProblemId || "two-sum";
  const currentProblem = questions.find((q) => q.id === targetId) || questions[0];

  useEffect(() => {
    if (currentProblem && currentProblem.id !== activeProblemId) {
      setActiveProblemId(currentProblem.id);
    }
  }, [currentProblem, activeProblemId, setActiveProblemId]);

  const currentIndex = questions.findIndex((q) => q.id === currentProblem?.id);
  const prevProblem = currentIndex > 0 ? questions[currentIndex - 1] : null;
  const nextProblem =
    currentIndex >= 0 && currentIndex < questions.length - 1
      ? questions[currentIndex + 1]
      : null;

  const handleSelectProblem = (id) => {
    setActiveProblemId(id);
    navigate(`/workspace/${id}`);
  };

  if (!currentProblem) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        Problem not found.
      </div>
    );
  }

  return (
    <div className="workspace-page">
      {/* Top Workspace Toolbar */}
      <div className="workspace-toolbar">
        <div className="workspace-toolbar-left">
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <Button
              variant="ghost"
              size="sm"
              disabled={!prevProblem}
              onClick={() => prevProblem && handleSelectProblem(prevProblem.id)}
              title={prevProblem ? `Previous: ${prevProblem.title}` : undefined}
              style={{ padding: "4px" }}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!nextProblem}
              onClick={() => nextProblem && handleSelectProblem(nextProblem.id)}
              title={nextProblem ? `Next: ${nextProblem.title}` : undefined}
              style={{ padding: "4px" }}
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          <select
            value={currentProblem.id}
            onChange={(e) => handleSelectProblem(e.target.value)}
            className="form-select"
            style={{
              padding: "4px 8px",
              fontSize: "12.5px",
              fontWeight: 500,
              maxWidth: "260px"
            }}
          >
            {questions.map((q, idx) => (
              <option key={q.id} value={q.id}>
                {idx + 1}. {q.title} ({q.difficulty})
              </option>
            ))}
          </select>
        </div>

        <div className="workspace-toolbar-right">
          <Button
            variant={aiAssistantOpen ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
            title="Toggle AI Assistant"
            style={{ color: aiAssistantOpen ? "var(--accent)" : undefined }}
          >
            <Sparkles size={14} />
            Assistant
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="workspace-split-container">
        <WorkspacePaneLeft
          problem={currentProblem}
          onScheduleRevision={() => setRevisionModalOpen(true)}
        />

        <WorkspacePaneRight
          problem={currentProblem}
          onOpenAiAssistant={() => setAiAssistantOpen(true)}
          onOpenGitHubModal={() => setGitHubModalOpen(true)}
        />

        {aiAssistantOpen && (
          <AIAssistantPanel
            isOpen={aiAssistantOpen}
            onClose={() => setAiAssistantOpen(false)}
            problem={currentProblem}
            language="javascript"
            currentCode={getDraft(currentProblem.id, "javascript")}
          />
        )}
      </div>

      {/* GitHub Integration Modal */}
      <GitHubPublishModal
        isOpen={gitHubModalOpen}
        onClose={() => setGitHubModalOpen(false)}
        problem={currentProblem}
        language="javascript"
        sourceCode={getDraft(currentProblem.id, "javascript")}
      />

      {/* Revision Modal */}
      <RevisionModal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        initialProblem={currentProblem}
      />
    </div>
  );
}
