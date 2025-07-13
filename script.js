const postList = document.getElementById("post-list");
const lang = localStorage.getItem("lang") || "es";

fetch("posts.json")
    .then((res) => res.json())
    .then((posts) => {
        posts.forEach((post) => {
            const title = post.title?.[lang] || post.title?.["es"] || "Sin título";
            const file = post.file?.[lang] || post.file?.["es"];
            const excerpt = post.excerpt?.[lang] || post.excerpt?.["es"] || "";
            const tags = Array.isArray(post.tags)
                ? post.tags.join(", ")
                : post.tags || "";

            if (!file) return; // Si no hay archivo, no continuar

            fetch(`posts/${file}`)
                .then((res) => res.text())
                .then((mdText) => {
                    const card = document.createElement("div");
                    card.className = "post-card";

                    card.innerHTML = `
                        <div class="post-number">${post.number || "000"}</div>
                        <div class="post-content">
                            <div class="post-date">${post.date || "Sin fecha"}</div>
                            <div class="post-title">${title}</div>
                            <div class="post-tags">${tags}</div>
                            <div class="post-excerpt">${excerpt}</div>
                        </div>
                    `;

                    card.addEventListener("click", () => {
                        window.location.href = `post.html?post=${post.number}`;
                    });

                    postList.appendChild(card);
                });
        });
    });

// BOTÓN DE MENÚ
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const menuIcon = document.getElementById('menu-icon');

let menuOpen = false;

menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;

    navLinks.classList.toggle('open');
    menuIcon.src = menuOpen ? './svg/close_menu.svg' : './svg/menu.svg';
    menuToggle.setAttribute('aria-label', menuOpen ? 'Cerrar menú' : 'Abrir menú');
});