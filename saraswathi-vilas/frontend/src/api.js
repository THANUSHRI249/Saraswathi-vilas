const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

export const api = {
  register: (name, email, password) => request("/auth/register", { method: "POST", body: { name, email, password } }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),

  getMenu: () => request("/menu"),
  getTables: () => request("/tables"),

  placeOrder: (token, items) => request("/orders", { method: "POST", token, body: { items } }),
  myOrders: (token) => request("/orders/mine", { token }),
  allOrders: (token) => request("/orders", { token }),
  advanceOrder: (token, id) => request(`/orders/${id}/advance`, { method: "PATCH", token }),

  reserveTable: (token, payload) => request("/reservations", { method: "POST", token, body: payload }),
  myReservations: (token) => request("/reservations/mine", { token }),
  allReservations: (token) => request("/reservations", { token }),

  updateTable: (token, id, status) => request(`/tables/${id}`, { method: "PATCH", token, body: { status } }),

  getStats: (token) => request("/stats", { token })
};
