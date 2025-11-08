import { useEffect, useRef, useState, useMemo } from "react";
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

// Demo data now includes summary/author/created_at
function demoEvents(buildingId) {
  const bid = String(buildingId || "unknown");
  const now = Date.now();
  return [
    { _id: "demo1", building_id: bid, title: "Looking for study group", type: "study", likes_count: 3, summary: "CS 187 group forming this weekend.", author: "Alice", created_at: now - 3600e3 },
    { _id: "demo2", building_id: bid, title: "Free pizza", type: "food", likes_count: 12, summary: "Grab a slice at 5pm in lobby.", author: "Bob", created_at: now - 2*3600e3 },
    { _id: "demo3", building_id: bid, title: "Lost water bottle", type: "help", likes_count: 0, summary: "Blue Nalgene with stickers.", author: "Cathy", created_at: now - 3*3600e3 },
    { _id: "demo4", building_id: bid, title: "Math tutoring drop-in", type: "study", likes_count: 5, summary: "Calc 2 help Tue/Thu evening.", author: "Dan", created_at: now - 4*3600e3 },
    { _id: "demo5", building_id: bid, title: "Club fair booth setup", type: "activity", likes_count: 2, summary: "Volunteers needed tomorrow.", author: "Erin", created_at: now - 5*3600e3 },
    { _id: "demo6", building_id: bid, title: "Found AirPods case", type: "notice", likes_count: 1, summary: "Describe stickers to claim.", author: "Frank", created_at: now - 6*3600e3 },
    { _id: "demo7", building_id: bid, title: "Snack stash restocked", type: "food", likes_count: 7, summary: "Free granola bars at desk.", author: "Gina", created_at: now - 7*3600e3 },
    { _id: "demo8", building_id: bid, title: "Coding challenge night", type: "activity", likes_count: 9, summary: "Bring your laptop. Prizes.", author: "Harry", created_at: now - 8*3600e3 },
    { _id: "demo9", building_id: bid, title: "Quiet zone reminder", type: "notice", likes_count: 4, summary: "Please keep voices low.", author: "Ivy", created_at: now - 9*3600e3 },
  ];
}

export default function PostList({
  buildingId,
  autoScroll = true,
  expanded = false,     // switch to expanded card layout
  filterType = null,    // filter by type key 
  bottomPadding = 0,
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch events or fallback demo
  useEffect(() => {
    if (!buildingId) {
      setEvents([]);
      return;
    }
    let aborted = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/events?building_id=${encodeURIComponent(buildingId)}`);
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        if (!aborted) setEvents(Array.isArray(data) ? data : []);
      } catch {
        if (!aborted) setEvents(demoEvents(buildingId));
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => { aborted = true; };
  }, [buildingId]);

  // Auto scroll until bottom then stop
  useEffect(() => {
    if (!autoScroll) return;
    const el = wrapRef.current;
    if (!el) return;

    function start() {
      stop();
      timerRef.current = setInterval(() => {
        if (!el) return;
        const atBottom = el.scrollTop + el.clientHeight + 2 >= el.scrollHeight;
        if (atBottom) {
          stop();
        } else {
          el.scrollTop = el.scrollTop + 1;
        }
      }, 18);
    }
    function stop() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    start();
    el.addEventListener("mouseenter", stop);
    el.addEventListener("mouseleave", () => { if (!timerRef.current) start(); });
    return () => {
      stop();
      el.removeEventListener("mouseenter", stop);
      el.removeEventListener("mouseleave", start);
    };
  }, [events, autoScroll, buildingId]);

  // Apply filter (client-side)
  const filtered = useMemo(() => {
    if (!filterType) return events;
    return events.filter((e) => String(e.type).toLowerCase() === String(filterType).toLowerCase());
  }, [events, filterType]);

  // Render
  return (
    <div 
    ref={wrapRef} 
    style={{ flex: 1,
    overflowY: "auto", 
    paddingTop: 8,
    paddingBottom: bottomPadding,
    }}
    >
      {loading && <div style={{ padding: 8, color: "#6b7280" }}>Loading events…</div>}
      {!loading && filtered.length === 0 && (
        <div style={{ padding: 8, color: "#6b7280" }}>No events.</div>
      )}

      {filtered.map((ev) => {
        const key = ev._id || ev.id;
        const type = String(ev.type || "other").toLowerCase();
        const likes = ev.likes_count != null ? ev.likes_count : 0;
        const summary = ev.summary ?? "";
        const author = ev.author ?? "Anon";
        const created = ev.created_at ? new Date(ev.created_at) : null;

        const goDetail = () => navigate(`/post/${encodeURIComponent(key)}`);

        return (
          <div
            key={key}
            role="button"
            tabIndex={0}
            onClick={goDetail}
            onKeyDown={(e) => { if (e.key === "Enter") goDetail(); }}
            style={{
              border: "1px solid #eef2f7",
              borderRadius: 14,
              padding: 12,
              marginBottom: 12,
              background: "#fff",
              cursor: "pointer",
              boxShadow: "0 1px 0 rgba(2,6,23,0.04)",
            }}
            title={ev.title}
          >
            {/* First line: [badge] Title .......... ❤️ likes */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 12,
                  padding: "6px 10px",
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
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: 0.2,
                  flex: "1 1 auto",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "#0f172a",
                }}
              >
                {ev.title}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                  color: "#ef4444",
                  flex: "0 0 auto",
                }}
                title={`${likes} likes`}
              >
                <span>❤️</span>
                <span style={{ color: "#6b7280", fontWeight: 700 }}>{likes}</span>
              </div>
            </div>

            {/* Second line: summary (only when expanded) */}
            {expanded && summary && (
              <div
                style={{
                  marginTop: 6,
                  color: "#334155",
                  fontSize: 14,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={summary}
              >
                {summary}
              </div>
            )}

            {/* Bottom meta: author · time (only when expanded) */}
            {expanded && (
              <div
                style={{
                  marginTop: 6,
                  color: "#64748b",
                  fontSize: 12,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <span>by {author}</span>
                {created && <span>· {created.toLocaleString()}</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
