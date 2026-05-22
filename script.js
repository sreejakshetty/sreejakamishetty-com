// ─── Blog Data ────────────────────────────────────────────────────────────────
// To publish a new weekly post, prepend a new object to this array.
// Fields:
//   id        — unique slug (kebab-case)
//   title     — post title
//   date      — display date, e.g. "May 2026"
//   category  — short label, e.g. "AI & Engineering" | "Leadership" | "Open Source"
//   readTime  — e.g. "5 min read"
//   summary   — one-sentence teaser shown on the card
//   content   — array of paragraph strings shown in the full-post modal
// ─────────────────────────────────────────────────────────────────────────────
const blogsData = [
    {
        id: "blog-eval-infra",
        title: "Building Evaluation Infrastructure for Gemini in Chrome",
        date: "March 2026",
        category: "AI & Engineering",
        readTime: "6 min read",
        summary: "How we approach measuring model quality for on-device AI features in Chrome — and why evaluation is the hardest unsolved problem in production AI.",
        content: [
            "Shipping AI to billions of Chrome users is fundamentally a quality problem. You can train the best model in the world, but if you can't reliably measure its behaviour across thousands of diverse real-world tasks, you can't safely ship it.",
            "Our evaluation infrastructure for Gemini in Chrome is built around a hybrid approach: automated LLM-as-a-judge scorers for scale, combined with human-in-the-loop workflows for the cases that matter most. This lets us iterate fast without trading away safety.",
            "One of the hardest challenges is stateful evaluation — when an agent interacts with Gmail, Calendar, or Drive, the outcome depends on the entire prior conversation state. We solved this by designing a deterministic state management layer that snapshots and restores real First-Party application state, making previously non-reproducible interactions fully testable.",
            "The key insight: evaluation infrastructure is product infrastructure. It's not a QA afterthought — it's what lets you move fast with confidence. Every week I'm more convinced that the teams who win in production AI are the ones who invest earliest in measurement."
        ]
    },
    {
        id: "blog-spiritual-optimism",
        title: "The Power of Spiritual Optimism in Tech Leadership",
        date: "January 2026",
        category: "Leadership",
        readTime: "5 min read",
        summary: "Why empathy and compassion are the real secret weapons of scale — and what 'spiritual optimism' actually means day-to-day.",
        content: [
            "Spiritual optimism is a phrase I use to describe something I believe deeply: that people are fundamentally capable of more than they currently imagine, and that the job of a leader is to hold that belief on their behalf until they can hold it themselves.",
            "In tech, this manifests as psychological safety — creating the conditions where engineers feel safe to be wrong, to ask questions that might sound naive, to propose wild ideas. Teams with high psychological safety ship better software. The data on this is unambiguous.",
            "The most resilient systems I've seen are built by the most compassionate teams. Not in a soft, sentimental way — but in the rigorous sense that they actually understand each other, communicate clearly under pressure, and share a genuine commitment to the mission.",
            "Compassion-driven leadership also produces less burnout. When people feel seen and understood, they bring their whole selves to hard problems. That's when the best engineering happens."
        ]
    }
];

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    renderBlogs();
    initModal();
    initMobileMenu();
    initSmoothScrolling();
});

// ─── Blog Rendering ───────────────────────────────────────────────────────────

function renderBlogs() {
    const grid = document.getElementById("blogGrid");
    if (!grid) return;

    grid.innerHTML = blogsData.map((blog, index) => `
        <article class="blog-card ${index === 0 ? "blog-card--featured" : ""}">
            <div class="blog-card-meta">
                <span class="blog-category-tag">${blog.category}</span>
                <span class="blog-read-time"><i class="fa-regular fa-clock"></i> ${blog.readTime}</span>
            </div>
            <h3 class="blog-card-title">${blog.title}</h3>
            <time class="blog-card-date">${blog.date}</time>
            <p class="blog-card-summary">${blog.summary}</p>
            <button class="read-more-btn" data-id="${blog.id}" aria-label="Read ${blog.title}">
                Read more <i class="fa-solid fa-arrow-right"></i>
            </button>
        </article>
    `).join("");

    grid.querySelectorAll(".read-more-btn").forEach(btn => {
        btn.addEventListener("click", () => openModal(btn.getAttribute("data-id")));
    });
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function initModal() {
    const overlay = document.getElementById("blog-modal");
    document.getElementById("modalClose").addEventListener("click", closeModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}

function openModal(blogId) {
    const blog = blogsData.find(b => b.id === blogId);
    if (!blog) return;

    document.getElementById("modal-category").textContent = blog.category;
    document.getElementById("modal-title").textContent = blog.title;
    document.getElementById("modal-date").textContent = blog.date;
    document.getElementById("modal-read-time").textContent = blog.readTime;
    document.getElementById("modal-body").innerHTML = blog.content
        .map(para => `<p>${para}</p>`)
        .join("");

    document.getElementById("blog-modal").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("blog-modal").classList.remove("active");
    document.body.style.overflow = "";
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

function initMobileMenu() {
    const btn = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("navLinks");
    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("nav-open");
        btn.classList.toggle("active", isOpen);
        btn.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("nav-open");
            btn.classList.remove("active");
            btn.setAttribute("aria-expanded", "false");
        });
    });
}

// ─── Smooth Scrolling ─────────────────────────────────────────────────────────

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}
