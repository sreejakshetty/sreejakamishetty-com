// ─── Substack Feed ────────────────────────────────────────────────────────────
// Posts are fetched live from the Substack RSS feed via rss2json.
// New posts appear automatically — no code changes needed when you publish.
// ─────────────────────────────────────────────────────────────────────────────

const SUBSTACK_FEED = 'https://browseragentgirl.substack.com/feed';
const RSS2JSON_URL  = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_FEED)}&count=12`;

async function fetchSubstackPosts() {
    const res  = await fetch(RSS2JSON_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('RSS parse error');
    return data.items;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html) {
    const el = document.createElement('div');
    el.innerHTML = html;
    return (el.textContent || el.innerText || '').trim();
}

function formatPubDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function estimateReadTime(html) {
    const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 200))} min read`;
}

// ─── Blog Rendering ───────────────────────────────────────────────────────────

async function renderBlogs() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="blog-loading">
            <span class="blog-loading-dot"></span>
            <span class="blog-loading-dot"></span>
            <span class="blog-loading-dot"></span>
            <span>Loading posts…</span>
        </div>`;

    let posts;
    try {
        posts = await fetchSubstackPosts();
    } catch (e) {
        grid.innerHTML = `
            <p class="blog-error">
                Couldn't load posts right now.
                <a href="${SUBSTACK_FEED.replace('/feed','')}" target="_blank" rel="noopener">Read on Substack →</a>
            </p>`;
        return;
    }

    if (!posts.length) {
        grid.innerHTML = `<p class="blog-error">No posts found yet. <a href="https://browseragentgirl.substack.com" target="_blank" rel="noopener">Visit Substack →</a></p>`;
        return;
    }

    grid.innerHTML = posts.map((item, index) => {
        const category = item.categories?.[0] || 'Newsletter';
        const date     = formatPubDate(item.pubDate);
        const readTime = estimateReadTime(item.description || item.content || '');
        const rawSummary = stripHtml(item.description || '');
        const summary  = rawSummary.length > 200 ? rawSummary.slice(0, 200).trimEnd() + '…' : rawSummary;

        return `
            <article class="blog-card ${index === 0 ? 'blog-card--featured' : ''}">
                <div class="blog-card-meta">
                    <span class="blog-category-tag">${category}</span>
                    <span class="blog-read-time"><i class="fa-regular fa-clock"></i> ${readTime}</span>
                </div>
                <h3 class="blog-card-title">${item.title}</h3>
                <time class="blog-card-date">${date}</time>
                <p class="blog-card-summary">${summary}</p>
                <a href="${item.link}" target="_blank" rel="noopener" class="read-more-btn">
                    Read on Substack <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            </article>`;
    }).join('');
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('navLinks');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('nav-open');
        btn.classList.toggle('active', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-open');
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
}

// ─── Smooth Scrolling ─────────────────────────────────────────────────────────

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    renderBlogs();
    initMobileMenu();
    initSmoothScrolling();
});
