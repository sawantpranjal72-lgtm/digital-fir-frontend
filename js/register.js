console.log("register.js loaded");

async function register() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
        alert("All fields are required");
        return;
    }

    if (password !== confirmPassword) {
        alert("Password mismatch");
        return;
    }

    const payload = {
        name: name,
        email: email,
        password: password,
        role: "CITIZEN"
    };

    try {
        const response = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }

        alert("Registration successful! Please login.");
        window.location.href = "index.html"; // login page
    } catch (error) {
        alert("Registration failed: " + error.message);
        console.error(error);
    }
}
