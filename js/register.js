console.log("register.js loaded");

// ================= REGISTER MODAL =================

const registerModal = document.getElementById("registerModal");
const registerBtn = document.getElementById("registerBtn");
const registerBtnHero = document.getElementById("registerBtnHero");
const closeRegister = document.querySelector(".closeRegister");

if (registerBtn) {
    registerBtn.onclick = function (e) {
        e.preventDefault();
        registerModal.style.display = "flex";
    };
}

if (registerBtnHero) {
    registerBtnHero.onclick = function (e) {
        e.preventDefault();
        registerModal.style.display = "flex";
    };
}

if (closeRegister) {
    closeRegister.onclick = function () {
        registerModal.style.display = "none";
    };
}

// close modal if clicked outside
window.addEventListener("click", function (e) {
    if (e.target == registerModal) {
        registerModal.style.display = "none";
    }
});


// ================= PASSWORD TOGGLE =================

const toggleRegPassword = document.getElementById("toggleRegPassword");
const regPassword = document.getElementById("regPassword");

if (toggleRegPassword) {
    toggleRegPassword.onclick = function () {
        const type = regPassword.type === "password" ? "text" : "password";
        regPassword.type = type;
    };
}


// ================= CONFIRM PASSWORD TOGGLE =================

const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const confirmPassword = document.getElementById("confirmPassword");

if (toggleConfirmPassword) {
    toggleConfirmPassword.onclick = function () {
        const type = confirmPassword.type === "password" ? "text" : "password";
        confirmPassword.type = type;
    };
}


// ================= REGISTER FUNCTION =================

async function register() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirmPasswordVal = document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPasswordVal) {
        alert("All fields are required");
        return;
    }

    if (password !== confirmPasswordVal) {
        alert("Passwords do not match");
        return;
    }

    const payload = {
        name: name,
        email: email,
        password: password
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

        registerModal.style.display = "none";

    } catch (error) {

        alert("Registration failed: " + error.message);

        console.error(error);

    }

}


// ================= REGISTER → LOGIN SWITCH =================

const openLogin = document.getElementById("openLogin");
const loginModal = document.getElementById("loginModal");

if (openLogin) {

    openLogin.onclick = function (e) {

        e.preventDefault();

        registerModal.style.display = "none";

        loginModal.style.display = "flex";

    };

}