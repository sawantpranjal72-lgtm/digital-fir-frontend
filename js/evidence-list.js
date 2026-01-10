const token = localStorage.getItem("token");
if (!token) {
    alert("Login required");
    window.location.href = "index.html";
}

// FIR ID from URL
const params = new URLSearchParams(window.location.search);
const firId = params.get("firId");

const listDiv = document.getElementById("evidenceList");

fetch(`http://localhost:8080/api/evidence/fir/${firId}`, {
    headers: {
        Authorization: "Bearer " + token
    }
})
.then(res => {
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
})
.then(data => {

    listDiv.innerHTML = "";

    if (!data || data.length === 0) {
        listDiv.innerHTML = "<p class='empty'>No evidence uploaded</p>";
        return;
    }

    data.forEach(ev => {

        const div = document.createElement("div");
        div.className = "fir-card";

        div.innerHTML = `
            <p><b>Evidence ID:</b> ${ev.id}</p>
            <p><b>File:</b> ${ev.fileName}</p>

            <a class="btn-primary"
               target="_blank"
               href="http://localhost:8080/api/evidence/view/${ev.id}">
               View
            </a>
        `;

        listDiv.appendChild(div);
    });
})
.catch(() => {
    listDiv.innerHTML =
        "<p class='empty error'>Failed to load evidence</p>";
});

function goBack() {
    history.back();
}
