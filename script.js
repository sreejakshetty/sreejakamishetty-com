// Sreeja Kamishetty Website Scripts

// Sample Data for Blogs (You can edit this array to add new blogs!)
const blogsData = [
    {
        id: "blog-eval-infra",
        title: "Building Evaluation Infrastructure for Gemini in Chrome",
        date: "March 2026",
        summary: "How we approach measuring model quality for on-device AI features in Chrome.",
        link: "javascript:void(0)",
        content: "Detailed evaluation infrastructure is key for on-device AI. We leverage standard test rigs combined with hybrid LLM-as-a-judge scorers to ensure deterministic quality checks for Gemini Nano features. This setup accelerates our iteration cycles! By combining automated metrics with human-in-the-loop insights, we can safely launch intelligent features without regressions."
    },
    {
        id: "blog-spiritual-optimism",
        title: "The Power of Spiritual Optimism in Tech Leadership",
        date: "Jan 2026",
        summary: "Why empathy and compassion are the real secret weapons of scale.",
        link: "javascript:void(0)",
        content: "Spiritual optimism means believing in the inherent goodness and potential of the human spirit. In tech, this translates to psychological safety, mentoring, and building accessible products that serve humanity. Leaders who bring out the best in people create the most resilient systems. Compassion-driven leadership leads to less burn out and more innovative problem solving."
    }
];

// Document Ready
document.addEventListener("DOMContentLoaded", () => {
    initBlogs();
    initSmoothScrolling();
});

// Render Blogs dynamically
function initBlogs() {
    const blogWidgetContainer = document.querySelector(".widgets-grid");
    
    if (blogWidgetContainer) {
        const blogSection = document.getElementById("blogs");
        const container = blogSection.querySelector(".container");
        
        const nativeBlogsDiv = document.createElement("div");
        nativeBlogsDiv.className = "native-blogs-container container";
        nativeBlogsDiv.style.marginBottom = "3rem";
        
        let blogsHTML = `
            <h3 style="color: var(--text-color); margin-bottom: 1.5rem; font-size: 1.8rem;">Native Blogs</h3>
            <div class="blogs-list" style="display: flex; flex-direction: column; gap: 1.5rem;">
        `;
        
        blogsData.forEach(blog => {
            blogsHTML += `
                <div class="blog-item" style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 1rem 0; display: flex; flex-direction: column; gap: 0.2rem;">
                    <a href="${blog.link}" class="read-more-btn" data-id="${blog.id}" style="color: var(--text-color); font-size: 1.3rem; font-weight: 600; text-decoration: none; transition: color 0.3s ease;">${blog.title}</a>
                    <span style="color: var(--accent-yellow); font-size: 0.85rem; font-weight: 600;">${blog.date}</span>
                </div>
            `;
        });
        
        blogsHTML += `</div>`;
        nativeBlogsDiv.innerHTML = blogsHTML;
        container.insertBefore(nativeBlogsDiv, container.querySelector(".widgets-grid"));

        // Create Modal Element
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "blog-modal";
        modalOverlay.className = "modal-overlay";
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2 id="modal-title"></h2>
                <span id="modal-date" class="modal-date"></span>
                <div id="modal-body" class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        // Click Event to open
        document.querySelectorAll(".read-more-btn").forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                const blogId = this.getAttribute("data-id");
                const blog = blogsData.find(b => b.id === blogId);
                
                if (blog) {
                    document.getElementById("modal-title").innerText = blog.title;
                    document.getElementById("modal-date").innerText = blog.date;
                    document.getElementById("modal-body").innerText = blog.content;
                    modalOverlay.classList.add("active");
                }
            });
        });

        // Click to close
        modalOverlay.querySelector(".modal-close").addEventListener("click", () => {
            modalOverlay.classList.remove("active");
        });

        // Close on background click
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove("active");
            }
        });
    }
}

// Global interactions (can add contact form logic, etc)
function initSmoothScrolling() {
    // Standard smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}
