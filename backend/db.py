from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import sqlite3
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parent.parent
DATABASE_ENV_PATH = os.environ.get("SENTINEL_DATABASE_PATH", "database/sentinel_grid_platform.sqlite3")
DATABASE_PATH = Path(DATABASE_ENV_PATH)
if not DATABASE_PATH.is_absolute():
    DATABASE_PATH = ROOT_DIR / DATABASE_PATH
SCHEMA_PATH = ROOT_DIR / "database" / "schema.sql"
SEED_PATH = ROOT_DIR / "database" / "seed.sql"
PASSWORD_ITERATIONS = 200000
MIN_ADMIN_PASSWORD_LENGTH = 12


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    connection.execute("PRAGMA journal_mode = MEMORY")
    connection.execute("PRAGMA temp_store = MEMORY")
    connection.execute("PRAGMA synchronous = NORMAL")
    return connection


def initialize_database() -> None:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    with get_connection() as connection:
        connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        connection.executescript(SEED_PATH.read_text(encoding="utf-8"))
        connection.commit()

    admin_username = os.environ.get("SENTINEL_ADMIN_USERNAME", "admin")
    admin_password = os.environ.get("SENTINEL_ADMIN_PASSWORD", "")
    admin_display_name = os.environ.get("SENTINEL_ADMIN_DISPLAY_NAME", "Sentinel Admin")

    if admin_password:
        upsert_admin_user(
            username=admin_username,
            password=admin_password,
            display_name=admin_display_name,
        )


def fetch_all(
    connection: sqlite3.Connection,
    query: str,
    params: tuple[Any, ...] = (),
) -> list[dict[str, Any]]:
    rows = connection.execute(query, params).fetchall()
    return [dict(row) for row in rows]


def fetch_one(
    connection: sqlite3.Connection,
    query: str,
    params: tuple[Any, ...] = (),
) -> dict[str, Any] | None:
    row = connection.execute(query, params).fetchone()
    return dict(row) if row else None


def fetch_scalar(
    connection: sqlite3.Connection,
    query: str,
    params: tuple[Any, ...] = (),
) -> Any:
    row = connection.execute(query, params).fetchone()
    return row[0] if row else None


def fetch_settings(connection: sqlite3.Connection) -> dict[str, str]:
    rows = fetch_all(
        connection,
        """
        SELECT setting_key, setting_value
        FROM site_settings
        """,
    )
    return {row["setting_key"]: row["setting_value"] for row in rows}


def hash_password(password: str, salt_hex: str) -> str:
    salt = bytes.fromhex(salt_hex)
    return hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PASSWORD_ITERATIONS,
    ).hex()


def generate_password_salt() -> str:
    return os.urandom(16).hex()


def validate_admin_password(password: str) -> None:
    if len(password) < MIN_ADMIN_PASSWORD_LENGTH:
        raise ValueError(
            f"Admin passwords must be at least {MIN_ADMIN_PASSWORD_LENGTH} characters long."
        )

    requirements = [
        (re.search(r"[a-z]", password), "one lowercase letter"),
        (re.search(r"[A-Z]", password), "one uppercase letter"),
        (re.search(r"\d", password), "one number"),
        (re.search(r"[^A-Za-z0-9]", password), "one special character"),
    ]
    missing = [label for matched, label in requirements if not matched]

    if missing:
        raise ValueError(f"Admin passwords must include at least {', '.join(missing)}.")


def sanitize_user(row: dict[str, Any] | None) -> dict[str, Any] | None:
    if not row:
        return None

    return {
        "id": row["id"],
        "username": row["username"],
        "displayName": row["display_name"],
        "role": row["role"],
    }


def verify_admin_credentials(username: str, password: str) -> dict[str, Any] | None:
    with get_connection() as connection:
        user = fetch_one(
            connection,
            """
            SELECT id, username, password_hash, password_salt, display_name, role
            FROM admin_users
            WHERE username = ?
            """,
            (username,),
        )

        if not user:
            return None

        candidate_hash = hash_password(password, user["password_salt"])

        if not hmac.compare_digest(candidate_hash, user["password_hash"]):
            return None

        return sanitize_user(user)


