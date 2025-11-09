// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";


async function registerEmail({ email, password }) {
  const res = await axios.post("http://127.0.0.1:8000/auth/register", {
    email,
    password,
  });
  return res.data; // 返回 message: 验证码已发送
}

async function verifyCode({ email, code }) {
  const res = await axios.post("http://127.0.0.1:8000/auth/verify", {
    email,
    code,
  });
  return res.data; // 返回 message: 注册成功
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function signUp({ email, password, confirm, username }) {
    if (password !== confirm) {
      throw new Error("Passwords do not match");
    }
    // 这里可以对接你的验证码注册流程，或只是先存本地状态
    const newUser = { email, username };
    setUser(newUser);
    return newUser;
  }

  async function signIn({ email, password }) {
    const res = await axios.post("http://127.0.0.1:8000/auth/login", {
      email,
      password,
    });



    // 构造用户对象
    const profile = {
      email: email,
      username: email.split("@")[0],
      avatarLetter: email[0].toUpperCase(),
      token: res.data.access_token,
    };
    setUser(profile);

    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("user", profile);
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  // ✅ 页面刷新或重新加载时，从 localStorage 恢复用户状态
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        signUp,
        registerEmail, // 第一步
        verifyCode,    // 第二步
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
