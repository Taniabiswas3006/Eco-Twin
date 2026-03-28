import os
import sqlite3
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')

def migrate():
    # 1. Connect to SQLite
    print("Reading from local SQLite...")
    try:
        sq_conn = sqlite3.connect('users.db')
        sq_conn.row_factory = sqlite3.Row
        sq_c = sq_conn.cursor()
        sq_c.execute("SELECT * FROM users")
        local_users = sq_c.fetchall()
        print(f"Found {len(local_users)} users locally.")
    except Exception as e:
        print(f"Error reading SQLite: {e}")
        return

    # 2. Connect to Supabase
    print("Connecting to Supabase PostgreSQL...")
    try:
        pg_conn = psycopg2.connect(DATABASE_URL)
        pg_c = pg_conn.cursor()
        
        # 3. Create table if not exists (using Supabase specific SERIAL/POSTGRES syntax)
        pg_c.execute('''CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            gender TEXT DEFAULT ''
        )''')
        pg_conn.commit()
        print("Ensured 'users' table exists on Supabase.")

        # 4. Insert users
        print("Migrating data...")
        for user in local_users:
            try:
                pg_c.execute(
                    "INSERT INTO users (username, password, name, phone, gender) VALUES (%s, %s, %s, %s, %s)",
                    (user['username'], user['password'], user['name'], user['phone'], user['gender'])
                )
                print(f"Migrated user: {user['username']}")
            except psycopg2.errors.UniqueViolation:
                pg_conn.rollback()
                print(f"User {user['username']} already exists on Supabase, skipped.")
            except Exception as e:
                print(f"Error migrating {user['username']}: {e}")
                pg_conn.rollback()
        
        pg_conn.commit()
        print("✅ Migration complete!")
        pg_conn.close()
    except Exception as e:
        print(f"❌ Failed to connect to Supabase or migrate data: {e}")
    finally:
        sq_conn.close()

if __name__ == "__main__":
    migrate()
