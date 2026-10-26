import React from "react";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "secondary", // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = "md", // 'sm' | 'md' | 'lg'
  icon: Icon,
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  title,
  ...rest
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size !== "md" ? `btn-${size}` : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
      {...rest}
    >
      {loading ? (
        <Loader2 size={13} className="spin-icon" style={{ animation: "spin 1s linear infinite" }} />
      ) : Icon ? (
        <Icon size={14} />
      ) : null}
      {children}
    </button>
  );
}
