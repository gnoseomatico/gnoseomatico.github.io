const container = document.getElementById("post-container");

// Obtener número del post desde la URL
const params = new URLSearchParams(window.location.search);
const postNumber = params.get("post");

if (!postNumber) {
    container.innerHTML = "<p>Post no encontrado.</p>";
} else {
    fetch("posts.json")
        .then(res => res.json())
        .then(posts => {
            const post = posts.find(p => p.number === postNumber);
            if (!post) {
                container.innerHTML = "<p>Post no encontrado.</p>";
                return;
            }

            fetch(`posts/${post.file}`)
                .then(res => res.text())
                .then(md => {
                    const htmlContent = marked.parse(md); // Usa marked.js

                    const tags = Array.isArray(post.tags)
                        ? post.tags.join(" - ")
                        : post.tags || "";

                    // Buscar publicaciones anterior y siguiente
                    const currentIndex = posts.findIndex(p => p.number === postNumber);
                    const prevPost = posts[currentIndex - 1];
                    const nextPost = posts[currentIndex + 1];

                    // Navegación entre posts
                    const navControls = `
                        <div class="post-nav-controls">
                            ${prevPost
                            ? `<a class="post-nav prev-post" href="post.html?post=${prevPost.number}">← PUBLICACIÓN ANTERIOR</a>`
                            : `<div></div>`}
                            ${nextPost
                            ? `<a class="post-nav next-post" href="post.html?post=${nextPost.number}">PUBLICACIÓN SIGUIENTE →</a>`
                            : `<div></div>`}
                        </div>
                    `;

                    container.innerHTML = `
                        <article class="full-post">
                            <div class="back-link">
                                <img src="./svg/left_arrow.svg" alt="Flecha hacia atrás">
                                <a href="./index.html">VOLVER AL INICIO</a>
                            </div>
                            <section class="post-header">
                                <div class="post-number-bg">${post.number}</div>
                                <h1 class="post-title">${post.title}</h1>
                            </section>
                            <div class="post-meta">
                                <span class="post-date">${post.date}</span> |
                                <span class="post-tags">${tags}</span>
                            </div>
                            <hr class="rect-line">
                            <div class="post-content">${htmlContent}</div>
                            <div class="post-signature">—Gnoseomático</div>
                            ${navControls}
                        </article>
                    `;
                });
        });
}

window.addEventListener("scroll", () => {
    const progressBar = document.getElementById("progress-bar");
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    progressBar.style.width = scrollPercent + "%";

    if (scrollPercent >= 99.5) {
        progressBar.style.backgroundColor = "#006400"; // Verde oscuro al final
    } else {
        progressBar.style.backgroundColor = "#222"; // Color normal mientras se lee
    }
});
