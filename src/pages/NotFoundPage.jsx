import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "../components/common/Button.jsx";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: "40px"
      }}
    >
      <AlertCircle size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
      <h1 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
        Page Not Found
      </h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: "400px", marginBottom: "20px", fontSize: "13px" }}>
        The requested URL does not match any route in the Practise workspace.
      </p>
      <Button
        variant="primary"
        icon={ArrowLeft}
        onClick={() => navigate("/dashboard")}
      >
        Return to Dashboard
      </Button>
    </div>
  );
}
