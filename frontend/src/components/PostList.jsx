// PostList.jsx
// Unchanged except for code style comments. Fixed-height cards for consistent frames.

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const TYPE_LABEL = {
  help: "Help",
  notice: "Notice",
  study: "Study",
  activity: "Activity",
  food: "Food",
  emergency: "Emergency",
  other: "Other",
};

const TYPE_BG = {
  help: "#eef2ff",
  notice: "#fef9c3",
  study: "#dcfce7",
  activity: "#e0f2fe",
  food: "#ffe4e6",
  emergency: "#fee2e2",
  other: "#f3f4f6",
};

const TYPE_FG = {
  help: "#3730a3",
  notice: "#854d0e",
  study: "#065f46",
  activity: "#075985",
  food: "#9f1239",
  emergency: "#991b1b",
  other: "#111827",
};

// ---- Time formatting helpers ----
function formatAbsolute(ts) {
  return new Date(ts || Date.now()).toLocaleString();
}
function formatRelativeOrAbsolute(ts) {
  const now = Date.now();
  const t = typeof ts === "number" ? ts : (ts ? new Date(ts).getTime() : now);
  const diffMs = Math.max(0, now - t);
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr  = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day >= 7) return formatAbsolute(t);
  if (day >= 1) return `${day} day${day > 1 ? "s" : ""} ago`;
  if (hr  >= 1) return `${hr} hour${hr > 1 ? "s" : ""} ago`;
  if (min >= 1) return `${min} minute${min > 1 ? "s" : ""} ago`;
  return `${sec} second${sec !== 1 ? "s" : ""} ago`;
}

// --- Demo data (fallback) ---
function demoEvents(buildingId) {
  const bid = String(buildingId || "unknown");
  const now = Date.now();
  return [
    { _id: "demo1", building_id: bid, title: "Looking for study group", type: "study", likes_count: 3, summary: "CS 187 group forming this weekend.", author: "Alice", created_at: now - 3600e3 },
    { _id: "demo2", building_id: bid, title: "Free pizza", type: "food", likes_count: 12, summary: "Grab a slice at 5pm in lobby.", author: "Bob", created_at: now - 2 * 3600e3 },
    { _id: "demo3", building_id: bid, title: "Lost water bottle", type: "help", likes_count: 0, summary: "Blue Nalgene with stickers.", author: "Cathy", created_at: now - 3 * 3600e3 },
    { _id: "demo4", building_id: bid, title: "Math tutoring drop-in", type: "study", likes_count: 5, summary: "Calc 2 help Tue/Thu evening.", author: "Dan", created_at: now - 4 * 3600e3 },
    { _id: "demo5", building_id: bid, title: "Club fair booth setup", type: "activity", likes_count: 2, summary: "Volunteers needed tomorrow.", author: "Erin", created_at: now - 5 * 3600e3 },
    { _id: "demo6", building_id: bid, title: "Found AirPods case", type: "notice", likes_count: 1, summary: "Describe stickers to claim.", author: "Frank", created_at: now - 6 * 3600e3 },
    { _id: "demo7", building_id: bid, title: "Snack stash restocked", type: "food", likes_count: 7, summary: "Free granola bars at desk.", author: "Gina", created_at: now - 7 * 3600e3 },
    { _id: "demo8", building_id: bid, title: "Coding challenge night", type: "activity", likes_count: 9, summary: "Bring your laptop. Prizes.", author: "Harry", created_at: now - 8 * 3600e3 },
    { _id: "demo9", building_id: bid, title: "Quiet zone reminder", type: "notice", likes_count: 4, summary: "Please keep voices low.", author: "Ivy", created_at: now - 9 * 3600e3 },
  ];
}

