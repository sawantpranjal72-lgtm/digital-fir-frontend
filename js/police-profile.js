// ================= AUTH CHECK =================
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "ROLE_POLICE") {
  alert("Unauthorized");
  window.location.href = "index.html";
}

// ================= ELEMENTS =================
const fullName = document.getElementById("fullName");
const badgeNumber = document.getElementById("badgeNumber");
const rank = document.getElementById("rank");
const policeStation = document.getElementById("policeStation");
const mobileNumber = document.getElementById("mobileNumber");

const profileForm = document.getElementById("profileForm");
const profileCard = document.getElementById("profileCard");

const preview = document.getElementById("preview");
const savedPhoto = document.getElementById("savedPhoto");

// BACKEND BASE URL (IMPORTANT 🔥)
const BASE_URL = "http://127.0.0.1:8080";

// ================= LOAD PROFILE =================
document.addEventListener("DOMContentLoaded", loadProfile);

function loadProfile() {
  fetch(`${BASE_URL}/api/police/profile/me`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.ok ? res.json() : null)
  .then(data => {
    if (!data) {
      profileCard.innerHTML = "<p>No profile found</p>";
      return;
    }

    // Fill form
    fullName.value = data.fullName || "";
    badgeNumber.value = data.badgeNumber || "";
    rank.value = data.rank || "";
    policeStation.value = data.policeStation || "";
    mobileNumber.value = data.mobileNumber || "";

    // Profile details
    profileCard.innerHTML = `
      <p><b>Name:</b> ${data.fullName}</p>
      <p><b>Badge:</b> ${data.badgeNumber}</p>
      <p><b>Rank:</b> ${data.rank}</p>
      <p><b>Station:</b> ${data.policeStation}</p>
      <p><b>Mobile:</b> ${data.mobileNumber}</p>
    `;

    // Show profile photo (preview + saved)
  if (data.profilePhoto) {
  const imgUrl = `${BASE_URL}/uploads/profile/${data.profilePhoto}`;

  savedPhoto.src = imgUrl;
  savedPhoto.style.display = "block";
}

  })
  .catch(() => {
    profileCard.innerHTML = "<p>Error loading profile</p>";
  });
}

// ================= SAVE PROFILE =================
profileForm.addEventListener("submit", function (e) {
  e.preventDefault();

  fetch(`${BASE_URL}/api/police/profile`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fullName: fullName.value,
      badgeNumber: badgeNumber.value,
      rank: rank.value,
      policeStation: policeStation.value,
      mobileNumber: mobileNumber.value
    })
  })
  .then(res => {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then(() => {
    alert("✅ Profile saved successfully");
    loadProfile();
  })
  .catch(() => {
    alert("❌ Error saving profile");
  });
});

// ================= UPLOAD PHOTO =================
function uploadPhoto() {

  const file = document.getElementById("photoInput").files[0];

  if (!file) {
    alert("Select photo first");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Max file size is 2MB");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  
  const reader = new FileReader();
reader.onload = () => {
  preview.src = reader.result;
  preview.style.display = "block";
};
reader.readAsDataURL(file);


  fetch(`${BASE_URL}/api/police/profile/upload-photo`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token
    },
    body: formData
  })
  .then(res => {
    if (!res.ok) throw new Error();
    return res.text();
  })
  .then(() => {
    alert("✅ Photo uploaded successfully");
    loadProfile(); // reload profile + image
  })
  .catch(() => {
    alert("❌ Upload failed");
  });
}

// ================= NAVIGATION =================
function goDashboard() {
  window.location.href = "police-dashboard.html";
}

window.goDashboard = goDashboard;
window.uploadPhoto = uploadPhoto;
