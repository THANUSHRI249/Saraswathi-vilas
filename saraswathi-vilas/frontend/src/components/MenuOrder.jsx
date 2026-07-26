import { useEffect, useState } from "react";
import { api } from "../api.js";

const CAT_TAM = { Tiffen: "டிபன்", Meals: "சாப்பாடு", Beverages: "குடிபானம்", Sweets: "இனிப்பு" };

export default function MenuOrder({ token, onOrderPlaced }) {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMenu().then((items) => { setMenu(items); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const categories = [...new Set(menu.map((m) => m.category))];

  function changeQty(id, delta) {
    setCart((prev) => {
      const cur = (prev[id] || 0) + delta;
      const next = { ...prev };
      if (cur <= 0) delete next[id]; else next[id] = cur;
      return next;
    });
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.find((m) => m._id === id);
    return item ? sum + item.price * qty : sum;
  }, 0);

  async function placeOrder() {
    setPlacing(true);
    setError("");
    try {
      const items = Object.entries(cart).map(([menuItemId, quantity]) => ({ menuItemId, quantity }));
      await api.placeOrder(token, items);
      setCart({});
      onOrderPlaced();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (loading) return <div className="loading-note">மெனுவை ஏற்றுகிறோம்… loading menu…</div>;

  return (
    <>
      <div className="card">
        <h2 className="section-title"><span className="tam">இன்றைய மெனு</span>Today's Menu</h2>
        <div className="section-sub">அனைத்தும் தூய சைவம் — 100% pure vegetarian</div>
        {categories.map((cat) => (
          <div className="menu-cat" key={cat}>
            <h3><span className="tam">{CAT_TAM[cat] || cat}</span>{cat}</h3>
            {menu.filter((m) => m.category === cat).map((item) => (
              <div className="menu-item" key={item._id}>
                <div>
                  <div className="mi-name"><span className="veg-dot"></span><span className="tam">{item.nameTamil}</span>{item.nameEnglish}</div>
                  {item.description && <div className="mi-desc">{item.description}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="mi-price">₹{item.price}</div>
                  <div className="qty-box">
                    <button onClick={() => changeQty(item._id, -1)}>−</button>
                    <span>{cart[item._id] || 0}</span>
                    <button onClick={() => changeQty(item._id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        {error && <div className="error">{error}</div>}
      </div>
      {cartCount > 0 && (
        <div className="cart-bar">
          <div><b>{cartCount} item(s)</b> &nbsp; மொத்தம் ₹{cartTotal}</div>
          <button className="stamp-btn primary" disabled={placing} onClick={placeOrder}>
            {placing ? "Placing…" : "Place Order · ஆர்டர் செய்யவும்"}
          </button>
        </div>
      )}
    </>
  );
}
