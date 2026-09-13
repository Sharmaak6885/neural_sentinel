from __future__ import annotations

import ipaddress
import re
import socket
from datetime import UTC, datetime
from html.parser import HTMLParser
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen

USER_AGENT = "SentinelGrid-SiteIntel/1.0"
MAX_RESPONSE_BYTES = 1_000_000
RESOURCE_PREVIEW_BYTES = 4096
TIMEOUT_SECONDS = 8
SECURITY_HEADERS = [
    ("strict-transport-security", 18, "HSTS is missing."),
    ("content-security-policy", 20, "Content Security Policy is missing."),
    ("x-frame-options", 12, "X-Frame-Options is missing."),
    ("x-content-type-options", 10, "X-Content-Type-Options is missing."),
    ("referrer-policy", 6, "Referrer-Policy is missing."),
    ("permissions-policy", 6, "Permissions-Policy is missing."),
]


class PageSummaryParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_title = False
        self.title_parts: list[str] = []
        self.meta_description = ""
        self.links: list[str] = []
        self.form_actions: list[str] = []
        self.text_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)

        if tag == "title":
            self.in_title = True

        if tag == "meta":
            name = (attributes.get("name") or attributes.get("property") or "").lower()
            if name in {"description", "og:description"} and not self.meta_description:
                self.meta_description = attributes.get("content", "") or ""

        if tag == "a" and attributes.get("href"):
            self.links.append(attributes["href"])

        if tag == "form":
            self.form_actions.append(attributes.get("action") or "")

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        cleaned = " ".join(data.split())
        if not cleaned:
            return

        if self.in_title:
            self.title_parts.append(cleaned)
        else:
            self.text_parts.append(cleaned)

    @property
    def title(self) -> str:
        return " ".join(self.title_parts).strip()

    @property
    def visible_text(self) -> str:
        return " ".join(self.text_parts).strip()


def normalize_target_url(target_url: str) -> str:
    candidate = target_url.strip()
    if not candidate:
        raise ValueError("A website URL is required.")

    if "://" not in candidate:
        candidate = f"https://{candidate}"

    parsed = urlparse(candidate)

    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Only http and https URLs are allowed.")

    if parsed.username or parsed.password:
        raise ValueError("Credentials are not allowed in URLs.")

    if parsed.port and parsed.port not in {80, 443}:
        raise ValueError("Only standard web ports 80 and 443 are allowed.")

    if not parsed.hostname:
        raise ValueError("A valid public hostname is required.")

    normalized = parsed._replace(fragment="")
    validate_public_hostname(normalized.hostname, normalized.port or default_port(normalized.scheme))
    return urlunparse(normalized)


def default_port(scheme: str) -> int:
    return 443 if scheme == "https" else 80


def validate_public_hostname(hostname: str, port: int) -> None:
    try:
        addresses = socket.getaddrinfo(hostname, port, proto=socket.IPPROTO_TCP)
    except socket.gaierror as error:
        raise ValueError("The hostname could not be resolved.") from error

    for address in addresses:
        ip = ipaddress.ip_address(address[4][0])
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_reserved
            or ip.is_multicast
            or ip.is_unspecified
        ):
            raise ValueError("Only publicly reachable websites can be analyzed.")


def fetch_resource(target_url: str, *, max_bytes: int) -> tuple[int, str, dict[str, str], bytes]:
    request = Request(
        target_url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    )

    try:
        with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            status_code = response.getcode()
            final_url = response.geturl()
            parsed_final = urlparse(final_url)
            validate_public_hostname(parsed_final.hostname or "", parsed_final.port or default_port(parsed_final.scheme))
            headers = {key.lower(): value for key, value in response.headers.items()}
            body = response.read(max_bytes + 1)
            return status_code, final_url, headers, body[:max_bytes]
    except HTTPError as error:
        return error.code, target_url, {key.lower(): value for key, value in error.headers.items()}, b""
    except URLError as error:
        raise ValueError("The website could not be reached within the safety limits.") from error


