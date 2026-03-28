import sqlite3

conn = sqlite3.connect('users.db')
c = conn.cursor()
c.execute("PRAGMA table_info(users)")
print(f"Schema for users table: {c.fetchall()}")
conn.close()
