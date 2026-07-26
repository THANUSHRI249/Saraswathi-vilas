import { useEffect, useState } from "react";
import { api } from "../api.js";

const NEXT_LABEL = { received: "Start Preparing", preparing: "Mark Ready", ready: "Mark Served" };

export default function StaffOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function refresh() {
    api.allOrders(token).then((data) => { setOrders(data); setLoading(false); });
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 6000);
    return () => clearInterval(id);
  }, [token]);

  async function advance(id) {
    await api.advanceOrder(token, id);
    refresh();
  }

  if (loading) return <div className="loading-note">Loading orders…</div>;

  return (
    <div className="card">
      <h2 className="section-title"><span className="tam">அனைத்து ஆர்டர்கள்</span>All Orders</h2>
      {orders.length === 0 ? (
        <div className="empty-note">No orders yet.</div>
      ) : (
        <table className="staff-table">
          <thead><tr><th>Token</th><th>Guest</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o.token}</td>
                <td>{o.guestName}</td>
                <td>{o.items.map((it) => `${it.name} ×${it.quantity}`).join(", ")}</td>
                <td>₹{o.total}</td>
                <td><span className="status-pill active">{o.status}</span></td>
                <td>
                  {NEXT_LABEL[o.status]
                    ? <button className="stamp-btn small primary" onClick={() => advance(o._id)}>{NEXT_LABEL[o.status]}</button>
                    : "✓ Done"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
