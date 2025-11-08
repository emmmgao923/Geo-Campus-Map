import React, { useEffect, useRef } from "react";
import PostList from "./PostList";

/**
 * Sidebar
 * - Auto-scrolls the posts list when NOT pinned (hover mode).
 * - Allows manual scrolling when pinned (click-to-pin mode).
 * - Resets scrollTop when the hovered building changes.
 */
export default function Sidebar({ building, pinned = false, onUnpin }) {
  if (!building) return null;

  const name =
    building?.properties?.name ?? building?.name ?? "Building";
  const buildingId =
    building?.id ??
    building?._id ??
    building?.properties?.id ??
    building?.properties?._id;

  const scrollRef = useRef(null);
  const timerRef = useRef(null);
  const lastIdRef = useRef(null);

  // Reset scroll position when the building changes
  useEffect(() => {
    const curId = String(buildingId ?? "");
    if (lastIdRef.current !== curId) {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
      lastIdRef.current = curId;
    }
  }, [buildingId]);

  // Auto scroll when not pinned; stop when pinned or unmounted
  useEffect(() => {
    // clear any previous timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!pinned && scrollRef.current) {
      // gentle auto-scroll: 1px every 40ms
      timerRef.current = setInterval(() => {
        const el = scrollRef.current;
        if (!el) return;
        const atBottom =
          el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if (atBottom) {
          el.scrollTop = 0; // loop back to top
        } else {
          el.scrollTop += 1; // smooth step
        }
      }, 40);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pinned, buildingId]);

  return (
    <aside
      style={{
        padding: 16,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxSizing: "border-box",
        background: "white",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <h2
          style={{
            flex: 1,
            margin: "8px 0 4px",
            fontSize: 18,
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={name}
        >
          {name}
        </h2>

        {/* Unpin button when pinned */}
        {pinned && typeof onUnpin === "function" && (
          <button
            onClick={onUnpin}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "6px 10px",
              background: "#fff",
              cursor: "pointer",
              fontSize: 12,
              color: "#374151",
              transition: "all 0.2s ease",
            }}
            aria-label="Unpin sidebar"
            title="Unpin"
          >
            Unpin ✕
          </button>
        )}
      </div>

      <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
        {pinned
          ? "Pinned building view — scroll to browse posts."
          : "Hover mode — posts will auto scroll."}
      </p>

      <div style={{ marginTop: 8, borderTop: "1px solid #eee" }} />

      {/* Scroll container:
          - overflowY: 'auto' when pinned (manual scroll)
          - overflow: 'hidden' when not pinned (auto scroll) */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          marginTop: 8,
          overflowY: pinned ? "auto" : "hidden",
          overflowX: "hidden",
          // Optional: smooth wheel feel when pinned
          scrollBehavior: pinned ? "smooth" : "auto",
        }}
      >
        <PostList buildingId={buildingId} />
      </div>
    </aside>
  );
}
