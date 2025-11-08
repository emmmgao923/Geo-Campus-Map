import { useEffect, useRef, useState } from "react";

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

// === Demo data ===
function demoEvents(buildingId) {
  const bid = String(buildingId || "unknown");
  return [
    { _id: "demo1", building_id: bid, title: "Looking for study group", type: "study", likes_count: 3 },
    { _id: "demo2", building_id: bid, title: "Free pizza", type: "food", likes_count: 12 },
    { _id: "demo3", building_id: bid, title: "Lost water bottle", type: "help", likes_count: 0 },
    { _id: "demo4", building_id: bid, title: "Math tutoring drop-in", type: "study", likes_count: 5 },
    { _id: "demo5", building_id: bid, title: "Club fair booth setup", type: "activity", likes_count: 2 },
    { _id: "demo6", building_id: bid, title: "Found AirPods case", type: "notice", likes_count: 1 },
    { _id: "demo7", building_id: bid, title: "Snack stash restocked", type: "food", likes_count: 7 },
    { _id: "demo8", building_id: bid, title: "Coding challenge night", type: "activity", likes_count: 9 },
    { _id: "demo9", building_id: bid, title: "Quiet zone reminder", type: "notice", likes_count: 4 },
  ];
}

export default function PostList({ buildingId, autoScroll = true }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);
  const timerRef = useRef(null);

  // === Fetch events or fallback demo ===
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
    return () => {
      aborted = true;
    };
  }, [buildingId]);

  // === Auto scroll until bottom then stop ===
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
          stop(); // stop permanently when reach bottom
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
    el.addEventListener("mouseleave", () => {
      if (!timerRef.current) start();
    });

    return () => {
      stop();
      el.removeEventListener("mouseenter", stop);
      el.removeEventListener("mouseleave", start);
    };
  }, [events, autoScroll, buildingId]);

  // === Render ===
  return (
    <div ref={wrapRef} style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
      {loading && <div style={{ padding: 8, color: "#6b7280" }}>Loading events…</div>}
      {!loading && events.length === 0 && (
        <div style={{ padding: 8, color: "#6b7280" }}>No events.</div>
      )}

      {events.map((ev) => {
        const key = ev._id || ev.id;
        const type = String(ev.type || "other").toLowerCase();
        const likes = ev.likes_count != null ? ev.likes_count : 0;

        return (
          <div
            key={key}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
              background: "#fff",
            }}
          >
            {/* Only: [badge] Title .......... ❤️ likes */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
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
                  fontWeight: 700,
                  fontSize: 15,
                  flex: "1 1 auto",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={ev.title}
              >
                {ev.title}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#ef4444",
                  flex: "0 0 auto",
                }}
                title={`${likes} likes`}
              >
                <span>❤️</span>
                <span style={{ color: "#6b7280" }}>{likes}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}