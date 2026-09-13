from __future__ import annotations

import argparse
import getpass

try:
    from .db import initialize_database, upsert_admin_user
except ImportError:
    from db import initialize_database, upsert_admin_user


def main() -> None:
    parser = argparse.ArgumentParser(description="Create or update the Sentinel Grid admin user.")
    parser.add_argument("--username", default="admin", help="Admin username")
    parser.add_argument("--display-name", default="Sentinel Admin", help="Admin display name")
    parser.add_argument("--role", default="admin", help="Admin role")
    parser.add_argument("--password", help="Admin password. If omitted, you will be prompted.")
    args = parser.parse_args()

    password = args.password or getpass.getpass("Admin password: ")
    if not password:
        raise SystemExit("A password is required.")

    initialize_database()
    user = upsert_admin_user(
        username=args.username,
        password=password,
        display_name=args.display_name,
        role=args.role,
    )
    print(f"Admin user ready: {user['username']} ({user['displayName']})")


if __name__ == "__main__":
    main()
