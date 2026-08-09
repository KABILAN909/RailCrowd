import json
import os

from database import get_db_connection


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(BASE_DIR, "data", "users.json")


def migrate_users():
    if not os.path.exists(USERS_FILE):
        print("❌ users.json not found!")
        return

    with open(USERS_FILE, "r") as file:
        users = json.load(file)

    connection = get_db_connection()

    if not connection:
        print("❌ Database connection failed!")
        return

    cursor = connection.cursor()

    try:
        migrated = 0
        skipped = 0

        for user in users:
            name = user.get("name", "").strip()
            email = user.get("email", "").strip()
            password = user.get("password", "")

            if not name or not email or not password:
                print(f"⚠️ Skipping invalid user: {email}")
                skipped += 1
                continue

            # Check if user already exists
            cursor.execute(
                "SELECT id FROM users WHERE LOWER(email) = LOWER(%s)",
                (email,)
            )

            existing_user = cursor.fetchone()

            if existing_user:
                print(f"⏭️ Already exists: {email}")
                skipped += 1
                continue

            cursor.execute(
                """
                INSERT INTO users (name, email, password)
                VALUES (%s, %s, %s)
                """,
                (name, email, password)
            )

            print(f"✅ Migrated: {email}")
            migrated += 1

        connection.commit()

        print("\n===================================")
        print("✅ User migration completed!")
        print("===================================")
        print(f"New users migrated : {migrated}")
        print(f"Users skipped       : {skipped}")
        print("===================================")

    except Exception as error:
        connection.rollback()
        print("❌ Migration failed!")
        print(error)

    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    migrate_users()