export default function PostList({
  buildingId,
  autoScroll = false,
  expanded = true,
  filterType = null,
  bottomPadding = 0,
  cardHeight,
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  // --- Row metrics: exactly 3 rows (title, summary, meta) ---
  const PAD = 12;
  const GAP = 6;
  const ROW_TITLE = 24;
  const ROW_SUMMARY = 20;
  const ROW_META = 18;
  const GRID_HEIGHT =
    ROW_TITLE + (expanded ? ROW_SUMMARY + ROW_META + 2 * GAP : 0);
  const CARD_FIXED = PAD * 2 + GRID_HEIGHT;
  const CARD_HEIGHT = typeof cardHeight === "number" ? cardHeight : CARD_FIXED;

  useEffect(() => {
    if (!buildingId) {
      setEvents([]);
      return;
    }
    let aborted = false;
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(
          `/api/events?building_id=${encodeURIComponent(buildingId)}`
        );
        if (!r.ok) throw new Error("bad status");
        const data = await r.json();
        if (!aborted) setEvents(Array.isArray(data) ? data : []);
      } catch {
        if (!aborted) setEvents(demoEvents(buildingId));
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [buildingId]);

  const filtered = useMemo(() => {
    if (!filterType) return events;
    return events.filter(
      (e) =>
        String(e.type).toLowerCase() === String(filterType).toLowerCase()
    );
  }, [events, filterType]);

  return (
    <div
      ref={wrapRef}
      style={{
        flex: 1,
        height: "100%",
        overflowY: "auto",
        overscrollBehavior: "contain",
        paddingTop: 8,
        paddingBottom: bottomPadding,
      }}
    >
      {loading && <div style={{ padding: 8, color: "#6b7280" }}>Loading…</div>}
      {!loading && filtered.length === 0 && (
        <div style={{ padding: 8, color: "#6b7280" }}>
            No posts here yet, be the first to share!
        </div>
      )}

      {filtered.map((ev) => {
        const key = ev._id || ev.id;
        const type = String(ev.type || "other").toLowerCase();
        const likes = ev.likes_count ?? 0;
        const summary = ev.summary ?? "";
        the_author: ;
        const author = ev.author ?? "Anon";
        const created = ev.created_at ? new Date(ev.created_at) : null;

        const goDetail = () => navigate(`/post/${encodeURIComponent(key)}`);

        return (
          <div
            key={key}
            onClick={goDetail}
            style={{
              // Fixed outer frame
              position: "relative",
              height: CARD_HEIGHT,
              minHeight: CARD_HEIGHT,
              maxHeight: CARD_HEIGHT,
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              background: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              marginBottom: 12,
              padding: PAD,
              overflow: "hidden",
              cursor: "pointer",
              contain: "layout paint",
            }}
          >
            {/* likes at top-right */}
            <div
              style={{
                position: "absolute",
                top: PAD,
                right: PAD,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
              aria-label="likes"
            >
              <span style={{ color: "#ef4444" }}>❤️</span>
              <span style={{ fontWeight: 700, color: "#6b7280" }}>{likes}</span>
            </div>

            {/* inner grid: 3 fixed rows */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: expanded
                  ? `${ROW_TITLE}px ${ROW_SUMMARY}px ${ROW_META}px`
                  : `${ROW_TITLE}px`,
                rowGap: expanded ? `${GAP}px` : "0px",
                height: GRID_HEIGHT,
              }}
            >
              {/* Row 1: badge + title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minHeight: ROW_TITLE,
                  paddingRight: 36,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    padding: "5px 10px",
                    borderRadius: 999,
                    background: TYPE_BG[type] || TYPE_BG.other,
                    color: TYPE_FG[type] || TYPE_FG.other,
                    whiteSpace: "nowrap",
                    flex: "0 0 auto",
                  }}
                >
                  {TYPE_LABEL[type] || TYPE_LABEL.other}
                </span>

                <div
                  style={{
                    flex: 1,
                    fontWeight: 800,
                    fontSize: 16,
                    color: "#0f172a",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: `${ROW_TITLE}px`,
                  }}
                >
                  {ev.title}
                </div>
              </div>

              {/* Row 2: summary */}
              {expanded && (
                <div
                  style={{
                    fontSize: 14,
                    color: "#334155",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minHeight: ROW_SUMMARY,
                    lineHeight: `${ROW_SUMMARY}px`,
                  }}
                >
                  {summary || " "}
                </div>
              )}

              {/* Row 3: meta */}
              {expanded && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minHeight: ROW_META,
                    lineHeight: `${ROW_META}px`,
                  }}
                >
                  <span>by {author}</span>
                  {created && (
                    <span title={formatAbsolute(created.getTime())}>
                      · {formatRelativeOrAbsolute(created.getTime())}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
