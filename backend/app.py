from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import pickle
import pandas as pd
import numpy as np
import os
import jwt
import datetime
import warnings
import json
import sqlite3
from sklearn.exceptions import InconsistentVersionWarning
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

# Silence the version mismatch warnings from pre-trained .pkl models
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

load_dotenv()

from gemini_engine import get_ai_insight

app = Flask(__name__)
# Upgraded secret key to 32+ characters to resolve InsecureKeyLengthWarning
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", "eco-twin-ultra-secure-fallback-secret-1234567890")
origins_str = os.environ.get("CORS_ORIGIN", "*")
CORS(app, origins=[o.strip() for o in origins_str.split(',') if o.strip()] if origins_str != "*" else "*", supports_credentials=True)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            # Expected format: Bearer <token>
            if 'Bearer ' in token:
                token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['username']
        except Exception as e:
            return jsonify({'error': f'Token is invalid: {str(e)}'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Load the models
try:
    with open('carbon.pkl', 'rb') as f:
        carbon_model = pickle.load(f)
    with open('energy.pkl', 'rb') as f:
        energy_model = pickle.load(f)
    with open('waste.pkl', 'rb') as f:
        waste_model = pickle.load(f)
except Exception as e:
    print(f"Error loading models: {e}")
    carbon_model, energy_model, waste_model = None, None, None

def prepare_features(data):
    """
    Models were trained on 5 features in this exact order:
      ['travel', 'electricity', 'meat', 'shopping', 'ac']
    """
    travel_map = {"car": 3, "public": 2, "bike": 1}
    food_map = {"non-veg": 3, "veg": 1}
    
    travel_val = travel_map.get(data.get("travel", "car").lower(), 2)
    
    # Validation & Clamping
    try:
        electricity_val = max(0, min(24, float(data.get("electricity", 5))))
        food_val = food_map.get(data.get("food", "veg").lower(), 2)
        shopping_val = max(0, min(20, float(data.get("shopping", 2))))
        ac_val = max(0, min(24, float(data.get("ac", 3))))
    except (ValueError, TypeError):
        electricity_val, food_val, shopping_val, ac_val = 5, 2, 2, 3
    
    return np.array([[travel_val, electricity_val, food_val, shopping_val, ac_val]])

# Database utilities
DATABASE_URL = os.getenv('DATABASE_URL', 'users.db')

def get_db_connection():
    """Get a connection to the database (PostgreSQL or SQLite)."""
    if DATABASE_URL and (DATABASE_URL.startswith("postgresql://") or DATABASE_URL.startswith("postgres://")):
        try:
            import psycopg2
            conn = psycopg2.connect(DATABASE_URL)
            return conn
        except Exception as e:
            print(f"⚠️ PostgreSQL connection failed, falling back to SQLite: {e}")
            
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Create the users table if it doesn't exist."""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        is_sqlite = isinstance(conn, sqlite3.Connection)
        
        if not is_sqlite:
            # PostgreSQL schema
            c.execute('''CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT DEFAULT '',
                phone TEXT DEFAULT '',
                gender TEXT DEFAULT '',
                settings TEXT DEFAULT '{}',
                bounties TEXT DEFAULT '[]',
                xp INTEGER DEFAULT 0,
                level INTEGER DEFAULT 1
            )''')
            # Handle existing table migrations
            try:
                c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE")
                c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS settings TEXT DEFAULT '{}'")
                c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS bounties TEXT DEFAULT '[]'")
                c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0")
                c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1")
            except: pass
        else:
            # SQLite schema
            c.execute('''CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT DEFAULT '',
                phone TEXT DEFAULT '',
                gender TEXT DEFAULT '',
                settings TEXT DEFAULT '{}',
                bounties TEXT DEFAULT '[]',
                xp INTEGER DEFAULT 0,
                level INTEGER DEFAULT 1
            )''')
            # SQLite column check
            try:
                c.execute("ALTER TABLE users ADD COLUMN email TEXT")
            except: pass
            try:
                c.execute("ALTER TABLE users ADD COLUMN bounties TEXT DEFAULT '[]'")
            except: pass
            try:
                c.execute("ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0")
            except: pass
            try:
                c.execute("ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1")
            except: pass
        
        conn.commit()
        conn.close()
        print("✅ Database successfully connected/initialized!")
    except Exception as e:
        print(f"❌ Database connection/initialization error: {e}")

# Run DB init
init_db()

@app.route('/', methods=['GET', 'HEAD'])
def index():
    return jsonify({"status": "active", "message": "EcoTwin Backend is running perfectly!"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data:
        return jsonify({"error": "No input provided"}), 400
        
    features = prepare_features(data)
    feature_names = ['travel', 'electricity', 'meat', 'shopping', 'ac']
    features_df = pd.DataFrame(features, columns=feature_names)
    
    try:
        carbon_pred = float(carbon_model.predict(features_df)[0]) if carbon_model else 40.0
        energy_pred = float(energy_model.predict(features_df)[0]) if energy_model else 25.0
        
        if waste_model:
            waste_class = int(waste_model.predict(features_df)[0])
            shopping_val = float(data.get("shopping", 2))
            food_val = {"non-veg": 3, "veg": 1}.get(data.get("food", "veg").lower(), 2)
            base_waste = (shopping_val * 1.2) + (food_val * 0.8) + 1.5
            waste_pred = base_waste * (1.8 if waste_class == 1 else 0.7)
        else:
            waste_pred = 5.0
            
    except Exception as e:
        print(f"Prediction error: {e}")
        carbon_pred = 40.0; energy_pred = 25.0; waste_pred = 5.0
    
    # --- Scoring ---
    carbon_penalty = min(40, (carbon_pred / 69) * 40)
    energy_penalty = min(30, (energy_pred / 47) * 30)
    waste_penalty = min(30, (waste_pred / 15) * 30)
    total_score = max(0, min(100, 100 - carbon_penalty - energy_penalty - waste_penalty))
    
    category = "Eco-Warrior" if total_score > 75 else "Eco-Conscious" if total_score > 55 else "Average Impact" if total_score > 35 else "High Impact"
    
    # --- Dynamic AI Insights (Gemini Powered) ---
    travel_map = {3: "Car", 2: "Public Transport", 1: "Bike/Walk"}
    food_map = {3: "Non-Veg", 1: "Veg/Vegan"}
    
    ai_prompt = (
        f"Data: {carbon_pred}kg CO2, {energy_pred}kWh, {waste_pred}kg waste. "
        f"Context: Travels by {travel_map.get(features[0][0], 'Car')}, "
        f"{features[0][1]}h electricity, {features[0][4]}h AC, {food_map.get(features[0][2], 'Veg')} diet. "
        "Provide exactly 4 distinct actionable eco-tips. "
        "Each tip MUST be between 20 to 25 words long for visual symmetry. "
        "Separate tips with the '|' symbol. No numbers."
    )
    
    try:
        raw_ai_response = get_ai_insight(ai_prompt)
        insights = [s.strip() for s in raw_ai_response.split('|') if len(s.strip()) > 10][:4]
        while len(insights) < 4:
            insights.append("Consider upgrading to high-efficiency LED bulbs to reduce secondary energy consumption and lower your monthly utility costs significantly over time.")
    except Exception:
        insights = ["Check your carbon footprint details.", "Review energy usage.", "Monitor waste generation.", "Improve sustainable habits."]
    
    return jsonify({
        "carbon_footprint": round(carbon_pred, 2),
        "energy_consumption": round(energy_pred, 2),
        "waste_generation": round(waste_pred, 2),
        "sustainability_score": round(total_score, 1),
        "category": category,
        "insights": insights
    })

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.json
    if not data: return jsonify({"error": "No input"}), 400
    baseline_data = data.get("baseline", {})
    new_data = data.get("new", {})
    base_features = prepare_features(baseline_data)
    new_features = prepare_features(new_data)
    feature_names = ['travel', 'electricity', 'meat', 'shopping', 'ac']
    base_df = pd.DataFrame(base_features, columns=feature_names)
    new_df = pd.DataFrame(new_features, columns=feature_names)
    
    try:
        base_carbon = float(carbon_model.predict(base_df)[0]) if carbon_model else 40.0
        new_carbon = float(carbon_model.predict(new_df)[0]) if carbon_model else 30.0
        improvement = ((base_carbon - new_carbon) / base_carbon) * 100 if base_carbon > 0 else 0
        return jsonify({
            "improvement_percentage": round(float(improvement), 1),
            "new_score": 85.0, # Placeholder
            "insight": f"Changes could reduce footprint by {round(improvement)}%!",
            "new_metrics": {"carbon_footprint": round(new_carbon, 2), "energy_consumption": 20.0, "waste_generation": 4.0}
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/action-calculate', methods=['POST'])
@token_required
def action_calculate(current_user):
    data = request.json
    mode = data.get("mode") # 'offset', 'meal', 'purchase'
    ai_analysis = ""
    
    if mode == 'offset':
        co2_amount = float(data.get("amount", 0))
        trees = round(co2_amount / 1.75, 1)
        solar_panels = round(co2_amount / 40.0, 2)
        plastic_days = round(co2_amount / 0.5, 0)
        
        prompt = f"Explain why {trees} trees or {solar_panels} solar panels are a good way to offset {co2_amount}kg of CO2. Provide a 20-word briefing."
        ai_analysis = get_ai_insight(prompt)
        
        return jsonify({
            "mode": "offset",
            "results": {
                "trees_needed": trees,
                "solar_panels": solar_panels,
                "plastic_free_days": int(plastic_days)
            },
            "ai_analysis": ai_analysis
        })
        
    elif mode == 'meal':
        factors = {"beef": 27.0, "chicken": 6.9, "fish": 6.1, "veg": 2.0, "vegan": 1.2}
        items = data.get("items", [])
        total_co2 = 0
        ingredients_str = ""
        for item in items:
            total_co2 += factors.get(item['type'], 2.0) * float(item.get('weight', 0.1))
            ingredients_str += f"{item['weight']}kg of {item['type']}, "
            
        prompt = f"A meal with {ingredients_str} generates {total_co2}kg CO2. Suggest a 15-word micro-improvement."
        ai_analysis = get_ai_insight(prompt)
            
        return jsonify({
            "mode": "meal",
            "impact_kg": round(total_co2, 2),
            "grade": "A+" if total_co2 < 0.5 else "B" if total_co2 < 1.5 else "D",
            "ai_analysis": ai_analysis
        })
        
    elif mode == 'purchase':
        m_factors = {"cotton": 8.3, "polyester": 5.5, "leather": 17.0, "electronics": 25.0}
        material = data.get("material", "cotton")
        weight = float(data.get("weight", 0.5))
        impact = m_factors.get(material.lower(), 5.0) * weight
        
        prompt = f"Buying a {weight}kg item made of {material} generates {impact}kg CO2. Provide one 15-word sustainable tip for this material."
        ai_analysis = get_ai_insight(prompt)
        
        return jsonify({
            "mode": "purchase",
            "impact_kg": round(impact, 2),
            "comparison": f"Roughly {round(impact*5, 1)}km of driving emissions.",
            "ai_analysis": ai_analysis
        })
        
    return jsonify({"error": "Invalid mode"}), 400

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username, password, email = data['username'], data['password'], data['email']
    hashed_password = generate_password_hash(password)
    try:
        conn = get_db_connection()
        c = conn.cursor()
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        c.execute(f"INSERT INTO users (username, email, password) VALUES ({placeholder}, {placeholder}, {placeholder})", (username, email, hashed_password))
        conn.commit(); conn.close()
        token = jwt.encode({'username': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({"message": "User created", "token": token}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username, password, email = data['username'], data['password'], data['email']
    try:
        conn = get_db_connection()
        c = conn.cursor()
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        c.execute(f"SELECT password, email FROM users WHERE username = {placeholder} AND email = {placeholder}", (username, email))
        row = c.fetchone()
        conn.close()
        if row and check_password_hash(row[0], password):
            token = jwt.encode({'username': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm="HS256")
            return jsonify({"token": token, "username": username, "email": email}), 200
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-profile', methods=['GET'])
@token_required
def get_profile(current_user):
    username = request.args.get('username')
    try:
        conn = get_db_connection(); c = conn.cursor()
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        c.execute(f"SELECT name, email, phone FROM users WHERE username={placeholder}", (username,))
        row = c.fetchone(); conn.close()
        if row:
            return jsonify({"name": row[0] or '', "email": row[1] or '', "phone": row[2] or ''}), 200
        return jsonify({"error": "Not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-bounties', methods=['GET'])
@token_required
def get_bounties(current_user):
    username = request.args.get('username')
    try:
        conn = get_db_connection(); c = conn.cursor()
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        c.execute(f"SELECT bounties, xp, level FROM users WHERE username={placeholder}", (username,))
        row = c.fetchone(); conn.close()
        if row:
            return jsonify({"bounties": json.loads(row[0] or '[]'), "xp": row[1] or 0, "level": row[2] or 1}), 200
        return jsonify({"error": "Not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/update-bounties', methods=['POST'])
@token_required
def update_bounties(current_user):
    data = request.json
    username = data['username']
    bounties_json = json.dumps(data.get('bounties', []))
    xp = data.get('xp', 0)
    level = max(1, (xp // 500) + 1)
    try:
        conn = get_db_connection(); c = conn.cursor()
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        c.execute(f"UPDATE users SET bounties={placeholder}, xp={placeholder}, level={placeholder} WHERE username={placeholder}", (bounties_json, xp, level, username))
        conn.commit(); conn.close()
        return jsonify({"message": "Success"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
