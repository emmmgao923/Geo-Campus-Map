// SidebarDetail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "./PostList";
import buildingNames from "../data/buildings.json";

function getBuildingName(buildingId) {
  if (!buildingId) return "Building";
  return buildingNames[buildingId] || "Building";
}

const API_BASE = "http://localhost:8000/api/events"; 

export default function SidebarDetail({ buildingId, selectedEventId }) {
  const navigate = useNavigate();

  if (!buildingId) return null;

  const name = getBuildingName(buildingId);
  const [filter, setFilter] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/${buildingId}`);
        if (!res.ok) {
          console.error("Failed to fetch events", res.status);
          if (!cancelled) setEvents([]);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Error fetching events for building", buildingId, e);
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, [buildingId]);

  // 通知其他组件当前 building（你原逻辑）
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("app:current-building", {
        detail: { buildingId, name },
      })
    );
  }, [buildingId, name]);

  const CATS = [
    { key: "notice", label: "📢 Announcements", emoji: "📢" },
    { key: "help", label: "🆘 Help Requests", emoji: "🆘" },
    { key: "food", label: "🍔 Food Drops", emoji: "🍔" },
    { key: "emergency", label: "🚨 Alerts", emoji: "🚨" },
    { key: "study", label: "📚 Study Missions", emoji: "📚" },
    { key: "activity", label: "🎯 Campus Events", emoji: "🎯" },
    { key: "other", label: "➕ Side Quests", emoji: "➕" },
  ];

  const SIDEBAR_WIDTH = 400;
  const BUTTON_HEIGHT = 44;
  const BOTTOM_GAP = 12;
  const FOOTER_SPACE = BUTTON_HEIGHT + BOTTOM_GAP;

  const openEditor = () => {
    window.dispatchEvent(
      new CustomEvent("app:open-editor", {
        detail: { buildingId, name },
      })
    );
  };

  const headerText = `Current loc: ${name}`;

  return (
    <aside
      style={{
        height: "100vh",
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        maxWidth: SIDEBAR_WIDTH,
        display: "flex",
        flexDirection: "column",
        padding: 16,
        background: "#fff",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
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
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={headerText}
        >
          {headerText}
        </h2>

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
          }}
        >
          Exit
        </button>
      </div>

      {/* Category chips */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          marginBottom: 10,
        }}
      >
        {CATS.map((c) => {
          const active = filter === c.key;
          return (
            <button
              key={c.key}
              onClick={() =>
                setFilter((cur) => (cur === c.key ? null : c.key))
              }
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
              }}
            >
              <span style={{ fontSize: 16 }}>{c.emoji}</span>
            </button>
          );
        })}
      </div>

      {/* 列表区域 */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {loading ? (
          <div style={{ padding: 8, color: "#6b7280" }}>Loading...</div>
        ) : (
          <PostList
            buildingId={buildingId}
            events={events}
            expanded={true}
            filterType={filter}
            bottomPadding={FOOTER_SPACE}
            highlightEventId={selectedEventId} // 用 URL eventId 高亮当前帖子
          />
        )}
      </div>

      {/* Sticky 创建按钮 */}
      <div style={{ position: "sticky", bottom: BOTTOM_GAP, paddingTop: 8 }}>
        <button
          className="btn-primary"
          style={{
            width: "100%",
            height: BUTTON_HEIGHT,
            borderRadius: 10,
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

