function sendLoginData() {
    const logEl = document.getElementById("username").value;
    const passEl = document.getElementById("password").value;
    console.log(logEl, passEl);
    onConfirmation();
}

function sendRegisterData() {
    const logEl = document.getElementById("username").value;
    const passEl = document.getElementById("password").value;
    console.log(logEl, passEl);
    onFailure();
}

function onConfirmation() {
    window.location.href = "risk-game.html"
}

function onFailure() {
    document.getElementById("errMsg").style.display = "block";
}

// Hide the login error message if the user clicks anywhere
let clicks = 0;
document.onclick = function () {
    // Check if the error message is available
    if (document.getElementById("errMsg").offsetParent !== null) {
        if (clicks > 0) {
            document.getElementById("errMsg").style.display = "none";
            clicks = 0;
        } else {
            clicks++;
        }
    }
};


