import { useEffect, useState } from "react";
import { api } from "../api.js";
import TableGrid from "./TableGrid.jsx";
import Ticket from "./Ticket.jsx";

export default function ReserveTable({ token }) {
  const [tables, setTables] = useState([]);
  const [mine, setMine] = useState([]);
  const [selected, setSelected] = useState(null);
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState("1:00 PM");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function refresh() {
    api.getTables().then(setTables);
    api.myReservations(token).then(setMine);
  }

  useEffect(refresh, [token]);

  async function confirm() {
    if (!selected) { setError("ஒரு மேசையைத் தேர்ந்தெடுக்கவும் — please pick a table."); return; }
    setBusy(true);
    setError("");
    try {
      await api.reserveTable(token, { tableId: selected._id, guests, time });
      setSelected(null);
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2 className="section-title"><span className="tam">மேசை பதிவு செய்யவும்</span>Reserve a Table</h2>
        <div className="section-sub">Pick a free table, choose a time — instant confirmation.</div>
        <TableGrid tables={tables} selectedId={selected?._id} onSelect={setSelected} interactive />
        <div style={{ marginTop: 22, maxWidth: 320 }}>
          <div className="field">
            <label>Number of guests / நபர்கள்</label>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Preferred time / நேரம்</label>
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              {["12:30 PM", "1:00 PM", "1:30 PM", "7:30 PM", "8:00 PM", "8:30 PM"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="error">{error}</div>
          <button className="stamp-btn primary" style={{ width: "100%" }} disabled={busy} onClick={confirm}>
            {busy ? "Confirming…" : "Confirm · உறுதி செய்யவும்"}
          </button>
        </div>
      </div>

      {mine.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {mine.map((r) => (
            <Ticket
              key={r._id}
              token={r.token}
              meta={`Table ${r.tableNumber} · ${r.guests} guests · ${r.time}`}
              stampText={r.status === "confirmed" ? "CONFIRMED" : "CANCELLED"}
              leafStamp={r.status === "confirmed"}
            >
              <div>Status: <b>{r.status === "confirmed" ? "Confirmed / உறுதி" : "Cancelled"}</b></div>
            </Ticket>
          ))}
        </div>
      )}
    </>
  );
}
