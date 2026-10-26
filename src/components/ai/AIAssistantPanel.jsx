import React, { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  Key,
  HelpCircle,
  Bug,
  ListPlus,
  FileQuestion,
  ChevronRight,
  AlertTriangle,
  Check
} from "lucide-react";
import { Button } from "../common/Button.jsx";
import {
  AI_PROVIDERS,
  getAiConfig,
  saveAiConfig,
  queryAiAssistant
} from "../../services/aiService.js";

export function AIAssistantPanel({
  isOpen,
  onClose,
  problem,
  language,
  currentCode
}) {
  const [activeTab, setActiveTab] = useState("review"); // 'review' | 'hints' | 'tests' | 'explain'
  const [hintLevel, setHintLevel] = useState(1);
  const [aiConfig, setAiConfig] = useState(getAiConfig());
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    setAiConfig(getAiConfig());
  }, [isOpen]);

  const handleSaveKey = () => {
    const updated = {
      ...aiConfig,
      apiKey: tempApiKey.trim()
    };
    saveAiConfig(updated);
    setAiConfig(updated);
    setShowKeyConfig(false);
    setTempApiKey("");
  };

  const handleTrigger = async (mode = activeTab, specificHintLevel = hintLevel) => {
    setLoading(true);
    setErrorInfo(null);
    setResultText("");

    const response = await queryAiAssistant({
      mode: mode === "hints" ? "hints" : mode === "tests" ? "generate_tests" : mode,
      problem,
      language,
      code: currentCode,
      hintLevel: specificHintLevel
    });

    setLoading(false);
    if (response.success) {
      setResultText(response.text);
    } else {
      setErrorInfo(response.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-assistant-pane">
      <div className="ai-assistant-header">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} style={{ color: "var(--accent)" }} />
          <span style={{ fontSize: "12.5px", fontWeight: "600" }}>Assistant</span>
          <span className="tag" style={{ fontSize: "10px", padding: "1px 5px" }}>
            {aiConfig.provider}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            title="Configure AI API Key"
            style={{ padding: "4px", color: aiConfig.apiKey ? "var(--text-muted)" : "var(--warning)" }}
          >
            <Key size={14} />
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={onClose}
            style={{ padding: "4px", color: "var(--text-muted)" }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Mode navigation */}
      <div className="workspace-pane-tabs" style={{ fontSize: "11px" }}>
        <button
          type="button"
          className={`workspace-pane-tab ${activeTab === "review" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("review");
            setResultText("");
            setErrorInfo(null);
          }}
          style={{ padding: "6px 10px", fontSize: "11.5px" }}
        >
          <Bug size={12} /> Review
        </button>
        <button
          type="button"
          className={`workspace-pane-tab ${activeTab === "hints" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("hints");
            setResultText("");
            setErrorInfo(null);
          }}
          style={{ padding: "6px 10px", fontSize: "11.5px" }}
        >
          <HelpCircle size={12} /> Hints
        </button>
        <button
          type="button"
          className={`workspace-pane-tab ${activeTab === "tests" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("tests");
            setResultText("");
            setErrorInfo(null);
          }}
          style={{ padding: "6px 10px", fontSize: "11.5px" }}
        >
          <ListPlus size={12} /> Tests
        </button>
        <button
          type="button"
          className={`workspace-pane-tab ${activeTab === "explain" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("explain");
            setResultText("");
            setErrorInfo(null);
          }}
          style={{ padding: "6px 10px", fontSize: "11.5px" }}
        >
          <FileQuestion size={12} /> Explain
        </button>
      </div>

      <div className="ai-assistant-content">
        {/* Quick API Key Setup accordion */}
        {(showKeyConfig || !aiConfig.apiKey) && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                API Key Configuration
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Browser Storage</span>
            </div>

            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", lineHeight: 1.4 }}>
              Enter your own Gemini or OpenAI API key. Stored in client localStorage only.
            </p>

            <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
              <select
                className="form-select"
                value={aiConfig.provider}
                onChange={(e) => {
                  const updated = { ...aiConfig, provider: e.target.value };
                  saveAiConfig(updated);
                  setAiConfig(updated);
                }}
                style={{ fontSize: "11px", padding: "4px 6px" }}
              >
                <option value={AI_PROVIDERS.GEMINI}>Google Gemini</option>
                <option value={AI_PROVIDERS.OPENAI}>OpenAI (ChatGPT)</option>
              </select>
            </div>

            <input
              type="password"
              className="form-input"
              placeholder={aiConfig.apiKey ? "••••••••••••••••" : "Paste API key..."}
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              style={{ fontSize: "11.5px", padding: "4px 8px", marginBottom: "8px" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveKey}
                disabled={!tempApiKey.trim()}
              >
                Save Key
              </Button>
            </div>
          </div>
        )}

        {/* Tab specific action controls */}
        {activeTab === "hints" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Progressive hints avoid spoiling full solutions:
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`btn btn-sm ${hintLevel === lvl ? "btn-secondary" : "btn-outline"}`}
                  style={{
                    flex: 1,
                    fontSize: "11px",
                    borderColor: hintLevel === lvl ? "var(--accent)" : undefined
                  }}
                  onClick={() => {
                    setHintLevel(lvl);
                    handleTrigger("hints", lvl);
                  }}
                >
                  Hint {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab !== "hints" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleTrigger(activeTab)}
            loading={loading}
          >
            {activeTab === "review" && "Analyze Code Quality & Bugs"}
            {activeTab === "tests" && "Generate Edge Cases"}
            {activeTab === "explain" && "Explain Solution Logic"}
          </Button>
        )}

        {/* Results / Feedback area */}
        {loading && (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>
            Querying {aiConfig.provider}...
          </div>
        )}

        {errorInfo && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "var(--bg-panel)",
              border: "1px solid rgba(215, 131, 131, 0.3)",
              borderRadius: "var(--radius-sm)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--danger)", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
              <AlertTriangle size={13} />
              {errorInfo.message}
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
              {errorInfo.guidance}
            </div>
          </div>
        )}

        {resultText && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "var(--bg-panel)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              color: "var(--text-primary)"
            }}
          >
            {resultText}
          </div>
        )}
      </div>
    </div>
  );
}
