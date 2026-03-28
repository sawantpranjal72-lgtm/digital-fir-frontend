const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const firId = params.get("firId");

const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.addEventListener("click", uploadEvidence);

function uploadEvidence() {
    const fileInput = document.getElementById("file");

    if (!fileInput.files.length) {
        alert("Please select a file");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch(`http://localhost:8080/api/evidence/upload/${firId}`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error("Upload failed");
        return res.json();
    })
    .then(data => {
        alert("Evidence uploaded successfully. Evidence ID = " + data.id);
    })
    .catch(err => {
        console.error(err);
        alert("Upload failed");
    });
}