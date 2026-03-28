import sqlite3

conn = sqlite3.connect('users.db')
c = conn.cursor()
c.execute("SELECT * FROM users")
rows = c.fetchall()
colnames = [d[0] for d in c.description]
print(f"Columns: {colnames}")
for row in rows:
    print(row)
conn.close()
