// SidebarDetail.jsx
// Left sidebar (Mission Zone): fixed width, emoji chips, scrollable mission list,
// and a sticky "Start New Quest" button that triggers the right-panel editor
// via a window CustomEvent (no route change).

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "./PostList";

export default function SidebarDetail({ building }) {
  if (!building) return null;

  const navigate = useNavigate();

  const name = building?.properties?.name ?? building?.name ?? "Building";
  const buildingId =
    building?.id ??
    building?._id ??
    building?.properties?.id ??
    building?.properties?._id;

  const [filter, setFilter] = useState(null);

  // === Gamified category chips ===
  const CATS = [
    { key: "notice",    label: "📢 Announcements", emoji: "📢" },
    { key: "help",      label: "🆘 Help Requests", emoji: "🆘" },
    { key: "food",      label: "🍔 Food Drops", emoji: "🍔" },
    { key: "emergency", label: "🚨 Alerts", emoji: "🚨" },
    { key: "study",     label: "📚 Study Missions", emoji: "📚" },
    { key: "activity",  label: "🎯 Campus Events", emoji: "🎯" },
    { key: "other",     label: "➕ Side Quests", emoji: "➕" },
  ];

  // Notify SearchBar (page2) which building we're in.
  useEffect(() => {
    if (!buildingId) return;
    window.dispatchEvent(
      new CustomEvent("app:current-building", {
        detail: { buildingId, name },
      })
    );
  }, [buildingId, name]);

  // Layout constants
  const SIDEBAR_WIDTH = 400;
  const BUTTON_HEIGHT = 44;
  const BOTTOM_GAP = 12;
  const FOOTER_SPACE = BUTTON_HEIGHT + BOTTOM_GAP;

  // Trigger editor in the right column without navigation.
  const openEditor = () => {
    window.dispatchEvent(
      new CustomEvent("app:open-editor", {
        detail: { buildingId, name },
      })
    );
  };

  // Header text: zone name
  const headerText = `Your Current in: ${name} `;

  return (
    <aside
      style={{
        height: "100%",
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        maxWidth: SIDEBAR_WIDTH,
        display: "flex",
        flexDirection: "column",
        padding: 16,
        background: "#fff",
        boxSizing: "border-box",
        minHeight: 0,
        position: "relative",
      }}
    >
      {/* Header: zone name + exit button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: 0.3,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          title={headerText}
          aria-label={headerText}
        >
          {headerText}
        </h2>

        {/* Exit zone button */}
        <button
          onClick={() => navigate("/")}
          style={{
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#334155",
            borderRadius: 8,
            fontSize: 13,
            padding: "6px 10px",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
        >
          Exit
        </button>
      </div>

      {/* Category chips (quest types) */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          paddingBottom: 4,
          marginBottom: 10,
        }}
      >
        {CATS.map((c) => {
          const active = filter === c.key;
          return (
            <button
              key={c.key}
              title={c.label}
              aria-label={c.label}
              onClick={() => setFilter((cur) => (cur === c.key ? null : c.key))}
              style={{
                height: 30,
                width: 30,
                minWidth: 30,
                borderRadius: 999,
                border: `1px solid ${active ? "#94a3b8" : "#e5e7eb"}`,
                background: active ? "#f0f9ff" : "#fff",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{c.emoji}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable quest list */}
      <div style={{ flex: 1, minHeight: 0, height: "100%", overflow: "hidden" }}>
        <PostList
          buildingId={buildingId}
          autoScroll={false}
          expanded={true}
          filterType={filter}
          bottomPadding={FOOTER_SPACE}
        />
      </div>

      {/* Sticky create quest button */}
      <div style={{ position: "sticky", bottom: BOTTOM_GAP, paddingTop: 8 }}>
        <button
          className="btn-primary"
          style={{
            width: "100%",
            height: BUTTON_HEIGHT,
            lineHeight: `${BUTTON_HEIGHT}px`,
            borderRadius: 10,
            position: "static",
            fontWeight: 600,
          }}
          onClick={openEditor}
        >
          Start a new post
        </button>
      </div>
    </aside>
  );
}
