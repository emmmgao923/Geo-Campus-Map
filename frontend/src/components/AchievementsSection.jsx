import React, { useMemo } from "react";
import firstPostImg from "../assets/1.png";

const ACHIEVEMENTS = [
  { id: 1, name: "First Post", icon: "🪶", threshold: 10, desc: "Publish your first post", reward: "Beginner Badge", points: 10, unlockedAt: "2025-11-05" },
  { id: 2, name: "Helper Lv.1", icon: "🔮", threshold: 200, desc: "Receive 10 likes on help posts", reward: "Colored Avatar Frame", points: 25 },
  { id: 3, name: "Contributor", icon: "🔥", threshold: 300, desc: "Post more than 5 times", reward: "1 Featured Post", points: 30 },
  { id: 4, name: "Master Mentor", icon: "👑", threshold: 1000, desc: "Help 20+ users", reward: "Special Frame", points: 50 },
  { id: 5, name: "Legend", icon: "🦄", threshold: 2000, desc: "Top 1% helper", reward: "Legend Title", points: 60 },
];

function ProgressBar({ value, max }) {
  const width = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
      <div className="h-full transition-all" style={{ background: "#6366f1", width: `${width}%` }} />
    </div>
  );
}

function fmtDate(d) {
  if (!d) return "—";
  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(date);
}

function guessPoints(a) {
  if (typeof a?.points === "number") return a.points;
  const t = a?.threshold ?? 0;
  if (t <= 50) return 10;
  if (t <= 200) return 25;
  if (t <= 500) return 30;
  if (t <= 1000) return 50;
  return 60;
}

export default function AchievementsSection({
  userXP = 0,
  items = ACHIEVEMENTS,
}) {
  // 标准化 + “First Post” 指定图片
  const rows = useMemo(() => {
    const norm = (s) => String(s ?? "").trim().toLowerCase();
    return (items ?? ACHIEVEMENTS).map((a) => {
      const isFirstById = a.id === 1 || norm(a.id) === "first_post" || norm(a.id) === "1";
      const isFirstByName = norm(a.name) === "first post";
      if (isFirstById || isFirstByName) return { ...a, image: firstPostImg };
      return a;
    });
  }, [items]);

  const maxXP = rows[rows.length - 1].threshold ?? 0;
  const next = useMemo(
    () => rows.find((a) => typeof a.threshold === "number" && userXP < a.threshold),
    [userXP, rows]
  );

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex items-end justify-between mb-2">
          <div className="text-sm text-gray-600">Level Progress</div>
          <div className="text-sm text-gray-600">
            {Math.min(userXP, maxXP)} / {maxXP} pts
          </div>
        </div>
        <ProgressBar value={userXP} max={maxXP} />
        <div className="mt-2 text-sm text-gray-600">
          {next ? (
            <>
              Need{" "}
              <span className="font-medium text-gray-800">
                {Math.max(0, next.threshold - userXP)}
              </span>{" "}
              pts to reach {next.name}
            </>
          ) : (
            "Maximum level reached 🎉"
          )}
        </div>
      </div>

      {/* Achievements strip：图片 + 下方三行；不再显示任何角标 */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {rows.map((a, idx) => {
            const unlocked = typeof a.threshold === "number" ? userXP >= a.threshold : false;
            const pts = guessPoints(a);
            const unlockedDate = unlocked ? fmtDate(a.unlockedAt) : "—";

            return (
              <div
                key={a.id ?? a.name ?? idx}
                className="w-[140px] shrink-0 rounded-xl border hover:shadow-sm transition-shadow bg-white"
              >
                {/* 只显示图片，无角标 */}
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

                {/* 下方三行：名称｜时间｜加分 */}
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
    </div>
  );
}
