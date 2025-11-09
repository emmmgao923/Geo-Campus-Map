import React, { useMemo } from "react";
import firstPostImg from "../assets/1.png";

/** Demo 数据（可被父组件 items 覆盖） */
const ACHIEVEMENTS = [
  { id: 1, name: "First Post", icon: "🪶", threshold: 10, desc: "Publish your first post", reward: "Beginner Badge", points: 10 },
  { id: 2, name: "Helper Lv.1", icon: "🔮", threshold: 200, desc: "Receive 10 likes on help posts", reward: "Colored Avatar Frame", points: 25 },
  { id: 3, name: "Contributor", icon: "🔥", threshold: 300, desc: "Post more than 5 times", reward: "1 Featured Post", points: 30 },
  { id: 4, name: "Master Mentor", icon: "👑", threshold: 1000, desc: "Help 20+ users", reward: "Special Frame", points: 50 },
  { id: 5, name: "Legend", icon: "🦄", threshold: 2000, desc: "Top 1% helper", reward: "Legend Title", points: 60 },
];

/** 简单日期格式化：优先用 a.unlockedAt（Date/时间戳/ISO 字符串），否则显示 "—" */
function fmtDate(d) {
  if (!d) return "—";
  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

/** 如果没提供 points，则根据 threshold 给一个保守推断值 */
function guessPoints(a) {
  if (typeof a?.points === "number") return a.points;
  const t = a?.threshold ?? 0;
  if (t <= 50) return 10;
  if (t <= 200) return 25;
  if (t <= 500) return 30;
  if (t <= 1000) return 50;
  return 60;
}

export default function AchievementStrip({
  userXP = 0,
  items = ACHIEVEMENTS,
}) {
  // 规范化 & 贴图（First Post 用你给的 1.png）
  const rows = useMemo(() => {
    const norm = (s) => String(s ?? "").trim().toLowerCase();
    return (items ?? ACHIEVEMENTS).map((a) => {
      const isFirstById =
        a.id === 1 || norm(a.id) === "first_post" || norm(a.id) === "1";
      const isFirstByName = norm(a.name) === "first post";
      if (isFirstById || isFirstByName) return { ...a, image: firstPostImg };
      return a;
    });
  }, [items]);

  return (
    <div className="rounded-2xl border bg-white p-4">
      {/* 横向可滚动的成就卡片条 */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {rows.map((a, idx) => {
          const unlocked = typeof a.threshold === "number"
            ? userXP >= a.threshold
            : false;

          const pts = guessPoints(a);
          // 仅在已解锁时显示时间；否则显示 "—"
          const unlockedDate = unlocked ? fmtDate(a.unlockedAt) : "—";

          return (
            <div
              key={a.id ?? a.name ?? idx}
              className="w-[140px] shrink-0 rounded-xl border hover:shadow-sm transition-shadow"
            >
              {/* 图片：不加任何角标 */}
              <div className="p-2">
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.name}
                    className={
                      "w-full h-[90px] object-contain rounded-lg " +
                      (unlocked ? "" : "grayscale opacity-60")
                    }
                  />
                ) : (
                  <div
                    className={
                      "w-full h-[90px] flex items-center justify-center text-3xl rounded-lg bg-gray-50 " +
                      (unlocked ? "" : "grayscale opacity-60")
                    }
                    aria-label={a.name}
                  >
                    {a.icon ?? "🏅"}
                  </div>
                )}
              </div>

              {/* 图片下方三行：名称｜时间｜加分 */}
              <div className="px-3 pb-3 text-center">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {a.name ?? "Achievement"}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {unlockedDate}
                </div>
                <div className="text-sm font-medium mt-0.5 text-indigo-600">
                  +{pts} pts
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
