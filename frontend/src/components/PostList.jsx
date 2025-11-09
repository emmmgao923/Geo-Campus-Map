import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence  } from "framer-motion";

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


export default function PostList({
  buildingId,
  autoScroll = false,
  events =  [],
  highlightEventId,
  expanded = false,
  filterType = null,
  bottomPadding = 0,
  cardHeight,
}) {

  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  // --- Row metrics: exactly 3 rows (title, summary, meta) ---
  const PAD = 12;
  const GAP = 6;
  const ROW_TITLE = 24;
  const ROW_SUMMARY = 20;
  const ROW_META = 18;
  const LIKE_AREA_WIDTH = 72;
  const GRID_HEIGHT = expanded
  ? ROW_TITLE + ROW_SUMMARY + ROW_META + 2 * GAP  // title + summary + meta
  : ROW_TITLE + ROW_SUMMARY + GAP;                // title + summary

const CARD_FIXED = PAD * 2 + GRID_HEIGHT;
  const CARD_HEIGHT = typeof cardHeight === "number" ? cardHeight : CARD_FIXED;


  const filtered = useMemo(() => {
    if (!Array.isArray(events)) return [];
    if (!filterType) return events;
    const ft = String(filterType).toLowerCase();
    return events.filter(
      (e) => String(e.type || "").toLowerCase() === ft
    );
  }, [events, filterType]);

  useEffect(() => {
    if (!autoScroll) return;
    const el = wrapRef.current;
    if (!el) return;

    function stop() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    function start() {
      stop();
      if (!filtered.length) return;
      timerRef.current = setInterval(() => {
        const atBottom =
          el.scrollTop + el.clientHeight + 2 >= el.scrollHeight;
        if (atBottom) {
          stop();
        } else {
          el.scrollTop = el.scrollTop + 1;
        }
      }, 18);
    }


    start();
    const handleEnter = () => stop();
    const handleLeave = () => {
      if (!timerRef.current) start();
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      stop();
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [filtered, autoScroll]);

  return (
    <div
      ref={wrapRef}
      style={{
        flex: 1,
        overflowY: "auto",
        overscrollBehavior: "contain",
        paddingTop: 8,
        paddingBottom: bottomPadding,
      }}
    >

    {buildingId && filtered.length === 0 && (
        <div style={{ padding: 8, color: "#6b7280" }}>
          Nothing happening here...
        </div>
    )}


      {filtered.map((ev) => {
        const key = ev._id || ev.id;
        const type = String(ev.type || "other").toLowerCase();
        const likes = ev.likes_count ?? 0;
        const summary = ev.content ?? "";
        const author = ev.user_id ?? "anon";
        const created = ev.timestamp ? new Date(ev.timestamp) : null;


        const isHighlighted = (highlightEventId && key === highlightEventId) || key === hoveredId; // ✅
        const goDetail = () => navigate(`/post/${buildingId}?eventId=${key}`);

        return (
          <div
              key={key}
              role="button"
              tabIndex={0}
              onClick={goDetail}
              onKeyDown={(e) => {
                if (e.key === "Enter") goDetail();
              }}
              onMouseEnter={() => setHoveredId(key)}   // 本地 hover 高亮
              onMouseLeave={() => setHoveredId(null)}
            style={{
              // Fixed outer frame
              position: "relative",
              height: CARD_HEIGHT,
              minHeight: CARD_HEIGHT,
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              background: isHighlighted
                ? "#f5f5f5ff"                   
                : "#ffffff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transform: isHighlighted ? "scale(1.01)" : "none",
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
                rowGap: expanded ? `${GAP}px` : `${GAP}px`,
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
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}