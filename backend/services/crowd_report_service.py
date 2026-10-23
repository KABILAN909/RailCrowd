from database import get_db_connection


# ============================================================
# Create Crowd Report
# ============================================================

def create_crowd_report(
    train_id,
    station_id,
    crowd_level,
    occupancy,
    coach
):

    connection = get_db_connection()

    if not connection:

        print("❌ Database connection failed")

        return None

    cursor = None

    try:

        cursor = connection.cursor()

        query = """
            INSERT INTO crowd_reports (
                train_id,
                station_id,
                crowd_level,
                occupancy,
                coach,
                source
            )
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        cursor.execute(
            query,
            (
                train_id,
                station_id,
                crowd_level,
                occupancy,
                coach,
                "passenger"
            )
        )

        connection.commit()

        report_id = cursor.lastrowid

        print(
            f"✅ Crowd report created: {report_id}"
        )

        return report_id

    except Exception as error:

        connection.rollback()

        print(
            f"❌ Crowd report creation error: {error}"
        )

        return None

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# Get Recent Crowd Reports
# ============================================================

def get_recent_crowd_reports(limit=20):

    connection = get_db_connection()

    if not connection:

        print("❌ Database connection failed")

        return None

    cursor = None

    try:

        cursor = connection.cursor()

        query = """
            SELECT
                cr.id,
                cr.train_id,
                t.train_number,
                t.train_name,

                cr.station_id,
                s.station_code,
                s.station_name,

                cr.crowd_level,
                cr.occupancy,
                cr.coach,
                cr.source,
                cr.reported_at

            FROM crowd_reports cr

            LEFT JOIN trains t
                ON cr.train_id = t.id

            LEFT JOIN stations s
                ON cr.station_id = s.id

            ORDER BY cr.reported_at DESC

            LIMIT %s
        """

        cursor.execute(
            query,
            (limit,)
        )

        rows = cursor.fetchall()

        result = []

        for row in rows:

            if isinstance(row, dict):

                result.append({
                    key: value.isoformat()
                    if hasattr(value, "isoformat")
                    else value
                    for key, value in row.items()
                })

        print(
            f"✅ Recent crowd reports: "
            f"{len(result)}"
        )

        return result

    except Exception as error:

        print(
            f"❌ Get crowd reports error: {error}"
        )

        return None

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()