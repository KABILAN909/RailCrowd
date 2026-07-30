import json
import hashlib
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
USERS_FILE = os.path.join(BASE_DIR, "data", "users.json")


def load_users():
    if not os.path.exists(USERS_FILE):
        return []

    with open(USERS_FILE, "r") as file:
        return json.load(file)


def save_users(users):
    with open(USERS_FILE, "w") as file:
        json.dump(users, file, indent=4)


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def register_user(name, email, password):
    users = load_users()

    for user in users:
        if user["email"].lower() == email.lower():
            return {
                "success": False,
                "message": "Email already registered"
            }

    new_user = {
        "name": name,
        "email": email,
        "password": hash_password(password)
    }

    users.append(new_user)
    save_users(users)

    return {
        "success": True,
        "message": "User registered successfully"
    }


def login_user(email, password):
    users = load_users()

    hashed_password = hash_password(password)

    for user in users:
        if (
            user["email"].lower() == email.lower()
            and user["password"] == hashed_password
        ):
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