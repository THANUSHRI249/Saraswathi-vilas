import { useState } from "react";
import StaffOrders from "./StaffOrders.jsx";
import StaffTables from "./StaffTables.jsx";
import StaffSales from "./StaffSales.jsx";

const TABS = [
  { key: "orders", tam: "ஆர்டர்கள்", en: "Orders" },
  { key: "tables", tam: "மேசைகள்", en: "Tables" },
  { key: "sales", tam: "விற்பனை", en: "Sales" }
];

export default function StaffApp({ token, onLogout }) {
  const [view, setView] = useState("orders");

  return (
    <div>
      <div className="topbar">
        <div className="who">Vanakkam, Staff!<span className="tam">சமையலறை கட்டுப்பாடு</span></div>
        <button className="stamp-btn ghost" onClick={onLogout}>Log out</button>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <div key={t.key} className={`tab ${view === t.key ? "active" : ""}`} onClick={() => setView(t.key)}>
            <span className="tam">{t.tam}</span>{t.en}
          </div>
        ))}
      </div>

      {view === "orders" && <StaffOrders token={token} />}
      {view === "tables" && <StaffTables token={token} />}
      {view === "sales" && <StaffSales token={token} />}
    </div>
  );
}
