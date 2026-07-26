import { useState } from "react";
import Landing from "./components/Landing.jsx";
import AuthForm from "./components/AuthForm.jsx";
import GuestApp from "./components/GuestApp.jsx";
import StaffApp from "./components/StaffApp.jsx";

// screen: "landing" | "guest-auth" | "staff-auth" | "guest-app" | "staff-app"
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [session, setSession] = useState(null); // { token, user }

  function handleAuthed(data) {
    setSession(data);
    setScreen(data.user.role === "staff" ? "staff-app" : "guest-app");
  }

  function logout() {
    setSession(null);
    setScreen("landing");
  }

  return (
    <div>
      <div className="kolam-strip"></div>
      <div className="wrap">
        <div className="brand">
          <div className="om">☙ ௐ ❧</div>
          <h1>ஸரஸ்வதி விலாஸ்</h1>
          <div className="sub">Saraswathi Vilas</div>
          <div className="est">Est. 1958 · Pure Vegetarian · Udupi Style Tiffin Room</div>
        </div>

        {screen === "landing" && (
          <Landing onGuest={() => setScreen("guest-auth")} onStaff={() => setScreen("staff-auth")} />
        )}

        {screen === "guest-auth" && (
          <AuthForm role="guest" onBack={() => setScreen("landing")} onAuthed={handleAuthed} />
        )}

        {screen === "staff-auth" && (
          <AuthForm role="staff" onBack={() => setScreen("landing")} onAuthed={handleAuthed} />
        )}

        {screen === "guest-app" && session && (
          <GuestApp user={session.user} token={session.token} onLogout={logout} />
        )}

        {screen === "staff-app" && session && (
          <StaffApp token={session.token} onLogout={logout} />
        )}

        <div className="footer-tam">சாப்பிட்டீர்களா? — நன்றி வணக்கம் 🙏</div>
      </div>
    </div>
  );
}
