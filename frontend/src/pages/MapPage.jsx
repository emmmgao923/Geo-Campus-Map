import { useState, useEffect } from "react";
import MapView from "../components/MapView";
import Sidebar from "../components/Sidebar";

const PANEL_RATIO = 0.3333;

export default function MapPage() {
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [pinnedBuilding, setPinnedBuilding] = useState(null);

  const activeBuilding = pinnedBuilding ?? hoveredBuilding; 
  const showSidebar = Boolean(activeBuilding);

  useEffect(() => {
    const onHover = (e) => {
      // ignore hover updates while pinned
      if (pinnedBuilding) return; 
      setHoveredBuilding(e.detail);
    };

    const onLeave = () => {
      if (pinnedBuilding) return; 
      setHoveredBuilding(null);
    };

    const onPin = (e) => setPinnedBuilding(e.detail);

    window.addEventListener("umass:building-hover", onHover);
    window.addEventListener("umass:building-leave", onLeave);
    window.addEventListener("umass:building-pin", onPin); 

    return () => {
      window.removeEventListener("umass:building-hover", onHover);
      window.removeEventListener("umass:building-leave", onLeave);
      window.removeEventListener("umass:building-pin", onPin); 
    };
  }, [pinnedBuilding]); // depend on pinnedBuilding

  // escape to cancel 
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setPinnedBuilding(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); 

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

        {showSidebar && activeBuilding && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${Math.round(PANEL_RATIO * 100)}%`,
              height: "100%",
              background: "white",
              borderRight: "1px solid #eee",
              zIndex: 10,
              boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
              pointerEvents: "auto",
            }}
          >
            <Sidebar
              building={activeBuilding}
              pinned={Boolean(pinnedBuilding)}  
              onUnpin={() => setPinnedBuilding(null)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
