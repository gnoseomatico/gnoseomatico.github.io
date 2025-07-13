const container = document.getElementById("post-container");
const langSwitchBtn = document.getElementById("lang-switch");

// Obtener idioma actual o defecto "es"
let lang = localStorage.getItem("lang") || "es";

// Actualizar texto del botón según idioma
const updateLangSwitchText = (lang) => {
  langSwitchBtn.textContent = lang === "es" ? "[ES]" : "[EO]";
};
updateLangSwitchText(lang);

// Cambiar idioma al hacer click y recargar la página
langSwitchBtn.addEventListener("click", () => {
  lang = lang === "es" ? "eo" : "es";
  localStorage.setItem("lang", lang);
  location.reload();
});

// Obtener número del post desde la URL
const params = new URLSearchParams(window.location.search);
const postNumber = params.get("post");

if (!postNumber) {
  container.innerHTML = "<p>Post no encontrado.</p>";
} else {
  fetch("posts.json")
    .then((res) => res.json())
    .then((posts) => {
      const post = posts.find((p) => p.number === postNumber);
      if (!post) {
        container.innerHTML = "<p>Post no encontrado.</p>";
        return;
      }

      // Obtener título y archivo según idioma
      const title = post.title[lang] || post.title["es"];
      const mdFile = post.file[lang] || post.file["es"];

      fetch(`posts/${mdFile}`)
        .then((res) => {
          if (!res.ok) throw new Error("Archivo markdown no encontrado");
          return res.text();
        })
        .then((md) => {
          const htmlContent = marked.parse(md);

          const tags = Array.isArray(post.tags)
            ? post.tags.join(" - ")
            : post.tags || "";

          const currentIndex = posts.findIndex((p) => p.number === postNumber);
          const prevPost = posts[currentIndex - 1];
          const nextPost = posts[currentIndex + 1];

          const navControls = `
            <div class="post-nav-controls">
              ${
                prevPost
                  ? `<a class="post-nav prev-post" href="post.html?post=${prevPost.number}">← ${
                      lang === "es"
                        ? "PUBLICACIÓN ANTERIOR"
                        : "ANTAUAA PUBLIKO"
                    }</a>`
                  : `<div></div>`
              }
              ${
                nextPost
                  ? `<a class="post-nav next-post" href="post.html?post=${nextPost.number}">${
                      lang === "es" ? "PUBLICACIÓN SIGUIENTE →" : "SEQUANTA PUBLIKO →"
                    }</a>`
                  : `<div></div>`
              }
            </div>
          `;

          const backText = lang === "es" ? "VOLVER AL INICIO" : "REVENI AL KOMENCON";

          container.innerHTML = `
            <article class="full-post">
              <div class="back-link">
                <img src="./svg/left_arrow.svg" alt="Flecha hacia atrás" />
                <a href="./index.html">${backText}</a>
              </div>
              <section class="post-header">
                <div class="post-number-bg">${post.number}</div>
                <h1 class="post-title">${title}</h1>
              </section>
              <div class="post-meta">
                <span class="post-date">${post.date}</span> |
                <span class="post-tags">${tags}</span>
              </div>
              <hr class="rect-line" />
              <div class="post-content">${htmlContent}</div>
              ${navControls}
            </article>
          `;
        })
        .catch((err) => {
          container.innerHTML = `<p>Error al cargar contenido: ${err.message}</p>`;
          console.error(err);
        });
    });
}

// Scroll progress bar
window.addEventListener("scroll", () => {
  const progressBar = document.getElementById("progress-bar");
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 105;

  progressBar.style.width = scrollPercent + "%";

  if (scrollPercent >= 99.5) {
    progressBar.style.backgroundColor = "#006400"; // Verde oscuro al final
  } else {
    progressBar.style.backgroundColor = "#222"; // Color normal mientras se lee
  }
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