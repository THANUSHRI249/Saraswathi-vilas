import { useEffect, useState } from "react";
import { api } from "../api.js";
import Ticket from "./Ticket.jsx";

const STEPS = [
  { key: "received", label: "Received" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "served", label: "Served" }
];

export default function TrackOrder({ token, refreshSignal }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.myOrders(token).then((data) => { setOrders(data); setLoading(false); });
  }, [token, refreshSignal]);

  // Poll every 5s so a guest sees "Ready" the moment staff updates it, without a manual refresh.
  useEffect(() => {
    const id = setInterval(() => { api.myOrders(token).then(setOrders); }, 5000);
    return () => clearInterval(id);
  }, [token]);

  if (loading) return <div className="loading-note">ஏற்றுகிறோம்… loading…</div>;

  return (
    <div>
      <div className="card">
        <h2 className="section-title"><span className="tam">உங்கள் ஆர்டர்கள்</span>Track My Order</h2>
        <div className="section-sub">Live status, updated by our kitchen staff.</div>
        {orders.length === 0 && <div className="empty-note">இன்னும் ஆர்டர் இல்லை — no orders yet. Head to the Menu tab!</div>}
      </div>

      {orders.map((o) => {
        const stepIdx = STEPS.findIndex((s) => s.key === o.status);
        return (
          <Ticket key={o._id} token={o.token} meta={`Placed at ${new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}>
            <div className="tk-items">
              {o.items.map((it, i) => (
                <div key={i}><span>{it.name} × {it.quantity}</span><span>₹{it.price * it.quantity}</span></div>
              ))}
            </div>
            <div className="tk-total">Total: ₹{o.total}</div>
            <div className="status-row">
              {STEPS.map((s, i) => (
                <div key={s.key} className={`status-pill ${i < stepIdx ? "done" : i === stepIdx ? "active" : ""}`}>{s.label}</div>
              ))}
            </div>
            {o.status === "ready" && (
              <div className="ready-banner">
                <span className="bell">🔔</span> Your order is ready!
                <span className="tam">உங்கள் ஆர்டர் தயார்! வாங்க எடுத்துக்கோங்க!</span>
              </div>
            )}
            {o.status === "served" && (
              <div className="hint" style={{ marginTop: 10 }}>சாப்பிட்டீர்களா? நன்றி வணக்கம் 🙏 — enjoy your meal!</div>
            )}
          </Ticket>
        );
      })}
    </div>
  );
}
