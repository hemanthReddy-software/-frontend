import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function VerifyEmail() {
  const [email, setEmail] = useState(sessionStorage.getItem("verificationEmail") || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify", { email, code });
      setMessage(res.data.message);
      sessionStorage.removeItem("verificationEmail");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">AI Chat</div>
        <h1>Verify your email</h1>
        <p className="muted">Enter the 6-digit code sent to your email.</p>
        <form onSubmit={submit}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Verification code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            maxLength="6"
            placeholder="123456"
            required
          />
          <button>Verify email</button>
          {message && <p className="notice">{message}</p>}
        </form>
        <p className="auth-link"><Link to="/login">Back to login</Link></p>
      </section>
    </main>
  );
}
