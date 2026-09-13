from __future__ import annotations

import os
import time
from collections import defaultdict, deque
from datetime import UTC, datetime, timedelta
from functools import wraps
from pathlib import Path
from typing import Any, Callable

from flask import Flask, jsonify, request, send_from_directory, session

try:
    from .db import (
        change_admin_password,
        create_post,
        delete_post,
        fetch_admin_overview,
        fetch_admin_posts,
        fetch_admin_user,
        fetch_contact_submissions,
        fetch_dashboard_payload,
        fetch_post_by_slug,
        fetch_public_posts,
        fetch_scan_history,
        initialize_database,
        save_contact_submission,
        save_scan_result,
        update_post,
        verify_admin_credentials,
    )
    from .site_intel import analyze_public_website
except ImportError:
    from db import (
        change_admin_password,
        create_post,
        delete_post,
        fetch_admin_overview,
        fetch_admin_posts,
        fetch_admin_user,
        fetch_contact_submissions,
        fetch_dashboard_payload,
        fetch_post_by_slug,
        fetch_public_posts,
        fetch_scan_history,
        initialize_database,
        save_contact_submission,
        save_scan_result,
        update_post,
        verify_admin_credentials,
    )
    from site_intel import analyze_public_website

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CSP_POLICY = (
    "default-src 'self'; "
    "img-src 'self' data: https:; "
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
    "font-src 'self' https://fonts.gstatic.com data:; "
    "script-src 'self'; "
    "connect-src 'self'; "
    "frame-ancestors 'none'; "
    "base-uri 'self'; "
    "form-action 'self'"
)
RATE_LIMITS = {
    "admin_login": (8, 600),
    "admin_password": (6, 600),
    "site_intelligence": (10, 600),
    "contact": (20, 600),
}
RATE_LIMIT_BUCKETS: defaultdict[tuple[str, str], deque[float]] = defaultdict(deque)

app = Flask(__name__, static_folder=str(PROJECT_ROOT), static_url_path="")
app.secret_key = os.environ.get("SENTINEL_SECRET_KEY", "change-this-sentinel-grid-secret")
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("SENTINEL_SECURE_COOKIES", "false").lower() == "true",
    SESSION_COOKIE_NAME="sentinel_grid_session",
    MAX_CONTENT_LENGTH=1_000_000,
)
initialize_database()


def current_admin() -> dict[str, Any] | None:
    user_id = session.get("admin_user_id")
    if not user_id:
        return None
    return fetch_admin_user(int(user_id))


def admin_required(view: Callable[..., Any]) -> Callable[..., Any]:
    @wraps(view)
    def wrapped(*args: Any, **kwargs: Any) -> Any:
        user = current_admin()
        if not user:
            return jsonify({"message": "Authentication required."}), 401
        return view(user, *args, **kwargs)

    return wrapped


def request_payload() -> dict[str, Any]:
    return request.get_json(silent=True) or request.form.to_dict()


