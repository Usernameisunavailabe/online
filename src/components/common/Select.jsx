import React from "react";

export function Select({
  label,
  value,
  onChange,
  options = [],
  className = "",
  disabled = false,
  id
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="form-select"
      >
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const labelText = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={val} value={val} style={{ background: "var(--bg-panel)" }}>
              {labelText}
            </option>
          );
        })}
      </select>
    </div>
  );
}
