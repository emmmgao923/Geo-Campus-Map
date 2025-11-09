import React, { useMemo, useState } from "react";

/* ========= Rank & Levels ========= */
function rankOf(points) {
  if (points >= 2000) return "Legend";
  if (points >= 1000) return "Master";
  if (points >= 500) return "Expert";
  if (points >= 200) return "Helper";
  if (points >= 50) return "Rookie";
  return "Newbie";
}

const LEVELS = [
  { id: 1, name: "Rookie",  threshold: 50,   reward: "Beginner badge",               icon: "🪶" },
  { id: 2, name: "Helper",  threshold: 200,  reward: "Colored avatar frame",         icon: "🔮" },
  { id: 3, name: "Expert",  threshold: 500,  reward: "1 featured post opportunity",  icon: "🔥" },
  { id: 4, name: "Master",  threshold: 1000, reward: "Exclusive border + name color",icon: "🛡️" },
  { id: 5, name: "Legend",  threshold: 2000, reward: "Special title + bonus sticker",icon: "🦄" },
];

/* ========= Achievements ========= */
const ACHIEVEMENTS = [
  { id: "first_post",    name: "First Post",       icon: "📝", points: 10,  desc: "Create your first post.",                 status: "unlocked" },
  { id: "first_answer",  name: "First Answer",     icon: "💬", points: 15,  desc: "Answer someone’s question.",              status: "unlocked" },
  { id: "first_accept",  name: "First Accepted",   icon: "✅", points: 40,  desc: "Your answer got accepted.",               status: "inprogress", progress: 0.6 },
  { id: "five_answers",  name: "5 Answers",        icon: "✋", points: 30,  desc: "Post five answers.",                      status: "inprogress", progress: 0.2 },
  { id: "streak7",       name: "7-Day Streak",     icon: "📆", points: 70,  desc: "Help once per day for 7 days.",           status: "locked" },
  { id: "upvotes50",     name: "+50 Upvotes",      icon: "⭐", points: 100, desc: "Receive 50 total upvotes.",               status: "locked" },
  { id: "bug_hunter",    name: "Bug Hunter",       icon: "🔧", points: 25,  desc: "Report a verified bug.",                  status: "unlocked" },
  { id: "event_vol",     name: "Event Volunteer",  icon: "🎪", points: 60,  desc: "Host or help an event.",                  status: "locked" },
];

/* ========= UI Elements ========= */
function ProgressBar({ value, max }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ width: "100%", height: 8, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "#111827", transition: "width .35s" }} />
    </div>
  );
}

function Pill({ children, tone = "default" }) {
  const tones = {
    default: { bg: "#F1F5F9", bd: "#E2E8F0", color: "#334155" },
    reached: { bg: "#DCFCE7", bd: "#BBF7D0", color: "#166534" },
    next:    { bg: "#EEF2FF", bd: "#C7D2FE", color: "#4338CA" },
  };
  const t = tones[tone] ?? tones.default;
  return (
    <span style={{
      fontSize: 12, padding: "2px 8px", borderRadius: 999,
      background: t.bg, border: `1px solid ${t.bd}`, color: t.color
    }}>{children}</span>
  );
}

/* ========= Level Progress ========= */
function LevelProgressPanel({ totalPoints }) {
  const top = LEVELS[LEVELS.length - 1].threshold;
  const next = LEVELS.find(l => totalPoints < l.threshold);
  return (
    <div style={{
      marginTop: 8, marginBottom: 16, background: "#fff",
      border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 16px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "#6b7280", fontSize: 14 }}>Level Progress</span>
        <span style={{ color: "#6b7280", fontSize: 14 }}>
          {Math.min(totalPoints, top)} / {top} pts
        </span>
      </div>
      <ProgressBar value={totalPoints} max={top} />
      <div style={{ marginTop: 8, color: "#6b7280", fontSize: 14 }}>
        {next ? <>Need <b>{next.threshold - totalPoints}</b> pts to reach <b>{next.name}</b></> : "You’ve reached the highest level 🎉"}
      </div>
    </div>
  );
}

