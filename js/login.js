function sendLoginData() {
    const logEl = document.getElementById("username").value;
    const passEl = document.getElementById("password").value;
    // Check if there is anything in the fields
    if (logEl.length > 1 && passEl.length > 1) {
        // There is something inside the passwords
        socket.emit("login", logEl, passEl);
    } else {
        onFailure();
    }
}

function sendRegisterData() {
    const logEl = document.getElementById("username").value;
    const passEl = document.getElementById("password").value;
    // Check if there is anything in the fields
    if (logEl.length > 1 && passEl.length > 1) {
        // There is something inside the passwords
        socket.emit("register", logEl, passEl);
    } else {
        onFailure();
    }}

function onConfirmation() {
    window.location.href = "/";
   // socket.emit('get lobby');
    socket.emit('logged in', document.getElementById("username").value, false);
}

function onFailure() {
    document.getElementById("errMsg").style.visibility = "visible";
}

// Hide the login error message if the user clicks anywhere
let clicks = 0;
document.onclick = function () {
    // Check if the error message is available
    if (document.getElementById("errMsg").offsetParent !== null) {
        if (clicks > 0) {
            document.getElementById("errMsg").style.visibility = "hidden";
            clicks = 0;
        } else {
            clicks++;
        }
    }
};
