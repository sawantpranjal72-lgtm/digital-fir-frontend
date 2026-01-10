// Save token & role
function saveAuth(token, role) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
}

// Get token
function getToken() {
    return localStorage.getItem("token");
}

// Get role
function getRole() {
    return localStorage.getItem("role");
}

// Check login
function isLoggedIn() {
    return getToken() !== null;
}

// Logout
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
