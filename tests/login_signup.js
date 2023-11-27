function validateEmail() {
    const emailInput = document.getElementById("emailInput");
    const emailTooltip = document.getElementById("emailTooltip");
    const emailValue = emailInput.value;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailRegex.test(emailValue) && emailValue.length <= 30) {
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
function validatePassw(passw, setPasswError) {
    const isLengthValid = passw.length >= 6 && passw.length <= 30;
    const hasDigit = /\d/.test(passw);
    const hasLetter = /[a-zA-Z]/.test(passw);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(passw);
    if (isLengthValid && hasDigit && hasLetter && hasSymbol) {
        setPasswError(false);
    } else {
        setPasswError(true);
    }
}
//still working on it
function handleFormSubmit(event) {
    event.preventDefault();
    if (validateEmail() && validatePassw() && validateRole()) {
        console.log("Submitted:", email, passw, role);
    } else {
        alert("Please check your inputs.");
    }
}
function validateRole(role) {
    return role !== "";
}



module.exports = { validateEmail: validateEmail, togglePasswordVisibility, validatePassw, validateRole, handleFormSubmit};
