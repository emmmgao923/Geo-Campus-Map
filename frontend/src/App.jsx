// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import MapPage from "./pages/MapPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AchievementPopup from "./components/AchievementPopup.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import axios from "axios";

/* ========= 子组件：包含轮询逻辑 ========= */
function AppContent() {
  const { user } = useAuth(); // ✅ 从 context 获取当前登录用户
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    if (!user?.email) return; // ✅ 没登录就不轮询

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/achievements/latest?user_id=${user.email}`
        );
        if (res.data.unlocked) {
          const newAch = res.data.data[0];
          setAchievement(newAch);
          setTimeout(() => setAchievement(null), 4000);
        }
      } catch (err) {
        console.error("Achievement check failed:", err);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
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
