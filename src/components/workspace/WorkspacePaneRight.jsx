import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  FolderGit2
} from "lucide-react";
import { Button } from "../common/Button.jsx";
import { WorkspaceBottomPanel } from "./WorkspaceBottomPanel.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { executeCode } from "../../services/executionService.js";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python 3" },
  { value: "cpp", label: "C++ (GCC)" },
  { value: "java", label: "Java (OpenJDK)" }
];

export function WorkspacePaneRight({
  problem,
  onOpenAiAssistant,
  onOpenGitHubModal
}) {
  const {
    preferences,
    getDraft,
    saveDraft,
    resetDraft
  } = useApp();

  const [language, setLanguage] = useState(
    preferences.preferredLanguage || "javascript"
  );
  const [code, setCode] = useState(() => getDraft(problem.id, language));
  const [isCopied, setIsCopied] = useState(false);
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [draftStatus, setDraftStatus] = useState("Saved");

  // Keep code synced when problem or language changes
  useEffect(() => {
    const existing = getDraft(problem.id, language);
    setCode(existing);
    setDraftStatus("Saved");
    setExecutionResult(null);
  }, [problem.id, language, getDraft]);

  // Handle editor code changes
  const handleEditorChange = (newVal) => {
    const value = newVal || "";
    setCode(value);
    setDraftStatus("Unsaved");

    // Debounced draft save to Context & LocalStorage
    saveDraft(problem.id, language, value);
    setDraftStatus("Saved");
  };

  const handleLanguageChange = (newLang) => {
    // Preserve current draft before switching
    saveDraft(problem.id, language, code);
    setLanguage(newLang);
  };

  const handleResetCode = () => {
    const starter = resetDraft(problem.id, language);
    setCode(starter);
    setDraftStatus("Saved");
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1800);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleRunCode = async () => {
    setExecuting(true);
    if (consoleCollapsed) setConsoleCollapsed(false);

    const activeInput =
      customInput.trim() ||
      (problem.testCases && problem.testCases[selectedTestCaseIndex]?.input) ||
      "";

    const res = await executeCode({
      problemId: problem.id,
      language,
      sourceCode: code,
      testInput: activeInput
    });

    setExecuting(false);
    setExecutionResult(res);
  };

  return (
    <div className="workspace-right-pane">
      {/* Editor Sub-Header Toolbar */}
      <div className="workspace-editor-header">
        <div className="workspace-editor-tabs">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="lang-select-input"
            aria-label="Select programming language"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="editor-status-pill">
            <span
              className={`editor-status-dot ${
                draftStatus === "Unsaved" ? "unsaved" : ""
              }`}
            />
            <span>{draftStatus}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            title="Copy Code to Clipboard"
            style={{ padding: "4px 8px" }}
          >
            {isCopied ? <Check size={13} style={{ color: "var(--accent)" }} /> : <Copy size={13} />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetCode}
            title="Reset to Starter Code"
            style={{ padding: "4px 8px" }}
          >
            <RotateCcw size={13} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAiAssistant}
            title="Open AI Assistant Panel"
          >
            <Sparkles size={13} style={{ color: "var(--accent)" }} />
            AI Help
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenGitHubModal}
            title="Publish to GitHub"
          >
            <FolderGit2 size={13} />
            GitHub
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Play}
            onClick={handleRunCode}
            loading={executing}
          >
            Run
          </Button>
        </div>
      </div>

      {/* Monaco Editor Wrapper */}
      <div className="monaco-editor-wrapper">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={handleEditorChange}
          theme={preferences.theme === "light" ? "vs" : "vs-dark"}
          options={{
            fontSize: preferences.fontSize || 14,
            tabSize: preferences.tabSize || 2,
            wordWrap: preferences.wordWrap || "on",
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: "var(--font-mono)",
            fontLigatures: true,
            renderLineHighlight: "all",
            padding: { top: 12, bottom: 12 }
          }}
          loading={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: "13px" }}>
              Initializing Monaco Editor...
            </div>
          }
        />
      </div>

      {/* Bottom Console Panel */}
      <WorkspaceBottomPanel
        testCases={problem.testCases || []}
        selectedTestCaseIndex={selectedTestCaseIndex}
        onSelectTestCase={(idx) => setSelectedTestCaseIndex(idx)}
        customInput={customInput}
        onCustomInputChange={setCustomInput}
        executionResult={executionResult}
        collapsed={consoleCollapsed}
        onToggleCollapse={() => setConsoleCollapsed(!consoleCollapsed)}
      />
    </div>
  );
}
