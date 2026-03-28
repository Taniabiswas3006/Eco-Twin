import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')
print(f"DATABASE_URL starts with: {DATABASE_URL[:20]}...")

try:
    conn = psycopg2.connect(DATABASE_URL)
    print("✅ Successfully connected to the database!")
    c = conn.cursor()
    c.execute("SELECT version();")
    print(f"Database version: {c.fetchone()}")
    conn.close()
except Exception as e:
    print(f"❌ Failed to connect: {e}")