/* ========= Titles: 5 evenly spaced ========= */
function LevelRail({ points }) {
  const next = LEVELS.find(l => points < l.threshold);

  return (
    <div>
      <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 8 }}>Titles</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
        }}
      >
        {LEVELS.map(lv => {
          const reached = points >= lv.threshold;
          const isNext = next && next.id === lv.id;

          return (
            <div
              key={lv.id}
              style={{
                padding: 12,
                borderRadius: 12,
                background: "#FFFFFF",
                border: `2px solid ${reached ? "#16A34A" : isNext ? "#6366F1" : "#E5E7EB"}`,
                boxShadow: isNext ? "0 2px 6px rgba(99,102,241,0.20)" : "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 22, opacity: reached ? 1 : 0.8 }}>{lv.icon}</div>
                {reached ? <Pill tone="reached">Reached</Pill>
                         : isNext ? <Pill tone="next">Next</Pill>
                                  : <Pill>Locked</Pill>}
              </div>

              <div style={{ fontWeight: 700 }}>{lv.name}</div>
              <div style={{ color: "#6B7280", fontSize: 13, marginTop: 2 }}>
                Reward: {lv.reward}
              </div>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 6 }}>
                XP ≥ {lv.threshold}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ========= Achievement Card ========= */
function AchievementCard({ a }) {
  const border = a.status === "unlocked" ? "#16A34A" : a.status === "inprogress" ? "#0EA5E9" : "#E5E7EB";
  const shadow = a.status === "unlocked" ? "0 0 0 2px rgba(22,163,74,.12) inset"
               : a.status === "inprogress" ? "0 0 0 2px rgba(14,165,233,.12) inset" : "none";
  return (
    <div style={{
      border: `1px solid ${border}`, borderRadius: 14, padding: 14, background: "white",
      boxShadow: shadow, display: "flex", flexDirection: "column", gap: 10, minHeight: 150
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 26 }}>{a.icon}</div>
        <Pill>{a.status === "unlocked" ? "Unlocked" : a.status === "inprogress" ? "In progress" : "Locked"}</Pill>
      </div>

      <div>
        <div style={{ fontWeight: 700 }}>{a.name}</div>
        <div style={{ fontSize: 13, color: "#6B7280" }}>{a.desc}</div>
      </div>

      {a.status !== "unlocked" && (
        <>
          <div style={{ height: 6, background: "#EEF2F7", borderRadius: 999 }}>
            <div style={{
              width: `${Math.round((a.progress ?? 0) * 100)}%`,
              height: "100%", borderRadius: 999, background: "#111827"
            }} />
          </div>
          <div style={{ fontSize: 12, color: "#64748B" }}>{Math.round((a.progress ?? 0) * 100)}%</div>
        </>
      )}

      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 600 }}>{a.points} pts</div>
        <button style={{
          padding: "6px 10px", borderRadius: 10, border: "1px solid #E5E7EB", background: "#F8FAFC", cursor: "pointer"
        }}>Details</button>
      </div>
    </div>
  );
}

/* ========= Achievements row (h-scroll) ========= */
function AchievementsRow() {
  return (
    <div style={{
      display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8,
      overscrollBehaviorX: "contain", scrollbarWidth: "thin"
    }}>
      {ACHIEVEMENTS.map(a => (
        <div key={a.id} style={{ minWidth: 340, flex: "0 0 340px", scrollSnapAlign: "start" }}>
          <AchievementCard a={a} />
        </div>
      ))}
    </div>
  );
}

/* ========= Post scoring rules ========= */
const POST_POINTS = {
  basePost: 5,
  likeBonus: 1,
  tagBonus: {
    Study: 10,
    Help: 12,
    Life: 8,
    Marketplace: 6,
    Default: 5,
  },
};
function pointsForPost(p) {
  const tagBonus = POST_POINTS.tagBonus[p.tag] ?? POST_POINTS.tagBonus.Default;
  const likePts = (p.likes ?? 0) * POST_POINTS.likeBonus;
  return POST_POINTS.basePost + tagBonus + likePts;
}

/* ========= History (interaction) scoring rules ========= */
const HISTORY_POINTS = {
  perComment: 3,          // 你在该帖下每发一条评论
  perLikeOnMyComment: 2,  // 你的评论每获得1个赞
  opLikedBonus: 8,        // 被帖主点赞一次的额外奖励
  acceptedBonus: 20,      // 被采纳/标记为解决方案
  capPerPost: 60,         // 单帖最高获得
};
function pointsForHistory(h) {
  let pts =
    (h.myComments ?? 0) * HISTORY_POINTS.perComment +
    (h.likesOnMyComments ?? 0) * HISTORY_POINTS.perLikeOnMyComment +
    (h.opLiked ? HISTORY_POINTS.opLikedBonus : 0) +
    (h.accepted ? HISTORY_POINTS.acceptedBonus : 0);
  return Math.min(pts, HISTORY_POINTS.capPerPost);
}

/* ========= Page ========= */
export default function ProfilePage() {
  const totalPoints = 420;
  const title = useMemo(() => rankOf(totalPoints), [totalPoints]);
  const [active, setActive] = useState("achievements");

  // My Posts (unchanged aside from scoring)
  const myPosts = [
    { id: 1, title: "Math tutoring session this weekend!", tag: "Study",       likes: 12 },
    { id: 2, title: "Selling used iPad Air 4",             tag: "Marketplace", likes: 8  },
  ];

  // History: 你参与过的帖子（含互动数据）
  const historyPosts = [
    {
      id: 101,
      title: "Lost keys at the library",
      tag: "Help",
      time: "2 hours ago",
      myComments: 2,            // 你评论了2次
      likesOnMyComments: 5,     // 你的评论共获5个赞
      opLiked: true,            // 帖主点过赞
      accepted: false,          // 未被采纳
    },
    {
      id: 102,
      title: "Where to find good coffee on campus",
      tag: "Life",
      time: "1 day ago",
      myComments: 1,
      likesOnMyComments: 1,
      opLiked: false,
      accepted: false,
    },
    {
      id: 103,
      title: "Best study spots around UMass",
      tag: "Study",
      time: "3 days ago",
      myComments: 1,
      likesOnMyComments: 7,
      opLiked: true,
      accepted: true,           // 被采纳，奖励更多
    },
  ];

  const tabs = [
    { key: "achievements", label: "Achievements", content: <AchievementsRow /> },
    {
      key: "myPosts",
      label: "My Posts",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {myPosts.map(p => {
            const xp = pointsForPost(p);
            return (
              <div key={p.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: 12, background: "#fafafa"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    background: "#dcfce7", color: "#166534", fontWeight: 700,
                    padding: "2px 10px", borderRadius: 999
                  }}>{p.tag}</span>
                  <span style={{ fontWeight: 600 }}>{p.title}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#6b7280" }}>
                  <span>❤️ {p.likes}</span>
                  <span style={{
                    fontWeight: 700, color: "#111827",
                    background: "#EEF2FF", border: "1px solid #C7D2FE",
                    padding: "2px 10px", borderRadius: 999
                  }}>
                    +{xp} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )
    },
    {
      key: "history",
      label: "History",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {historyPosts.map(p => {
            const xp = pointsForHistory(p);
            return (
              <div key={p.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: 12, background: "#fafafa"
              }}>
                {/* 左侧：标签 + 标题 */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    background: "#eef2ff", color: "#4338ca", fontWeight: 700,
                    padding: "2px 10px", borderRadius: 999
                  }}>{p.tag}</span>
                  <span style={{ fontWeight: 600 }}>{p.title}</span>
                </div>

                {/* 右侧：互动信息 + 总积分 */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>{p.time}</span>
                  <span title="Likes on your comments" style={{ color: "#6b7280" }}>❤️ {p.likesOnMyComments}</span>
                  {p.opLiked && <span title="Post owner liked your comment">👑 OP liked</span>}
                  {p.accepted && <span title="Your comment was accepted">🏅 Accepted</span>}
                  <span style={{
                    fontWeight: 700, color: "#111827",
                    background: "#FEF3C7", border: "1px solid #FDE68A",
                    padding: "2px 10px", borderRadius: 999
                  }}>
                    +{xp} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )
    },
  ];

  return (
    <main style={{
      display: "flex", justifyContent: "center",
      background: "#fafafa", minHeight: "100vh", padding: "2rem 1rem"
    }}>
      <div style={{
        width: "100%", maxWidth: 1200, display: "flex",
        flexDirection: "column", gap: "1.5rem"
      }}>
        {/* Header */}
        <div style={{
          background: "#fff", borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: "1.5rem 2rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", background: "#e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 20
              }}>U</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 4 }}>Username</div>
                <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>user@example.com</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{title}</span>
              <span style={{ fontSize: "1rem", color: "#6b7280" }}>{totalPoints} pts</span>
            </div>
          </div>
        </div>

        {/* Tabs + Level Progress + Titles + Content */}
        <div style={{
          background: "#fff", borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: "1.5rem 2rem"
        }}>
          {/* Tabs */}
          <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", gap: 60, marginBottom: 10
          }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                style={{
                  minWidth: 180, padding: "0.75rem 1rem", borderRadius: 10,
                  border: active === t.key ? "2px solid #6366f1" : "1px solid #e5e7eb",
                  background: active === t.key ? "#eef2ff" : "#fff",
                  fontWeight: 600, color: active === t.key ? "#4338ca" : "#374151",
                  cursor: "pointer", transition: "all .2s",
                  boxShadow: active === t.key ? "0 2px 6px rgba(99,102,241,0.25)" : "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <LevelProgressPanel totalPoints={totalPoints} />
          <LevelRail points={totalPoints} />

          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, minHeight: 220 }}>
            {(tabs.find(t => t.key === active) || tabs[0]).content}
          </div>
        </div>
      </div>
    </main>
  );
}
