# Pulse Token Dashboard

This is a simple project made using **React + Vite (frontend)** and **Express (backend)**.  
It shows mock token data with real-time price updates.  
You don’t need any database — everything runs locally.

---

## How to Run

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/pixel-perfect-pulse.git
cd pixel-perfect-pulse


### 2. Install dependencies

```bash
npm install
```

### 3. Start the project

```bash
npm run dev
```

You will see a message like:

```
[express] serving on port 5173
```

Then open your browser and go to:

```
http://localhost:5173/
```

---

## Project Info

* Frontend: React + Vite
* Backend: Express + WebSocket
* Port: 5173
* Node.js version: **18 or higher**

---

## Folder Structure

```
client/   → React frontend  
server/   → Express backend  
shared/   → Shared files (types, schema)
```

---

## Notes

* The app auto-generates fake token data.
* You can see live price changes (green/red flashes).
* No extra setup or database is needed.


