const token = localStorage.getItem("token");

// 🔐 LOGIN CHECK
if (!token) {
    alert("Login required");
    window.location.href = "home.html";
}

// 📩 SUBMIT FIR
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
        return res.json();
    })
    .then(fir => {

        console.log("Created FIR:", fir);

        localStorage.setItem("lastFirId", fir.id);

        // ✅ UI SUCCESS BOX
        document.getElementById("firForm").innerHTML = `
            <div style="text-align:center; padding:20px;">
                <h2 style="color:green;">✅ FIR Submitted Successfully</h2>

                <p><b>FIR ID:</b> ${fir.id}</p>
                <p><b>Status:</b> ${fir.status}</p>

                <button onclick="goDashboard()" style="
                    padding:10px 20px;
                    background:#007bff;
                    color:white;
                    border:none;
                    border-radius:5px;
                    cursor:pointer;
                ">
                    Go to Dashboard
                </button>
            </div>
        `;
    })
    .catch(err => {
        alert(err.message);
    });
});
document.getElementById("backBtn").addEventListener("click", function () {
    window.location.href = "dashboard.html";
});