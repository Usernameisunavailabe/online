import React, { useState } from "react";
import {
  Palette,
  Sliders,
  Sparkles,
  Database,
  Download,
  Upload,
  Trash2,
  Check,
  AlertTriangle,
  Key,
  ShieldAlert
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { Button } from "../components/common/Button.jsx";
import { ConfirmDialog } from "../components/common/ConfirmDialog.jsx";
import {
  AI_PROVIDERS,
  getAiConfig,
  saveAiConfig,
  clearAiConfig
} from "../services/aiService.js";
import { TARGET_COMPANIES, DIFFICULTIES } from "../data/companyData.js";
import "../styles/pages/settings.css";

export function SettingsPage() {
  const {
    preferences,
    updatePreferences,
    dailyGoal,
    setDailyGoalTarget,
    exportData,
    importData,
    resetAllData
  } = useApp();

  // AI configuration state
  const [aiConfig, setAiConfig] = useState(getAiConfig());
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [aiFeedback, setAiFeedback] = useState(null);

  // Import / Export state
  const [importStatus, setImportStatus] = useState(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSaveAiKey = () => {
    if (!apiKeyInput.trim()) return;
    const updated = {
      ...aiConfig,
      apiKey: apiKeyInput.trim()
    };
    saveAiConfig(updated);
    setAiConfig(updated);
    setApiKeyInput("");
    setAiFeedback({ success: true, message: "API key securely stored in browser local storage." });
    setTimeout(() => setAiFeedback(null), 3000);
  };

  const handleRemoveAiKey = () => {
    clearAiConfig();
    const updated = getAiConfig();
    setAiConfig(updated);
    setAiFeedback({ success: true, message: "API key removed." });
    setTimeout(() => setAiFeedback(null), 3000);
  };

  const handleExportJson = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `practise-workspace-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const res = importData(content);
      if (res.success) {
        setImportStatus({ success: true, message: "Application data successfully restored." });
      } else {
        setImportStatus({ success: false, message: `Import error: ${res.error}` });
      }
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleToggleCompany = (companyName) => {
    const current = preferences.preferredCompanies || [];
    const updated = current.includes(companyName)
      ? current.filter((c) => c !== companyName)
      : [...current, companyName];
    updatePreferences({ preferredCompanies: updated });
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Settings"
        description="Configure editor ergonomics, practice objectives, local data persistence, and AI providers."
      />

      <div className="settings-container">
        {/* Appearance & Editor */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Palette size={15} style={{ color: "var(--accent)" }} />
            <span className="settings-section-title">Appearance & Editor Ergonomics</span>
          </div>
          <div className="settings-section-body">
            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">Theme</span>
                <span className="settings-label-desc">Primary workspace surface coloring</span>
              </div>
              <div className="settings-row-control">
                <select
                  className="form-select"
                  value={preferences.theme || "dark"}
                  onChange={(e) => updatePreferences({ theme: e.target.value })}
                >
                  <option value="dark">Graphite Dark (Default)</option>
                  <option value="light">Editorial Light</option>
                </select>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">Editor Font Size</span>
                <span className="settings-label-desc">Monaco code rendering scale</span>
              </div>
              <div className="settings-row-control">
                <select
                  className="form-select"
                  value={preferences.fontSize || 14}
                  onChange={(e) => updatePreferences({ fontSize: Number(e.target.value) })}
                >
                  <option value={12}>12 px</option>
                  <option value={13}>13 px</option>
                  <option value={14}>14 px (Standard)</option>
                  <option value={15}>15 px</option>
                  <option value={16}>16 px</option>
                  <option value={18}>18 px</option>
                </select>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">Tab Size</span>
                <span className="settings-label-desc">Indentation space count</span>
              </div>
              <div className="settings-row-control">
                <select
                  className="form-select"
                  value={preferences.tabSize || 2}
                  onChange={(e) => updatePreferences({ tabSize: Number(e.target.value) })}
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">Word Wrap</span>
                <span className="settings-label-desc">Wrap long code statements</span>
              </div>
              <div className="settings-row-control">
                <select
                  className="form-select"
                  value={preferences.wordWrap || "on"}
                  onChange={(e) => updatePreferences({ wordWrap: e.target.value })}
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Preferences */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Sliders size={15} style={{ color: "var(--accent)" }} />
            <span className="settings-section-title">Practice Goals & Targeting</span>
          </div>
          <div className="settings-section-body">
            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">Daily Problem Target</span>
                <span className="settings-label-desc">Number of problems to solve each day</span>
              </div>
              <div className="settings-row-control">
                <select
                  className="form-select"
                  value={dailyGoal.target}
                  onChange={(e) => setDailyGoalTarget(e.target.value)}
                >
                  <option value={1}>1 problem / day</option>
                  <option value={2}>2 problems / day</option>
                  <option value={3}>3 problems / day</option>
                  <option value={5}>5 problems / day</option>
                </select>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">Default Language</span>
                <span className="settings-label-desc">Initial language loaded in workspace</span>
              </div>
              <div className="settings-row-control">
                <select
                  className="form-select"
                  value={preferences.preferredLanguage || "javascript"}
                  onChange={(e) => updatePreferences({ preferredLanguage: e.target.value })}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python 3</option>
                  <option value="cpp">C++ (GCC)</option>
                  <option value="java">Java (OpenJDK)</option>
                </select>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">Targeted Companies</span>
                <span className="settings-label-desc">Prioritize company readiness tracking</span>
              </div>
              <div className="settings-row-control" style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {TARGET_COMPANIES.map((comp) => {
                  const isSelected = (preferences.preferredCompanies || []).includes(comp.name);
                  return (
                    <button
                      key={comp.id}
                      type="button"
                      className={`btn btn-sm ${isSelected ? "btn-secondary" : "btn-outline"}`}
                      onClick={() => handleToggleCompany(comp.name)}
                      style={{
                        borderColor: isSelected ? "var(--accent)" : undefined,
                        color: isSelected ? "var(--accent)" : undefined
                      }}
                    >
                      {isSelected ? "✓ " : ""}{comp.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* AI Provider Settings */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Sparkles size={15} style={{ color: "var(--accent)" }} />
            <span className="settings-section-title">AI Assistant Integration</span>
          </div>
          <div className="settings-section-body">
            <div
              style={{
                padding: "10px 14px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                fontSize: "12px",
                color: "var(--text-secondary)",
                lineHeight: 1.5
              }}
            >
              <ShieldAlert size={16} style={{ color: "var(--warning)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ color: "var(--text-primary)" }}>Client Privacy & Storage:</strong> API keys are kept in your browser's unencrypted local storage. Practise never transmits keys to an unconfigured backend. Use restricted, pay-as-you-go developer keys.
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">AI Provider</span>
                <span className="settings-label-desc">Underlying inference model</span>
              </div>
              <div className="settings-row-control">
                <select
                  className="form-select"
                  value={aiConfig.provider}
                  onChange={(e) => {
                    const updated = { ...aiConfig, provider: e.target.value };
                    saveAiConfig(updated);
                    setAiConfig(updated);
                  }}
                >
                  <option value={AI_PROVIDERS.GEMINI}>Google Gemini (gemini-1.5-flash)</option>
                  <option value={AI_PROVIDERS.OPENAI}>OpenAI (gpt-4o-mini)</option>
                </select>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">API Key</span>
                <span className="settings-label-desc">
                  {aiConfig.apiKey ? "Key configured (masked)" : "No key saved"}
                </span>
              </div>
              <div className="settings-row-control">
                <input
                  type="password"
                  className="form-input"
                  placeholder={aiConfig.apiKey ? "••••••••••••••••••••••••" : "Paste your API key here..."}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveAiKey}
                    disabled={!apiKeyInput.trim()}
                  >
                    Save Key
                  </Button>
                  {aiConfig.apiKey && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveAiKey}
                    >
                      Remove Key
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {aiFeedback && (
              <div style={{ fontSize: "12px", color: "var(--accent)" }}>
                {aiFeedback.message}
              </div>
            )}
          </div>
        </div>

        {/* Local Data Management */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Database size={15} style={{ color: "var(--accent)" }} />
            <span className="settings-section-title">Data Backup & Migration</span>
          </div>
          <div className="settings-section-body">
            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">Export Backup</span>
                <span className="settings-label-desc">Download solved status, drafts, notes, and revision data as JSON</span>
              </div>
              <div className="settings-row-control">
                <Button
                  variant="secondary"
                  icon={Download}
                  onClick={handleExportJson}
                >
                  Export JSON Backup
                </Button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-label-title">Restore Backup</span>
                <span className="settings-label-desc">Import and validate a previously exported JSON backup</span>
              </div>
              <div className="settings-row-control">
                <label className="btn btn-secondary" style={{ cursor: "pointer", display: "inline-flex" }}>
                  <Upload size={14} style={{ marginRight: "6px" }} />
                  <span>Choose File to Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            {importStatus && (
              <div
                style={{
                  fontSize: "12px",
                  color: importStatus.success ? "var(--accent)" : "var(--danger)",
                  padding: "6px 0"
                }}
              >
                {importStatus.message}
              </div>
            )}

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "16px", marginTop: "8px" }}>
              <div className="settings-row">
                <div className="settings-row-label">
                  <span className="settings-label-title" style={{ color: "var(--danger)" }}>
                    Reset Application State
                  </span>
                  <span className="settings-label-desc">
                    Erase all local progress, saved drafts, notes, revisions, and return to default state
                  </span>
                </div>
                <div className="settings-row-control">
                  <Button
                    variant="danger"
                    icon={Trash2}
                    onClick={() => setResetConfirmOpen(true)}
                  >
                    Reset Workspace
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={() => {
          resetAllData();
          setResetConfirmOpen(false);
        }}
        title="Reset All Application Data?"
        message="This will completely clear your local storage, erasing your saved problem statuses, code drafts, personal notes, and revision schedules. This action cannot be reversed."
        confirmLabel="Reset Everything"
        confirmVariant="danger"
      />
    </div>
  );
}
