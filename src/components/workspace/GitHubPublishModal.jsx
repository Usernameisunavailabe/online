import React, { useState } from "react";
import { Modal } from "../common/Modal.jsx";
import { Button } from "../common/Button.jsx";
import {
  generateDefaultFilePath,
  generateDefaultCommitMessage,
  publishSolutionToGitHub
} from "../../services/githubService.js";
import { GitBranch, FolderGit2, AlertCircle, FileCode } from "lucide-react";

export function GitHubPublishModal({
  isOpen,
  onClose,
  problem,
  language,
  sourceCode
}) {
  const [repoName, setRepoName] = useState("dsa-practice");
  const [branch, setBranch] = useState("main");
  const [filePath, setFilePath] = useState(() =>
    generateDefaultFilePath(problem, language)
  );
  const [commitMessage, setCommitMessage] = useState(() =>
    generateDefaultCommitMessage(problem, language)
  );
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  const handlePublish = async () => {
    setLoading(true);
    setResultMessage(null);

    const res = await publishSolutionToGitHub({
      repoName,
      branch,
      filePath,
      commitMessage,
      fileContent: sourceCode,
      problemMetadata: {
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        topics: problem.topics
      }
    });

    setLoading(false);
    setResultMessage(res);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish Solution to GitHub"
      maxWidth="620px"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handlePublish}
            loading={loading}
          >
            Publish Solution
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Backend contract notice banner */}
        <div
          style={{
            padding: "10px 12px",
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            gap: "10px",
            alignItems: "flex-start"
          }}
        >
          <FolderGit2 size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
            <strong style={{ color: "var(--text-primary)" }}>Architecture Notice:</strong> GitHub publishing is dispatched via the backend service boundary (<code className="font-mono">POST /api/github/publish</code>) to prevent exposing client OAuth secrets in the browser.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
          <div>
            <label className="form-label">Repository</label>
            <input
              type="text"
              className="form-input"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="e.g. username/dsa-solutions"
            />
          </div>

          <div>
            <label className="form-label">Branch</label>
            <input
              type="text"
              className="form-input"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="form-label">Target File Path</label>
          <input
            type="text"
            className="form-input"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
          />
          <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
            Hierarchical format: <code className="font-mono">[Topic]/[Problem-Slug]/solution.[ext]</code>
          </span>
        </div>

        <div>
          <label className="form-label">Commit Message</label>
          <input
            type="text"
            className="form-input"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
          />
        </div>

        <div>
          <div className="form-label">Payload Preview</div>
          <div
            style={{
              padding: "10px",
              backgroundColor: "var(--bg-sidebar)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              maxHeight: "120px",
              overflowY: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-secondary)"
            }}
          >
            {sourceCode.slice(0, 300)}...
          </div>
        </div>

        {resultMessage && !resultMessage.success && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "var(--bg-panel)",
              border: "1px solid rgba(216, 180, 119, 0.3)",
              borderRadius: "var(--radius-sm)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--warning)", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
              <AlertCircle size={14} />
              {resultMessage.error.message}
            </div>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              {resultMessage.error.detail}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
}
