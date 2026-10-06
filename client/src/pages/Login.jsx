import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";
import { API_BASE } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        if (data.token) {
          localStorage.setItem("autobill_token", data.token);
        }
        if (data.user) {
          localStorage.setItem("autobill_user", JSON.stringify(data.user));
        } else {
          localStorage.setItem(
            "autobill_user",
            JSON.stringify({ name: form.name || "Admin", email: form.email, role: "Administrator" })
          );
        }
        navigate("/dashboard");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch {
      // Fallback for offline/demo
      localStorage.setItem(
        "autobill_user",
        JSON.stringify({ name: form.name || "Admin", email: form.email || "admin@autobill.com", role: "Administrator" })
      );
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem(
      "autobill_user",
      JSON.stringify({ name: "Admin", email: "admin@autobill.com", role: "Administrator" })
    );
    navigate("/dashboard");
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card card-shadow">
        <div className="login-brand">
          <div className="logo-icon-lg"><Receipt size={28} /></div>
          <h2>AutoBill</h2>
          <p>Automated Billing & Inventory Management</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="auth-tab-switch">
          <button
            type="button"
            className={!isRegister ? "active" : ""}
            onClick={() => setIsRegister(false)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={isRegister ? "active" : ""}
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Admin Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@autobill.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In to AutoBill"}
          </button>
        </form>

        <div className="demo-login-divider">
          <span>or continue instantly</span>
        </div>

        <button type="button" className="demo-login-btn" onClick={handleDemoLogin}>
          One-Click Demo Login (Admin)
        </button>
      </div>
    </div>
  );
}
