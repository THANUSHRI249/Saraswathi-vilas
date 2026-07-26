import { useState } from "react";
import MenuOrder from "./MenuOrder.jsx";
import ReserveTable from "./ReserveTable.jsx";
import TrackOrder from "./TrackOrder.jsx";

const TABS = [
  { key: "menu", tam: "மெனு", en: "Order" },
  { key: "reserve", tam: "மேசை பதிவு", en: "Reserve Table" },
  { key: "track", tam: "ஆர்டர் நிலை", en: "Track Order" }
];

export default function GuestApp({ user, token, onLogout }) {
  const [view, setView] = useState("menu");
  const [trackRefresh, setTrackRefresh] = useState(0);

  return (
    <div>
      <div className="topbar">
        <div className="who">
          Vanakkam, {user.name}!
          <span className="tam">இன்று என்ன சாப்பிடலாம்?</span>
        </div>
        <button className="stamp-btn ghost" onClick={onLogout}>Log out</button>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <div key={t.key} className={`tab ${view === t.key ? "active" : ""}`} onClick={() => setView(t.key)}>
            <span className="tam">{t.tam}</span>{t.en}
          </div>
        ))}
      </div>

      {view === "menu" && <MenuOrder token={token} onOrderPlaced={() => { setTrackRefresh((n) => n + 1); setView("track"); }} />}
      {view === "reserve" && <ReserveTable token={token} />}
      {view === "track" && <TrackOrder token={token} refreshSignal={trackRefresh} />}
    </div>
  );
}
