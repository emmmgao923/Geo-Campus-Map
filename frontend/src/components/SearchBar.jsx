import React, { useEffect, useMemo, useState } from "react";

/**
 * Compact typeahead for buildings.
 * - Visual style unchanged.
 * - Accepts a placeholder prop (e.g., "Search post..." on detail pages).
 */
export default function SearchBar({ placeholder = "Search buildings..." }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // keyboard navigation

  // Load building names once from public/UmassBuildings.geojson
  useEffect(() => {
    let alive = true;
    fetch("/UmassBuildings.geojson")
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        const feats = Array.isArray(data?.features) ? data.features : [];
        const rows = feats
          .map((f, i) => {
            const props = f?.properties || {};
            const id = f?.id ?? props?.id ?? props?._id ?? `${props?.name ?? "b"}-${i}`;
            const name = props?.name ?? "Unknown building";
            return { id, name, properties: props };
          })
          .filter((x) => !!x.name);
        const seen = new Set();
        const unique = rows.filter((r) => {
          const k = r.name.toLowerCase().trim();
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        setBuildings(unique);
      })
      .catch(() => setBuildings([]));
    return () => { alive = false; };
  }, []);

  // Simple case-insensitive filtering
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return buildings.filter((b) => b.name.toLowerCase().includes(s)).slice(0, 8);
  }, [q, buildings]);

  // Emit hover event so Sidebar updates
  const selectBuilding = (row) => {
    if (!row) return;
    window.dispatchEvent(
      new CustomEvent("umass:building-hover", {
        detail: { id: row.id, name: row.name, properties: row.properties },
      })
    );
    setQ(row.name);
    setOpen(false);
  };

  // Keyboard behavior: ArrowUp/Down and Enter
  const onKeyDown = (e) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectBuilding(results[activeIndex] || results[0]);
    }
  };

  return (
    <div
      /* keep your original search bar visuals */
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: 280,
        height: 40,
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 8,
        paddingLeft: 12,
        paddingRight: 36,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <input
        type="text"
        placeholder={placeholder}          // NEW
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActiveIndex(0); }}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)} // allow click
        onKeyDown={onKeyDown}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: 14,
          background: "transparent",
        }}
      />

      {/* magnifying glass icon (black/gray) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#555"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          right: 10,
          width: 18,
          height: 18,
          pointerEvents: "none",
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      {/* results dropdown uses existing .search-panel / .search-item styles */}
      {open && results.length > 0 && (
        <div className="search-panel">
          {results.map((row, idx) => (
            <button
              key={`${row.id}-${idx}`}
              className="search-item"
              onMouseDown={(e) => e.preventDefault()} // keep focus
              onClick={() => selectBuilding(row)}
              style={{
                background: idx === activeIndex ? "#f8fafc" : "#fff",
                borderColor: idx === activeIndex ? "#e5e7eb" : "transparent",
              }}
              title={row.name}
            >
              {row.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
