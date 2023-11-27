import React, { useState } from "react";
import "../component/CSS/loginS.css";
import email_image from "../component/image/email.png"
import exchange from "../component/image/exchange.png"
import password from "../component/image/password.png"
import person from "../component/image/person.png"
import showpw from "../component/image/showpw.png"
import showpw2 from "../component/image/showpw2.png"

function LoginSignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [action, setAction] = useState("Login");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [passw, setPassw] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwError, setPasswError] = useState(false);

    const handleLogin = () => {
        fetch('http://localhost:5001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: passw
            })
        })
        .then(response => {
            if (response.headers.get("Content-Type").includes("application/json")) {
              return response.json();
            }
            return response.text();
          })
        .then(data => {

            if (data.success) { // Check if login was successful
                // Store user data in session storage
                console.log(JSON.stringify(data.user))
                sessionStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/'
            } else {
                // Handle unsuccessful login
                // Display an error message to the user
                alert("Login failed: Invalid credentials");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle error here (e.g., show error message)
        });
    };
    const handleSignup = () => {
        fetch('http://localhost:5001/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: name,
                email: email,
                password: passw,
                role: role,
                userImage: ''
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Signup successful:', data);
                alert("Signup successful!");
                window.location.href = '/';
            } else {
                console.error('Signup failed:', data.message);
                alert("Signup failed: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred during signup.");
        });
    };
    
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (emailRegex.test(email) && email.length <= 30) {
            setEmailError(false);
            return(true);
        } else {
            setEmailError(true);
            return(false);
        }
    };
    const validateName = () => {
        // Check if name length is more than 5 characters
        if (name.length > 5) {
            // Return true if the name is more than 5 characters
            return true;
        } else {

            alert("Name must be more than 5 characters.");
            return false;
        }
    };
    
    const validatePassw = () => {
        // Check if password length is between 6 and 30 characters
        const isLengthValid = passw.length >= 6 && passw.length <= 30;

        // Check if password contains at least one digit
        const hasDigit = /\d/.test(passw);

        // Check if password contains at least one letter (uppercase or lowercase)
        const hasLetter = /[a-zA-Z]/.test(passw);

        // Check if password contains at least one symbol
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(passw);

        if (isLengthValid && hasDigit && hasLetter && hasSymbol) {

            // Return true if all conditions are met
            setPasswError(false);
            return(true);
        } else {
            setPasswError(true);
            return(false);
        }
    };

    const validateRole = () => {
        return role !== "";
    };

    const toggleAction = () => {
        setAction(action === "Login" ? "Sign Up" : "Login");
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (validateEmail() && validatePassw() ) {
            handleLogin();
            
        } else {
            
            alert("Please check your input.");
        }
       
    };
    const handlesignupFormSubmit = (event) => {
        event.preventDefault();
        console.log(role)
        console.log(validateEmail(),validatePassw(),validateRole(),validateName())
        if (validateEmail() && validatePassw() && validateRole() && validateName() ) {

            handleSignup();
            console.log("Submitted:", email, name, passw, role);
        } else {
            alert("Please check your inputs.");
        }
       
    };
    const sendResetLink = () => {
        alert("Reset link has been sent to your email!");
    };

    const goBackToLogin = () => {
        window.location.reload();
    };

    const renderSignupForm = () => {
        return (
            <form id="myform" method="post" onSubmit={handlesignupFormSubmit}>
                <input type="hidden" name="action" id="actionInput" value={action} />
                <div className="container">
                    <div className="header">
                        <div className="text">Vup</div>
                        <div className="underline"></div>
                    </div>
                    <div className="inputs">
                        <div className="input" id="nameInputContainer">
                            <div className="input-content">
                                <img src={person} alt="User Icon" />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    name="user_name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={validateName}
                                />
                            </div>
                        </div>
                        <div className="input">
                            <img src={email_image} alt="Email Icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                id="emailInput"
                                name="user_email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={validateEmail}
                            />
                            {emailError && <span className="email-tooltiptext" id="emailTooltip">Invalid format</span>}
                        </div>
                        <div className="input">
                            <img src={password} alt="Password Icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                id="passwordInput"
                                autoComplete="new-password"
                                name="user_pass"
                                value={passw}
                                onChange={(e) => setPassw(e.target.value)}
                                onBlur={validatePassw}
                            />
                            {passwError && <span className="email-tooltiptext" id="emailTooltip">Invalid format</span>}

                            <input
                                type="text"
                                id="hiddenPasswordInput"
                                style={{ opacity: 0, position: "absolute", top: -9999, left: -9999 }}
                            />
                            <p className="password-toggle" onClick={togglePasswordVisibility}>
                                {showPassword ? "Hide" : "Show"}
                            </p>
                        </div>
                    </div>
                    <div className="roleChoose" id="roleInputContainer" style={{ display: "flex", alignItems: "center" }}>
                        <label htmlFor="role" style={{ fontSize: "1.17em", fontWeight: "bold", color: "#4c00b4", marginRight: "10px", marginBottom: "0" }}>
                            <h3 style={{ margin: "0" }}>*Select your role:</h3>
                        </label>
                        <select
                            name="role"
                            id="role"
                            style={{
                                fontSize: "18px",
                                padding: "5px 10px",
                                borderRadius: "10px",
                                width: "185px",
                                border: "1px solid black",
                                marginTop: "5px",
                                marginBottom: "8px"
                            }}
                            value={role}
                            onChange={(e) => {setRole(e.target.value);}}
                        >
                            <option value="" >Select a role</option>
                            <option value="sender">Sender</option>
                            <option value="receiver">Receiver</option>
                        </select>
                    </div>
                    {/* <div className="forgot-password" onClick={navigateToForgotPasswordPage} id="forgotPassword">
                        Forgot password? <span>Click Here!</span>
                    </div> */}
                    <div className="tooltip" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: 0, padding: 0 }}>
                        <img
                            src={exchange}
                            alt="Switch"
                            className="switch-icon"
                            style={{ margin: "2px 0", width: "40px", height: "40px" }}
                            onClick={toggleAction}
                        />
                        <span className="tooltiptext" id="switchTooltip" style={{ textAlign: "center", marginTop: "2px", marginBottom: "2px" }}>
                            {action === "Login" ? "Switch to Sign Up" : "Switch to Log in"}
                        </span>
                    </div>
                    <div className="submit-container">
                        <button className={action === "Login" ? "submit" : "submit"} type="submit">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        );
    };
    const renderLoginForm = () => {
        return (
            <form id="myform" method="post" onSubmit={handleFormSubmit}>
                <input type="hidden" name="action" id="actionInput" value={action} />
                <div className="container">
                    <div className="header">
                        <div className="text">Vup</div>
                        <div className="underline"></div>
                    </div>
                    <div className="inputs">
                        <div className="input" id="nameInputContainer">
                            <div className="input-content">
                                <img src={person} alt="User Icon" />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    name="user_name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div> 
                        <div className="input">
                            <img src={email_image} alt="Email Icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                id="emailInput"
                                name="user_email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={validateEmail}
                            />
                            {emailError && <span className="email-tooltiptext" id="emailTooltip">Invalid format</span>}
                        </div>
                        <div className="input">
                            <img src={password} alt="Password Icon" />
                            <input
                                 type={showPassword ? "text" : "password"}
                                 placeholder="Password"
                                 id="passwordInput"
                                 autoComplete="new-password"
                                 name="user_pass"
                                 value={passw}
                                 onChange={(e) => setPassw(e.target.value)}
                                 onBlur={validatePassw}
                            />
                            <input
                                type="text"
                                id="hiddenPasswordInput"
                                style={{ opacity: 0, position: "absolute", top: -9999, left: -9999 }}
                            />
                            <p className="password-toggle" onClick={togglePasswordVisibility}>
                                {showPassword ? "Hide" : "Show"}
                            </p>
                        </div>
                    </div>
                    {/* <div className="roleChoose" id="roleInputContainer" style={{ display: "flex", alignItems: "center" }}>
                        <label htmlFor="role" style={{ fontSize: "1.17em", fontWeight: "bold", color: "#4c00b4", marginRight: "10px", marginBottom: "0" }}>
                            <h3 style={{ margin: "0" }}>*Select your role:</h3>
                        </label>
                        <select
                            name="role"
                            id="role"
                            style={{
                                fontSize: "18px",
                                padding: "5px 10px",
                                borderRadius: "10px",
                                width: "185px",
                                border: "1px solid black",
                                marginTop: "5px",
                            }}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="empty" disabled hidden>Select a role</option>
                            <option value="sender">Sender</option>
                            <option value="receiver">Receiver</option>
                        </select>
                    </div> */}
                    <div className="forgot-password" onClick={renderForgotPasswordForm} id="forgotPassword">
                        Forgot password? <span onClick={() => setAction("Forget")}>Click Here!</span>
                    </div>
                    <div className="tooltip" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: 0, padding: 0 }}>
                        <img
                            src={exchange}
                            alt="Switch"
                            className="switch-icon"
                            style={{ margin: "2px 0", width: "40px", height: "40px" }}
                            onClick={toggleAction}
                        />
                        <span className="tooltiptext" id="switchTooltip" style={{ textAlign: "center", marginTop: "2px", marginBottom: "2px" }}>
                            {action === "Login" ? "Switch to Sign Up" : "Switch to Log in"}
                        </span>
                    </div>
                    <div className="submit-container">
                        <button className={action === "Login" ? "submit" : "submit gray"} type="submit">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        );
    };
    const renderForgotPasswordForm = () => {
        return (
            <div className="container" style={{ textAlign: "center", paddingTop: "30px", paddingBottom: "50px" }}>
                <h2 style={{ color: "#4c00b4" }}>Forgot Password</h2>
                <h4 style={{ color: "#888888" }}>Please enter your email address so we can send you an account recovery link.</h4>
                <div className="inputs" style={{ marginTop: "10px" }}>
                    <div className="input">
                        <img src={email_image} alt="Email Icon" />
                        <input type="email" placeholder="Enter your registered email" style={{ width: "80%" }} />
                    </div>
                </div>
                <div className="submit-container" style={{ marginTop: "20px", marginBottom: "10px" }}>
                    <div className="submit" onClick={sendResetLink} style={{ width: "180px", height: "40px", padding: "5px 10px", marginRight: "10px", marginBottom: "10px" }}>
                        Send Reset Link
                    </div>
                </div>
                <div className="separator" style={{ marginTop: "10px" }}>
                    <span>
                        <h3>OR</h3>
                    </span>
                </div>
                <div className="submit-container" style={{ marginTop: "5px", marginBottom: "5px" }}>
                    <a onClick={goBackToLogin} style={{ cursor: "pointer", color: "#4c00b4" }}>
                        <h3 style={{ margin: "0" }}>Back to the Login Page</h3>
                    </a>
                </div>
            </div>
        );
    };

    let form;
    if (action === "Login") {
        form = renderLoginForm();
    } else if (action === "Forget") {
        form = renderForgotPasswordForm();
    } else {
        form = renderSignupForm();
    }

    return (
        <div>
            {form}
        </div>
    );
}

export default LoginSignupForm;
