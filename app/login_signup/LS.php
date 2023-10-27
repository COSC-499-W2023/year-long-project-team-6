<?php
session_start();
include("../Connection.php");
include("../Function.php");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $username = $_POST['user_name'];
    $email = $_POST['user_email'];
    $password = $_POST['user_pass'];

    if (!empty($username) && !empty($password) && !is_numeric($username)) {
        //save to database; 
        $query = "insert into users (username, password, email) values ('$username', '$password', '$email')";
        mysqli_query($link, $query);
        header("Location: LS.php");
        die;
    } else {
        echo "please enter valid information!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login/Signup</title>
    <link rel="stylesheet" href="loginS.css">


</head>

<body>
    <form id="myform" method="post">
        <div class="container">
            <div class='header'>
                <div class='text'></div>
                <div class='underline'></div>
            </div>
            <div class='inputs'>
                <div class='input' id="nameInputContainer">
                    <div class="input-content">
                        <img src="image/person.png" alt="User Icon" />
                        <!-- Replace "user_icon.jpg" with your actual image file and provide alt text -->
                        <input type="text" placeholder="Name" name="user_name" />
                    </div>
                </div>
                <div class='input'>
                    <img src="image/email.png" alt="Email Icon" />
                    <input type="email" placeholder="Email" id="emailInput" onInput="validateEmail()"
                        name="user_email" />
                    <span class="email-tooltiptext" id="emailTooltip">Invalid format</span>
                </div>

                <div class='input'>
                    <img src="image/password.png" alt="Password Icon" />
                    <!-- Replace "password_icon.jpg" with your actual image file and provide alt text -->
                    <input type="password" placeholder="Password" id="passwordInput" autocomplete="new-password"
                        name="user_pass" />
                    <input type="text" id="hiddenPasswordInput"
                        style="opacity: 0; position: absolute; top: -9999px; left: -9999px;" />
                    <button class="password-toggle" onClick="togglePasswordVisibility()">Show</button>
                </div>

            </div>

            <div class="forgot-password" onClick="navigateToForgotPasswordPage()" id="forgotPassword">Forgot password?
                <span>Click Here!</span>
            </div>
            <div class="tooltip">
                <img src="image/exchange.png" alt="Switch" class="switch-icon" onClick="toggleAction()" />
                <span class="tooltiptext" id="switchTooltip">Switch between Login and Sign Up interface</span>
            </div>
            <div class="submit-container">
                <div class="submit gray" id="signUpButton" onClick="showUnimplementedAlert()">Sign Up</div>
                <div class="submit" id="loginButton" onClick="showUnimplementedAlert()">Login</div>
            </div>
        </div>
    </form>

    <!-- ---------------------------------------------------------------------- -->
    <script>
        let showPassword = false;
        let action = "Login";  // Initial action

        document.addEventListener("DOMContentLoaded", function () {
            action = "Login";
            updateUI(); // 更新UI以反映新的action
        });

        function showText() {
            document.querySelector('.switch-text').style.visibility = 'visible';
        }

        function hideText() {
            document.querySelector('.switch-text').style.visibility = 'hidden';
        }
        function showUnimplementedAlert() {
            document.getElementById('myform').submit();
        }
        function togglePasswordVisibility() {
            showPassword = !showPassword;
            const passwordInput = document.getElementById("passwordInput");
            if (showPassword) {
                passwordInput.type = "text";
                document.querySelector(".password-toggle").textContent = "Hide";
            } else {
                passwordInput.type = "password";
                document.querySelector(".password-toggle").textContent = "Show";
            }
        }

        function setAction(newAction) {
            if (newAction === "Login" || newAction === "Sign Up") {
                action = newAction;
                // localStorage.setItem('lastAction', action);
                // Update the UI to reflect the new action, including the name input field
                updateUI();
            } else {
                console.error("Invalid action:", newAction);
            }
        }

        function updateUI() {
            const headerText = document.querySelector('.header .text');
            const submitContainer = document.querySelector('.submit-container');
            const nameInputContainer = document.getElementById('nameInputContainer');
            const forgotPassword = document.getElementById('forgotPassword'); // Get the element by ID

            const signUpButton = document.getElementById('signUpButton');
            const loginButton = document.getElementById('loginButton');
            const tooltipText = document.getElementById('switchTooltip');

            // 设置按钮的初始样式为紫色
            if (signUpButton) {
                signUpButton.classList.remove('gray');
            }
            if (loginButton) {
                loginButton.classList.remove('gray');
            }

            if (action === "Login") {
                headerText.textContent = "Vup";
                nameInputContainer.style.display = "none";
                forgotPassword.style.display = "block";
                signUpButton.style.display = "none";
                loginButton.style.display = "block";
                tooltipText.textContent = "Switch to Sign Up";
            } else if (action === "Sign Up") {
                headerText.textContent = "Vup";
                nameInputContainer.style.display = "block";
                forgotPassword.style.display = "none";
                signUpButton.style.display = "block";
                loginButton.style.display = "none";
                tooltipText.textContent = "Switch to Log in";
            }
        }

        function validateEmail() {
            const emailInput = document.getElementById("emailInput");
            const emailTooltip = document.getElementById("emailTooltip");
            const emailValue = emailInput.value;

            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

            if (emailRegex.test(emailValue) && emailValue.endsWith(".com")) {
                emailTooltip.style.visibility = "hidden"; // Hide tooltip
            } else {
                emailTooltip.style.visibility = "visible"; // Show tooltip
            }
        }

        function toggleAction() {
            if (action === "Login") {
                action = "Sign Up";
            } else {
                action = "Login";
            }

            // Update the UI to reflect the new action
            updateUI();
        }
        function navigateToForgotPasswordPage() {
            const forgotPasswordHTML = `
        <div class="container" style="text-align: center; padding-top: 30px; padding-bottom: 50px;">
        <h2 style="color: #4c00b4;">Forgot Password</h2>
        <h4 style="color:#888888;">Please enter your email address so we can send you an account recovery link.</h4>
        <div class='inputs' style="margin-top: 10px;">
        <div class='input'>
            <img src="image/email.png" alt="Email Icon" />
            <input type="email" placeholder="Enter your registered email" style="width: 80%;"/>
        </div>
        </div>
        <div class="submit-container" style="margin-top: 20px; margin-bottom: 10px;">
            <div class="submit" onClick="sendResetLink()" style="width: 180px; height: 40px; padding: 5px 10px; margin-right: 10px; margin-bottom: 10px;">Send Reset Link</div>
        </div>
        <div class="separator" style="margin-top: 10px;">
            <span><h3>OR</h3></span>
        </div>
        <div class="submit-container" style="margin-top: 5px; margin-bottom: 5px;">
            <a onclick="goBackToLogin()" style="cursor: pointer; color: #4c00b4; "><h3 style="margin: 0;">Back to the main page</h3></a>
        </div>
        </div>

        `   ;

            document.body.innerHTML = forgotPasswordHTML;
        }

        // function navigateToSignupPage() {
        // action = "Sign Up";
        // updateUI();
        // }




        function sendResetLink() {
            // 开发中
            alert('Reset link has been sent to your email!');
        }

        function goBackToLogin() {
            // navigateToSignupPage();
            location.reload();
        }


    </script>
</body>

</html>