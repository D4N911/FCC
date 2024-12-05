// Selección de elementos principales
const postForm = document.getElementById("post-form");
const postModal = document.getElementById("post-modal");
const closeModal = document.getElementById("close-modal");
const newPostBtn = document.getElementById("new-post-btn");
const postsContainer = document.getElementById("posts-container");
const adsContainer = document.getElementById("ads-container");

// Abrir modal para nueva publicación
newPostBtn.addEventListener("click", () => {
    postModal.style.display = "flex";
});

// Cerrar modal de nueva publicación
closeModal.addEventListener("click", () => {
    postModal.style.display = "none";
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

    if (imagePath) {
        const postImage = document.createElement("img");
        postImage.src = imagePath; // Usar la ruta de la imagen proporcionada
        postImage.alt = "Imagen de la publicación";
        postImage.style.maxWidth = "100%";
        postImage.style.borderRadius = "8px";
        postContent.appendChild(postImage);
    }

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
        voteCount.dataset.id = id; // Para identificarlo en futuras actualizaciones

        const downvoteBtn = document.createElement("button");
        downvoteBtn.textContent = "⬇";
        downvoteBtn.classList.add("vote", "downvote");
        downvoteBtn.addEventListener("click", () => votePost(id, -1));

        interactionDiv.appendChild(upvoteBtn);
        interactionDiv.appendChild(voteCount);
        interactionDiv.appendChild(downvoteBtn);

        postDiv.appendChild(interactionDiv);
    }

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
        posts.forEach((post) => {
            addPostToPage(
                post.type,
                post.title,
                post.content,
                post.image_path, // Mostrar la imagen si existe
                post.id,
                post.votes
            );
        });
    })
    .catch((error) => console.error("Error al cargar publicaciones:", error));
}

window.onload = () => {
    loadPosts();
};
