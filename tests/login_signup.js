function validateEmail() {
    const emailInput = document.getElementById("emailInput");
    const emailTooltip = document.getElementById("emailTooltip");
    const emailValue = emailInput.value;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
    if (emailRegex.test(emailValue)&& emailValue.length <= 30) {
        emailTooltip.style.visibility = "hidden"; // "invalid format" hide
        return true;
    } else {
        emailTooltip.style.visibility = "visible"; // "invalid format" show
        return false;

    }
}
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("passwordInput");
    const showPassword = passwordInput.type === "password";
    if (showPassword) {
        passwordInput.type = "text";
        document.querySelector(".password-toggle").textContent = "Hide";
    } else {
        passwordInput.type = "password";
        document.querySelector(".password-toggle").textContent = "Show";
    }
}


module.exports = { validateEmail, togglePasswordVisibility };
