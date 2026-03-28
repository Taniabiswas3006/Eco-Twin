from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

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
    
    - travel:      car=3, public=2, bike=1
    - electricity:  hours of general electricity use per day (0-24)
    - meat:         veg=1, non-veg=3
    - shopping:     times per week (0-10)
    - ac:           hours of AC / heavy appliance use per day (0-24)
    """
    travel_map = {"car": 3, "public": 2, "bike": 1}
    food_map = {"non-veg": 3, "veg": 1}
    
    travel_val = travel_map.get(data.get("travel", "car").lower(), 2)
    electricity_val = float(data.get("electricity", 5))
    food_val = food_map.get(data.get("food", "veg").lower(), 2)
    shopping_val = float(data.get("shopping", 2))
    ac_val = float(data.get("ac", 3))
    
    return np.array([[travel_val, electricity_val, food_val, shopping_val, ac_val]])

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data:
        return jsonify({"error": "No input provided"}), 400
        
    features = prepare_features(data)
    
    # Use DataFrame with feature names to avoid sklearn warnings
    feature_names = ['travel', 'electricity', 'meat', 'shopping', 'ac']
    features_df = pd.DataFrame(features, columns=feature_names)
    
    try:
        # Carbon model: LinearRegression — returns kg CO2 / month
        carbon_pred = float(carbon_model.predict(features_df)[0]) if carbon_model else 40.0
        
        # Energy model: LinearRegression — returns kWh / month
        energy_pred = float(energy_model.predict(features_df)[0]) if energy_model else 25.0
        
        # Waste model: DecisionTreeClassifier — returns 0 (low) or 1 (high)
        if waste_model:
            waste_class = int(waste_model.predict(features_df)[0])
            # Convert class to a meaningful kg/week value based on inputs
            shopping_val = float(data.get("shopping", 2))
            food_val = {"non-veg": 3, "veg": 1}.get(data.get("food", "veg").lower(), 2)
            base_waste = (shopping_val * 1.2) + (food_val * 0.8) + 1.5
            waste_pred = base_waste * (1.8 if waste_class == 1 else 0.7)
        else:
            waste_pred = 5.0
            
    except Exception as e:
        print(f"Prediction error: {e}")
        # Manual fallback calculation using known coefficients
        travel_map = {"car": 3, "public": 2, "bike": 1}
        food_map = {"non-veg": 3, "veg": 1}
        t = travel_map.get(data.get("travel", "car").lower(), 2)
        e_val = float(data.get("electricity", 5))
        m = food_map.get(data.get("food", "veg").lower(), 2)
        s = float(data.get("shopping", 2))
        a = float(data.get("ac", 3))
        carbon_pred = (t * 12) + (m * 6) + (s * 3)
        energy_pred = (e_val * 4) + (a * 7)
        waste_pred = (s * 1.2) + (m * 0.8) + 1.5
    
    # Ensure non-negative
    carbon_pred = max(0, carbon_pred)
    energy_pred = max(0, energy_pred)
    waste_pred = max(0, waste_pred)
    
    # --- Scoring ---
    carbon_penalty = min(40, (carbon_pred / 69) * 40)
    energy_penalty = min(30, (energy_pred / 47) * 30)
    waste_penalty = min(30, (waste_pred / 15) * 30)
    total_score = max(0, min(100, 100 - carbon_penalty - energy_penalty - waste_penalty))
    
    if total_score > 75:
        category = "Eco-Warrior 🌱"
    elif total_score > 55:
        category = "Eco-Conscious 🌿"
    elif total_score > 35:
        category = "Average Impact"
    else:
        category = "High Impact ⚠️"
    
    # --- Dynamic insights (Rule-based) ---
    insights = []
    
    travel_val = features[0][0]
    electricity_val = features[0][1]
    food_val = features[0][2]
    shopping_val = features[0][3]
    ac_val = features[0][4]
    
    if travel_val == 3:
        insights.append(f"🚗 Driving adds ~{round(12 * 3, 1)} units to your carbon footprint. Switching to public transport could cut it by 33%.")
    elif travel_val == 2:
        insights.append("🚌 Using public transport is great! Consider biking for even lower emissions.")
    else:
        insights.append("🚲 Amazing! Biking/walking is the lowest-emission choice.")
    
    if ac_val > 5:
        insights.append(f"❄️ You use AC/heavy appliances {int(ac_val)} hrs/day — this is your biggest energy driver. Even 1 hr less saves ~7 kWh/month.")
    elif electricity_val > 6:
        insights.append(f"💡 Your general electricity use ({int(electricity_val)} hrs/day) is above average. Smart power strips could help reduce standby waste.")
    
    if food_val == 3:
        insights.append("🍖 A non-veg diet contributes significantly to your carbon score. Even 2 meatless days/week can make a big difference.")
    else:
        insights.append("🥬 Great choice! A plant-based diet keeps your food-related emissions low.")
    
    if shopping_val > 4:
        insights.append(f"🛒 Shopping {int(shopping_val)}x/week generates extra packaging waste. Try consolidating trips and buying in bulk.")
    
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
    if not data:
        return jsonify({"error": "No input provided"}), 400
        
    baseline_data = data.get("baseline", {})
    new_data = data.get("new", {})
    
    base_features = prepare_features(baseline_data)
    new_features = prepare_features(new_data)
    
    try:
        base_carbon = float(carbon_model.predict(base_features)[0]) if carbon_model else 40.0
        new_carbon = float(carbon_model.predict(new_features)[0]) if carbon_model else 30.0
        
        base_energy = float(energy_model.predict(base_features)[0]) if energy_model else 25.0
        new_energy = float(energy_model.predict(new_features)[0]) if energy_model else 20.0
        
        # Waste is a classifier — derive meaningful values
        base_s = float(baseline_data.get("shopping", 2))
        base_m = {"non-veg": 3, "veg": 1}.get(baseline_data.get("food", "veg").lower(), 2)
        new_s = float(new_data.get("shopping", 2))
        new_m = {"non-veg": 3, "veg": 1}.get(new_data.get("food", "veg").lower(), 2)
        
        if waste_model:
            base_wc = int(waste_model.predict(base_features)[0])
            new_wc = int(waste_model.predict(new_features)[0])
            base_waste = ((base_s * 1.2) + (base_m * 0.8) + 1.5) * (1.8 if base_wc == 1 else 0.7)
            new_waste = ((new_s * 1.2) + (new_m * 0.8) + 1.5) * (1.8 if new_wc == 1 else 0.7)
        else:
            base_waste = 5.0
            new_waste = 4.0
    except Exception as e:
        print(f"Simulation error: {e}")
        t_b = {"car": 3, "public": 2, "bike": 1}.get(baseline_data.get("travel", "car").lower(), 2)
        t_n = {"car": 3, "public": 2, "bike": 1}.get(new_data.get("travel", "car").lower(), 2)
        base_carbon = (t_b * 12) + (base_m * 6) + (base_s * 3)
        new_carbon = (t_n * 12) + (new_m * 6) + (new_s * 3)
        base_energy = float(baseline_data.get("electricity", 5)) * 4 + float(baseline_data.get("ac", 3)) * 7
        new_energy = float(new_data.get("electricity", 5)) * 4 + float(new_data.get("ac", 3)) * 7
        base_waste = 5.0
        new_waste = 4.0

    base_carbon = max(0, base_carbon)
    new_carbon = max(0, new_carbon)
    
    improvement = 0
    if base_carbon > 0:
        improvement = ((base_carbon - new_carbon) / base_carbon) * 100
    
    # Use same scoring formula as /predict
    cp = min(40, (new_carbon / 69) * 40)
    ep = min(30, (new_energy / 47) * 30)
    wp = min(30, (new_waste / 15) * 30)
    new_score = max(0, min(100, 100 - cp - ep - wp))

    insight = f"Making these changes could reduce your footprint by {max(0, round(improvement))}%!"

    return jsonify({
        "improvement_percentage": max(0, round(float(improvement), 1)),
        "new_score": round(float(new_score), 1),
        "insight": insight,
        "new_metrics": {
            "carbon_footprint": round(float(new_carbon), 2),
            "energy_consumption": round(float(new_energy), 2),
            "waste_generation": round(float(new_waste), 2)
        }
    })


import sqlite3
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

# Use SQLite by default if no DATABASE_URL is provided or if pointing to local file
DATABASE_URL = os.getenv('DATABASE_URL', 'users.db')

def get_db_connection():
    """Get a connection to the database (PostgreSQL or SQLite)."""
    if DATABASE_URL.startswith("postgresql://") or DATABASE_URL.startswith("postgres://"):
        try:
            import psycopg2
            conn = psycopg2.connect(DATABASE_URL)
            return conn
        except Exception as e:
            print(f"⚠️ PostgreSQL connection failed, falling back to SQLite: {e}")
            # Fall through to SQLite
            
    # Use SQLite
    conn = sqlite3.connect('users.db')
    # Use Row factory to make it behave more like a dict/postgres result
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Create the users table if it doesn't exist."""
    conn = get_db_connection()
    c = conn.cursor()
    
    # Check if we are using SQLite or PostgreSQL connection
    is_sqlite = isinstance(conn, sqlite3.Connection)
    