def upsert_admin_user(
    *,
    username: str,
    password: str,
    display_name: str = "Sentinel Admin",
    role: str = "admin",
) -> dict[str, Any]:
    validate_admin_password(password)
    salt = generate_password_salt()
    password_hash = hash_password(password, salt)
    normalized_username = username.strip() or "admin"
    normalized_display_name = display_name.strip() or normalized_username

    with get_connection() as connection:
        existing = fetch_one(
            connection,
            "SELECT id FROM admin_users WHERE username = ?",
            (normalized_username,),
        )

        if existing:
            connection.execute(
                """
                UPDATE admin_users
                SET password_hash = ?, password_salt = ?, display_name = ?, role = ?
                WHERE username = ?
                """,
                (password_hash, salt, normalized_display_name, role, normalized_username),
            )
        else:
            connection.execute(
                """
                INSERT INTO admin_users (username, password_hash, password_salt, display_name, role)
                VALUES (?, ?, ?, ?, ?)
                """,
                (normalized_username, password_hash, salt, normalized_display_name, role),
            )

        connection.commit()

        user = fetch_one(
            connection,
            """
            SELECT id, username, display_name, role
            FROM admin_users
            WHERE username = ?
            """,
            (normalized_username,),
        )

        return sanitize_user(user) or {}


def change_admin_password(user_id: int, current_password: str, new_password: str) -> dict[str, Any] | None:
    current_password = current_password.strip()
    if not current_password or not new_password:
        raise ValueError("Current password and new password are required.")

    if current_password == new_password:
        raise ValueError("Choose a new password that is different from the current password.")

    validate_admin_password(new_password)

    with get_connection() as connection:
        user = fetch_one(
            connection,
            """
            SELECT id, username, password_hash, password_salt, display_name, role
            FROM admin_users
            WHERE id = ?
            """,
            (user_id,),
        )

        if not user:
            return None

        current_hash = hash_password(current_password, user["password_salt"])
        if not hmac.compare_digest(current_hash, user["password_hash"]):
            raise ValueError("Current password is incorrect.")

        salt = generate_password_salt()
        password_hash = hash_password(new_password, salt)

        connection.execute(
            """
            UPDATE admin_users
            SET password_hash = ?, password_salt = ?
            WHERE id = ?
            """,
            (password_hash, salt, user_id),
        )
        connection.commit()

        return sanitize_user(user)


def fetch_admin_user(user_id: int) -> dict[str, Any] | None:
    with get_connection() as connection:
        user = fetch_one(
            connection,
            """
            SELECT id, username, display_name, role
            FROM admin_users
            WHERE id = ?
            """,
            (user_id,),
        )
        return sanitize_user(user)


def fetch_public_posts(
    *,
    limit: int | None = None,
    search: str = "",
    include_content: bool = False,
) -> list[dict[str, Any]]:
    with get_connection() as connection:
        query = [
            "SELECT id, slug, title, excerpt, category, status, is_featured, created_at, updated_at, published_at"
        ]

        if include_content:
            query.append(", content")

        query.append("FROM blog_posts WHERE status = 'published'")
        params: list[Any] = []

        if search:
            query.append("AND (title LIKE ? OR excerpt LIKE ? OR category LIKE ? OR content LIKE ?)")
            term = f"%{search}%"
            params.extend([term, term, term, term])

        query.append("ORDER BY COALESCE(published_at, created_at) DESC")

        if limit is not None:
            query.append("LIMIT ?")
            params.append(limit)

        posts = fetch_all(connection, " ".join(query), tuple(params))

        for post in posts:
            post["isFeatured"] = bool(post.pop("is_featured"))

        return posts


def fetch_post_by_slug(slug: str) -> dict[str, Any] | None:
    posts = fetch_public_posts(include_content=True)
    for post in posts:
        if post["slug"] == slug:
            return post
    return None


def fetch_admin_posts(limit: int | None = None) -> list[dict[str, Any]]:
    with get_connection() as connection:
        query = """
        SELECT id, slug, title, excerpt, content, category, status, is_featured, created_at, updated_at, published_at
        FROM blog_posts
        ORDER BY updated_at DESC
        """
        params: tuple[Any, ...] = ()

        if limit is not None:
            query += " LIMIT ?"
            params = (limit,)

        posts = fetch_all(connection, query, params)

        for post in posts:
            post["isFeatured"] = bool(post.pop("is_featured"))

        return posts


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "post"


def generate_unique_slug(
    connection: sqlite3.Connection,
    title: str,
    *,
    exclude_id: int | None = None,
) -> str:
    base_slug = slugify(title)
    candidate = base_slug
    counter = 2

    while True:
        if exclude_id is None:
            row = fetch_one(connection, "SELECT id FROM blog_posts WHERE slug = ?", (candidate,))
        else:
            row = fetch_one(
                connection,
                "SELECT id FROM blog_posts WHERE slug = ? AND id != ?",
                (candidate, exclude_id),
            )

        if not row:
            return candidate

        candidate = f"{base_slug}-{counter}"
        counter += 1


