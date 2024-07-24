function openModal(id, title, content, publicationDate) {
    document.getElementById('messageId').value = id;
    document.getElementById('modalTitle').value = title;
    document.getElementById('modalContent').value = content;
    document.getElementById('modalPublicationDate').value = publicationDate;
    document.getElementById('updateModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('updateModal').classList.add('hidden');
}

async function updateMessage() {
    let id_message = document.getElementById('messageId').value;
    let title = document.getElementById('modalTitle').value;
    let content = document.getElementById('modalContent').value;
    let publicationDate = document.getElementById('modalPublicationDate').value;
    console.log(id_message);

    if (!title || !content || !publicationDate) {
        alert("Tous les champs doivent être remplis.");
        return;
    }

    const jwt = window.localStorage.getItem("jwt");
    if (!jwt) {
        alert("Token d'authentification manquant. Veuillez vous reconnecter.");
        return;
    }

    let updatedMessage = {
        id_message: id_message,
        title: title,
        content: content,
        publication_date: publicationDate
    };

    let request = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(updatedMessage),
    };

    try {
        let response = await fetch(`http://localhost:3200/message/update`, request);
        if (response.ok) {
            console.log("Message mis à jour avec succès !");
            const newtitle =document.querySelector(`.title${id_message}`)
            const newtexte =document.querySelector(`.content${id_message}`)
            newtitle.innerText = title  
            newtexte.innerText = content  
            
        } else {
            let errorMsg = await response.text();
            console.error("Erreur lors de la mise à jour du message :", response.status, errorMsg);
            alert(`Une erreur est survenue lors de la mise à jour du message: ${response.status} ${errorMsg}`);
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        alert("Une erreur est survenue lors de la mise à jour du message. Veuillez réessayer.");
    } finally {
        closeModal();
    }
}
