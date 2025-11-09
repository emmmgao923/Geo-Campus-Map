import React, { useMemo, useState } from "react";
import firstPostImg from "../assets/1.png";

/* ========= Glory Path: Rank & Levels ========= */
// Glory Path 段位名（由低到高）
function rankOf(points) {
  if (points >= 2000) return "Mythic";
  if (points >= 1000) return "Paragon";
  if (points >= 500)  return "Vanguard";
  if (points >= 200)  return "Trailblazer";
  if (points >= 50)   return "Initiate";
  return "Initiate";
}

const LEVELS = [
  {
    id: 1,
    name: "Initiate",
    threshold: 50,
    reward: "Dawn Sigil (badge)",
    icon: "✨",
  },
  {
    id: 2,
    name: "Trailblazer",
    threshold: 200,
    reward: "Auric Frame (avatar border)",
    icon: "🧭",
  },
  {
    id: 3,
    name: "Vanguard",
    threshold: 500,
    reward: "Featured Post Token ×1",
    icon: "⚔️",
  },
  {
    id: 4,
    name: "Paragon",
    threshold: 1000,
    reward: "Nameplate Aura + Elite border",
    icon: "🏛️",
  },
  {
    id: 5,
    name: "Mythic",
    threshold: 2000,
    reward: "Crown Title + Mythic sticker",
    icon: "👑",
  },
];

/* ========= Achievements ========= */
const ACHIEVEMENTS = [
  { id: "first_post",   name: "First Post",      icon: "📝", points: 10,  desc: "Create your first post.",            status: "unlocked",  image: firstPostImg, unlockedAt: "2025-11-05" },
  { id: "first_answer", name: "First Answer",    icon: "💬", points: 15,  desc: "Answer someone’s question.",         status: "unlocked",  unlockedAt: "2025-11-06" },
  { id: "first_accept", name: "First Accepted",  icon: "✅", points: 40,  desc: "Your answer got accepted.",          status: "inprogress" },
  { id: "five_answers", name: "5 Answers",       icon: "✋", points: 30,  desc: "Post five answers.",                 status: "inprogress" },
  { id: "streak7",      name: "7-Day Streak",    icon: "📆", points: 70,  desc: "Help once per day for 7 days.",      status: "locked" },
  { id: "upvotes50",    name: "+50 Upvotes",     icon: "⭐", points: 100, desc: "Receive 50 total upvotes.",          status: "locked" },
  { id: "bug_hunter",   name: "Bug Hunter",      icon: "🔧", points: 25,  desc: "Report a verified bug.",             status: "unlocked",  unlockedAt: "2025-11-02" },
  { id: "event_vol",    name: "Event Volunteer", icon: "🎪", points: 60,  desc: "Host or help an event.",             status: "locked" },
];

/* ========= UI ========= */
function ProgressBar({ value, max }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ width: "100%", height: 10, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          backgroundImage: "linear-gradient(90deg,#f59e0b,#f97316,#ef4444)",
          boxShadow: "0 0 8px rgba(245,158,11,0.35)",
          transition: "width .35s",
        }}
      />
    </div>
  );
}

