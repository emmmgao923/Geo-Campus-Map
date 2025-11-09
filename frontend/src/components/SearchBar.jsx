import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * SearchBar
 * Visual style unchanged.
 * - On /post/* (page 2): typeahead for POSTS of the current building (title/summary/author).
 *   Select => navigate to /post/:id
 * - On other pages: original building typeahead (select => umass:building-hover)
 */
export default function SearchBar({ placeholder }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isPostDetail = pathname.startsWith("/post");

  // shared UI states
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // --------- Buildings data (page1) ---------
  const [buildings, setBuildings] = useState([]);
  useEffect(() => {
    if (isPostDetail) return; // not needed on page2
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
  }, [isPostDetail]);

  // --------- Posts data (page2) ---------
  const [buildingId, setBuildingId] = useState(null);
  const [posts, setPosts] = useState([]);

  // Receive current building id from SidebarDetail (page2)
  useEffect(() => {
    if (!isPostDetail) return;
    const onCurrent = (e) => {
      const bid = e?.detail?.buildingId ?? e?.detail?.id;
      if (bid) setBuildingId(String(bid));
    };
    window.addEventListener("app:current-building", onCurrent);
    return () => window.removeEventListener("app:current-building", onCurrent);
  }, [isPostDetail]);

  // Fetch posts for that building
  useEffect(() => {
    if (!isPostDetail || !buildingId) return;
    let alive = true;

    async function load() {
      try {
        const r = await fetch(`/api/events?building_id=${encodeURIComponent(buildingId)}`);
        if (!r.ok) throw new Error("bad status");
        const data = await r.json();
        if (alive) setPosts(Array.isArray(data) ? data : []);
      } catch {
        // fallback demo data (same shape as your PostList)
        const now = Date.now();
        const demo = [
          { _id: "demo1", title: "Looking for study group", type: "study", summary: "CS 187 group forming this weekend.", author: "Alice", created_at: now - 3600e3 },
          { _id: "demo2", title: "Free pizza", type: "food", summary: "Grab a slice at 5pm in lobby.", author: "Bob", created_at: now - 2 * 3600e3 },
          { _id: "demo3", title: "Lost water bottle", type: "help", summary: "Blue Nalgene with stickers.", author: "Cathy", created_at: now - 3 * 3600e3 },
          { _id: "demo4", title: "Coding challenge night", type: "activity", summary: "Bring your laptop. Prizes.", author: "Harry", created_at: now - 8 * 3600e3 },
        ];
        if (alive) setPosts(demo);
      }
    }
    load();
    return () => { alive = false; };
  }, [isPostDetail, buildingId]);

  // --------- Filtering (mode-aware) ---------
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    if (isPostDetail) {
      return posts
        .filter((p) => {
          const t = (p.title || "").toLowerCase();
          const m = (p.summary || "").toLowerCase();
          const a = (p.author || "").toLowerCase();
          return t.includes(s) || m.includes(s) || a.includes(s);
        })
        .slice(0, 8)
        .map((p) => ({
          id: p._id || p.id,
          label: p.title || "(untitled)",
        }));
    }
    // building mode
    return buildings
      .filter((b) => b.name.toLowerCase().includes(s))
      .slice(0, 8)
      .map((b) => ({ id: b.id, label: b.name, raw: b }));
  }, [q, isPostDetail, posts, buildings]);

  // --------- Selection (mode-aware) ---------
  const selectItem = (idx) => {
    const row = results[idx] || results[0];
    if (!row) return;

    if (isPostDetail) {
      // open the post
      if (row.id) navigate(`/post/${encodeURIComponent(row.id)}`);
      setQ(row.label);
      setOpen(false);
    } else {
      // keep original: emit building hover
      const raw = buildings.find((b) => String(b.id) === String(row.id));
      if (raw) {
        window.dispatchEvent(
          new CustomEvent("umass:building-hover", {
            detail: { id: raw.id, name: raw.name, properties: raw.properties },
          })
        );
        setQ(raw.name);
      }
      setOpen(false);
    }
  };

  // keyboard behavior
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
      selectItem(activeIndex);
    }
  };

  return (
    <div
      /* visuals unchanged */
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
        placeholder={placeholder || (isPostDetail ? "Search posts..." : "Search buildings...")}
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActiveIndex(0); }}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: 14,
          background: "transparent",
        }}
      />

      {/* magnifying icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#555"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: "absolute", right: 10, width: 18, height: 18, pointerEvents: "none" }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      {/* dropdown (reuses your .search-panel / .search-item styles) */}
      {open && results.length > 0 && (
        <div className="search-panel">
          {results.map((row, idx) => (
            <button
              key={`${row.id}-${idx}`}
              className="search-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectItem(idx)}
              style={{
                background: idx === activeIndex ? "#f8fafc" : "#fff",
                borderColor: idx === activeIndex ? "#e5e7eb" : "transparent",
              }}
              title={row.label}
            >
              {row.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
