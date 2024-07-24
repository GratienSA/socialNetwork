// Fonction pour liker un post
async function likePost(button) {
    const id_message = button.closest('.card').dataset.id;
    const jwt = window.localStorage.getItem("jwt");
    const response = await fetch(`http://localhost:3200/message/like/${id_message}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        }
    });

    if (response.ok) {
        const likeCountElement = button.querySelector('.like-count');
        likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
    } else {
        console.error('Failed to like post');
    }
}

// Fonction pour disliker un post
async function dislikePost(button) {
    const id_message = button.closest('.card').dataset.id;
    const jwt = window.localStorage.getItem("jwt");
    const response = await fetch(`http://localhost:3200/message/dislike/${id_message}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        }
    });

    if (response.ok) {
        const dislikeCountElement = button.querySelector('.dislike-count');
        dislikeCountElement.textContent = parseInt(dislikeCountElement.textContent) + 1;
    } else {
        console.error('Failed to dislike post');
    }
}


// Génération dynamique de HTML pour les posts
response.forEach((element) => {
    cards.innerHTML += `
    <div id="postsContainer" class="mt-8 space-y-4 test${element._id}">
        <div class="bg-white p-6 shadow-md rounded-lg mr-4 ml-4 card" data-id="${element._id}">
            <div class="bg-white p-6 shadow-md rounded-lg profile-column">
                <h2 class="text-xl font-bold mb-4" id="userName">${element.userName}</h2>
                <img src="${element.userProfilePhoto}" alt="Photo de Profil" class="rounded-full mb-4 w-48 h-48 mx-auto" id="userProfilePhoto">
                <p class="text-gray-800" id="userEmail">${element.userEmail}</p>
            </div>
            <h3 class="text-lg font-bold mb-2 title${element._id}">${element.title}</h3>
            <p class="text-gray-700 mb-4 content${element._id}">${element.content}</p>
            <div class="flex items-center justify-between">
                <div class="flex space-x-4">
                    <button class="like-button text-green-500" onclick="likePost(this)">
                        <i class="fas fa-thumbs-up"></i> <span class="like-count">${element.likeCount}</span>
                    </button>
                    <button class="dislike-button text-red-500" onclick="dislikePost(this)">
                        <i class="fas fa-thumbs-down"></i> <span class="dislike-count">${element.dislikeCount}</span>
                    </button>
                    <button class="text-blue-500" onclick="addComment(this)">Commenter</button>
                </div>
                <p class="text-gray-700">Publié le ${element.publication_date}</p>
                <div class="flex items-center justify-between">
                    <button onclick="openModal('${element._id}', '${element.title}', '${element.content}', '${element.publication_date}')" class="text-blue-500 mr-4">Modifier</button>
                    <button onclick="deleteMessage('${element._id}')" class="text-red-500">Supprimer</button>
                </div>
            </div>
            <div class="comments-section hidden mt-4">
                <input type="text" class="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:border-blue-500" placeholder="Ajoutez un commentaire...">
                <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline" onclick="addComment(this)">Ajouter</button>
                <div class="comments-list mt-4 space-y-2">
                    <!-- Liste des commentaires -->
                </div>
            </div>
        </div>
    </div>`;
});
