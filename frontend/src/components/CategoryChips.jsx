import React from "react";

/**
 * One-line emoji chips with circle outline and hover tooltip.
 * The row will NEVER wrap; it scrolls horizontally if needed.
 */
export default function CategoryChips({ categories = [], onPick }) {
  return (
    <div className="chips-row" title="Categories">
      {categories.map((c) => (
        <button
          key={c.key}
          className="chip"
          aria-label={c.label}
          title={c.label}
          onClick={() => onPick?.(c)}
        >
          <span className="chip-emoji" aria-hidden>{c.emoji}</span>
        </button>
      ))}
    </div>
  );
}
