// src/pages/SignUpPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignUpPage() {
  const nav = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const next = params.get("next") || "/";
  const { signUp } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signUp({ email, password: pwd, confirm, username });
      nav(next, { replace: true });
    } catch (e) {
      setErr(e?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="page-container" style={{ maxWidth: 520 }}>
        <div className="panel">
          <h1 className="panel-title">Create your account</h1>
          <div className="panel-body">
            {err && (
              <div className="comment" style={{ borderColor: "#fecaca", background: "#fee2e2" }}>
                <strong style={{ color: "#991b1b" }}>{err}</strong>
              </div>
            )}
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
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
                {loading ? "Creating..." : "Sign up"}
              </button>
            </form>

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
