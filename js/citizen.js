// ================= AUTH CHECK =================
document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    console.log("TOKEN:", token);
    console.log("ROLE:", role);

    if (!token || role !== "ROLE_CITIZEN") {
        alert("Unauthorized access");
        window.location.href = "index.html";
        return;
    }
});

// ================= CREATE FIR =================
function openCreateFir() {
    window.location.href = "create-fir.html";
}

// ================= LOAD MY FIRs =================
function loadMyFirs() {

    const firSection = document.getElementById("firSection");
    const firList = document.getElementById("firList");

    firSection.style.display = "block";
    firList.innerHTML = "";

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/fir/my", {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to load FIRs");
        return res.json();
    })
    .then(firs => {

        if (!firs || firs.length === 0) {
            firList.innerHTML = `<p class="empty">No FIRs found</p>`;
            return;
        }

        firs.forEach(fir => {

            const card = document.createElement("div");
            card.className = "fir-card";

            card.innerHTML = `
                <p><b>FIR ID:</b> ${fir.id}</p>
                <p><b>Name:</b> ${fir.complainantName}</p>
                <p><b>Details:</b> ${fir.complaintDetails}</p>
                <p><b>Status:</b> ${fir.status}</p>

                <div class="fir-actions">
                    <button class="btn-primary"
                        onclick="uploadEvidence(${fir.id})">
                        Upload Evidence
                    </button>

                    <button class="back-btn"
                        onclick="viewEvidenceList(${fir.id})">
                        View Evidence
                    </button>
                </div>
            `;

            firList.appendChild(card);
        });

        firSection.scrollIntoView({ behavior: "smooth" });
    })
    .catch(err => {
        alert(err.message);
    });
}

// ================= NAV =================
function uploadEvidence(firId) {
    window.location.href = `upload-evidence.html?firId=${firId}`;
}

function viewEvidenceList(firId) {
    window.location.href = `evidence-list.html?firId=${firId}`;
}

function goBack() {
    document.getElementById("firSection").style.display = "none";
    document.getElementById("top").scrollIntoView({ behavior: "smooth" });
}

// ================= LOGOUT =================
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