function Pill({ children, tone = "default" }) {
  const tones = {
    default: { bg: "#F1F5F9", bd: "#E2E8F0", color: "#334155" },
    // Reached 改为金色荣耀风
    reached: { bg: "#FEF3C7", bd: "#FDE68A", color: "#92400E" },
    next:    { bg: "#EEF2FF", bd: "#C7D2FE", color: "#4338CA" },
  };
  const t = tones[tone] ?? tones.default;
  return (
    <span
      style={{
        fontSize: 12,
        padding: "2px 8px",
        borderRadius: 999,
        background: t.bg,
        border: `1px solid ${t.bd}`,
        color: t.color,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

/* ========= Level Progress ========= */
function LevelProgressPanel({ totalPoints }) {
  const top = LEVELS[LEVELS.length - 1].threshold;
  const next = LEVELS.find((l) => totalPoints < l.threshold);
  return (
    <div
      style={{
        marginTop: 8,
        marginBottom: 16,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "12px 16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "#6b7280", fontSize: 14 }}>Glory Path Progress</span>
        <span style={{ color: "#6b7280", fontSize: 14 }}>
          {Math.min(totalPoints, top)} / {top} pts
        </span>
      </div>
      <ProgressBar value={totalPoints} max={top} />
      <div style={{ marginTop: 8, color: "#6b7280", fontSize: 14 }}>
        {next ? (
          <>
            Need <b>{next.threshold - totalPoints}</b> pts to reach <b>{next.name}</b>
          </>
        ) : (
          "You’ve reached the highest level 🎉"
        )}
      </div>
    </div>
  );
}

/* ========= Titles ========= */
function LevelRail({ points }) {
  const next = LEVELS.find((l) => points < l.threshold);
  return (
    <div>
      <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 8 }}>Titles</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {LEVELS.map((lv) => {
          const reached = points >= lv.threshold;
          const isNext = next && next.id === lv.id;
          return (
            <div
              key={lv.id}
              style={{
                padding: 12,
                borderRadius: 12,
                background: "#FFFFFF",
                border: `2px solid ${
                  reached ? "#F59E0B" : isNext ? "#6366F1" : "#E5E7EB"
                }`,
                boxShadow: isNext
                  ? "0 2px 8px rgba(99,102,241,0.20)"
                  : reached
                  ? "0 2px 8px rgba(245,158,11,0.18)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 22, opacity: reached ? 1 : 0.85 }}>{lv.icon}</div>
                {reached ? (
                  <Pill tone="reached">Reached</Pill>
                ) : isNext ? (
                  <Pill tone="next">Next</Pill>
                ) : (
                  <Pill>Locked</Pill>
                )}
              </div>
              <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>{lv.name}</div>
              <div style={{ color: "#6B7280", fontSize: 13, marginTop: 2 }}>Reward: {lv.reward}</div>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 6 }}>XP ≥ {lv.threshold}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ========= AchievementsRow（Glory Path 页签） ========= */
function AchievementsRow() {
  const items = ACHIEVEMENTS;

  const fmtDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return isNaN(dt.getTime())
      ? "—"
      : dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
  };

  const wrapper = {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "min-content",
    gap: 24,
    overflowX: "auto",
    padding: "12px 4px 8px",
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
  };
  const hideBar = `.achv-row::-webkit-scrollbar { display: none; }`;
  const cardW = 170;

  return (
    <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
      <h2
        style={{
          fontSize: "1.4rem",
          fontWeight: 900,
          margin: "0 0 10px 0",
          backgroundImage: "linear-gradient(90deg,#f59e0b,#f97316,#ef4444)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 10px rgba(245,158,11,0.15)",
        }}
      >
        Glory Path 🏆
      </h2>

      <style>{hideBar}</style>
      <div className="achv-row" style={wrapper}>
        {items.map((a) => (
          <div key={a.id} style={{ width: cardW, scrollSnapAlign: "start" }}>
            <div style={{ borderRadius: 16, background: "#fff" }}>
              {a.image ? (
                <img
                  src={a.image}
                  alt={a.name}
                  style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 16 }}
                />
              ) : (
                <div
                  aria-label={a.name}
                  style={{
                    width: "100%",
                    height: 120,
                    borderRadius: 16,
                    background: "#f9fafb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                  }}
                >
                  {a.icon ?? "🏅"}
                </div>
              )}
            </div>

            <div style={{ textAlign: "center", padding: "10px 10px 12px" }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#111827",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {a.name ?? "Achievement"}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{fmtDate(a.unlockedAt)}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#b45309", marginTop: 4 }}>
                +{a.points ?? 0} pts
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========= Scoring ========= */
const POST_POINTS = {
  basePost: 5,
  likeBonus: 1,
  tagBonus: { Study: 10, Help: 12, Life: 8, Marketplace: 6, Default: 5 },
};
function pointsForPost(p) {
  const tagBonus = POST_POINTS.tagBonus[p.tag] ?? POST_POINTS.tagBonus.Default;
  const likePts = (p.likes ?? 0) * POST_POINTS.likeBonus;
  return POST_POINTS.basePost + tagBonus + likePts;
}

const HISTORY_POINTS = {
  perComment: 3,
  perLikeOnMyComment: 2,
  opLikedBonus: 8,
  acceptedBonus: 20,
  capPerPost: 60,
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

  const myPosts = [
    { id: 1, title: "Math tutoring session this weekend!", tag: "Study", likes: 12 },
    { id: 2, title: "Selling used iPad Air 4", tag: "Marketplace", likes: 8 },
  ];

  const historyPosts = [
    {
      id: 101,
      title: "Lost keys at the library",
      tag: "Help",
      time: "2 hours ago",
      myComments: 2,
      likesOnMyComments: 5,
      opLiked: true,
      accepted: false,
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
      accepted: true,
    },
  ];

  const tabs = [
    { key: "achievements", label: "Glory Path", content: <AchievementsRow /> },
    {
      key: "myPosts",
      label: "My Posts",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {myPosts.map((p) => {
            const xp = pointsForPost(p);
            return (
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
                      background: "#FEF3C7",
                      color: "#92400E",
                      fontWeight: 800,
                      padding: "2px 10px",
                      borderRadius: 999,
                      border: "1px solid #FDE68A",
                    }}
                  >
                    {p.tag}
                  </span>
                  <span style={{ fontWeight: 700 }}>{p.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#6b7280" }}>
                  <span>❤️ {p.likes}</span>
                  <span
                    style={{
                      fontWeight: 800,
                      color: "#b45309",
                      background: "#FFF7ED",
                      border: "1px solid #FED7AA",
                      padding: "2px 10px",
                      borderRadius: 999,
                    }}
                  >
                    +{xp} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: "history",
      label: "History",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {historyPosts.map((p) => {
            const xp = pointsForHistory(p);
            return (
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
                      background: "#EEF2FF",
                      color: "#4338ca",
                      fontWeight: 800,
                      padding: "2px 10px",
                      borderRadius: 999,
                      border: "1px solid #C7D2FE",
                    }}
                  >
                    {p.tag}
                  </span>
                  <span style={{ fontWeight: 700 }}>{p.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>{p.time}</span>
                  <span title="Likes on your comments" style={{ color: "#6b7280" }}>
                    ❤️ {p.likesOnMyComments}
                  </span>
                  {p.opLiked && <span title="Post owner liked your comment">👑 OP liked</span>}
                  {p.accepted && <span title="Your comment was accepted">🏅 Accepted</span>}
                  <span
                    style={{
                      fontWeight: 800,
                      color: "#92400E",
                      background: "#FEF3C7",
                      border: "1px solid #FDE68A",
                      padding: "2px 10px",
                      borderRadius: 999,
                    }}
                  >
                    +{xp} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        background: "#fafafa",
        minHeight: "100vh",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "1.5rem 2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                <div style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: 4 }}>Username</div>
                <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>user@example.com</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              {/* 当前称号：Glory Path 金色风格 */}
              <span
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  backgroundImage: "linear-gradient(90deg,#f59e0b,#f97316,#ef4444)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  textShadow: "0 0 10px rgba(245,158,11,0.2)",
                  letterSpacing: 0.3,
                }}
                title="Current Title"
              >
                {title}
              </span>
              <span style={{ fontSize: "1rem", color: "#6b7280" }}>{totalPoints} pts</span>
            </div>
          </div>
        </div>

        {/* Tabs + Level Progress + Titles + Content */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "1.5rem 2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 60, marginBottom: 10 }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                style={{
                  minWidth: 180,
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  border: active === t.key ? "2px solid #f59e0b" : "1px solid #e5e7eb",
                  background: active === t.key ? "#FFFBEB" : "#fff",
                  fontWeight: 700,
                  color: active === t.key ? "#92400E" : "#374151",
                  cursor: "pointer",
                  transition: "all .2s",
                  boxShadow:
                    active === t.key
                      ? "0 2px 8px rgba(245,158,11,0.25)"
                      : "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <LevelProgressPanel totalPoints={totalPoints} />
          <LevelRail points={totalPoints} />

          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, minHeight: 220 }}>
            {(tabs.find((t) => t.key === active) || tabs[0]).content}
          </div>
        </div>
      </div>
    </main>
  );
}
