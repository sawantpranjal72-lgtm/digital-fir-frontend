const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "ROLE_ADMIN") {
  alert("Unauthorized access");
  window.location.href = "index.html";
}

// ================= PAGE LOAD =================
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});


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

// ================= SIDEBAR =================
function showDashboard() {
  dashboardSection.scrollIntoView({ behavior: "smooth" });
}
function showUsers() {
  userSection.scrollIntoView({ behavior: "smooth" });
}
function showFirs() {
  firSection.scrollIntoView({ behavior: "smooth" });
}
function showPoliceProfiles() {
  policeProfileSection.scrollIntoView({ behavior: "smooth" });
}
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

window.showDashboard = showDashboard;
window.showUsers = showUsers;
window.showFirs = showFirs;
window.showPoliceProfiles = showPoliceProfiles;
window.logout = logout;

// ================= LOAD DASHBOARD =================
function loadDashboard() {
  loadUsers();
  loadFirs();
  loadPoliceProfiles();
}

// ================= USERS =================
let userChart;

function loadUsers() {
  fetch("http://localhost:8080/api/admin/users", {
    headers: { Authorization: "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {

    let police = 0, citizen = 0;
    userList.innerHTML = "";

    data.forEach(u => {
      if (u.role === "POLICE") police++;
      if (u.role === "CITIZEN") citizen++;

      userList.innerHTML += `
        <div class="fir-card">
          <p><b>ID:</b> ${u.id}</p>
          <p><b>Name:</b> ${u.name}</p>
          <p><b>Email:</b> ${u.email}</p>
          <p><b>Role:</b> ${u.role}</p>
          <p><b>Status:</b> ${u.enabled ? "ACTIVE" : "DISABLED"}</p>
        </div>
      `;
    });

    totalUsers.innerText = data.length;
    policeCount.innerText = police;
    citizenCount.innerText = citizen;

    const canvas = document.getElementById("userChart");
    if (!canvas) return;

    if (userChart) userChart.destroy();
    userChart = new Chart(canvas, {
      type: "pie",
      data: {
        labels: ["Police", "Citizen"],
        datasets: [{
          data: [police, citizen],
          backgroundColor: ["#22c55e", "#3b82f6"]
        }]
      }
    });
  });
}

// ================= FIR =================
let firChart;

function loadFirs() {
  fetch("http://localhost:8080/api/fir/all", {
    headers: { Authorization: "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {

    let approved = 0, rejected = 0, pending = 0;
    firList.innerHTML = "";

    data.forEach(f => {
      if (f.status === "APPROVED") approved++;
      else if (f.status === "REJECTED") rejected++;
      else pending++;

      firList.innerHTML += `
        <div class="fir-card">
          <p><b>FIR ID:</b> ${f.id}</p>
          <p><b>Date:</b> ${f.createdAt || "-"}</p>
          <p><b>Status:</b> ${f.status}</p>
        </div>
      `;
    });

    firCount.innerText = data.length;

    const firCanvas = document.getElementById("firChart");
    if (!firCanvas) return;

    if (firChart) firChart.destroy();
    firChart = new Chart(firCanvas, {
      type: "bar",
      data: {
        labels: ["Approved", "Rejected", "Pending"],
        datasets: [{
          label: "FIR Count",
          data: [approved, rejected, pending],
          backgroundColor: ["#22c55e", "#ef4444", "#facc15"]
        }]
      }
    });
  });
}

// ================= POLICE PROFILES =================
function loadPoliceProfiles() {
  fetch("http://localhost:8080/api/admin/police-profiles", {
    headers: { Authorization: "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {

    policeProfileTable.innerHTML = "";

    data.forEach(p => {
      const imgUrl = p.profilePhoto
        ? `http://127.0.0.1:8080/uploads/profile/${p.profilePhoto}`
        : "img/default.png";
        const statusText = p.enabled ? "ACTIVE" : "DISABLED";
        const btnText = p.enabled ? "Disable" : "Enable";

     policeProfileTable.innerHTML += `
  <tr>
    <td>${p.fullName}</td>
    <td>${p.badgeNumber}</td>
    <td>${p.policeStation}</td>
    <td>${p.rank}</td>
    <td>
      <img 
        src="${imgUrl}"
        class="admin-police-img"
        onclick="openPhoto('${imgUrl}')"
      />
    </td>
    <td>${statusText}</td>
    <td>
      <button onclick="togglePolice(${p.userId})">
        ${btnText}
      </button>
    </td>
  </tr>
`;

    });
  });
}

// ================= PHOTO MODAL =================
function openPhoto(src) {
  const modal = document.getElementById("photoModal");
  const modalImg = document.getElementById("modalImg");
  modalImg.src = src;
  modal.style.display = "flex";
}


function togglePolice(userId) {
  if (!confirm("Change police status?")) return;

  fetch(`http://localhost:8080/api/admin/toggle-user/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token
    }
  })
  .then(res => res.text())
  .then(() => {
    alert("✅ Status updated");
    loadPoliceProfiles();
  })
  .catch(() => alert("❌ Failed to update status"));
}

window.togglePolice = togglePolice;

function closePhoto() {
  document.getElementById("photoModal").style.display = "none";
}

window.openPhoto = openPhoto;
window.closePhoto = closePhoto;