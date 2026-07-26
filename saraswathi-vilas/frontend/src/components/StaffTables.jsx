import { useEffect, useState } from "react";
import { api } from "../api.js";
import TableGrid from "./TableGrid.jsx";

export default function StaffTables({ token }) {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);

  function refresh() {
    api.getTables().then(setTables);
    api.allReservations(token).then(setReservations);
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 6000);
    return () => clearInterval(id);
  }, [token]);

  async function toggle(table) {
    const next = table.status === "free" ? "occupied" : "free";
    await api.updateTable(token, table._id, next);
    refresh();
  }

  return (
    <>
      <div className="card">
        <h2 className="section-title"><span className="tam">மேசை நிலை</span>Table Status</h2>
        <div className="section-sub">Tap a table to toggle Free ⇄ Occupied. Reservations are set by guests automatically.</div>
        <div className="table-grid">
          {tables.map((t) => (
            <div key={t._id} className={`table-card ${t.status}`} onClick={() => toggle(t)}>
              <div className="tnum">#{t.number}</div>
              <div className="cap">Seats {t.capacity}</div>
              <div className="st">{t.status === "free" ? "காலி Free" : t.status === "reserved" ? "முன்பதிவு" : "நிரம்பியது"}</div>
            </div>
          ))}
        </div>
      </div>

      {reservations.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <h2 className="section-title"><span className="tam">முன்பதிவுகள்</span>Reservations</h2>
          <table className="staff-table">
            <thead><tr><th>Token</th><th>Guest</th><th>Table</th><th>Guests</th><th>Time</th><th>Status</th></tr></thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>#{r.token}</td><td>{r.guestName}</td><td>#{r.tableNumber}</td><td>{r.guests}</td><td>{r.time}</td><td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
