import React, { useMemo, useState } from "react";

function rankOf(points) {
  if (points >= 2000) return "Legend";
  if (points >= 1000) return "Master";
  if (points >= 500) return "Expert";
  if (points >= 200) return "Helper";
  if (points >= 50) return "Rookie";
  return "Newbie";
}

export default function ProfilePage() {
  const totalPoints = 420;
  const title = useMemo(() => rankOf(totalPoints), [totalPoints]);
  const [active, setActive] = useState("history");

  // ---- mock data ----
  const viewedPosts = [
    { id: 1, title: "Lost keys at the library", tag: "Help", time: "2 hours ago" },
    { id: 2, title: "Where to find good coffee on campus", tag: "Life", time: "1 day ago" },
    { id: 3, title: "Best study spots around UMass", tag: "Study", time: "3 days ago" },
  ];
  const myPosts = [
    { id: 1, title: "Math tutoring session this weekend!", tag: "Study", likes: 12 },
    { id: 2, title: "Selling used iPad Air 4", tag: "Marketplace", likes: 8 },
  ];
  const achievements = [
    { id: 1, name: "First Post", desc: "Published your first post", date: "2024-11-02" },
    { id: 2, name: "Helper Lv.1", desc: "Received 10 likes on help posts", date: "2024-11-05" },
    { id: 3, name: "Contributor", desc: "Posted more than 5 times", date: "2024-11-07" },
  ];

  const tabs = [
    {
      key: "history",
      label: "History",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {viewedPosts.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                background: "#fafafa",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    background: "#eef2ff",
                    color: "#4338ca",
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: 999,
                  }}
                >
                  {p.tag}
                </span>
                <span style={{ fontWeight: 600 }}>{p.title}</span>
              </div>
              <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>{p.time}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "myPosts",
      label: "My Posts",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {myPosts.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                background: "#fafafa",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: 999,
                  }}
                >
                  {p.tag}
                </span>
                <span style={{ fontWeight: 600 }}>{p.title}</span>
              </div>
              <div style={{ color: "#6b7280" }}>❤️ {p.likes}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "achievements",
      label: "Achievements",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {achievements.map((a) => (
            <div
              key={a.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "12px 16px",
                background: "#f9fafb",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>{a.name}</span>
                <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>{a.date}</span>
              </div>
              <div style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: 4 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <main
      className="page"
      style={{
        display: "flex",
        justifyContent: "center",
        background: "#fafafa",
        minHeight: "100vh",
        padding: "2rem 1rem",
      }}
    >
      <div
        className="page-container"
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* 顶部信息栏（左头像/名邮箱，右称号/积分） */}
        <div
          className="panel"
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            padding: "1.5rem 2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                U
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 4 }}>Username</div>
                <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>user@example.com</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                {title}
              </span>
              <span style={{ fontSize: "1rem", color: "#6b7280" }}>{totalPoints} pts</span>
            </div>
          </div>
        </div>

        {/* 模块区 */}
        <div
          className="panel"
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            padding: "1.5rem 2rem",
          }}
        >
          {/* 按钮行：水平居中，彼此有距离，左右留白 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 60,           // 三个按钮之间的距离
              marginBottom: 20,
              flexWrap: "nowrap",
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                style={{
                  minWidth: 180,
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  border: active === t.key ? "2px solid #6366f1" : "1px solid #e5e7eb",
                  background: active === t.key ? "#eef2ff" : "#fff",
                  fontWeight: 600,
                  color: active === t.key ? "#4338ca" : "#374151",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: active === t.key ? "0 2px 6px rgba(99,102,241,0.25)" : "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 内容 */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, minHeight: 220 }}>
            {(tabs.find((t) => t.key === active) || tabs[0]).content}
          </div>
        </div>
      </div>
    </main>
  );
}
