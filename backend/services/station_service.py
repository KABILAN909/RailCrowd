from database import get_db_connection


def get_all_stations():
    connection = get_db_connection()

    if not connection:
        return None

    cursor = connection.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                station_code,
                station_name,
                city,
                state
            FROM stations
            ORDER BY station_name
        """)

        return cursor.fetchall()

    except Exception as error:
        print(f"❌ Station service error: {error}")
        return None

    finally:
        cursor.close()
        connection.close()