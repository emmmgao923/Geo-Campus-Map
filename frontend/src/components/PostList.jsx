import { useEffect, useRef, useState, useMemo } from "react";
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

export default function PostList({
  buildingId,
  events =  [],
  highlightEventId,
  autoScroll = true,
  expanded = false,     // switch to expanded card layout
  filterType = null,    // filter by type key 
  bottomPadding = 0,
}) {

  const wrapRef = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

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
      
      {buildingId && filtered.length === 0 && (
      <div style={{ padding: 8, color: "#6b7280" }}>
        Nothing happening here...
      </div>
       )}
    
    <AnimatePresence mode="popLayout">
      {filtered.map((ev, index) => {
        const key = ev._id || ev.id;
        const type = String(ev.type || "other").toLowerCase();
        const likes = ev.likes_count != null ? ev.likes_count : 0;
        const summary = ev.summary ?? "";
        const author = ev.author ?? "Anon";
        const created = ev.created_at ? new Date(ev.created_at) : null;


        const isHighlighted = (highlightEventId && key === highlightEventId) || key === hoveredId; // ✅

        const goDetail = () => navigate(`/post/${buildingId}?eventId=${key}`);

        return (
          <motion.div
              key={key}
              role="button"
              tabIndex={0}
              onClick={goDetail}
              onKeyDown={(e) => {
                if (e.key === "Enter") goDetail();
              }}
              onMouseEnter={() => setHoveredId(key)}   // 本地 hover 高亮
              onMouseLeave={() => setHoveredId(null)}
              // === Entrance animation for each post ===
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
                delay: index * 0.05, // stagger delay by index
              }}
              whileHover={{ scale: 1.02 }} // slightly enlarge on hover
              whileTap={{ scale: 0.98 }}   // slightly shrink on click
              style={{
                border: "1px solid #eef2f7",
                borderRadius: 14,
                padding: 12,
                marginBottom: 12,
                background: isHighlighted
                ? "#f5f5f5ff"                   
                : "#ffffff",
                transform: isHighlighted ? "scale(1.02)" : "none",
                transition: "all 0.18s ease-out",
                cursor: "pointer",
                boxShadow: "0 1px 0 rgba(2,6,23,0.04)",
                originY: 0.5,
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
          </motion.div>
        );
      })}
      </AnimatePresence>
    </div>
  );
}
