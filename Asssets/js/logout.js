function logout() {
    window.localStorage.removeItem("jwt");
    window.alert("Disconnected successfull");
    window.location.href = "../../index.html";
  }