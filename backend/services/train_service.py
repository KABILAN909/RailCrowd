from database import get_db_connection


# ============================================================
# Get train details by train number
# ============================================================

def get_train_by_number(train_number):
    connection = get_db_connection()

    if not connection:
        return None

    cursor = connection.cursor()

    try:
        query = """
            SELECT
                t.train_number,
                t.train_name,

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

        cursor.execute(query, (train_number,))

        rows = cursor.fetchall()

        return rows

    except Exception as error:
        print(f"❌ Train service error: {error}")
        return None

    finally:
        cursor.close()
        connection.close()


# ============================================================
# Search trains between two stations
# ============================================================

def search_trains(from_code, to_code):
    connection = get_db_connection()

    if not connection:
        return None

    cursor = connection.cursor()

    try:
        query = """
            SELECT
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

        cursor.execute(query, (from_code, to_code))

        rows = cursor.fetchall()

        return rows

    except Exception as error:
        print(f"❌ Train search error: {error}")
        return None

    finally:
        cursor.close()
        connection.close()