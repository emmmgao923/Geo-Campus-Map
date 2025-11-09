import { useState, useEffect, useRef  } from "react";
import MapView from "../components/MapView";
import Sidebar from "../components/Sidebar";

const PANEL_RATIO = 0.3333;

export default function MapPage() {
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [pinnedBuilding, setPinnedBuilding] = useState(null); // NEW
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

  const activeBuilding = pinnedBuilding ?? hoveredBuilding;     // NEW
  const showSidebar = Boolean(activeBuilding) || isHoveringSidebar;

  const currentBuildingId = useRef(null);

  useEffect(() => {
    // const onHover = (e) => {
    //   // ignore hover updates while pinned
    //   if (pinnedBuilding) return;                 // NEW
    //   setHoveredBuilding(e.detail);
    // };
    const onHover = (e) => {
      if (pinnedBuilding) return;
  
      const newBuilding = e.detail;
      if (!newBuilding) return;
  
      // ✅ 关键逻辑：相同 buildingId 时不更新
      const newId =
        newBuilding.id ??
        newBuilding._id ??
        newBuilding.properties?.id ??
        newBuilding.properties?._id;
  
      const curId =
        hoveredBuilding?.id ??
        hoveredBuilding?._id ??
        hoveredBuilding?.properties?.id ??
        hoveredBuilding?.properties?._id;
  
      if (newId === currentBuildingId) return; // 同一栋楼，不更新，不触发动画
      currentBuildingId.current = newId;
      setHoveredBuilding(newBuilding);
      console.log("hovered feature", e.detail);

    };

    // const onLeave = () => {
    //   if (pinnedBuilding) return;                 // NEW
    //   setHoveredBuilding(null);
    // };
    const onLeave = () => {
      if (pinnedBuilding) return;
      // ✅ 只有在不悬停 Sidebar 时，才立即关闭
      if (!isHoveringSidebar) {
        currentBuildingId.current = null;
        setHoveredBuilding(null);
      }
    };

    const onPin = (e) => setPinnedBuilding(e.detail); // NEW

    window.addEventListener("umass:building-hover", onHover);
    window.addEventListener("umass:building-leave", onLeave);
    window.addEventListener("umass:building-pin", onPin);       // NEW

    return () => {
      window.removeEventListener("umass:building-hover", onHover);
      window.removeEventListener("umass:building-leave", onLeave);
      window.removeEventListener("umass:building-pin", onPin);  // NEW

    };
  }, [pinnedBuilding, hoveredBuilding, isHoveringSidebar]); // NEW: 依赖 pinnedBuilding，这样 pinned 时会暂停 hover/leave 的影响

  // 可选：按 ESC 解除固定
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {setPinnedBuilding(null); setHoveredBuilding(null);};
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // 可删

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 60px",
        backgroundColor: "#fafafa",
        height: "calc(100vh - 64px)",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1200,
          height: "100%",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          background: "white",
        }}
      >
        <MapView />

        {/* {showSidebar && activeBuilding && ( */}
        {showSidebar && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${Math.round(PANEL_RATIO * 100)}%`,
              height: "100%",
              background: "transparent",
              // borderRight: "1px solid #eee",
              zIndex: 10,
              // boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
              pointerEvents: "none",
            }}
          >
            {/* <div style={{ pointerEvents: "auto", height: "100%" }}> */}
              <Sidebar
                building={activeBuilding}
                pinned={Boolean(pinnedBuilding)}
                onUnpin={() => {
                  setPinnedBuilding(null);
                  setHoveredBuilding(null);
                  // currentBuildingId.current = null;
                }}
                // onMouseEnterSidebar={() => setIsHoveringSidebar(true)}
                // onMouseLeaveSidebar={() => {
                //   setIsHoveringSidebar(false);
                //   // ✅ 若此时建筑也没 hover，立即关闭
                //   if (!hoveredBuilding && !pinnedBuilding) {
                //     currentBuildingId.current = null;
                //     setHoveredBuilding(null);
                //   }
                // }}
                onMouseEnterSidebar={() => setHoveredBuilding(activeBuilding)}   // ✅ 鼠标进入 sidebar 保持显示
                onMouseLeaveSidebar={() => setHoveredBuilding(null)} 
              />
            </div>
          // </div>
        )}
      </div>
    </div>
  );
}