def client_identity() -> str:
    forwarded_for = request.headers.get("X-Forwarded-For", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.remote_addr or "unknown"


def public_base_url() -> str:
    configured = os.environ.get("SENTINEL_PUBLIC_BASE_URL", "").strip()
    if configured:
        return configured.rstrip("/")
    return request.host_url.rstrip("/")


def public_url(path: str) -> str:
    return f"{public_base_url()}/{path.lstrip('/')}"


def is_rate_limited(scope: str) -> bool:
    limit, period = RATE_LIMITS[scope]
    bucket = RATE_LIMIT_BUCKETS[(scope, client_identity())]
    now = time.monotonic()

    while bucket and now - bucket[0] > period:
        bucket.popleft()

    if len(bucket) >= limit:
        return True

    bucket.append(now)
    return False


@app.after_request
def apply_security_headers(response: Any) -> Any:
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    response.headers.setdefault("Content-Security-Policy", CSP_POLICY)

    if request.path.startswith("/api/admin"):
        response.headers["Cache-Control"] = "no-store"

    return response


@app.get("/api/health")
def health() -> Any:
    return jsonify({"status": "ok", "service": "sentinel-grid"})


@app.get("/robots.txt")
def robots_txt() -> Any:
    body = "\n".join(
        [
            "User-agent: *",
            "Allow: /",
            f"Sitemap: {public_url('/sitemap.xml')}",
            "",
        ]
    )
    return app.response_class(body, mimetype="text/plain")


@app.get("/sitemap.xml")
def sitemap_xml() -> Any:
    pages = [
        ("/", None),
        ("/blog.html", None),
        ("/admin.html", None),
        ("/help.html", None),
        ("/privacy.html", None),
        ("/terms.html", None),
    ]
    posts = fetch_public_posts()
    current_timestamp = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    items: list[str] = []

    for path, last_modified in pages:
        loc = public_url(path)
        items.append(
            "<url>"
            f"<loc>{loc}</loc>"
            f"<lastmod>{last_modified or current_timestamp}</lastmod>"
            "</url>"
        )

    for post in posts:
        published_at = str(post.get("published_at") or post.get("updated_at") or "").replace(" ", "T")
        last_modified = f"{published_at}Z" if published_at else current_timestamp
        items.append(
            "<url>"
            f"<loc>{public_url(f'/blog.html?slug={post['slug']}')}</loc>"
            f"<lastmod>{last_modified}</lastmod>"
            "</url>"
        )

    body = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f"{''.join(items)}"
        "</urlset>"
    )
    return app.response_class(body, mimetype="application/xml")


@app.get("/.well-known/security.txt")
def security_txt() -> Any:
    contact_email = os.environ.get("SENTINEL_SECURITY_EMAIL", "hello@neuralsentinel.com").strip()
    expires = (datetime.now(UTC) + timedelta(days=365)).strftime("%Y-%m-%dT%H:%M:%SZ")
    body = "\n".join(
        [
            f"Contact: mailto:{contact_email}",
            f"Expires: {expires}",
            f"Policy: {public_url('/privacy.html')}",
            f"Canonical: {public_url('/.well-known/security.txt')}",
            "Preferred-Languages: en",
            "",
        ]
    )
    return app.response_class(body, mimetype="text/plain")


@app.get("/api/dashboard")
def dashboard() -> Any:
    return jsonify(fetch_dashboard_payload())


@app.get("/api/posts")
def posts() -> Any:
    limit = request.args.get("limit", type=int)
    search = request.args.get("q", default="", type=str)
    return jsonify(fetch_public_posts(limit=limit, search=search))


@app.get("/api/posts/<slug>")
def post_detail(slug: str) -> Any:
    post = fetch_post_by_slug(slug)
    if not post:
        return jsonify({"message": "Post not found."}), 404
    return jsonify(post)


@app.post("/api/contact")
def contact() -> Any:
    if is_rate_limited("contact"):
        return jsonify({"message": "Too many contact submissions from this client. Please wait a few minutes."}), 429

    payload = request_payload()
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip()
    company = str(payload.get("company", "")).strip()
    priority = str(payload.get("priority", "Threat Monitoring")).strip()
    message = str(payload.get("message", "")).strip()

    if not name or not email:
        return jsonify({"message": "Name and email are required."}), 400

    save_contact_submission(
        {
            "name": name,
            "email": email,
            "company": company,
            "priority": priority,
            "message": message,
        }
    )

    return jsonify(
        {
            "message": f"Thanks {name}. Your cybersecurity request has been stored in the SQL queue."
        }
    ), 201


@app.post("/api/site-intelligence")
def site_intelligence() -> Any:
    if is_rate_limited("site_intelligence"):
        return jsonify({"message": "Too many analysis requests from this client. Please wait before trying again."}), 429

    payload = request_payload()
    target_url = str(payload.get("url", "")).strip()
    keyword = str(payload.get("keyword", "")).strip()

    if not target_url:
        return jsonify({"message": "A website URL is required."}), 400

    try:
        result = analyze_public_website(target_url, keyword)
        save_scan_result(result)
        return jsonify(result)
    except ValueError as error:
        return jsonify({"message": str(error)}), 400
    except Exception:
        return jsonify({"message": "The website could not be analyzed safely at this time."}), 502


