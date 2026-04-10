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
from sklearn.exceptions import InconsistentVersionWarning
from functools import wraps

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
    
    - travel:      car=3, public=2, bike=1
    - electricity:  hours of general electricity use per day (0-24)
    - meat:         veg=1, non-veg=3
    - shopping:     times per week (0-10)
    - ac:           hours of AC / heavy appliance use per day (0-24)
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

@app.route('/', methods=['GET', 'HEAD'])
def index():
    return jsonify({"status": "active", "message": "EcoTwin Backend is running perfectly!"}), 200

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
        category = "Eco-Warrior"
    elif total_score > 55:
        category = "Eco-Conscious"
    elif total_score > 35:
        category = "Average Impact"
    else:
        category = "High Impact"
    
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
        insights = [
            f"Your current carbon footprint of {carbon_pred}kg is driven by transport. Switching to public transit once a week could lower your impact by fifteen percent.",
            "Energy usage is reaching peak zones in your house. Installing a smart thermostat would help automate cooling and save energy while you are away.",
            "Your dietary choices represent a major opportunity. Transitioning to just two meat-free days per week can dramatically reduce your personal methane and nitrous oxide contributions.",
            "Consolidating your weekly shopping trips into a single run reduces packaging waste. Buying in bulk further minimizes the plastic footprint of your household cycles."
        ]
    
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
    
    # Wrap in DataFrames to avoid 'valid feature names' UserWarnings
    feature_names = ['travel', 'electricity', 'meat', 'shopping', 'ac']
    base_df = pd.DataFrame(base_features, columns=feature_names)
    new_df = pd.DataFrame(new_features, columns=feature_names)
    
    try:
        base_carbon = float(carbon_model.predict(base_df)[0]) if carbon_model else 40.0
        new_carbon = float(carbon_model.predict(new_df)[0]) if carbon_model else 30.0
        
        base_energy = float(energy_model.predict(base_df)[0]) if energy_model else 25.0
        new_energy = float(energy_model.predict(new_df)[0]) if energy_model else 20.0
        
        # Waste is a classifier — derive meaningful values
        base_s = float(baseline_data.get("shopping", 2))
        base_m = {"non-veg": 3, "veg": 1}.get(baseline_data.get("food", "veg").lower(), 2)
        new_s = float(new_data.get("shopping", 2))
        new_m = {"non-veg": 3, "veg": 1}.get(new_data.get("food", "veg").lower(), 2)
        
        if waste_model:
            base_wc = int(waste_model.predict(base_df)[0])
            new_wc = int(waste_model.predict(new_df)[0])
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
        
        prompt = f"Explain why {trees} trees or {solar_panels} solar panels are a good way to offset {co2_amount}kg of CO2."
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
            
        prompt = f"A meal with {ingredients_str} generates {total_co2}kg CO2. Briefly explain why this matters and suggest a micro-improvement."
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
        
        prompt = f"Buying a {weight}kg item made of {material} generates {impact}kg CO2 during manufacturing. Mention one environmental fact about this material choice."
        ai_analysis = get_ai_insight(prompt)
        
        return jsonify({
            "mode": "purchase",
            "impact_kg": round(impact, 2),
            "comparison": f"Roughly {round(impact*5, 1)}km of driving emissions.",
            "ai_analysis": ai_analysis
        })
        
    return jsonify({"error": "Invalid mode"}), 400


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
        # Handle existing table
        try:
            c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE")
            c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS settings TEXT DEFAULT '{}'")
            c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS bounties TEXT DEFAULT '[]'")
            c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0")
            c.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1")
        except:
            pass
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
            c.execute("ALTER TABLE users ADD COLUMN email TEXT") # SQLite unique on alter is tricky, so simplified
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

try:
    init_db()
    print("✅ Database successfully connected/initialized!")
