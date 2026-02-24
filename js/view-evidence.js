const token = localStorage.getItem("token");

if (!token) {
    alert("Login required");
    window.location.href = "index.html";
}

const params = new URLSearchParams(window.location.search);
const evidenceId = params.get("id");

if (!evidenceId) {
    alert("Evidence ID missing");
}

fetch(`http://34.235.155.152:8080/api/evidence/view/${evidenceId}`, {
    headers: {
        "Authorization": "Bearer " + token
    }
})
.then(res => {
    if (!res.ok) throw new Error("Failed to load evidence");
    return res.blob();
})
.then(blob => {

    const viewer = document.getElementById("viewer");

    const url = URL.createObjectURL(blob);

    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "500px";
    img.style.borderRadius = "10px";

    viewer.innerHTML = "";
    viewer.appendChild(img);
})
.catch(err => {
    alert(err.message);
});
