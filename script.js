// Selección de elementos principales
const postForm = document.getElementById("post-form");
const postModal = document.getElementById("post-modal");
const closeModal = document.getElementById("close-modal");
const newPostBtn = document.getElementById("new-post-btn");
const postsContainer = document.getElementById("posts-container");
const adsContainer = document.getElementById("ads-container");
//LOGIN
const loginBtn = document.getElementById("login-btn");
const loginModal = document.getElementById("login-modal");
const closeLoginModal = document.getElementById("close-login-modal");
const showLogin = document.getElementById("show-login");
const showRegister = document.getElementById("show-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

//AJAX
const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const searchBtn = document.getElementById("search-btn");

// Abrir modal para nueva publicación
newPostBtn.addEventListener("click", () => {
    postModal.style.display = "flex";
});

// Cerrar modal de nueva publicación
closeModal.addEventListener("click", () => {
    postModal.style.display = "none";
});

//login
loginBtn.addEventListener("click", () => {
    loginModal.style.display = "flex";
  });
  
  // Cerrar el modal de login
  closeLoginModal.addEventListener("click", () => {
    loginModal.style.display = "none";
    loginForm.style.display = "none";
    registerForm.style.display = "none";
  });
  
  // Cambiar entre formulario de login y registro
  showLogin.addEventListener("click", () => {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  });
  //mostrar registro
  showRegister.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

// Función para agregar publicación al contenedor
function addPostToPage(postType, title, content, imagePath = null, id = null, votes = 0) {
    const postDiv = document.createElement("div");
    postDiv.classList.add(postType === "foro" ? "post" : "ad");

    const postContent = document.createElement("div");
    postContent.classList.add("post-content");

    const postTitle = document.createElement("h2");
    postTitle.textContent = title;

    const postDescription = document.createElement("p");
    postDescription.textContent = content;

    postContent.appendChild(postTitle);
    postContent.appendChild(postDescription);

    // Si hay imagen, la agregamos
    if (imagePath) {
        const postImage = document.createElement("img");
        postImage.src = imagePath;
        postImage.alt = "Imagen de la publicación";
        postImage.style.maxWidth = "100%";
        postImage.style.borderRadius = "8px";
        postContent.appendChild(postImage);
    }

    postDiv.appendChild(postContent);

    // Interacciones (solo para foro)
    if (postType === "foro") {
        const interactionDiv = document.createElement("div");
        interactionDiv.classList.add("post-interaction");

        const upvoteBtn = document.createElement("button");
        upvoteBtn.textContent = "⬆";
        upvoteBtn.classList.add("vote", "upvote");
        upvoteBtn.addEventListener("click", () => votePost(id, 1));

        const voteCount = document.createElement("span");
        voteCount.textContent = votes;
        voteCount.classList.add("vote-count");
        voteCount.dataset.id = id;

        const downvoteBtn = document.createElement("button");
        downvoteBtn.textContent = "⬇";
        downvoteBtn.classList.add("vote", "downvote");
        downvoteBtn.addEventListener("click", () => votePost(id, -1));

        interactionDiv.appendChild(upvoteBtn);
        interactionDiv.appendChild(voteCount);
        interactionDiv.appendChild(downvoteBtn);

        postDiv.appendChild(interactionDiv);
    }

    // Seccion de comentarios
    const commentsSection = document.createElement("div");
    commentsSection.classList.add("comments-section");
    commentsSection.style.display = "none"; // Oculto por defecto

    const commentsContainer = document.createElement("div");
    commentsContainer.classList.add("comments-container");

    const toggleCommentsBtn = document.createElement("button");
    toggleCommentsBtn.textContent = "Ver comentarios";
    toggleCommentsBtn.addEventListener("click", () => {
        if (commentsSection.style.display === "none") {
            commentsSection.style.display = "block";
            loadComments(id, commentsContainer);
        } else {
            commentsSection.style.display = "none";
        }
    });

    // Formulario para agregar comentarios
    const commentForm = document.createElement("form");
    commentForm.classList.add("comment-form");
    const commentInput = document.createElement("textarea");
    commentInput.name = "comment_text";
    commentInput.placeholder = "Escribe un comentario...";
    commentInput.required = true;

    const submitCommentBtn = document.createElement("button");
    submitCommentBtn.type = "submit";
    submitCommentBtn.textContent = "Enviar";

    commentForm.appendChild(commentInput);
    commentForm.appendChild(submitCommentBtn);

    // Al enviar el comentario
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const commentText = commentInput.value.trim();
        if (commentText) {
            fetch("submit_comment.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ post_id: id, comment_text: commentText })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    commentInput.value = "";
                    loadComments(id, commentsContainer); // Recargar los comentarios
                } else {
                    alert("No se pudo enviar el comentario.");
                }
            })
            .catch(err => console.error("Error al enviar comentario:", err));
        }
    });

    commentsSection.appendChild(commentsContainer);
    commentsSection.appendChild(commentForm);

    postDiv.appendChild(toggleCommentsBtn);
    postDiv.appendChild(commentsSection);

    // Agregar el post al contenedor correspondiente
    if (postType === "anuncio") {
        adsContainer.appendChild(postDiv);
    } else {
        postsContainer.appendChild(postDiv);
    }
}