def create_post(payload: dict[str, Any]) -> dict[str, Any]:
    title = str(payload.get("title", "")).strip()
    excerpt = str(payload.get("excerpt", "")).strip()
    content = str(payload.get("content", "")).strip()
    category = str(payload.get("category", "Cybersecurity")).strip() or "Cybersecurity"
    status = str(payload.get("status", "draft")).strip() or "draft"
    is_featured = 1 if payload.get("isFeatured") else 0

    with get_connection() as connection:
        slug = generate_unique_slug(connection, title)
        published_at = "CURRENT_TIMESTAMP" if status == "published" else "NULL"

        connection.execute(
            f"""
            INSERT INTO blog_posts (slug, title, excerpt, content, category, status, is_featured, updated_at, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, {published_at})
            """,
            (slug, title, excerpt, content, category, status, is_featured),
        )
        connection.commit()

        post_id = fetch_scalar(connection, "SELECT last_insert_rowid()")
        return fetch_one(
            connection,
            """
            SELECT id, slug, title, excerpt, content, category, status, is_featured, created_at, updated_at, published_at
            FROM blog_posts
            WHERE id = ?
            """,
            (post_id,),
        ) or {}


def update_post(post_id: int, payload: dict[str, Any]) -> dict[str, Any] | None:
    with get_connection() as connection:
        current = fetch_one(connection, "SELECT * FROM blog_posts WHERE id = ?", (post_id,))

        if not current:
            return None

        title = str(payload.get("title", current["title"])).strip()
        excerpt = str(payload.get("excerpt", current["excerpt"])).strip()
        content = str(payload.get("content", current["content"])).strip()
        category = str(payload.get("category", current["category"])).strip() or current["category"]
        status = str(payload.get("status", current["status"])).strip() or current["status"]
        is_featured = 1 if payload.get("isFeatured", bool(current["is_featured"])) else 0
        slug = current["slug"] or generate_unique_slug(connection, title, exclude_id=post_id)

        if title != current["title"] and not current["slug"]:
            slug = generate_unique_slug(connection, title, exclude_id=post_id)

        published_at = current["published_at"]
        if status == "published" and not published_at:
            published_at = fetch_scalar(connection, "SELECT CURRENT_TIMESTAMP")

        if status != "published":
            published_at = None

        connection.execute(
            """
            UPDATE blog_posts
            SET slug = ?, title = ?, excerpt = ?, content = ?, category = ?, status = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP, published_at = ?
            WHERE id = ?
            """,
            (slug, title, excerpt, content, category, status, is_featured, published_at, post_id),
        )
        connection.commit()

        updated = fetch_one(
            connection,
            """
            SELECT id, slug, title, excerpt, content, category, status, is_featured, created_at, updated_at, published_at
            FROM blog_posts
            WHERE id = ?
            """,
            (post_id,),
        )

        if updated:
            updated["isFeatured"] = bool(updated.pop("is_featured"))

        return updated


def delete_post(post_id: int) -> bool:
    with get_connection() as connection:
        cursor = connection.execute("DELETE FROM blog_posts WHERE id = ?", (post_id,))
        connection.commit()
        return cursor.rowcount > 0


