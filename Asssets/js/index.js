let jwt = window.localStorage.getItem('jwt')
if (!jwt || jwt === 'undefined' || jwt.length < 20) {
    window.location.href = './login.html'
}