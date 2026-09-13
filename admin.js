const defaultConfig = {
  backend: "python",
  endpoints: {
    python: {
      adminSession: "/api/admin/session",
      adminLogin: "/api/admin/login",
      adminPassword: "/api/admin/password",
      adminLogout: "/api/admin/logout",
      adminOverview: "/api/admin/overview",
      adminContacts: "/api/admin/contacts",
      adminScans: "/api/admin/scans",
      adminPosts: "/api/admin/posts"
    }
  }
};

const runtimeConfig = window.SentinelConfig || defaultConfig;
const endpoints =
  runtimeConfig.endpoints?.[runtimeConfig.backend] || defaultConfig.endpoints.python;

const loginView = document.getElementById("loginView");
const adminView = document.getElementById("adminView");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");
const overviewGrid = document.getElementById("overviewGrid");
const contactsList = document.getElementById("contactsList");
const scansList = document.getElementById("scansList");
const postsList = document.getElementById("postsList");
const postForm = document.getElementById("postForm");
const postMessage = document.getElementById("postMessage");
const cancelEditButton = document.getElementById("cancelEditButton");
const passwordForm = document.getElementById("passwordForm");
const passwordMessage = document.getElementById("passwordMessage");
const editorState = document.getElementById("editorState");
const adminName = document.getElementById("adminName");
const adminRole = document.getElementById("adminRole");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

const state = {
  user: null,
  posts: []
};
const postIdInput = postForm.querySelector('input[name="postId"]');

