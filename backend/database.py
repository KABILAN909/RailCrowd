import pymysql


def get_db_connection():
    try:
        connection = pymysql.connect(
            host="127.0.0.1",
            user="root",
            password="",
            database="railcrowd",
            port=3306,
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=True
        )

        return connection

    except pymysql.MySQLError as error:
        print(f"❌ MySQL connection error: {error}")
        return None