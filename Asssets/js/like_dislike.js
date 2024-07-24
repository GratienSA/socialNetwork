async function likePost(button) {
    const id_message = button.closest('.card').dataset.id;
    const jwt = window.localStorage.getItem("jwt");
    const response = await fetch('http://localhost:3200/message/like-dislike', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({ id_message, type: 'like' })
    });
    if (response.ok) {
        const likeCount = button.querySelector('.like-count');
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    } else {
        console.error('Failed to like the post');
    }
}

async function dislikePost(button) {
    const id_message = button.closest('.card').dataset.id;
    const jwt = window.localStorage.getItem("jwt");
    const response = await fetch('http://localhost:3200/message/like-dislike', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({ id_message, type: 'dislike' })
    });
    if (response.ok) {
        const dislikeCount = button.querySelector('.dislike-count');
        dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
    } else {
        console.error('Failed to dislike the post');
    }
}


