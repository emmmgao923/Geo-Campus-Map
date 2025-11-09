// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import MapPage from "./pages/MapPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AchievementPopup from "./components/AchievementPopup.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";   // ✅ 新增
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import axios from "axios";

/* ========= 子组件：包含轮询逻辑 ========= */
function AppContent() {
  const { user } = useAuth(); // ✅ 从 context 获取当前登录用户
  const [achievement, setAchievement] = useState(null);
  const userId = localStorage.getItem("user_id");
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(async () => {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/achievements/latest`,{params: {user_id: userId}}
      );
      if (res.data.unlocked) {
        const newAch = res.data.data[0];
        setAchievement(newAch);
        setTimeout(() => setAchievement(null), 4000);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [userId]);
  
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* ✅ 新增下面这一行，匹配帖子详情页 */}
        <Route path="/post/:buildingId" element={<PostDetailPage />} />
      </Routes>
      <AchievementPopup achievement={achievement} />
    </>
  );
}

/* ========= 主组件：包裹全局 AuthProvider ========= */
export default function App() {
  return (
    <div className="app">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}
