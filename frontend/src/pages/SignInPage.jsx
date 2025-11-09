// src/pages/SignInPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignInPage() {
  const nav = useNavigate();
  const { search } = useLocation();
  const { signIn } = useAuth();
  const params = new URLSearchParams(search);
  const next = params.get("next") || "/";

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signIn({ email, password: pwd });
      nav(next, { replace: true });
    } catch (e) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="page-container" style={{ maxWidth: 480 }}>
        <div className="panel">
          <h1 className="panel-title">Sign in</h1>
          <div className="panel-body">
            {err && (
              <div className="comment" style={{ borderColor: "#fecaca", background: "#fee2e2" }}>
                <strong style={{ color: "#991b1b" }}>{err}</strong>
              </div>
            )}
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
              <label>
                <div className="muted" style={{ marginBottom: 6 }}>Email(@umass.edu)</div>
                <input
                  className="composer-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
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
              <button className="btn-primary" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <div style={{ marginTop: 12, fontSize: 14 }}>
              No account?{" "}
              <Link to={`/signup?next=${encodeURIComponent(next)}`} className="btn-link">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
