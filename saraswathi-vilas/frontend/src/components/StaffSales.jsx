import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function StaffSales({ token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getStats(token).then(setStats);
    const id = setInterval(() => api.getStats(token).then(setStats), 8000);
    return () => clearInterval(id);
  }, [token]);

  if (!stats) return <div className="loading-note">Loading…</div>;

  return (
    <>
      <div className="stat-row">
        <div className="stat-box"><div className="num">{stats.totalOrders}</div><div className="lbl">Orders Today</div></div>
        <div className="stat-box"><div className="num">₹{stats.revenue}</div><div className="lbl">Revenue</div></div>
        <div className="stat-box"><div className="num">{stats.served}</div><div className="lbl">Served</div></div>
        <div className="stat-box"><div className="num" style={{ fontSize: "1.1rem" }}>{stats.topItem}</div><div className="lbl">Top Item</div></div>
      </div>
      <div className="card">
        <h2 className="section-title"><span className="tam">குறிப்பு</span>Note</h2>
        <div className="section-sub">Figures are computed live from MongoDB — no external analytics API used.</div>
      </div>
    </>
  );
}