// Manejar el envío del formulario
postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(postForm);

    fetch("submit_post.php", {
        method: "POST",
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            addPostToPage(
                formData.get("post-type"),
                formData.get("post-title"),
                formData.get("post-content"),
                data.image_path, // Ruta de la imagen devuelta por el backend
                data.id,
                0 // Nuevo post inicia con 0 votos
            );
            postModal.style.display = "none";
            postForm.reset();
        } else {
            alert("Hubo un error al guardar la publicación.");
        }
    })
    .catch((error) => console.error("Error:", error));
});

// Función para votar una publicación
function votePost(postId, voteValue) {
    fetch("vote_post.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId, vote: voteValue }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            const voteCount = document.querySelector(`.vote-count[data-id="${postId}"]`);
            if (voteCount) {
                voteCount.textContent = data.newVoteCount;
            }
        } else {
            alert("Error al registrar el voto.");
        }
    })
    .catch((error) => console.error("Error al votar:", error));
}

// Cargar publicaciones existentes
function loadPosts() {
    fetch("fetch_posts.php")
    .then((response) => response.json())
    .then((posts) => {
        // Separar las publicaciones por tipo
        const foroPosts = posts.filter(post => post.type === "foro");
        const anuncioPosts = posts.filter(post => post.type === "anuncio");

        // Ordenar los foroPosts por votos (de mayor a menor)
        foroPosts.sort((a, b) => b.votes - a.votes);

        // Ordenar los anuncioPosts por fecha (más reciente primero)
        // Asumiendo created_at es un string con formato fecha, por ejemplo '2024-12-05 10:30:00'
        anuncioPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Ahora agregar al DOM primero los foros ordenados por votos
        foroPosts.forEach((post) => {
            addPostToPage(
                post.type,
                post.title,
                post.content,
                post.image_path,
                post.id,
                post.votes
            );
        });

        // Y luego los anuncios, ordenados por fecha
        anuncioPosts.forEach((post) => {
            addPostToPage(
                post.type,
                post.title,
                post.content,
                post.image_path,
                post.id,
                post.votes
            );
        });
    })
    .catch((error) => console.error("Error al cargar publicaciones:", error));
}

function loadComments(postId, container) {
    // Limpiar contenedor antes de cargar
    container.innerHTML = "";
    fetch("fetch_comments.php?post_id=" + postId)
        .then(res => res.json())
        .then(comments => {
            if (comments.length === 0) {
                const noComments = document.createElement("p");
                noComments.textContent = "No hay comentarios todavía. ¡Sé el primero!";
                container.appendChild(noComments);
            } else {
                comments.forEach(comment => {
                    const commentDiv = document.createElement("div");
                    commentDiv.classList.add("comment");

                    const commentText = document.createElement("p");
                    commentText.textContent = comment.comment_text;

                    const commentDate = document.createElement("small");
                    const date = new Date(comment.created_at);
                    commentDate.textContent = "Publicado: " + date.toLocaleString();

                    commentDiv.appendChild(commentText);
                    commentDiv.appendChild(commentDate);

                    container.appendChild(commentDiv);
                });
            }
        })
        .catch(err => console.error("Error al cargar comentarios:", err));
}
//BUSQYEDA CON AJAX
searchBtn.addEventListener("click", () => {
    applySearchAndFilter();
});

function applySearchAndFilter() {
    const searchQuery = searchInput.value.trim();
    const selectedType = typeFilter.value;

    // Construir la URL con parámetros GET
    let url = "fetch_posts.php?";
    if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
    }
    if (selectedType) {
        url += `type=${encodeURIComponent(selectedType)}&`;
    }

    // Quitar el & final si existe
    url = url.replace(/&$/, '');

    fetch(url)
    .then(response => response.json())
    .then(posts => {
        // Vaciar el contenedor antes de cargar los nuevos resultados
        postsContainer.innerHTML = "";
        adsContainer.innerHTML = "";

        // Reagregar las publicaciones filtradas
        posts.forEach((post) => {
            addPostToPage(
                post.type,
                post.title,
                post.content,
                post.image_path,
                post.id,
                post.votes
            );
        });
    })
    .catch(error => console.error("Error al filtrar publicaciones:", error));
}

window.onload = () => {
    loadPosts();
};
