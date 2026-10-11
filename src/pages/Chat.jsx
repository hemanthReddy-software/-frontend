import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat/message", {
        chatId,
        message: text
      });

      setChatId(res.data.chatId);
      setMessages((m) => [...m, { role: "assistant", content: res.data.message }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: err.response?.data?.message || "Something went wrong." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <button className="new-chat" onClick={() => {
          setChatId(null);
          setMessages([{ role: "assistant", content: "New chat started. How can I help?" }]);
        }}>+ New chat</button>

        <div className="sidebar-spacer" />

        <div className="account">
          <div>{localStorage.getItem("email")}</div>
          <button onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">AI Chat</header>

        <section className="messages">
          {messages.map((msg, i) => (
            <div className={`message-row ${msg.role}`} key={i}>
              <div className="avatar">{msg.role === "user" ? "U" : "AI"}</div>
              <div className="message-content">
                {msg.role === "assistant"
                  ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                  : msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-row assistant">
              <div className="avatar">AI</div>
              <div className="message-content typing">Thinking...</div>
            </div>
          )}
        </section>

        <section className="composer-wrap">
          <div className="composer">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message AI..."
              rows="1"
            />
            <button onClick={send} disabled={loading || !input.trim()}>↑</button>
          </div>
          <small>AI can make mistakes. Check important information.</small>
        </section>
      </main>
    </div>
  );
}
