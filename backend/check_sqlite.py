import sqlite3

try:
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print(f"Tables found in users.db: {c.fetchall()}")
    conn.close()
except Exception as e:
    print(f"❌ Error reading users.db: {e}")
