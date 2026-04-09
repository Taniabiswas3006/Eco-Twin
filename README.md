# 🌱 EcoTwin: Gamified Sustainability Dashboard

EcoTwin is a state-of-the-art **Digital Twin** focused on environmental tracking. It models a user's real-life behavioral data and visualizes their carbon footprint, energy consumption, and waste generation. By blending algorithms with interactive web features, EcoTwin translates abstract sustainability metrics into tangible, gamified financial and environmental insights.
hii
---

## 🚀 Key Features

### 1. The Interactive "What-If" Sandbox
The core of EcoTwin. Users interact with sliders to modify their daily habits (e.g., electricity use, AC hours, shopping trips, diet type) and instantly see the simulated impact on their Digital Twin's overall sustainability score.

### 2. Time-Travel Simulation Engine ⏳
A slider that lets users "fast forward" to 2050 to see their accumulated lifetime carbon generation based on their *current* habits. It vividly demonstrates the compounding effects of minor lifestyle choices.

### 3. The Dynamic Eco-Avatar 🌿🔥
A Tamagotchi-style companion that visually represents the overall health of the user's twin.
- **Thriving (Green Leaf):** Healthy, sustainable habits.
- **Struggling (Yellow Leaf):** Warning state.
- **Critical (Red Flame):** High carbon generation; particularly triggered when time-traveling into the deep future with unhealthy baseline habits.

### 4. Eco-Wallet Financial Estimator 💵
A highly unique psychology hook. This widget takes the difference between the user's baseline habits and changes made in the Sandbox and calculates **projected real-world financial savings/losses** per month. It proves that going green literally saves fiat currency!

### 5. Gamified Active Bounties 🎯
A built-in interactive mission system that turns tracking into a game. Users can accept bounties (e.g., "Meatless Weekend"), slowly fill out their progress bars, and earn XP to level up their eco-status over time. 

---

## 🛠️ Technology Stack

**Frontend Framework**
- React 18 (Vite)
- Tailwind CSS v4 (Using modern `@theme` configurations)
- Framer Motion (Delivering fluid layout animations and micro-interactions)
- Recharts (Data visualization & dynamic bar chart breakdowns)
- Lucide React (Clean, minimal iconography)

**Backend Architecture**
- Python 3.12 / Flask
- SQLite (Local database persistence via `sqlite3`)
- Scikit-learn (ML modeling for clustering and environmental prediction engines)
- Pandas & NumPy (Data parsing and metric calculations)

---

## ⚙️ Running Locally

The project is split into a separated Frontend and Backend infrastructure. 

### 1. Start the Python Backend
Ensure your virtual environment is active and all dependencies (`flask`, `flask-cors`, `pandas`, `scikit-learn`) are installed.
```bash
cd backend
.\venv\Scripts\activate   # (On Windows)
python app.py
```
*The backend will boot up locally on `http://127.0.0.1:5000`.*

### 2. Start the React Frontend
Open a new terminal session.
```bash
cd frontend
npm run dev
```
*The Vite development server will host the UI typically on `http://localhost:5173`. Navigate there in your browser to interact with your Digital Twin!*
