import sqlite3

conn = sqlite3.connect('users.db')
c = conn.cursor()
c.execute("SELECT username FROM users")
print(f"Users: {[row[0] for row in c.fetchall()]}")
conn.close()
