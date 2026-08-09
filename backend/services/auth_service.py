import hashlib

from database import get_db_connection


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def register_user(name, email, password):
    connection = get_db_connection()

    if not connection:
        return {
            "success": False,
            "message": "Database connection failed"
        }

    try:
        cursor = connection.cursor()

        # Check whether email already exists
        cursor.execute(
            "SELECT id FROM users WHERE LOWER(email) = LOWER(%s)",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return {
                "success": False,
                "message": "Email already registered"
            }

        hashed_password = hash_password(password)

        cursor.execute(
            """
            INSERT INTO users (name, email, password)
            VALUES (%s, %s, %s)
            """,
            (name, email, hashed_password)
        )

        connection.commit()

        return {
            "success": True,
            "message": "User registered successfully"
        }

    except Exception as error:
        print("❌ Registration error:", error)

        return {
            "success": False,
            "message": "Registration failed"
        }

    finally:
        cursor.close()
        connection.close()


def login_user(email, password):
    connection = get_db_connection()

    if not connection:
        return {
            "success": False,
            "message": "Database connection failed"
        }

    try:
        cursor = connection.cursor()

        hashed_password = hash_password(password)

        cursor.execute(
            """
            SELECT id, name, email
            FROM users
            WHERE LOWER(email) = LOWER(%s)
            AND password = %s
            """,
            (email, hashed_password)
        )

        user = cursor.fetchone()

        if user:
            return {
                "success": True,
                "message": "Login successful",
                "user": {
                    "name": user["name"],
                    "email": user["email"]
                }
            }

        return {
            "success": False,
            "message": "Invalid email or password"
        }

    except Exception as error:
        print("❌ Login error:", error)

        return {
            "success": False,
            "message": "Login failed"
        }

    finally:
        cursor.close()
        connection.close()