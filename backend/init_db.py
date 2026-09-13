try:
    from .db import DATABASE_PATH, initialize_database
except ImportError:
    from db import DATABASE_PATH, initialize_database


if __name__ == "__main__":
    initialize_database()
    print(f"Database ready at {DATABASE_PATH}")
