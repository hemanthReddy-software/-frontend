import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.post("/auth/register", form);
      sessionStorage.setItem("verificationEmail", form.email);
      setMessage(res.data.message);
      setTimeout(() => navigate("/verify-email"), 700);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Create your account">
      <form onSubmit={submit}>
        <label>Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />
        <label>Password</label>
        <input
          type="password"
          required
          minLength="8"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="At least 8 characters"
        />
        <button>Create account</button>
        {message && <p className="notice">{message}</p>}
      </form>
      <p className="auth-link">Already registered? <Link to="/login">Login</Link></p>
    </AuthLayout>
  );
}

function AuthLayout({ title, children }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">AI Chat</div>
        <h1>{title}</h1>
        <p className="muted">Secure AI conversations with email verification.</p>
        {children}
      </section>
    </main>
  );
}
