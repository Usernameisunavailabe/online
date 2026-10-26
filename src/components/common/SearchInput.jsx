import React from "react";
import { Search, X } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search problems, topics, companies...",
  shortcutHint,
  onFocus,
  autoFocus = false,
  className = ""
}) {
  return (
    <div className={`search-wrapper ${className}`}>
      <Search size={14} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        autoFocus={autoFocus}
      />
      {value ? (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X size={13} />
        </button>
      ) : shortcutHint ? (
        <span
          className="kbd"
          style={{ position: "absolute", right: "7px", fontSize: "10px", pointerEvents: "none" }}
        >
          {shortcutHint}
        </span>
      ) : null}
    </div>
  );
}