@app.post("/api/admin/login")
def admin_login() -> Any:
    if is_rate_limited("admin_login"):
        return jsonify({"message": "Too many login attempts. Please wait before trying again."}), 429

    payload = request_payload()
    username = str(payload.get("username", "")).strip()
    password = str(payload.get("password", "")).strip()

    if not username or not password:
        return jsonify({"message": "Username and password are required."}), 400

    user = verify_admin_credentials(username, password)
    if not user:
        return jsonify({"message": "Invalid admin credentials."}), 401

    session.clear()
    session["admin_user_id"] = user["id"]
    return jsonify({"user": user, "message": "Admin session started."})


@app.post("/api/admin/logout")
def admin_logout() -> Any:
    session.clear()
    return jsonify({"message": "Admin session ended."})


@app.get("/api/admin/session")
def admin_session() -> Any:
    user = current_admin()
    return jsonify({"authenticated": bool(user), "user": user})


@app.post("/api/admin/password")
@admin_required
def admin_password(user: dict[str, Any]) -> Any:
    if is_rate_limited("admin_password"):
        return jsonify({"message": "Too many password updates. Please wait before trying again."}), 429

    payload = request_payload()
    current_password = str(payload.get("currentPassword", "")).strip()
    new_password = str(payload.get("newPassword", "")).strip()
    confirm_password = str(payload.get("confirmPassword", "")).strip()

    if new_password != confirm_password:
        return jsonify({"message": "New password and confirmation do not match."}), 400

    try:
        updated_user = change_admin_password(user["id"], current_password, new_password)
    except ValueError as error:
        return jsonify({"message": str(error)}), 400

    if not updated_user:
        session.clear()
        return jsonify({"message": "Admin account not found."}), 404

    session["admin_user_id"] = updated_user["id"]
    return jsonify({"message": "Admin password updated successfully.", "user": updated_user})


@app.get("/api/admin/overview")
@admin_required
def admin_overview(_user: dict[str, Any]) -> Any:
    return jsonify(fetch_admin_overview())


@app.get("/api/admin/contacts")
@admin_required
def admin_contacts(_user: dict[str, Any]) -> Any:
    limit = request.args.get("limit", default=50, type=int)
    return jsonify(fetch_contact_submissions(limit=limit))


@app.get("/api/admin/scans")
@admin_required
def admin_scans(_user: dict[str, Any]) -> Any:
    limit = request.args.get("limit", default=25, type=int)
    return jsonify(fetch_scan_history(limit=limit))


@app.route("/api/admin/posts", methods=["GET", "POST"])
@admin_required
def admin_posts(_user: dict[str, Any]) -> Any:
    if request.method == "GET":
        return jsonify(fetch_admin_posts())

    payload = request_payload()
    if not str(payload.get("title", "")).strip():
        return jsonify({"message": "Post title is required."}), 400
    if not str(payload.get("content", "")).strip():
        return jsonify({"message": "Post content is required."}), 400

    created = create_post(payload)
    if "is_featured" in created:
        created["isFeatured"] = bool(created.pop("is_featured"))

    return jsonify(created), 201


@app.route("/api/admin/posts/<int:post_id>", methods=["PATCH", "DELETE"])
@admin_required
def admin_post_actions(_user: dict[str, Any], post_id: int) -> Any:
    if request.method == "DELETE":
        deleted = delete_post(post_id)
        if not deleted:
            return jsonify({"message": "Post not found."}), 404
        return jsonify({"message": "Post deleted."})

    updated = update_post(post_id, request_payload())
    if not updated:
        return jsonify({"message": "Post not found."}), 404
    return jsonify(updated)


@app.get("/")
def home() -> Any:
    return send_from_directory(PROJECT_ROOT, "index.html")


@app.get("/<path:path>")
def static_files(path: str) -> Any:
    target = PROJECT_ROOT / path

    if path.startswith(("backend/", "database/")):
        return jsonify({"message": "Not found"}), 404

    if target.is_file():
        return send_from_directory(PROJECT_ROOT, path)

    return send_from_directory(PROJECT_ROOT, "index.html")


if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5000"))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host=host, port=port, debug=debug)
