const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const firId = params.get("firId");

function uploadEvidence() {
    const fileInput = document.getElementById("file");
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch(`http://localhost:8080/api/evidence/upload/${firId}`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        alert("Evidence uploaded successfully. Evidence ID = " + data.id);
    })
    .catch(() => alert("Upload failed"));
}

