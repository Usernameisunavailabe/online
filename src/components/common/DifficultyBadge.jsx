import React from "react";

export function DifficultyBadge({ difficulty = "Medium" }) {
  const norm = (difficulty || "Medium").toLowerCase();

  return (
    <span className={`badge badge-${norm}`}>
      {difficulty}
    </span>
  );
}
