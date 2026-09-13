const defaultConfig = {
  backend: "python",
  endpoints: {
    python: {
      posts: "/api/posts",
      postDetailBase: "/api/posts/"
    }
  }
};

const runtimeConfig = window.SentinelConfig || defaultConfig;
const endpoints =
  runtimeConfig.endpoints?.[runtimeConfig.backend] || defaultConfig.endpoints.python;

const searchForm = document.getElementById("blogSearchForm");
const blogList = document.getElementById("blogList");
const blogDetail = document.getElementById("blogDetail");
const blogMessage = document.getElementById("blogMessage");
const blogMeta = document.getElementById("blogMeta");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const state = {
  posts: [],
  activeSlug: new URLSearchParams(window.location.search).get("slug") || ""
};

function formatDate(value) {
  if (!value) {
    return "Draft";
  }

  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function renderPostList() {
  if (state.posts.length === 0) {
    blogList.innerHTML = `
      <article class="briefing-card empty-state">
        <h3>No published posts found</h3>
        <p>Use the admin dashboard to publish a briefing and it will appear here.</p>
      </article>
    `;
    blogMeta.textContent = "0 posts";
    return;
  }

  blogMeta.textContent = `${state.posts.length} posts`;
  blogList.innerHTML = state.posts
    .map(
      (post) => `
        <article class="briefing-card ${post.slug === state.activeSlug ? "active" : ""}" data-slug="${post.slug}">
          <div class="briefing-topline">
            <span class="pill">${post.category}</span>
            <span>${formatDate(post.published_at)}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="briefing-footer">
            <span>${post.isFeatured ? "Featured" : "Published"}</span>
            <a href="blog.html?slug=${encodeURIComponent(post.slug)}">Open article</a>
          </div>
        </article>
      `
    )
    .join("");

  blogList.querySelectorAll("[data-slug]").forEach((card) => {
    card.addEventListener("click", () => {
      const slug = card.getAttribute("data-slug") || "";
      if (!slug) {
        return;
      }
      state.activeSlug = slug;
      history.replaceState({}, "", `blog.html?slug=${encodeURIComponent(slug)}`);
      renderPostList();
      loadPostDetail(slug);
    });
  });
}

function renderPostDetail(post) {
  blogDetail.innerHTML = `
    <p class="eyebrow">${post.category}</p>
    <h2>${post.title}</h2>
    <div class="detail-meta">
      <span>${formatDate(post.published_at)}</span>
      <span>${post.isFeatured ? "Featured briefing" : "Published briefing"}</span>
      <span>${post.slug}</span>
    </div>
    <p class="lead-copy">${post.excerpt}</p>
    <div class="article-body">
      ${String(post.content)
        .split(/\n{2,}/)
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join("")}
    </div>
  `;
}

async function loadPosts(query = "") {
  blogMessage.textContent = "Loading posts...";

  try {
    const searchParams = new URLSearchParams();
    if (query) {
      searchParams.set("q", query);
    }

    const response = await fetch(`${endpoints.posts}?${searchParams.toString()}`);
    const posts = await response.json();

    if (!response.ok) {
      throw new Error("Unable to load blog posts.");
    }

    state.posts = posts;
    if (!posts.some((post) => post.slug === state.activeSlug)) {
      state.activeSlug = posts[0]?.slug || "";
    }

    if (state.activeSlug && posts[0]) {
      history.replaceState({}, "", `blog.html?slug=${encodeURIComponent(state.activeSlug)}`);
    }

    renderPostList();

    if (state.activeSlug) {
      await loadPostDetail(state.activeSlug);
    } else {
      blogDetail.innerHTML = `
        <p class="eyebrow">Article View</p>
        <h2>No article selected</h2>
        <p class="muted-copy">Search results are loaded, but no article is currently selected.</p>
      `;
    }

    blogMessage.textContent = "";
  } catch (error) {
    blogMessage.textContent = error.message || "Unable to load posts.";
  }
}

async function loadPostDetail(slug) {
  if (!slug) {
    return;
  }

  try {
    const response = await fetch(`${endpoints.postDetailBase || "/api/posts/"}${encodeURIComponent(slug)}`);
    const post = await response.json();

    if (!response.ok) {
      throw new Error(post.message || "Unable to load article.");
    }

    renderPostDetail(post);
  } catch (error) {
    blogDetail.innerHTML = `
      <p class="eyebrow">Article View</p>
      <h2>Unable to load this article</h2>
      <p class="muted-copy">${error.message || "Please try another post."}</p>
    `;
  }
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(searchForm);
  const query = String(formData.get("query") || "").trim();
  await loadPosts(query);
});

if (menuToggle && navLinks && menuToggle.dataset.navBound !== "true") {
  menuToggle.dataset.navBound = "true";
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });
}

loadPosts();
