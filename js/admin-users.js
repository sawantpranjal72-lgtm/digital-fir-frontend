const token = localStorage.getItem("token");

fetch("/api/admin/users", {
    headers: { "Authorization": "Bearer " + token }
})
.then(res => res.json())
.then(data => {
    const table = document.getElementById("userTable");
    table.innerHTML = "";

    data.forEach(u => {
        table.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
             <td class="${u.enabled ? 'status-active' : 'status-disabled'}">
  ${u.enabled ? "ACTIVE" : "DISABLED"}
</td>
<td>
  ${u.role === "POLICE"
    ? `<button class="toggle-btn" onclick="toggle(${u.id})">Toggle</button>`
    : "-"
  }
</td>
        `;
    });
});

function toggle(id) {
    fetch(`/api/admin/toggle-user/${id}`, {
        method: "PUT",
        headers: { "Authorization": "Bearer " + token }
    }).then(() => location.reload());
}

function addPolice() {
    fetch("/api/admin/add-police", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value
        })
    }).then(() => location.reload());
}