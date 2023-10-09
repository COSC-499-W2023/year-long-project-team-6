import React, { useState } from 'react'
import './LoginSignup.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
const LoginSignup = () => {

    const [action, setAction] = useState("Login");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                {action === "Login" ? <div></div> : <div className='input'>
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Name" />
                </div>}
                {/* <div className='input'>
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Name"/>
                </div> */}
                <div className='input'>
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email" />
                </div>
                <div className='input'>
                    <img src={password_icon} alt="" />
                    <input
                        type={showPassword ? "text" : "password"} // 根据 showPassword 状态决定密码框的类型
                        placeholder="Password"
                    />
                    <button className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide " : "Show "}
                    </button>
                </div>
            </div>

            {action === "Sign Up" ? <div></div> : <div className="forgot-password" onClick={() => setAction("Sign Up")}>Forgot password? <span>Click Here!</span></div>}
            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>Sign Up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>Login</div>
            </div>
        </div>
    )
}
export default LoginSignup