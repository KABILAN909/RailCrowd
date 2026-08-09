from database import get_db_connection


def setup_database():
    connection = get_db_connection()

    if not connection:
        print("❌ Database connection failed!")
        return

    cursor = connection.cursor()

    try:
        # USERS
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # STATIONS
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS stations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                station_code VARCHAR(20) NOT NULL UNIQUE,
                station_name VARCHAR(150) NOT NULL,
                city VARCHAR(100),
                state VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # TRAINS
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS trains (
                id INT AUTO_INCREMENT PRIMARY KEY,
                train_number VARCHAR(20) NOT NULL UNIQUE,
                train_name VARCHAR(150) NOT NULL,
                source_station VARCHAR(150),
                destination_station VARCHAR(150),
                departure_time VARCHAR(20),
                arrival_time VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # CROWD REPORTS
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS crowd_reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                train_id INT,
                station_id INT,
                crowd_level ENUM(
                    'Low',
                    'Medium',
                    'High',
                    'Very High'
                ) NOT NULL,
                occupancy INT,
                coach VARCHAR(20),
                source VARCHAR(50) DEFAULT 'passenger',
                reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (train_id)
                    REFERENCES trains(id)
                    ON DELETE SET NULL,

                FOREIGN KEY (station_id)
                    REFERENCES stations(id)
                    ON DELETE SET NULL
            )
        """)

        # PREDICTIONS
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                train_id INT,
                station_id INT,
                crowd_level ENUM(
                    'Low',
                    'Medium',
                    'High',
                    'Very High'
                ) NOT NULL,
                occupancy INT,
                confidence DECIMAL(5,2),
                generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (train_id)
                    REFERENCES trains(id)
                    ON DELETE SET NULL,

                FOREIGN KEY (station_id)
                    REFERENCES stations(id)
                    ON DELETE SET NULL
            )
        """)

        # SAVED ROUTES
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS saved_routes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                from_station_id INT,
                to_station_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (from_station_id)
                    REFERENCES stations(id)
                    ON DELETE SET NULL,

                FOREIGN KEY (to_station_id)
                    REFERENCES stations(id)
                    ON DELETE SET NULL
            )
        """)

        # CONTACTS
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL,
                subject VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        connection.commit()

        print("===================================")
        print("✅ RailCrowd database setup complete!")
        print("===================================")
        print("✅ users")
        print("✅ stations")
        print("✅ trains")
        print("✅ crowd_reports")
        print("✅ predictions")
        print("✅ saved_routes")
        print("✅ contacts")
        print("===================================")

    except Exception as error:
        connection.rollback()
        print("❌ Database setup failed!")
        print(error)

    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    setup_database()