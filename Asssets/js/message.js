async function createMessage() {
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let publicationDate = document.getElementById("publication_date").value;

    let message = {
        title: title,
        content: content,
        publication_date: publicationDate
    };

    const jwt = window.localStorage.getItem("jwt");
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(message),
    };

    try {
        let response = await fetch("http://localhost:3200/message/create", request);
        if (response.ok) {
            window.location.href = "../user/user.html";
        } else {
            console.error("Erreur lors de la création du message :", response.status);
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
    }
}






async function getAllMessages() {
    let cards = document.querySelector(".cards");
    cards.innerHTML = "";

    try {
        let apiCall = await fetch("http://localhost:3200/message/all");
        let response = await apiCall.json();

        for (const element of response) {
            const likeDislikeCounts = await getLikeDislikeCounts(element._id);
            createCard(element, likeDislikeCounts);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
    }
}

async function getAllMessages() {
    let cards = document.querySelector(".cards");
    cards.innerHTML = "";

    try {
        let apiCall = await fetch("http://localhost:3200/message/all");
        let response = await apiCall.json();

        for (const element of response) {
            const likeDislikeCounts = await getLikeDislikeCounts(element._id);
            const comments = await getComments(element._id);
            createCard(element, likeDislikeCounts, comments);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
    }
}

async function getLikeDislikeCounts(id_message) {
    try {
        const response = await fetch(`http://localhost:3200/message/LikesDislikes/${id_message}/count`);
        if (!response.ok) {
            throw new Error('Failed to fetch counts');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return { like: 0, dislike: 0 };  // Valeurs par défaut en cas d'erreur
    }
}

async function getComments(id_message) {
    try {
        const response = await fetch(`http://localhost:3200/comments/${id_message}`);
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];  // Valeurs par défaut en cas d'erreur
    }
}

function createCard(element, likeDislikeCounts, comments) {
    let cards = document.querySelector(".cards");

    const commentsHTML = comments.map(comment => `
        <div class="comment" data-id="${comment._id}">
            <p>${comment.content}</p>
            <div class="flex space-x-4">
                <button class="like-button text-green-500" onclick="likeComment(this, '${comment._id}')">
                    <i class="fas fa-thumbs-up"></i> <span class="like-count">${comment.likes || 0}</span>
                </button>
                <button class="dislike-button text-red-500" onclick="dislikeComment(this, '${comment._id}')">
                    <i class="fas fa-thumbs-down"></i> <span class="dislike-count">${comment.dislikes || 0}</span>
                </button>
                <button class="text-blue-500" onclick="editComment('${comment._id}')">Modifier</button>
                <button class="text-red-500" onclick="deleteComment('${comment._id}')">Supprimer</button>
            </div>
        </div>
    `).join('');

    const cardHTML = `
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
                        <i class="fas fa-thumbs-up"></i> <span class="like-count">${likeDislikeCounts.like}</span>
                    </button>
                    <button class="dislike-button text-red-500" onclick="dislikePost(this)">
                        <i class="fas fa-thumbs-down"></i> <span class="dislike-count">${likeDislikeCounts.dislike}</span>
                    </button>
                    <button class="text-blue-500" onclick="addComment(this, '${element._id}')">Commenter</button>
                </div>
                <p class="text-gray-700">Publié le ${element.publication_date}</p>
                <div class="flex items-center justify-between">
                    <button onclick="openModal('${element._id}', '${element.title}', '${element.content}', '${element.publication_date}')" class="text-blue-500 mr-4">Modifier</button>
                    <button onclick="deleteMessage('${element._id}')" class="text-red-500">Supprimer</button>
                </div>
            </div>
            <div class="comments-section mt-4">
                ${commentsHTML}
                <div class="add-comment mt-4">
                    <input type="text" class="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:border-blue-500" placeholder="Ajoutez un commentaire...">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline" onclick="addComment(this, '${element._id}')">Ajouter</button>
                </div>
            </div>
        </div>
    </div>`;

    cards.innerHTML += cardHTML;
}

async function addComment(button, id_message) {
    const commentInput = button.previousElementSibling;
    const content = commentInput.value;

    try {
        const response = await fetch("http://localhost:3200/message/comment", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_message, content })
        });

        if (!response.ok) {
            throw new Error('Failed to add comment');
        }

        const newComment = await response.json();
        const commentHTML = `
            <div class="comment" data-id="${newComment._id}">
                <p>${newComment.content}</p>
                <div class="flex space-x-4">
                    <button class="like-button text-green-500" onclick="likeComment(this, '${newComment._id}')">
                        <i class="fas fa-thumbs-up"></i> <span class="like-count">0</span>
                    </button>
                    <button class="dislike-button text-red-500" onclick="dislikeComment(this, '${newComment._id}')">
                        <i class="fas fa-thumbs-down"></i> <span class="dislike-count">0</span>
                    </button>
                    <button class="text-blue-500" onclick="editComment('${newComment._id}')">Modifier</button>
                    <button class="text-red-500" onclick="deleteComment('${newComment._id}')">Supprimer</button>
                </div>
            </div>`;
        button.closest('.comments-section').insertAdjacentHTML('beforeend', commentHTML);
        commentInput.value = '';
    } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire :", error);
    }
}