def fetch_dashboard_payload() -> dict[str, Any]:
    with get_connection() as connection:
        settings = fetch_settings(connection)
        metrics = fetch_all(
            connection,
            """
            SELECT label, value, suffix
            FROM metrics
            ORDER BY display_order
            """,
        )
        regions = fetch_all(
            connection,
            """
            SELECT name, sector, level
            FROM regions
            ORDER BY display_order
            """,
        )
        feed_set_rows = fetch_all(
            connection,
            """
            SELECT id
            FROM feed_sets
            ORDER BY display_order
            """,
        )
        feed_sets: list[list[dict[str, Any]]] = []

        for feed_set in feed_set_rows:
            feed_sets.append(
                fetch_all(
                    connection,
                    """
                    SELECT title, text, tag
                    FROM feed_items
                    WHERE set_id = ?
                    ORDER BY display_order
                    """,
                    (feed_set["id"],),
                )
            )

        services = fetch_all(
            connection,
            """
            SELECT title, text, tag
            FROM services
            ORDER BY display_order
            """,
        )
        timeline = fetch_all(
            connection,
            """
            SELECT title, text
            FROM timeline_steps
            ORDER BY display_order
            """,
        )
        score_bars = fetch_all(
            connection,
            """
            SELECT label, value
            FROM score_bars
            ORDER BY display_order
            """,
        )
        stories = fetch_all(
            connection,
            """
            SELECT id, title, text
            FROM case_stories
            ORDER BY display_order
            """,
        )

        for story in stories:
            story["kpis"] = fetch_all(
                connection,
                """
                SELECT label, value
                FROM case_story_kpis
                WHERE story_id = ?
                ORDER BY display_order
                """,
                (story["id"],),
            )
            story.pop("id", None)

        featured_posts = fetch_public_posts(limit=3)

        return {
            "heroSignal": {
                "label": settings.get("priority_advisory_label", "Priority Advisory"),
                "headline": settings.get(
                    "priority_advisory_headline",
                    "Credential-stuffing traffic spike detected in retail sector.",
                ),
                "linkText": settings.get("priority_advisory_link_text", "View response pattern"),
                "linkTarget": settings.get("priority_advisory_url", "#stories"),
            },
            "metrics": metrics,
            "regions": regions,
            "feedSets": feed_sets,
            "services": services,
            "timeline": timeline,
            "maturity": {
                "score": int(settings.get("maturity_score", "86")),
                "label": settings.get("maturity_label", "Adaptive"),
            },
            "scoreBars": score_bars,
            "stories": stories,
            "featuredPosts": featured_posts,
        }


def save_contact_submission(payload: dict[str, str]) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO contact_submissions (name, email, company, priority, message)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                payload["name"],
                payload["email"],
                payload.get("company", ""),
                payload["priority"],
                payload.get("message", ""),
            ),
        )
        connection.commit()


def fetch_contact_submissions(limit: int = 50) -> list[dict[str, Any]]:
    with get_connection() as connection:
        return fetch_all(
            connection,
            """
            SELECT id, name, email, company, priority, message, created_at
            FROM contact_submissions
            ORDER BY created_at DESC
            LIMIT ?
            """,
            (limit,),
        )


def save_scan_result(payload: dict[str, Any]) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO scan_history (
              requested_url,
              normalized_url,
              final_url,
              keyword,
              status_code,
              title,
              meta_description,
              content_type,
              server_header,
              security_score,
              internal_links,
              external_links,
              forms_count,
              keyword_matches,
              headers_json,
              findings_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload["requestedUrl"],
                payload["normalizedUrl"],
                payload["finalUrl"],
                payload.get("keyword", ""),
                payload.get("statusCode"),
                payload.get("title", ""),
                payload.get("metaDescription", ""),
                payload.get("contentType", ""),
                payload.get("serverHeader", ""),
                payload.get("securityScore", 0),
                payload.get("internalLinks", 0),
                payload.get("externalLinks", 0),
                payload.get("formsCount", 0),
                payload.get("keywordMatches", 0),
                json.dumps(payload.get("securityHeaders", [])),
                json.dumps(
                    {
                        "findings": payload.get("findings", []),
                        "keywordSnippets": payload.get("keywordSnippets", []),
                    }
                ),
            ),
        )
        connection.commit()


def fetch_scan_history(limit: int = 25) -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = fetch_all(
            connection,
            """
            SELECT id, requested_url, final_url, keyword, status_code, title, security_score, keyword_matches, analyzed_at, findings_json
            FROM scan_history
            ORDER BY analyzed_at DESC
            LIMIT ?
            """,
            (limit,),
        )

        for row in rows:
            details = json.loads(row.pop("findings_json"))
            row["findings"] = details.get("findings", [])
            row["keywordSnippets"] = details.get("keywordSnippets", [])

        return rows


def fetch_admin_overview() -> dict[str, Any]:
    with get_connection() as connection:
        average_score = fetch_scalar(
            connection,
            "SELECT ROUND(AVG(security_score), 1) FROM scan_history",
        )

        return {
            "stats": {
                "contacts": fetch_scalar(connection, "SELECT COUNT(*) FROM contact_submissions"),
                "publishedPosts": fetch_scalar(
                    connection,
                    "SELECT COUNT(*) FROM blog_posts WHERE status = 'published'",
                ),
                "scans": fetch_scalar(connection, "SELECT COUNT(*) FROM scan_history"),
                "averageScore": average_score or 0,
            },
            "recentContacts": fetch_contact_submissions(limit=5),
            "recentScans": fetch_scan_history(limit=5),
            "recentPosts": fetch_admin_posts(limit=5),
        }
