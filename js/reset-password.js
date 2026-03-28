const params = new URLSearchParams(window.location.search);

const token = params.get("token");

console.log("RESET TOKEN:",token);