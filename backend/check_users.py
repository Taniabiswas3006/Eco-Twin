import sqlite3

conn = sqlite3.connect('users.db')
c = conn.cursor()
c.execute("SELECT username FROM users")
print(f"Users in users.db: {c.fetchall()}")
conn.close()
