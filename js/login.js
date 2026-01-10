document.getElementById("loginForm")
.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
    })
    .then(data => {

        console.log("LOGIN RESPONSE:", data);

        // ✅ SAVE
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        alert("Login Successful");

        // ✅ ROLE BASED REDIRECT
        if (data.role === "ROLE_ADMIN") {
            window.location.href = "admin.html";
        }
        else if (data.role === "ROLE_POLICE") {
            window.location.href = "police-dashboard.html";
        }
        else if (data.role === "ROLE_CITIZEN") {
            window.location.href = "dashboard.html";
        }
        else if (data.role === "ROLE_POLICE_PENDING") {
            alert("⏳ Waiting for admin approval");
        }
        else {
            alert("Unknown role: " + data.role);
        }
    })
    .catch(err => {
        alert(err.message);
        console.error(err);
    });
});
