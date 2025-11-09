// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { user_id, username, token }
  const [loading, setLoading] = useState(true);

  // 启动时从 localStorage 读取
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const user_id = localStorage.getItem("user_id");
    if (token && user_id) setUser({ token, username, user_id });
    setLoading(false);
  }, []);

  async function signIn({ username_or_email, password }) {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/login", {
      username_or_email,
      password,
    });
    const { access_token, user_id, username } = res.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("username", username);
    setUser({ token: access_token, username, user_id });
  }

  async function signUp({ username, email, password, code }) {
    await axios.post("http://127.0.0.1:8000/api/auth/register", {
      username,
      email,
      password,
      code, // 邮箱验证码
    });
    alert("✅ 注册成功，请登录！");
  }

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
