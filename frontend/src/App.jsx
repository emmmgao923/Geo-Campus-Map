import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import MapPage from './pages/MapPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import PostDetailPage from './pages/PostDetailPage.jsx' 
import AchievementPopup from "./components/AchievementPopup.jsx";

export default function App() {
  const [achievement, setAchievement] = useState(null);
  const userId = localStorage.getItem("user_id");

  // 🕒 每8秒轮询一次后端，检查是否有新成就
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/achievements/latest?user_id=${userId}`
        );
        if (res.data.unlocked) {
          // 拿到新成就
          const newAch = res.data.data[0];
          setAchievement(newAch);
          // 4秒后自动关闭弹窗
          setTimeout(() => setAchievement(null), 4000);
        }
      } catch (err) {
        console.error("Achievement check failed:", err);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/post/:buildingId" element={<PostDetailPage />} /> {/* NEW */}
      </Routes>

      <AchievementPopup achievement={achievement} />
    </div>
  )
}