import React from "react";

export function PageHeader({ title, description, actions, children }) {
  return (
    <div className="page-header">
      <div className="page-header-info">
        <h1 className="page-header-title">{title}</h1>
        {description && <p className="page-header-desc">{description}</p>}
        {children}
      </div>
      {actions && <div className="page-header-actions" style={{ display: "flex", gap: "8px", alignItems: "center" }}>{actions}</div>}
    </div>
  );
}
