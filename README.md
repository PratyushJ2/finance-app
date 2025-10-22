# 💸 Finance Ledger App

A full-stack finance application featuring a **custom double-entry ledger**, user authentication, and real-time account balances. Built with **Node.js**, **Express**, **React**, and **Prisma**, this project allows users to securely manage financial accounts and balanced transactions through a clean and functional UI.

---

## ⚙️ Tech Stack

| Layer       | Technology               |
|-------------|---------------------------|
| **Frontend**| React, Vite, React Router |
| **Backend** | Node.js, Express, Prisma  |
| **Auth**    | JWT (Access + Refresh Tokens), Argon2 |
| **Database**| PostgreSQL                |

---

## 📦 Features

### ✅ Authentication
- Register & Login
- JWT-based access tokens
- Secure refresh tokens via HTTP-only cookies

### 📘 Accounts
- Create named financial accounts
- View accounts and their real-time balances

### 🔄 Transactions
- Add **multi-entry** transactions (debit/credit)
- Backend enforces **double-entry** balance
- Track transaction history

### 🔐 Auth Flow
- Tokens automatically refreshed via frontend logic
- Protected routes & fetch calls using custom React hook

---

## 🗂️ Folder Structure  
├── backend/  
│ ├── index.js # Express server + Prisma setup  
│ └── schema.prisma # Prisma DB schema  
│  
├── frontend/  
│ ├── pages/ # Page components  
│ ├── Context/ # AuthContext logic  
│ ├── hooks/ # useAuthenticatedFetch hook  
│ ├── utils/ # refreshAccessToken helper  
│ ├── App.jsx # Routes and layout  
│ └── vite.config.js # Proxy setup for dev  


---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/finance-ledger-app.git
cd finance-ledger-app
```
### 2. Backend Setup (/backend)
```bash
Install dependencies
cd backend
npm install

Create .env
DATABASE_URL=postgresql://user:password@localhost:5432/ledgerdb
JWT_SECRET=your_jwt_secret
PORT=3000

Run migrations
npx prisma migrate dev --name init

Start the backend server
npm start
```

### 3. Frontend Setup (/frontend)
```bash
Install dependencies
cd ../frontend
npm install

Start the frontend server
npm run dev
```

📃 License
This project is open-sourced under the MIT License

