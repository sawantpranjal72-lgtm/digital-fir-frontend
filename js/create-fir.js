const token = localStorage.getItem("token");

if (!token) {
    alert("Login required");
    window.location.href = "index.html";
}

document.getElementById("firForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const details = document.getElementById("details").value;

    fetch("http://localhost:8080/api/fir/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            complainantName: name,
            complaintDetails: details
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to submit FIR");
        return res.json();   // 🔥 IMPORTANT
    })
    .then(fir => {
        // 🔥 FIR OBJECT मिळतो इथे
        console.log("Created FIR:", fir);

        // FIR ID save for evidence upload
        localStorage.setItem("lastFirId", fir.id);

        alert(
            "FIR Submitted Successfully!\n\n" +
            "FIR ID: " + fir.id + "\n" +
            "Status: " + fir.status
        );

        window.location.href = "dashboard.html";
    })
    .catch(err => {
        alert(err.message);
    });
});

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

