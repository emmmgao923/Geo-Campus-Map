import React, { useMemo } from "react";

const ACHIEVEMENTS = [
  { id: 1, name: "First Post",     icon: "🪶", threshold: 10,   desc: "Published your first post",       reward: "新手徽章" },
  { id: 2, name: "Helper Lv.1",    icon: "🔮", threshold: 200,  desc: "Received 10 likes on help posts", reward: "彩色头像框" },
  { id: 3, name: "Contributor",    icon: "🔥", threshold: 300,  desc: "Posted more than 5 times",        reward: "置顶 1 次" },
  { id: 4, name: "Master Mentor",  icon: "👑", threshold: 1000, desc: "Helped 20+ users",                reward: "专属边框" },
  { id: 5, name: "Legend",         icon: "🦄", threshold: 2000, desc: "Top 1% helper",                   reward: "传奇称号" },
];

function ProgressBar({ value, max }) {
  const width = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
      <div className="h-full bg-indigo-500 transition-all" style={{ width: `${width}%` }} />
    </div>
  );
}

export default function AchievementsSection({ userXP = 0, items = ACHIEVEMENTS }) {
  const maxXP = items[items.length - 1].threshold;
  const next = useMemo(() => items.find(a => userXP < a.threshold), [userXP, items]);

  return (
    <div className="space-y-4">
      {/* 顶部进度条 */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex items-end justify-between mb-2">
          <div className="text-sm text-gray-600">Level Progress</div>
          <div className="text-sm text-gray-600">
            {Math.min(userXP, maxXP)} / {maxXP} pts
          </div>
        </div>
        <ProgressBar value={userXP} max={maxXP} />
        <div className="mt-2 text-sm text-gray-600">
          {next ? <>再获得 <span className="font-medium text-gray-800">{next.threshold - userXP}</span> 分即可解锁「{next.name}」</> : "已达最高等级 🎉"}
        </div>
      </div>

      {/* 列表样式，贴合你截图里的卡片行 */}
      <div className="rounded-2xl border bg-white">
        {items.map((a, idx) => {
          const unlocked = userXP >= a.threshold;
          return (
            <div
              key={a.id}
              className={"flex items-center gap-3 px-4 py-3 " + (idx ? "border-t" : "")}
            >
              <div className={"text-2xl select-none " + (unlocked ? "" : "grayscale opacity-60")}>
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-gray-900 truncate">{a.name}</div>
                  {unlocked ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Unlocked</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Locked</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{a.desc}</div>
                <div className="text-xs text-gray-500">奖励：{a.reward} · 解锁条件 XP ≥ {a.threshold}</div>
              </div>
              {/* 右侧状态/日期位（与你的UI对齐） */}
              <div className="text-sm text-gray-500 whitespace-nowrap">
                {unlocked ? "已获得" : `差 ${Math.max(0, a.threshold - userXP)} 分`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
