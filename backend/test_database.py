from database import get_db_connection


print("Testing RailCrowd database...")

connection = get_db_connection()

if connection:
    print("✅ RailCrowd MySQL connection successful!")
    connection.close()
else:
    print("❌ RailCrowd MySQL connection failed!")