import React, { useState } from "react";
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

  // Fixed category chips
  const CATS = [
    { key: "notice",    label: "Notice",    emoji: "📢" },
    { key: "help",      label: "Help",      emoji: "🆘" },
    { key: "food",      label: "Food",      emoji: "🍔" },
    { key: "emergency", label: "Emergency", emoji: "🚨" },
    { key: "study",     label: "Study",     emoji: "📚" },
    { key: "activity",  label: "Activity",  emoji: "🎯" },
    { key: "other",     label: "Others",    emoji: "➕" },
  ];

  // Layout constants
  const SIDEBAR_WIDTH = 400;
  const BUTTON_HEIGHT = 44;
  const BOTTOM_GAP = 12;
  const FOOTER_SPACE = BUTTON_HEIGHT + BOTTOM_GAP;

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
      {/* Header: title + Leave button */}
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
            fontSize: 22,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: 0.3,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          title={name}
        >
          {name}
        </h2>

        {/* Leave the building button */}
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
          Leave building
        </button>
      </div>

      {/* Category chips */}
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
                background: active ? "#f8fafc" : "#fff",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{c.emoji}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, minHeight: 0, height: "100%", overflow: "hidden" }}>
        <PostList
          buildingId={buildingId}
          autoScroll={false}
          expanded={true}
          filterType={filter}
          bottomPadding={FOOTER_SPACE}
        />
      </div>

      {/* Sticky create button */}
      <div style={{ position: "sticky", bottom: BOTTOM_GAP, paddingTop: 8 }}>
        <button
          className="btn-primary"
          style={{
            width: "100%",
            height: BUTTON_HEIGHT,
            lineHeight: `${BUTTON_HEIGHT}px`,
            borderRadius: 10,
            position: "static",
          }}
          onClick={() => alert("Open post editor (right side)")}
        >
          Create a Post
        </button>
      </div>
    </aside>
  );
}
