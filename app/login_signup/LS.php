<?php
session_start();
include("../Connection.php");
include("../Function.php");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $action = $_POST['action'];
    if ($action == "Sign Up") {
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
            echo '<script type="text/javascript">';
            echo 'alert("please enter valid information!");';
            echo '</script>';
        }
    } else if ($action == "Login") {
        $email = $_POST['user_email'];
        $password = $_POST['user_pass'];

        if (!empty($email) && !empty($password)) {
            //read from database; 
            $query = "select * from users where email = '$email' limit 1";
            $result = mysqli_query($link, $query);
            if ($result) {
                if ($result && mysqli_num_rows($result) > 0) {
                    $user_data = mysqli_fetch_assoc($result);
                    if ($user_data['password'] === $password) {
                        $_SESSION['userid'] = $user_data['userid'];
                        header("Location: ../HomePage_UI/Homepage.php");
                        die;
                    }
                }
            }
            echo '<script type="text/javascript">';
            echo 'alert("Wrong email or password!");';
            echo '</script>';
        } else {
            echo '<script type="text/javascript">';
            echo 'alert("Please enter some valid information!");';
            echo '</script>';
        }
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
        <input type="hidden" name="action" id="actionInput" value="Login">
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
                    <input type="password" placeholder="Password" id="passwordInput" autocomplete="new-password"
                        name="user_pass" />
                    <input type="text" id="hiddenPasswordInput"
                        style="opacity: 0; position: absolute; top: -9999px; left: -9999px;" />
                    <p class="password-toggle" onClick="togglePasswordVisibility()">Show</p>
                </div>


                
            </div>
            <div class="roleChoose" id="roleInputContainer">
                <label for="role" style="font-size: 1.17em; font-weight: bold; color:#4c00b4"><h3>*Select your role:&nbsp;</label>
                <select name="role" id="role" style="font-size: 18px; padding: 5px 10px; border-radius:10px; width: 185px; border: 1px solid black;">
                    <option value="empty" disabled selected hidden></option>
                    <option value="sender">Sender</option>
                    <option value="receiver">Receiver</option>
                </select>
            </div>

            <div class="forgot-password" onClick="navigateToForgotPasswordPage()" id="forgotPassword">Forgot password?
                <span>Click Here!</span>
            </div>

            <div class="tooltip" style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0; padding: 0;">
                <img src="image/exchange.png" alt="Switch" class="switch-icon" style="margin: 2px 0; width: 40px; height: 40px;" onClick="toggleAction()" />
                <span class="tooltiptext" id="switchTooltip" style="text-align: center; margin-top: 2px; margin-bottom: 2px;">Switch between Login and Sign Up interface</span>
            </div>

            
            <div class="submit-container">
                <button class="submit gray" id="signUpButton" type="submit">Submit</button>
                <button class="submit" id="loginButton" type="submit">Submit</button>
            </div>
        </div>
    </form>

    <!-- ---------------------------------------------------------------------- -->
    <script src="login_signup.js">
        let showPassword = false;
        let action = "Login";  

        document.addEventListener("DOMContentLoaded", function () {
            action = "Login";
            updateUI(); // 更新UI以反映新的action，的、默认进入login
        });

        // function showText() {
        //     document.querySelector('.switch-text').style.visibility = 'visible';
        // }

        // function hideText() {
        //     document.querySelector('.switch-text').style.visibility = 'hidden';
        // }

        //点击login/signup button 
        document.getElementById('signUpButton').addEventListener("click",function(event) {
        event.preventDefault();
        if (validateEmail() && validateRole()) {
            document.getElementById('myform').submit();
        } else {
            alert("Please check your inputs.");
        }
        });
        document.getElementById('loginButton').addEventListener("click",function(event) {
        event.preventDefault();
        if (validateEmail()) {
            document.getElementById('myform').submit();
        } else {
            alert("Please check your inputs.");
        }
        });
        
        //设置密码可见性，点击show即可查看，hide则隐藏
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
                //login和signup界面所要的信息不同
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
            const roleInputContainer = document.getElementById('roleInputContainer');
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
            //如果在login界面则不显示nameinput和signup button,当鼠标移到“交换”标志时会显示"Switch to Sign Up"
            if (action === "Login") {
                headerText.textContent = "Vup";
                nameInputContainer.style.display = "none";
                forgotPassword.style.display = "block";
                signUpButton.style.display = "none";
                loginButton.style.display = "block";
                roleInputContainer.style.display = "none";
                tooltipText.textContent = "Switch to Sign Up";
            //如果在signup界面则不显示forgotpassword button和login button,当鼠标移到“交换”标志时会显示"Switch to Log in"
            } else if (action === "Sign Up") {
                headerText.textContent = "Vup";
                nameInputContainer.style.display = "block";
                forgotPassword.style.display = "none";
                signUpButton.style.display = "block";
                loginButton.style.display = "none";
                tooltipText.textContent = "Switch to Log in";
                roleInputContainer.style.display = "block";
            }
            document.getElementById('actionInput').value = action;
        }
        
        //确定邮箱格式，中间必须含有@，结尾必须以.com结束，长度必须在30个characters以内
        //如果不符合格式将会一直显示“invalid format”直到符合为止

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
        function validateRole() {
        const roleSelect = document.getElementById("role");
        if (roleSelect.value === "") {
            return false;  // Role is not selected
        }
            return true;  // Role is selected
        }
        //点击"交换"标志则会切换signup和login界面
        function toggleAction() {
            if (action === "Login") {
                action = "Sign Up";
            } else {
                action = "Login";
            }
            document.getElementById('actionInput').value = action;
            // Update the UI to reflect the new action
            updateUI();
        }
        //forgotpassword design
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
