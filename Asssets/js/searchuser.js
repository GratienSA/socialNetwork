document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchTerm = document.querySelector('input[name="term"]').value.trim(); 
    if (searchTerm !== '') { 
        try {
            const response = await fetch(`http://localhost:3200/user/search?term=${searchTerm}`);
            if (!response.ok) { 
                throw new Error('Erreur lors de la recherche utilisateur');
            }
            const data = await response.json();
            const searchResults = document.getElementById('search-results');
            searchResults.innerHTML = ''; 
            if (data && data.length > 0) {
                data.forEach(user => {
                    const userElement = document.createElement('div');
                    userElement.textContent = `Nom d'utilisateur: ${user.name}, Email: ${user.email}`;
                    searchResults.appendChild(userElement);
                });
            } else {
                const noResultsMessage = document.createElement('div');
                noResultsMessage.textContent = 'Aucun résultat trouvé';
                searchResults.appendChild(noResultsMessage);
            }
        } catch (error) {
            console.error('Erreur:', error.message);
        }
    } else {
        console.error('Le terme de recherche est vide');
    }
});
