import React from "react";
import { Inbox } from "lucide-react";
import { Button } from "./Button.jsx";

export function EmptyState({
  icon: Icon = Inbox,
  title = "No items found",
  description = "Try adjusting your search or filters to find what you are looking for.",
  actionLabel,
  onAction
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