def check_auxiliary_resource(resource_url: str) -> bool:
    request = Request(resource_url, headers={"User-Agent": USER_AGENT})

    try:
        with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            response.read(RESOURCE_PREVIEW_BYTES)
            return 200 <= response.getcode() < 400
    except Exception:
        return False


def categorize_links(links: list[str], base_url: str) -> tuple[int, int]:
    parsed_base = urlparse(base_url)
    internal = 0
    external = 0

    for link in links:
        if link.startswith("#") or link.startswith("mailto:") or link.startswith("tel:"):
            continue

        absolute = urlparse(urljoin(base_url, link))
        if not absolute.scheme.startswith("http"):
            continue

        if absolute.hostname == parsed_base.hostname:
            internal += 1
        else:
            external += 1

    return internal, external


def evaluate_security_headers(headers: dict[str, str], final_url: str) -> tuple[int, list[dict[str, Any]], list[str]]:
    score = 100
    header_details: list[dict[str, Any]] = []
    findings: list[str] = []

    if urlparse(final_url).scheme != "https":
        score -= 22
        findings.append("The final URL is not using HTTPS.")

    for header_name, penalty, missing_message in SECURITY_HEADERS:
        value = headers.get(header_name, "")
        present = bool(value)
        header_details.append({"name": header_name, "present": present, "value": value})

        if not present:
            score -= penalty
            findings.append(missing_message)

    return max(score, 0), header_details, findings


def extract_keyword_snippets(text: str, keyword: str) -> tuple[int, list[str]]:
    if not keyword:
        return 0, []

    pattern = re.compile(re.escape(keyword), re.IGNORECASE)
    matches = list(pattern.finditer(text))
    snippets: list[str] = []

    for match in matches[:5]:
        start = max(match.start() - 60, 0)
        end = min(match.end() + 60, len(text))
        snippet = text[start:end].strip()
        snippets.append(re.sub(r"\s+", " ", snippet))

    return len(matches), snippets


def analyze_public_website(target_url: str, keyword: str = "") -> dict[str, Any]:
    normalized_url = normalize_target_url(target_url)
    status_code, final_url, headers, body = fetch_resource(normalized_url, max_bytes=MAX_RESPONSE_BYTES)
    content_type = headers.get("content-type", "")
    parser = PageSummaryParser()

    if body and "html" in content_type.lower():
        parser.feed(body.decode("utf-8", errors="ignore"))

    internal_links, external_links = categorize_links(parser.links, final_url)
    security_score, security_headers, findings = evaluate_security_headers(headers, final_url)
    keyword_matches, keyword_snippets = extract_keyword_snippets(parser.visible_text.lower(), keyword.lower())

    if parser.form_actions and urlparse(final_url).scheme != "https":
        findings.append("The page exposes forms without HTTPS.")

    root = urlparse(final_url)
    root_base = f"{root.scheme}://{root.netloc}"
    robots_exists = check_auxiliary_resource(urljoin(root_base, "/robots.txt"))
    sitemap_exists = check_auxiliary_resource(urljoin(root_base, "/sitemap.xml"))

    if not robots_exists:
        findings.append("robots.txt was not found on the public root path.")

    if not sitemap_exists:
        findings.append("sitemap.xml was not found on the public root path.")

    return {
        "requestedUrl": target_url.strip(),
        "normalizedUrl": normalized_url,
        "finalUrl": final_url,
        "statusCode": status_code,
        "contentType": content_type,
        "title": parser.title,
        "metaDescription": parser.meta_description,
        "serverHeader": headers.get("server", ""),
        "securityScore": security_score,
        "securityHeaders": security_headers,
        "internalLinks": internal_links,
        "externalLinks": external_links,
        "formsCount": len(parser.form_actions),
        "keyword": keyword,
        "keywordMatches": keyword_matches,
        "keywordSnippets": keyword_snippets,
        "previewText": parser.visible_text[:320],
        "robotsTxt": {"checked": True, "found": robots_exists},
        "sitemapXml": {"checked": True, "found": sitemap_exists},
        "findings": findings,
        "analyzedAt": datetime.now(UTC).isoformat(),
        "safeMode": "Passive public-page analysis only. No brute force, port scans, or exploit checks are performed.",
    }
