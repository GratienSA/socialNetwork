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