except Exception as e:
    print(f"❌ Database connection error: {e}")

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data or 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify({"error": "Username, email and password are required"}), 400
        
    username, password, email = data['username'], data['password'], data['email']
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
            f"INSERT INTO users (username, email, password, name, phone, gender) VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})", 
            (username, email, hashed_password, name, phone, gender)
        )
        conn.commit()
        conn.close()
        
        token = jwt.encode({
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({"message": "User created successfully", "username": username, "email": email, "token": token}), 201
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
    if not data or 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify({"error": "Username, email and password are required"}), 400
        
    username, password, email = data['username'], data['password'], data['email']
    
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Use '?' for SQLite, '%s' for PostgreSQL
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        
        c.execute(f"SELECT password, email FROM users WHERE username = {placeholder} AND email = {placeholder}", (username, email))
        row = c.fetchone()
        conn.close()
        
        if row and check_password_hash(row[0], password):
            db_email = row['email'] if hasattr(row, 'keys') else row[1]
            # Use timezone-aware UTC now to resolve DeprecationWarning
            now = datetime.datetime.now(datetime.timezone.utc)
            token = jwt.encode({
                'username': username,
                'exp': now + datetime.timedelta(hours=24)
            }, app.config['SECRET_KEY'], algorithm="HS256")
            
            return jsonify({
                "message": "Login successful", 
                "username": username, 
                "email": db_email,
                "token": token
            }), 200
        else:
            return jsonify({"error": "Invalid username, email or password"}), 401
    except Exception as e:
        print(f"Login error: {e}")
        if 'conn' in locals(): conn.close()
        return jsonify({"error": "Database error"}), 500

@app.route('/get-profile', methods=['GET'])
@token_required
def get_profile(current_user):
    username = request.args.get('username')
    if not username or username != current_user:
        return jsonify({"error": "Unauthorized user access"}), 403
        
    try:
        conn = get_db_connection()
        c = conn.cursor()
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        c.execute(f"SELECT name, email, phone, gender FROM users WHERE username={placeholder}", (username,))
        row = c.fetchone()
        conn.close()
        
        if row:
            print(f"DEBUG: Profile data for {username}: {row}")
            # Handle both SQLite (Row) and PostgreSQL (Tuple)
            if hasattr(row, 'keys'): # SQLite
                return jsonify({
                    "name": row['name'] or '',
                    "email": row['email'] or '',
                    "phone": row['phone'] or '',
                    "gender": row['gender'] or ''
                }), 200
            else: # PostgreSQL/Tuple
                return jsonify({
                    "name": row[0] or '',
                    "email": row[1] or '',
                    "phone": row[2] or '',
                    "gender": row[3] or ''
                }), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Get profile error: {e}")
        return jsonify({"error": "Database error"}), 500

@app.route('/update-profile', methods=['POST'])
@token_required
def update_profile(current_user):
    data = request.json
    if not data or 'username' not in data or data['username'] != current_user:
        return jsonify({"error": "Unauthorized user access"}), 403
        
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
@token_required
def get_settings(current_user):
    username = request.args.get('username')
    if not username or username != current_user:
        return jsonify({"error": "Unauthorized user access"}), 403
        
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
@token_required
def update_settings(current_user):
    data = request.json
    if not data or 'username' not in data or 'settings' not in data or data['username'] != current_user:
        return jsonify({"error": "Unauthorized user access"}), 403
        
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

@app.route('/get-bounties', methods=['GET'])
@token_required
def get_bounties(current_user):
    username = request.args.get('username')
    if not username or username != current_user:
        return jsonify({"error": "Unauthorized user access"}), 403
        
    try:
        conn = get_db_connection()
        c = conn.cursor()
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        c.execute(f"SELECT bounties, xp, level FROM users WHERE username={placeholder}", (username,))
        row = c.fetchone()
        conn.close()
        
        if row:
            # Handle both SQLite (Row) and PostgreSQL (Tuple)
            if hasattr(row, 'keys'): # SQLite
                return jsonify({
                    "bounties": json.loads(row['bounties'] or '[]'),
                    "xp": row['xp'] or 0,
                    "level": row['level'] or 1
                }), 200
            else: # PostgreSQL/Tuple
                return jsonify({
                    "bounties": json.loads(row[0] or '[]'),
                    "xp": row[1] or 0,
                    "level": row[2] or 1
                }), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Get bounties error: {e}")
        return jsonify({"error": "Database error"}), 500

@app.route('/update-bounties', methods=['POST'])
@token_required
def update_bounties(current_user):
    data = request.json
    if not data or 'username' not in data or data['username'] != current_user:
        return jsonify({"error": "Unauthorized user access"}), 403
        
    username = data['username']
    bounties_json = json.dumps(data.get('bounties', []))
    xp = data.get('xp', 0)
    
    # Robust Leveling Logic
    # Level 1: 0-499, Level 2: 500-999, etc.
    # Recursive level calculation: level = floor(xp / 500) + 1
    level = max(1, (xp // 500) + 1)
    
    try:
        conn = get_db_connection()
        c = conn.cursor()
        placeholder = '?' if isinstance(conn, sqlite3.Connection) else '%s'
        c.execute(
            f"UPDATE users SET bounties={placeholder}, xp={placeholder}, level={placeholder} WHERE username={placeholder}", 
            (bounties_json, xp, level, username)
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Bounties updated successfully"}), 200
    except Exception as e:
        print(f"Update bounties error: {e}")
        return jsonify({"error": "Database error"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
