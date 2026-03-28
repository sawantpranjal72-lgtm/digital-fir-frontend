// ================= AUTH =================
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

import { ROLES } from "./roles.js";

if (!token || role !== ROLES.POLICE) {
  alert("Unauthorized access");
  window.location.href = "index.html";
}

// ================= GLOBALS =================
let pieChart = null;
let barChart = null;

// ================= LOAD FIRs =================
function loadAllFirs() {
  fetch("http://localhost:8080/api/fir/all", {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {

      let total = data.length;
      let approved = 0, rejected = 0, pending = 0;

      const firList = document.getElementById("firList");
      firList.innerHTML = "";

      data.forEach(fir => {

        if (fir.status === "APPROVED") approved++;
        else if (fir.status === "REJECTED") rejected++;
        else pending++;

        const card = document.createElement("div");
        card.className = "fir-card";

        card.innerHTML = `
          <p><b>ID:</b> ${fir.id}</p>
          <p><b>Name:</b> ${fir.complainantName}</p>

          <select class="fir-status-select">
            <option value="CREATED">CREATED</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <br><br>
          <button class="btn-primary">View</button>
        `;

        const select = card.querySelector(".fir-status-select");
        select.value = fir.status;
        applyStatusColor(select, fir.status);

        select.onchange = () => {
          applyStatusColor(select, select.value);
          updateStatus(fir.id, select.value);
        };

        card.querySelector(".btn-primary").onclick = () => {
          openModal(
            fir.id,
            fir.complainantName,
            fir.status,
            fir.complaintDetails
          );
        };

        firList.appendChild(card);
      });

      document.getElementById("totalCount").innerText = total;
      document.getElementById("approvedCount").innerText = approved;
      document.getElementById("rejectedCount").innerText = rejected;
      document.getElementById("pendingCount").innerText = pending;

      renderCharts(approved, rejected, pending);
    });
}

// ================= STATUS COLORS =================
function applyStatusColor(select, status) {
  select.className = "fir-status-select";

  if (status === "CREATED") select.classList.add("status-created");
  else if (status === "SUBMITTED") select.classList.add("status-submitted");
  else if (status === "UNDER_REVIEW") select.classList.add("status-under-review");
  else if (status === "APPROVED") select.classList.add("status-approved");
  else if (status === "REJECTED") select.classList.add("status-rejected");
  else if (status === "CLOSED") select.classList.add("status-closed");
}

// ================= CHARTS =================
function renderCharts(approved, rejected, pending) {

  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  pieChart = new Chart(document.getElementById("statusPie"), {
    type: "pie",
    data: {
      labels: ["Approved", "Rejected", "Pending"],
      datasets: [{
        data: [approved, rejected, pending]
      }]
    }
  });

  barChart = new Chart(document.getElementById("statusBar"), {
    type: "bar",
    data: {
      labels: ["Approved", "Rejected", "Pending"],
      datasets: [{
        label: "FIR Count",
        data: [approved, rejected, pending]
      }]
    }
  });
}

// ================= UPDATE STATUS =================
function updateStatus(id, status) {
  fetch(`http://localhost:8080/api/fir/update-status/${id}?status=${status}`, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => {
      if (res.ok) {
        alert("✅ FIR status updated");
        loadAllFirs();
      } else {
        alert("❌ Update failed");
      }
    });
}

// ================= MODAL =================
function openModal(id, name, status, details) {
  document.getElementById("modalFirId").innerText = id;
  document.getElementById("modalName").innerText = name;
  document.getElementById("modalStatus").innerText = status;
  document.getElementById("modalDetails").innerText = details;

  document.getElementById("firModal").style.display = "block";
  loadEvidence(id);
}

function closeModal() {
  document.getElementById("firModal").style.display = "none";
}

// ================= LOAD EVIDENCE =================
function loadEvidence(firId) {
  fetch(`http://localhost:8080/api/evidence/fir/${firId}`, {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {

      const list = document.getElementById("evidenceList");
      list.innerHTML = "";

      if (!data || data.length === 0) {
        list.innerHTML = "<p>No evidence uploaded</p>";
        return;
      }

      data.forEach(ev => {
        list.innerHTML += `
          <div class="evidence-card">
            <p><b>ID:</b> ${ev.id}</p>
            <p>${ev.fileName}</p>

            <a class="btn-primary"
               target="_blank"
               href="http://localhost:8080/api/evidence/view/${ev.id}">
               View File
            </a>
          </div>
        `;
      });
    });
}

// ================= SEARCH =================
document.getElementById("firSearch").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  document.querySelectorAll(".fir-card").forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(value)
      ? "block" : "none";
  });
});

// ================= SIDEBAR =================
function showDashboard() {
  closeModal();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showFirs() {
  document.querySelector(".fir-section")
    .scrollIntoView({ behavior: "smooth" });
}

function showEvidence() {
  alert("Select FIR to view evidence");
}

function showProfile() {
  window.location.href = "police-profile.html";
}


// ================= POLICE NOTIFICATIONS =================
let notifVisible = false;

function toggleNotifications() {
  const box = document.getElementById("notificationBox");
  notifVisible = !notifVisible;
  box.style.display = notifVisible ? "block" : "none";

  if (notifVisible) {
    loadNotifications(true);
  }
}

function loadNotifications(markRead = false) {
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
            headers: { Authorization: "Bearer " + token }
          });
        }
      }
      list.appendChild(div);
    });

    if (markRead) {
      badge.style.display = "none";
      badge.innerText = "0";
    } else {
      badge.innerText = unread;
      badge.style.display = unread > 0 ? "inline-block" : "none";
    }
  });
}

// initial load
document.addEventListener("DOMContentLoaded", () => {
  loadNotifications(false);
});

// expose
window.toggleNotifications = toggleNotifications;


// ================= LOGOUT =================
document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  window.location.href = "home.html";
};

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadAllFirs);

// ================= EXPOSE =================
window.showDashboard = showDashboard;
window.showFirs = showFirs;
window.showEvidence = showEvidence;
window.showProfile = showProfile;
window.closeModal = closeModal;