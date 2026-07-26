# ஸரஸ்வதி விலாஸ் — Saraswathi Vilas
### Smart Restaurant Management System · VibeAthon 6.0 (2K26)

A vintage South Indian ("Udupi tiffin room") themed restaurant platform with guest ordering, table reservations, live order tracking, and a staff operations dashboard — built with the suggested full-stack tech, no third-party/AI APIs.

## Team Name
_(fill in your team name here)_

## Tech Stack
- **Frontend:** React 18 + Vite (plain CSS, no UI framework)
- **Backend:** Node.js + Express.js (REST API)
- **Database:** MongoDB with Mongoose
- **Authentication:** Email & Password with JWT (bcrypt password hashing) — no OAuth/OTP third-party services
- **AI Usage:** None — every feature (menu, cart, orders, reservations, sales stats) is computed from the app's own data
- **Deployment:** Deployable to Vercel/Netlify (frontend) + Render/Railway (backend) + MongoDB Atlas (database)
- **Version Control:** Git / GitHub

## User Stories Completed
- **Bronze — User Story 1:** Modern, distinct interface for both guests and staff, vintage South Indian visual identity with Tamil affirmations throughout.
- **Silver — User Stories 1–3:** Email/password authentication (JWT, role-based access for guest vs staff); digitized core workflows — digital menu, order placement, table reservation, order status/notifications.
- **Gold — User Stories 1–4:** Staff management dashboard covering Orders (live queue + status updates), Tables (occupancy management), and Sales (orders count, revenue, top item) — reduces manual coordination between kitchen, front desk, and customers.
- Platinum (AI-powered features) was intentionally left out of scope per project requirements.

## Project Structure
```
saraswathi-vilas/
├── backend/           Express API + MongoDB models
│   ├── config/        DB connection
│   ├── middleware/     JWT auth guard
│   ├── models/         User, MenuItem, Table, Order, Reservation, Counter
│   ├── routes/         auth, menu, tables, orders, reservations, stats
│   ├── seed.js         Seeds menu items, tables, and one staff account
│   └── server.js
└── frontend/          React (Vite) app
    └── src/
        ├── components/  Landing, AuthForm, GuestApp, StaffApp, ...
        ├── styles/       theme.css (vintage design system)
        ├── api.js        fetch wrapper for the backend
        └── App.jsx
```

## Running Locally

### 1. Backend
```bash
cd backend
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm install
npm run seed               # seeds menu, tables, and the staff login
npm run dev                # starts API on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env       # points to http://localhost:5000/api by default
npm install
npm run dev                 # starts app on http://localhost:5173
```

You'll need a MongoDB instance — either run `mongod` locally or use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its connection string into `backend/.env`.

## Logins
- **Guest:** Sign up with any name, email, and password — instant access.
- **Staff (seeded):** `staff@saraswathivilas.com` / `staff123`

## Notable Design Choices
- All state-changing actions (advancing an order's status, reserving a table) go through the Express API and persist in MongoDB — nothing is faked in the frontend.
- The guest "Track Order" and staff "Orders/Tables/Sales" views poll the API every few seconds, so a guest sees "🔔 Ready" moments after the kitchen marks it, without needing sockets/AI/push-notification services.
- Visual identity draws from real Udupi-hotel signage and order chits (dashed perforated "tickets", rotated stamp for status) rather than a generic dashboard look.

## Hosted Application Link
_(fill in after deployment)_
