from database import get_db_connection

from decimal import Decimal
from datetime import timedelta, time, datetime


# ============================================================
# Convert MySQL values to JSON-safe values
# ============================================================

def make_json_safe(value):

    if value is None:
        return None

    # MySQL TIME
    if isinstance(value, time):
        return value.strftime("%H:%M")

    # MySQL TIME as timedelta
    if isinstance(value, timedelta):

        total_seconds = int(
            value.total_seconds()
        )

        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60

        return f"{hours:02d}:{minutes:02d}"

    # Date / datetime
    if isinstance(value, datetime):
        return value.isoformat()

    # Decimal
    if isinstance(value, Decimal):
        return float(value)

    return value


# ============================================================
# Clean database row
# ============================================================

def clean_row(row):

    if isinstance(row, dict):

        return {
            key: make_json_safe(value)
            for key, value in row.items()
        }

    return tuple(
        make_json_safe(value)
        for value in row
    )


# ============================================================
# Get train details by train number
# ============================================================

def get_train_by_number(train_number):

    connection = get_db_connection()

    if not connection:

        print(
            "❌ Database connection failed"
        )

        return None

    cursor = None

    try:

        cursor = connection.cursor()

        query = """
            SELECT
                t.id AS train_id,
                t.train_number,
                t.train_name,

                s.id AS station_id,
                s.station_code,
                s.station_name,
                s.city,
                s.state,

                ts.stop_number,
                ts.arrival_time,
                ts.departure_time,
                ts.halt_minutes,
                ts.distance_km

            FROM trains t

            JOIN train_stops ts
                ON t.id = ts.train_id

            JOIN stations s
                ON ts.station_id = s.id

            WHERE t.train_number = %s

            ORDER BY ts.stop_number
        """

        cursor.execute(
            query,
            (train_number,)
        )

        rows = cursor.fetchall()

        rows = [
            clean_row(row)
            for row in rows
        ]

        print(
            f"✅ Train {train_number}: "
            f"{len(rows)} stops found"
        )

        return rows

    except Exception as error:

        print(
            f"❌ Train service error: {error}"
        )

        return None

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# Search trains between two stations
# ============================================================

def search_trains(from_code, to_code):

    connection = get_db_connection()

    if not connection:

        print(
            "❌ Database connection failed"
        )

        return None

    cursor = None

    try:

        cursor = connection.cursor()

        query = """
            SELECT

                t.id AS train_id,
                t.train_number,
                t.train_name,

                s1.station_code AS from_station_code,
                s1.station_name AS from_station_name,

                s2.station_code AS to_station_code,
                s2.station_name AS to_station_name,

                ts1.departure_time AS departure_time,
                ts2.arrival_time AS arrival_time,

                ts1.distance_km AS from_distance_km,
                ts2.distance_km AS to_distance_km

            FROM trains t

            JOIN train_stops ts1
                ON t.id = ts1.train_id

            JOIN stations s1
                ON ts1.station_id = s1.id

            JOIN train_stops ts2
                ON t.id = ts2.train_id

            JOIN stations s2
                ON ts2.station_id = s2.id

            WHERE
                s1.station_code = %s
                AND s2.station_code = %s
                AND ts1.stop_number < ts2.stop_number

            ORDER BY ts1.departure_time
        """

        cursor.execute(
            query,
            (from_code, to_code)
        )

        rows = cursor.fetchall()

        rows = [
            clean_row(row)
            for row in rows
        ]

        print(
            f"✅ Search {from_code} -> {to_code}: "
            f"{len(rows)} trains found"
        )

        return rows

    except Exception as error:

        print(
            f"❌ Train search error: {error}"
        )

        return None

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# Get All Train Numbers
#
# Used for Dashboard Analytics
# ============================================================

def get_all_train_numbers():

    connection = get_db_connection()

    if not connection:

        print(
            "❌ Database connection failed"
        )

        return None

    cursor = None

    try:

        cursor = connection.cursor()

        query = """
            SELECT
                train_number
            FROM trains
            ORDER BY train_number
        """

        cursor.execute(query)

        rows = cursor.fetchall()

        rows = [
            clean_row(row)
            for row in rows
        ]

        print(
            f"✅ Total trains found: {len(rows)}"
        )

        return rows

    except Exception as error:

        print(
            f"❌ Get all trains error: {error}"
        )

        return None

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()