import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SidebarDetail from "../components/SidebarDetail";
import axios from "axios";
import buildingNameMap from "../data/buildings.json";





export default function PostDetailPage() {
  const { buildingId } = useParams();
  const [searchParams] = useSearchParams();         
  const eventId = searchParams.get("eventId"); 
  const [eventList, setEventList] = useState([]); // 左侧 SidebarDetail 使用
  const [event, setEvent] = useState(null);   
  const [loading, setLoading] = useState(true);

  // right pane: simple local comment composer state
  const [draft, setDraft] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    // ✅ 异步自调用函数
    (async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/events/${buildingId}`
        );
        const allEvents = res.data;
        setEventList(allEvents); // ✅ 保存事件列表
        const target = allEvents.find(e => e._id === eventId);
        setEvent(target || null);
      } catch (err) {
        console.error("❌ 请求失败:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [buildingId, eventId]); // ✅ 当 buildingId 或 eventId 变化时重新请求


  const buildingName = buildingNameMap[buildingId] || buildingId;
  console.log(buildingName);

  const addComment = () => {
    const text = draft.trim();
    if (!text) return;
    const item = {
      id: `c-${Date.now()}`,
      author: "You",
      body: link ? `${text} ${link}` : text,
      createdAt: Date.now(),
    };
    setEvent((p) => ({ ...p, comments: [item, ...(p?.comments || [])] }));
    setDraft("");
    setLink("");
  };

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
          display: "grid",
          gridTemplateColumns: "minmax(300px, 33.33%) 1fr",
        }}
      >
        {/* LEFT: allow child to define scroll (no overflow hidden) */}
        <div style={{ borderRight: "1px solid #eee", height: "100%", minHeight: 0, display: "flex" }}>
          <SidebarDetail   
            eventList={eventList}
            buildingName={buildingName}  // 或者从上层传真实名字
            buildingId={buildingId} />
        </div>

        {/* RIGHT: detail panel */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0, height: "100%" }}>
          {/* building name */}
          {/* <div style={{ padding: "16px 20px 0 20px", borderBottom: "1px solid #f1f5f9" }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "#0f172a",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={buildingName}
            >
              {buildingName}
            </div>
          </div> */}

          {/* content split */}
          <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateRows: "auto 1fr auto" }}>
            {/* upper: post summary */}
            <div style={{ padding: "16px 20px 8px 20px" }}>
              {loading ? (
                <div>Loading…</div>
              ) : (
                <>
                  <h1
                    style={{
                      margin: "4px 0 6px",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: 0.2,
                      color: "#0f172a",
                      lineHeight: 1.25,
                    }}
                    title={event?.title}
                  >
                    {event?.title}
                  </h1>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      color: "#64748b",
                      fontSize: 14,
                    }}
                  >
                    <span
                      style={{
                        color: "#334155",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                      title={event?.summary}
                    >
                      {event?.summary}
                    </span>
                    <span>·</span>
                    <time>{new Date(event?.timestamp  || Date.now()).toLocaleString()}</time>
                  </div>
                </>
              )}
            </div>

            {/* divider */}
            <div style={{ height: 1, background: "#f1f5f9", margin: "0 20px" }} />

            {/* comments (scrollable) */}
            <div style={{ padding: "12px 20px", overflowY: "auto", minHeight: 0 }}>
              {loading && <div>Loading…</div>}
              {!loading &&
                (event?.comments || []).map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: 12,
                      border: "1px solid #eef2f7",
                      borderRadius: 12,
                      marginBottom: 10,
                      background: "#fff",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {c.author}
                      <span style={{ color: "#64748b", fontWeight: 400, marginLeft: 6 }}>
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ color: "#0f172a" }}>{c.body}</div>
                  </div>
                ))}
              {!loading && (event?.comments || []).length === 0 && (
                <div className="muted">No comments yet.</div>
              )}
            </div>

            {/* composer */}
            <div
              style={{
                borderTop: "1px solid #f1f5f9",
                padding: "10px 20px",
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: 8,
                alignItems: "center",
              }}
            >
              <input
                placeholder="Write a comment…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                style={{
                  height: 40,
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: "0 12px",
                  outline: "none",
                  fontSize: 14,
                }}
              />
              <button
                className="btn-lite"
                onClick={() => {
                  const url = prompt("Paste a URL");
                  if (url) setLink(url);
                }}
                title="Add link"
                style={{ whiteSpace: "nowrap" }}
              >
                {link ? "Link added" : "Add link"}
              </button>
              <button className="btn-primary" onClick={addComment} title="Send">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
