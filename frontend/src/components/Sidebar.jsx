import PostList from "./PostList";

export default function Sidebar({ building, pinned, onUnpin }) {
  if (!building) return null;

  const name = building?.properties?.name ?? building?.name ?? "Building";
  const buildingId =
    building?.id ??
    building?._id ??
    building?.properties?.id ??
    building?.properties?._id;

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
        >
          {name}
        </h2>

        {/* 如果 pinned 为 true，就显示 Unpin 按钮 */}
        {pinned && onUnpin && (
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
          >
            Unpin ✕
          </button>
        )}
      </div>

      <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
        {pinned
          ? "Pinned building view — click Unpin to return."
          : "Hover over buildings to update this panel"}
      </p>

      <div style={{ marginTop: 8, borderTop: "1px solid #eee" }} />

      {/* Post 列表部分 */}
      <div style={{ flex: 1, overflowY: "auto", marginTop: 8 }}>
        <PostList buildingId={buildingId} />
      </div>
    </aside>
  );
}