function resetPasswordForm() {
  if (passwordForm) {
    passwordForm.reset();
  }

  if (passwordMessage) {
    passwordMessage.textContent = "";
  }
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function setAuthenticatedView(authenticated) {
  loginView.classList.toggle("hidden", authenticated);
  adminView.classList.toggle("hidden", !authenticated);
}

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderOverview(overview) {
  const stats = overview.stats || {};

  overviewGrid.innerHTML = `
    <article class="mini-stat"><span>Contacts</span><strong>${stats.contacts ?? 0}</strong></article>
    <article class="mini-stat"><span>Published Posts</span><strong>${stats.publishedPosts ?? 0}</strong></article>
    <article class="mini-stat"><span>Scans</span><strong>${stats.scans ?? 0}</strong></article>
    <article class="mini-stat"><span>Average Score</span><strong>${stats.averageScore ?? 0}</strong></article>
  `;
}

function renderContacts(items) {
  if (!items.length) {
    contactsList.innerHTML = `<div class="empty-state"><p>No contact submissions yet.</p></div>`;
    return;
  }

  contactsList.innerHTML = items
    .map(
      (item) => `
        <article class="record-card">
          <div class="record-topline">
            <strong>${item.name}</strong>
            <span>${formatDate(item.created_at)}</span>
          </div>
          <p>${item.email}${item.company ? ` - ${item.company}` : ""}</p>
          <span class="pill">${item.priority}</span>
          <p class="muted-copy">${item.message || "No message provided."}</p>
        </article>
      `
    )
    .join("");
}

function renderScans(items) {
  if (!items.length) {
    scansList.innerHTML = `<div class="empty-state"><p>No site analysis history yet.</p></div>`;
    return;
  }

  scansList.innerHTML = items
    .map(
      (item) => `
        <article class="record-card">
          <div class="record-topline">
            <strong>${item.title || item.final_url}</strong>
            <span>${formatDate(item.analyzed_at)}</span>
          </div>
          <p>${item.requested_url}</p>
          <div class="record-tags">
            <span class="pill">Score ${item.security_score}</span>
            <span class="pill">${item.status_code || "N/A"}</span>
            <span class="pill">${item.keyword ? `Keyword: ${item.keyword}` : "No keyword"}</span>
          </div>
          <ul class="compact-list">
            ${(item.findings || [])
              .slice(0, 3)
              .map((finding) => `<li>${finding}</li>`)
              .join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function fillPostForm(post = null) {
  postForm.reset();
  postIdInput.value = post?.id || "";
  postForm.querySelector('[name="title"]').value = post?.title || "";
  postForm.querySelector('[name="excerpt"]').value = post?.excerpt || "";
  postForm.querySelector('[name="content"]').value = post?.content || "";
  postForm.querySelector('[name="category"]').value = post?.category || "Cybersecurity";
  postForm.querySelector('[name="status"]').value = post?.status || "draft";
  postForm.querySelector('[name="isFeatured"]').checked = Boolean(post?.isFeatured);
  editorState.textContent = post ? `Editing: ${post.title}` : "New post";
  postMessage.textContent = "";
}

function renderPosts(items) {
  state.posts = items;

  if (!items.length) {
    postsList.innerHTML = `<div class="empty-state"><p>No posts saved yet.</p></div>`;
    return;
  }

  postsList.innerHTML = items
    .map(
      (post) => `
        <article class="record-card" data-post-id="${post.id}">
          <div class="record-topline">
            <strong>${post.title}</strong>
            <span>${post.status}</span>
          </div>
          <p>${post.category} - ${post.slug}</p>
          <p class="muted-copy">${post.excerpt}</p>
          <div class="record-tags">
            <span class="pill">${post.isFeatured ? "Featured" : "Standard"}</span>
            <span class="pill">${formatDate(post.updated_at)}</span>
          </div>
          <div class="form-actions">
            <button class="button button-secondary" type="button" data-action="edit">Edit</button>
            <button class="button button-secondary" type="button" data-action="delete">Delete</button>
          </div>
        </article>
      `
    )
    .join("");

  postsList.querySelectorAll("[data-post-id]").forEach((card) => {
    const postId = Number(card.getAttribute("data-post-id"));

    card.querySelector('[data-action="edit"]').addEventListener("click", () => {
      const post = state.posts.find((item) => item.id === postId);
      fillPostForm(post);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    card.querySelector('[data-action="delete"]').addEventListener("click", async () => {
      try {
        await apiRequest(`${endpoints.adminPosts}/${postId}`, { method: "DELETE" });
        postMessage.textContent = "Post deleted.";
        await loadAdminData();
        fillPostForm();
      } catch (error) {
        postMessage.textContent = error.message;
      }
    });
  });
}

async function loadAdminData() {
  const [overview, contacts, scans, posts] = await Promise.all([
    apiRequest(endpoints.adminOverview),
    apiRequest(endpoints.adminContacts),
    apiRequest(endpoints.adminScans),
    apiRequest(endpoints.adminPosts)
  ]);

  renderOverview(overview);
  renderContacts(contacts);
  renderScans(scans);
  renderPosts(posts);
}

async function refreshSession() {
  const sessionData = await apiRequest(endpoints.adminSession);

  if (!sessionData.authenticated) {
    state.user = null;
    resetPasswordForm();
    setAuthenticatedView(false);
    return;
  }

  state.user = sessionData.user;
  adminName.textContent = sessionData.user.displayName;
  adminRole.textContent = sessionData.user.role;
  setAuthenticatedView(true);
  resetPasswordForm();
  await loadAdminData();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = {
    username: String(formData.get("username") || "").trim(),
    password: String(formData.get("password") || "").trim()
  };

  try {
    const result = await apiRequest(endpoints.adminLogin, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    loginMessage.textContent = result.message;
    await refreshSession();
  } catch (error) {
    loginMessage.textContent = error.message;
  }
});

logoutButton.addEventListener("click", async () => {
  await apiRequest(endpoints.adminLogout, { method: "POST" });
  fillPostForm();
  resetPasswordForm();
  await refreshSession();
});

if (passwordForm) {
  passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(passwordForm);
    const payload = {
      currentPassword: String(formData.get("currentPassword") || "").trim(),
      newPassword: String(formData.get("newPassword") || "").trim(),
      confirmPassword: String(formData.get("confirmPassword") || "").trim()
    };

    if (payload.newPassword !== payload.confirmPassword) {
      passwordMessage.textContent = "New password and confirmation do not match.";
      return;
    }

    try {
      const result = await apiRequest(endpoints.adminPassword, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      resetPasswordForm();
      await refreshSession();
      passwordMessage.textContent = result.message;
    } catch (error) {
      passwordMessage.textContent = error.message;
    }
  });
}

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(postForm);
  const postId = String(formData.get("postId") || "").trim();
  const payload = {
    title: String(formData.get("title") || "").trim(),
    excerpt: String(formData.get("excerpt") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    status: String(formData.get("status") || "draft").trim(),
    isFeatured: formData.get("isFeatured") === "on"
  };

  try {
    if (postId) {
      await apiRequest(`${endpoints.adminPosts}/${postId}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      postMessage.textContent = "Post updated.";
    } else {
      await apiRequest(endpoints.adminPosts, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      postMessage.textContent = "Post created.";
    }

    fillPostForm();
    await loadAdminData();
  } catch (error) {
    postMessage.textContent = error.message;
  }
});

cancelEditButton.addEventListener("click", () => fillPostForm());

if (menuToggle && navLinks && menuToggle.dataset.navBound !== "true") {
  menuToggle.dataset.navBound = "true";
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });
}

fillPostForm();
resetPasswordForm();
refreshSession().catch(() => {
  setAuthenticatedView(false);
});