import json

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    is_sqlite = isinstance(conn, sqlite3.Connection)
    
    if not is_sqlite:
        c.execute('''CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            gender TEXT DEFAULT '',
            settings TEXT DEFAULT '{}'
        )''')
        # Handle existing table
        try:
            c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS settings TEXT DEFAULT '{}'")
        except:
            pass
    else:
        # SQLite schema
        c.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            gender TEXT DEFAULT '',
            settings TEXT DEFAULT '{}'
        )''')
        # SQLite column check
        try:
            c.execute("ALTER TABLE users ADD COLUMN settings TEXT DEFAULT '{}'")
        except:
            pass
    
    conn.commit()
    conn.close()

try:
    init_db()
    print("✅ Database successfully connected/initialized!")
except Exception as e:
    print(f"❌ Database connection error: {e}")

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password required"}), 400
        
    username, password = data['username'], data['password']
    name = data.get('name', '')
    phone = data.get('phone', '')
    gender = data.get('gender', '')
    hashed_password = generate_password_hash(password)
    
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Use '?' for SQLite, '%s' for PostgreSQL
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        
        c.execute(
            f"INSERT INTO users (username, password, name, phone, gender) VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})", 
            (username, hashed_password, name, phone, gender)
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "User created successfully", "username": username, "token": "dummy-jwt-token"}), 201
    except Exception as e:
        # Check for unique constraint violation across both DB types
        if "UNIQUE constraint failed" in str(e) or "duplicate key value" in str(e):
            if 'conn' in locals(): conn.rollback(); conn.close()
            return jsonify({"error": "Username already exists"}), 409
        print(f"Signup error: {e}")
        if 'conn' in locals(): conn.close()
        return jsonify({"error": "Database error"}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password required"}), 400
        
    username, password = data['username'], data['password']
    
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Use '?' for SQLite, '%s' for PostgreSQL
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        
        c.execute(f"SELECT password FROM users WHERE username = {placeholder}", (username,))
        row = c.fetchone()
        conn.close()
        
        if row and check_password_hash(row[0], password):
            return jsonify({"message": "Login successful", "username": username, "token": "dummy-jwt-token"}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        print(f"Login error: {e}")
        if 'conn' in locals(): conn.close()
        return jsonify({"error": "Database error"}), 500

@app.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.json
    if not data or 'username' not in data:
        return jsonify({"error": "Username required"}), 400
        
    username = data['username']
    name = data.get('name', '')
    phone = data.get('phone', '')
    
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Use '?' for SQLite, '%s' for PostgreSQL
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        
        c.execute(
            f"UPDATE users SET name={placeholder}, phone={placeholder} WHERE username={placeholder}", 
            (name, phone, username)
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Profile updated successfully", "name": name, "phone": phone}), 200
    except Exception as e:
        print(f"Update error: {e}")
        if 'conn' in locals(): conn.close()
        return jsonify({"error": "Database error"}), 500

@app.route('/get-settings', methods=['GET'])
def get_settings():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username required"}), 400
        
    try:
        conn = get_db_connection()
        c = conn.cursor()
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        c.execute(f"SELECT settings FROM users WHERE username={placeholder}", (username,))
        row = c.fetchone()
        conn.close()
        
        if row:
            # PostgreSQL returns string, SQLite returns row object
            settings_str = row[0] if isinstance(row[0], str) else row['settings']
            return jsonify(json.loads(settings_str or '{}')), 200
        return jsonify({}), 404
    except Exception as e:
        print(f"Get settings error: {e}")
        return jsonify({"error": "Database error"}), 500

@app.route('/update-settings', methods=['POST'])
def update_settings():
    data = request.json
    if not data or 'username' not in data or 'settings' not in data:
        return jsonify({"error": "Username and settings required"}), 400
        
    username = data['username']
    settings_json = json.dumps(data['settings'])
    
    try:
        conn = get_db_connection()
        c = conn.cursor()
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        c.execute(f"UPDATE users SET settings={placeholder} WHERE username={placeholder}", (settings_json, username))
        conn.commit()
        conn.close()
        return jsonify({"message": "Settings updated successfully"}), 200
    except Exception as e:
        print(f"Update settings error: {e}")
        return jsonify({"error": "Database error"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
