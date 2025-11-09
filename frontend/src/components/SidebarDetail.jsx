import React, { useState, useEffect, useRef } from "react";
import PostList from "./PostList";
import { motion, AnimatePresence } from "framer-motion";


/**
 * SidebarDetail (for PostDetailPage)
 * - Building title
 * - One-line emoji chips (no "Filter" caption)
 * - Scrollable post list (expanded cards)
 * - Sticky bottom "Create a Post" that never covers the list
 */
export default function SidebarDetail({ eventList = [], buildingName = "Building", buildingId = null }) {
  const [filter, setFilter] = useState(null);
  const events = eventList;

  // const [filter, setFilter] = useState(null);

  const CATS = [
    { key: "notice",    label: "Notice",    emoji: "📢" },
    { key: "help",      label: "Help",      emoji: "🆘" },
    { key: "event",     label: "Event",     emoji: "📅" },
    { key: "food",      label: "Food",      emoji: "🍔" },
    { key: "emergency", label: "Emergency", emoji: "🚨" },
    { key: "study",     label: "Study",     emoji: "📚" },
    { key: "activity",  label: "Activity",  emoji: "🎯" },
    { key: "other",     label: "Others",    emoji: "➕" },
  ];

  // Height reserved for the sticky footer
  const FOOTER_SPACE = 88;

  return (
    <aside
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 16,
        background: "#fff",
        boxSizing: "border-box",
        minHeight: 0, // allow children to create scroll
      }}
    >
      {/* Title */}
      <h2
        style={{
          margin: "8px 0 6px",
          fontSize: 18,
          fontWeight: 700,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        title={buildingName}
      >
        {buildingName}
      </h2>

      {/* One-line emoji row */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          paddingBottom: 4,
          marginBottom: 8,
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

      {/* Scrollable list area wrapper */}
      <div style={{ flex: 1, minHeight: 0, height: "100%", overflow: "hidden" }}>
        <PostList
          buildingId={buildingId}
          events={events}
          autoScroll={false}
          expanded={true}
          filterType={filter}
          bottomPadding={FOOTER_SPACE}
        />
      </div>

      {/* Sticky footer button (never covers the list) */}
      <div style={{ position: "sticky", bottom: 8, paddingTop: 8 }}>
        <button
          className="btn-primary"
          onClick={() => alert("Open post editor (right side)")}
          style={{ width: "100%", position: "static" }}
        >
          Create a Post
        </button>
      </div>
    </aside>
  );
}
