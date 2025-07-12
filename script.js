const postList = document.getElementById("post-list");

fetch("posts.json")
    .then((res) => res.json())
    .then((posts) => {
        posts.forEach((post) => {
            fetch(`posts/${post.file}`)
                .then((res) => res.text())
                .then((mdText) => {
                    const card = document.createElement("div");
                    card.className = "post-card";

                    const tags = Array.isArray(post.tags)
                        ? post.tags.join(", ")
                        : post.tags || "";

                    card.innerHTML = `
            <div class="post-number">${post.number || "000"}</div>
            <div class="post-content">
              <div class="post-date">${post.date || "Sin fecha"}</div>
              <div class="post-title">${post.title || "Sin título"}</div>
              <div class="post-tags">${tags}</div>
              <div class="post-excerpt">${post.excerpt || ""}</div>
            </div>
          `;

                    card.addEventListener("click", () => {
                        window.location.href = `post.html?post=${post.number}`;
                    });

                    postList.appendChild(card);
                });
        });
    });