async function likeComment(button, commentId) {
    // Implémenter la logique pour liker un commentaire
}

async function dislikeComment(button, commentId) {
}

async function editComment(commentId) {
}

async function deleteComment(commentId) {

}

getAllMessages();


  

 async function updateMessage(id_message) {
    // Récupérer les données du formulaire
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let publicationDate = document.getElementById("publication_date").value;
  
    // Vérifier si les champs ne sont pas vides
    if (!title || !content || !publicationDate) {
        alert("Tous les champs doivent être remplis.");
        return;
    }
  
    // Récupérer le JWT depuis le stockage local
    const jwt = window.localStorage.getItem("jwt");
  
    // Vérifier si le JWT est présent
    if (!jwt) {
        alert("Token d'authentification manquant. Veuillez vous reconnecter.");
        return;
    }
  
    // Construire l'objet message avec les nouvelles valeurs
    let updatedMessage = {
        id_message: id_message,  
        title: title,
        content: content,
        publication_date: publicationDate
    };
  
    // Construire l'objet de requête avec les détails de la requête PATCH
    let request = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(updatedMessage),
    };
  
    try {
        // Envoyer la requête PATCH à l'URL spécifiée avec l'ID du message
        let response = await fetch(`http://localhost:3200/message/update`, request);
        const newtitle =document.querySelector(`.title${id_message}`)
        const newtexte =document.querySelector(`.content${id_message}`)
        newtitle.innerText = title  
        newtexte.innerText = content  

        if (response.ok) {
            // Si la mise à jour réussit, rediriger l'utilisateur vers une autre page
            console.log("Message mis à jour avec succès ! ici");
            window.location.reload()
        } else {
            // Si la mise à jour échoue, afficher un message d'erreur à l'utilisateur
            let errorMsg = await response.text(); // Lire la réponse pour plus d'informations
            console.error("Erreur lors de la mise à jour du message :", response.status, errorMsg);
            alert(`Une erreur est survenue lors de la mise à jour du message: ${response.status} ${errorMsg}`);
        }
    } catch (error) {
        // Si une erreur inattendue se produit, afficher un message d'erreur générique à l'utilisateur
        console.error("Erreur lors de la requête :", error);
        alert("Une erreur est survenue lors de la mise à jour du message. Veuillez réessayer.");
    }
  }
  
  async function deleteMessage(id_message) {
    try {
        // Récupérer le JWT depuis le stockage local
        const jwt = window.localStorage.getItem("jwt");
  console.log(id_message)
      let message={
          id_message: id_message
      }
  
        // Construire l'objet de requête avec les détails de la requête DELETE
        let request = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${jwt}`,
            },
  
            body: JSON.stringify(message)
        };
  
        // Envoyer la requête DELETE à l'URL spécifiée avec l'ID du message
        let response = await fetch(`http://localhost:3200/message/delete`, request);
        console.log(id_message);
        let responseData = await response.json();
        const Divdelete = document.querySelector(`div.test${id_message}`)
        console.log(Divdelete);
        Divdelete.remove()
        if (response.ok) {
            // Si la suppression réussit, afficher un message de confirmation à l'utilisateur
            console.log(responseData.message);
            
        } else {
            // Si la suppression échoue, afficher un message d'erreur à l'utilisateur
            console.error("Erreur lors de la suppression du message :", responseData.message);
            alert("Une erreur est survenue lors de la suppression du message. Veuillez réessayer.");
        }
    } catch (error) {
        // Si une erreur inattendue se produit, afficher un message d'erreur générique à l'utilisateur
        console.error("Erreur lors de la requête :", error);
        alert("Une erreur est survenue lors de la suppression du message. Veuillez réessayer.");
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    async function fetchUserProfile(id_user) {
        try {
            const response = await fetch(`http://localhost:3200/user/${id_user}/profile`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const user = await response.json();

            document.getElementById('userName').textContent = user.name;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userProfilePhoto').src = user.profile_photo;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    
    const token = window.localStorage.getItem('jwt');
    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.id;

            fetchUserProfile(userId);
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
    } else {
        console.error('No JWT found in localStorage');
    }
});
