async function handleRegister() {
  let name = document.querySelector('.name').value;
  let email = document.querySelector('.email').value;
  let password = document.querySelector('.password').value;
  let profilePhotoInput = document.querySelector('.profile_photo'); 
  let profile_photo = '';

  console.log(profilePhotoInput.files.length, "teste")
  if (profilePhotoInput.files.length > 0) {
    console.log('test')
      const formData = new FormData();
      formData.append('profile_photo', profilePhotoInput.files[0]);

      try {
          const response = await fetch('http://localhost:3200/user/insert/picture', {
              method: 'POST',
              body: formData,
          });
          console.log(response);
          const data = await response.json();
          console.log(data);
          if (response.status === 200) {
            console.log(data.newFileName);
              profile_photo = data.newFileName;
          } else {
            console.log("ici");
              throw new Error(data.error || 'Image upload failed');
          }
      } catch (error) {
          document.getElementById('error-message').textContent = error.message;
          return;
      }
  }
console.log(profile_photo);
  let user = {
      name: name,
      email: email,
      password: password,
      profile_photo: profile_photo || null ,
  };
console.log(user)

  let request = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(user),
  };

  try {
      let response = await fetch('http://localhost:3200/user/register', request);
      console.log(response)
      let data = await response.json();
      console.log(data)
      if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
      }

      alert('Registration successful, please check your email for activation link.');
      window.location.href = './connexion.html';
  } catch (error) {
      document.getElementById('error-message').textContent = error.message;
  }
}

async function handleLogin() {
  let identifier = document.querySelector('.email').value;
  let password = document.querySelector('.password').value;

  let user = {
      email: identifier, 
      password: password,
  };

  let request = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(user),
  };

  try {
      let response = await fetch('http://localhost:3200/user/login', request);
      let data = await response.json();

      if (response.status === 200) {
          let jwt = data.jwt;
          let role = data.role;

          window.localStorage.setItem('jwt', jwt);

          if (role === 2) { // admin role
              window.location.href = '../admin/admin.html';
          } else if (role === 1) { // user role
              window.location.href = '../user/user.html';
          } else {
              alert('Unknown role');
          }
      } else {
          alert('Invalid email or password');
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Server error. Please try again later.');
  }
}


async function handleResetPassword() {
    event.preventDefault()
    let identifier = document.querySelector('.email').value;
    console.log(identifier)
    let email = { email: identifier };
  
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ email }),
    };
  
    try {
      const response = await fetch(`http://localhost:3200/user/reset-password-request`, request);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'the email does not exist');
      }
  
      alert('please check your email to log in with your new password.');
    } catch (error) {
      document.getElementById('error-message').textContent = error.message;
    }
  }
  

 
  async function newPassword(event) {
    event.preventDefault();  // Ajoute preventDefault pour éviter le rechargement de la page

    const password = document.querySelector('.password').value;
    const token = new URLSearchParams(window.location.search).get('token');
    
    if (!token) {
      document.getElementById('error-message').textContent = 'Token is missing.';
      return;
    }

    const request = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ password }),
    };

    try {
      const response = await fetch(`http://localhost:3200/user/reset-password-request/${token}`, request);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      alert('Password reset successfully.');
      window.location.href = '../auth/login.html';
    } catch (error) {
      document.getElementById('error-message').textContent = error.message;
    }
}
