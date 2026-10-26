import React from "react";

export function StatusBadge({ status = "Todo", onClick, clickable = false }) {
  const norm = (status || "Todo").toLowerCase().replace(/\s+/g, "");

  return (
    <span
      className={`badge status-${norm} ${clickable ? "cursor-pointer" : ""}`}
      onClick={clickable ? onClick : undefined}
      title={clickable ? `Click to cycle status (Current: ${status})` : status}
      style={clickable ? { cursor: "pointer" } : undefined}
    >
      <span className="status-dot" />
      {status}
    </span>
  );
}
