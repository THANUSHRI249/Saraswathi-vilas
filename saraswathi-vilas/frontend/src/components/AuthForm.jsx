import { useState } from "react";
import { api } from "../api.js";

export default function AuthForm({ role, onBack, onAuthed }) {
  const [mode, setMode] = useState(role === "guest" ? "register" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isGuest = role === "guest";

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password || (mode === "register" && !name)) {
      setError("தயவுசெய்து அனைத்து விவரங்களையும் நிரப்பவும் — please fill in all fields.");
      return;
    }
    setBusy(true);
    try {
      const data = mode === "register" ? await api.register(name, email, password) : await api.login(email, password);
      if (!isGuest && data.user.role !== "staff") {
        setError("This login is not a staff account.");
        setBusy(false);
        return;
      }
      onAuthed(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <button className="back-link" onClick={onBack}>← Back</button>
      <h2 className="section-title">
        <span className="tam">{isGuest ? "உங்கள் கணக்கு" : "பணியாளர் நுழைவு"}</span>
        {isGuest ? (mode === "register" ? "Create Guest Account" : "Guest Login") : "Staff Login"}
      </h2>
      <div className="section-sub">
        {isGuest
          ? "Quick sign up with just your name, email and a password."
          : "Kitchen & front-desk access only."}
      </div>
      <form onSubmit={submit}>
        {mode === "register" && (
          <div className="field">
            <label>Your name / உங்கள் பெயர்</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Meenakshi" maxLength={30} />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <div className="error">{error}</div>
        <button className="stamp-btn primary" style={{ width: "100%" }} disabled={busy} type="submit">
          {busy ? "Please wait…" : mode === "register" ? "வாங்க! உள்ளே வாருங்கள் — Sign Up" : "உள்நுழையவும் — Log In"}
        </button>
      </form>
      {isGuest && (
        <div className="hint" style={{ cursor: "pointer" }} onClick={() => setMode(mode === "register" ? "login" : "register")}>
          {mode === "register" ? "Already have an account? Log in" : "New here? Create an account"}
        </div>
      )}
      {!isGuest && <div className="hint">Demo credentials — email: <b>staff@saraswathivilas.com</b> · password: <b>staff123</b></div>}
    </div>
  );
}
