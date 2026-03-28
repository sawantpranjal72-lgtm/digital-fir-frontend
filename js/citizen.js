// ================= AUTH CHECK =================
document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    console.log("TOKEN:", token);
    console.log("ROLE:", role);

    if (!token || role !== "ROLE_CITIZEN") {
        alert("Unauthorized access");
        window.location.href = "home.html";
        return;
    }

    // 🔔 load notifications count initially
    loadNotifications(false);
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
        console.error(err);
        alert(err.message);
    });
}


// ================= NOTIFICATIONS =================
let notifVisible = false;

function toggleNotifications() {
    const box = document.getElementById("notificationBox");

    notifVisible = !notifVisible;
    box.style.display = notifVisible ? "block" : "none";

    if (notifVisible) {
        loadNotifications(true); // mark as read
    }
}

function loadNotifications(markRead = false) {

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/notifications", {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(data => {

        const list = document.getElementById("notificationList");
        const badge = document.getElementById("notifCount");

        list.innerHTML = "";
        let unread = 0;

        if (!data || data.length === 0) {
            badge.style.display = "none";
            list.innerHTML = "<p>No notifications</p>";
            return;
        }

        data.forEach(n => {

            const div = document.createElement("div");
            div.className = "notification-item";
            div.innerText = n.message;

            if (!n.read) {
                unread++;
                div.style.fontWeight = "bold";

                if (markRead) {
                    fetch(`http://localhost:8080/notifications/${n.id}/read`, {
                        method: "PUT",
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    });
                }
            }

            list.appendChild(div);
        });

        // 🔔 badge count
        if (markRead) {
            badge.style.display = "none";
            badge.innerText = "0";
        } else {
            badge.innerText = unread;
            badge.style.display = unread > 0 ? "inline-block" : "none";
        }

    })
    .catch(err => console.error(err));
}


// ================= NAVIGATION =================
function uploadEvidence(firId) {
    window.location.href = `upload-evidence.html?firId=${firId}`;
}

function viewEvidenceList(firId) {
    window.location.href = `evidence-list.html?firId=${firId}`;
}

function goBack() {
    const firSection = document.getElementById("firSection");

    firSection.style.display = "none";

    // scroll to top properly
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ================= LOGOUT =================
function logout() {
    localStorage.clear();
    window.location.href = "home.html";
}