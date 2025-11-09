// src/pages/SignUpPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function SignUpPage() {
  const nav = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const next = params.get("next") || "/signin";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState(""); // ✅ 新增验证码输入框
  const [step, setStep] = useState(1);  // ✅ 控制步骤：1=注册, 2=输入验证码
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 第一步：发送验证码
  async function handleRegister(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      if (pwd !== confirm) throw new Error("Passwords do not match");

      const res = await axios.post("http://127.0.0.1:8000/auth/register", {
        email,
        password: pwd,
      });

      alert(res.data.message || "Verification code sent!");
      setStep(2); // 转到输入验证码阶段
    } catch (e) {
      setErr(e?.response?.data?.detail || e?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  }

  // ✅ 第二步：验证验证码 + 上传用户数据
  async function handleVerify(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // 验证 6 位验证码
      const res = await axios.post("http://127.0.0.1:8000/auth/verify", {
        email,
        code,
      });

      alert(res.data.message || "Email verified!");

      // 邮箱验证成功后，将用户信息写入 MongoDB 用户表
      await axios.post("http://127.0.0.1:8000/api/users", {
        email,
        username,
        credits: 0,
        post_count: 0,
        achievements: {
          "first_post": False,
          "ten_posts": False,
          "first_like": False,
          "hundred_like": False,
          "first_help": False,
          "ten_help": False,
        },
      });

      alert("✅ Registration complete!");
      nav(next, { replace: true });
    } catch (e) {
      setErr(String(e?.response?.data?.detail || e?.message || "Verification failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="page-container" style={{ maxWidth: 520 }}>
        <div className="panel">
          <h1 className="panel-title">
            {step === 1 ? "Create your account" : "Verify your email"}
          </h1>

          <div className="panel-body">
            {err && (
              <div
                className="comment"
                style={{ borderColor: "#fecaca", background: "#fee2e2" }}
              >
                <strong style={{ color: "#991b1b" }}>{err}</strong>
              </div>
            )}

            {step === 1 ? (
              /* ---------- Step 1: 注册表单 ---------- */
              <form onSubmit={handleRegister} style={{ display: "grid", gap: 10 }}>
                <label>
                  <div className="muted" style={{ marginBottom: 6 }}>Username</div>
                  <input
                    className="composer-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your display name"
                    required
                  />
                </label>

                <label>
                  <div className="muted" style={{ marginBottom: 6 }}>Email (@umass.edu)</div>
                  <input
                    type="email"
                    className="composer-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <label>
                  <div className="muted" style={{ marginBottom: 6 }}>Password</div>
                  <input
                    type="password"
                    className="composer-input"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    required
                  />
                </label>

                <label>
                  <div className="muted" style={{ marginBottom: 6 }}>Confirm password</div>
                  <input
                    type="password"
                    className="composer-input"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </label>

                <button className="btn-primary" disabled={loading}>
                  {loading ? "Sending..." : "Send verification code"}
                </button>
              </form>
            ) : (
              /* ---------- Step 2: 验证邮箱 ---------- */
              <form onSubmit={handleVerify} style={{ display: "grid", gap: 10 }}>
                <p style={{ color: "#374151" }}>
                  We've sent a 6-digit verification code to <b>{email}</b>.  
                  Please check your inbox.
                </p>

                <label>
                  <div className="muted" style={{ marginBottom: 6 }}>Verification Code</div>
                  <input
                    className="composer-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                </label>

                <button className="btn-primary" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Complete"}
                </button>
              </form>
            )}

            <div style={{ marginTop: 12, fontSize: 14 }}>
              Already have an account?{" "}
              <Link to={`/signin?next=${encodeURIComponent(next)}`} className="btn-link">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
