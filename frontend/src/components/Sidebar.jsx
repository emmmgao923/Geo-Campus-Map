import React, { useEffect, useRef } from "react";
import PostList from "./PostList";
import { motion, AnimatePresence } from "framer-motion";


export default function Sidebar({
  building,
  highlightEventId,
  pinned = false,
  onUnpin,
  onMouseEnterSidebar,
  onMouseLeaveSidebar,
}) {
  if (!building || !building.id) return null;

  const name = building.name ?? building.properties?.name ?? "Building";
  const buildingId = building.id ?? building.properties?.id;
  const events = building.events ?? [];

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

// ====== 分支 1：没有 building（刷新后地图未就绪/尚未 hover） ======
  // 显示一个占位 Sidebar：宽度固定、半透明白底，左→右淡入
  // if (!building) {
  //   console.log("building is not loaded yet.")
  //   return (
  //     <AnimatePresence mode="wait">
  //       <motion.aside
  //         key="sidebar-placeholder"
  //         initial={{ x: -300, opacity: 0, backgroundColor: "rgba(255,255,255,0)" }}
  //         animate={{ x: 0, opacity: 0.9, backgroundColor: "rgba(255,255,255,0.9)" }}
  //         exit={{ x: -300, opacity: 0, backgroundColor: "rgba(255,255,255,0)" }}
  //         transition={{ type: "spring", stiffness: 120, damping: 18 }}
  //         onMouseEnter={(e) => {
  //           e.stopPropagation(); // 阻止事件向下传递到 mapbox canvas
  //           if (onMouseEnterSidebar) onMouseEnterSidebar();
  //         }}
  //         onMouseLeave={(e) => {
  //           e.stopPropagation();
  //           if (onMouseLeaveSidebar) onMouseLeaveSidebar();
  //         }}
  //         style={{
  //           width: 300,            // 占位时给个固定宽度，避免布局跳动
  //           height: "100%",
  //           padding: 16,
  //           display: "flex",
  //           flexDirection: "column",
  //           boxSizing: "border-box",
  //           boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
  //           // boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
  //           backdropFilter: "blur(2px)", // 轻微磨砂质感，视觉更柔和
  //         }}
  //       >
  //         <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#334155" }}>
  //           GeoCampus
  //         </div>
  //         <div style={{ color: "#6b7280", fontSize: 14 }}>
  //           加载中… 将鼠标移动到建筑上查看帖子
  //         </div>

  //         {/* 简易骨架屏 */}
  //         <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
  //           {[...Array(4)].map((_, i) => (
  //             <div key={i} style={{
  //               height: 64,
  //               borderRadius: 12,
  //               background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
  //               backgroundSize: "200% 100%",
  //               animation: "shimmer 1.2s infinite",
  //             }}/>
  //           ))}
  //         </div>

  //         {/* shimmer 动画（内联 keyframes） */}
  //         <style>{`
  //           @keyframes shimmer {
  //             0% { background-position: 200% 0; }
  //             100% { background-position: -200% 0; }
  //           }
  //         `}</style>
  //       </motion.aside>
  //     </AnimatePresence>
  //   );
  // }

  // ====== 分支 2：有 building（正常展示 Sidebar） ======
  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={buildingId} // building 变化触发退出->进入过渡
        initial={{ x: -300, opacity: 0, backgroundColor: "rgba(255,255,255,0)" }}
        animate={{ x: 0, opacity: 1, backgroundColor: "rgba(255,255,255,1)" }}
        exit={{ x: -300, opacity: 0, backgroundColor: "rgba(255,255,255,0)" }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        // onMouseEnter={(e) => {
        //   e.stopPropagation();
        //   onMouseEnterSidebar?.();
        // }}
        // onMouseLeave={(e) => {
        //   e.stopPropagation();
        //   onMouseLeaveSidebar?.();
        // }}
        onMouseEnter={onMouseEnterSidebar}
        onMouseLeave={onMouseLeaveSidebar}
        style={{
          padding: 16,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxSizing: "border-box",
          boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
          // boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
          pointerEvents: "auto",
        }}
      >
        {/* 标题区 */}
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

          {/* 固定时的 Unpin 按钮 */}
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
            ? "What's happenning now?"
            : "What's happenning now?"}
        </p>

        <div style={{ marginTop: 8, borderTop: "1px solid #eee" }} />

        {/* 帖子滚动区 */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            marginTop: 8,
            overflowY: pinned ? "auto" : "hidden",
            overflowX: "hidden",
            scrollBehavior: pinned ? "smooth" : "auto",
          }}
        >
          <PostList 
          buildingId={buildingId} 
          events={events}
          highlightEventId={highlightEventId}
           />
        </div>
      </motion.aside>
    </AnimatePresence>
  );  // return (
  //   <aside
  //     style={{
  //       padding: 16,
  //       height: "100%",
  //       display: "flex",
  //       flexDirection: "column",
  //       position: "relative",
  //       boxSizing: "border-box",
  //       background: "white",
  //     }}
  //   >
  //     {/* Header */}
  //     <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
  //       <h2
  //         style={{
  //           flex: 1,
  //           margin: "8px 0 4px",
  //           fontSize: 18,
  //           fontWeight: 700,
  //           overflow: "hidden",
  //           textOverflow: "ellipsis",
  //           whiteSpace: "nowrap",
  //         }}
  //         title={name}
  //       >
  //         {name}
  //       </h2>

  //       {/* Unpin button when pinned */}
  //       {pinned && typeof onUnpin === "function" && (
  //         <button
  //           onClick={onUnpin}
  //           style={{
  //             border: "1px solid #e5e7eb",
  //             borderRadius: 8,
  //             padding: "6px 10px",
  //             background: "#fff",
  //             cursor: "pointer",
  //             fontSize: 12,
  //             color: "#374151",
  //             transition: "all 0.2s ease",
  //           }}
  //           aria-label="Unpin sidebar"
  //           title="Unpin"
  //         >
  //           Unpin ✕
  //         </button>
  //       )}
  //     </div>

  //     <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
  //       {pinned
  //         ? "Pinned building view — scroll to browse posts."
  //         : "Hover mode — posts will auto scroll."}
  //     </p>

  //     <div style={{ marginTop: 8, borderTop: "1px solid #eee" }} />

  //     {/* Scroll container:
  //         - overflowY: 'auto' when pinned (manual scroll)
  //         - overflow: 'hidden' when not pinned (auto scroll) */}
  //     <div
  //       ref={scrollRef}
  //       style={{
  //         flex: 1,
  //         marginTop: 8,
  //         overflowY: pinned ? "auto" : "hidden",
  //         overflowX: "hidden",
  //         // Optional: smooth wheel feel when pinned
  //         scrollBehavior: pinned ? "smooth" : "auto",
  //       }}
  //     >
  //       <PostList buildingId={buildingId} />
  //     </div>
  //   </aside>
  // );
}
