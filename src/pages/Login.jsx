import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);
      navigate("/chat");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">AI Chat</div>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to continue your conversations.</p>
        <form onSubmit={submit}>
          <label>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <label>Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button>Login</button>
          {message && <p className="error">{message}</p>}
        </form>
        <p className="auth-link">New here? <Link to="/register">Create account</Link></p>
      </section>
    </main>
  );
}
