import React from "react";
import { Modal } from "./Modal.jsx";
import { Button } from "./Button.jsx";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Confirm",
  confirmVariant = "danger",
  loading = false
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="440px"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ color: "var(--warning)", flexShrink: 0, marginTop: "2px" }}>
          <AlertTriangle size={20} />
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {message}
        </p>
      </div>
    </Modal>
  );
}
