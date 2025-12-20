import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import "./login.css"; // Reusing login styles for consistency

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // The true/false logic you requested
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/forgot-password/`, { email });
      toast.success("OTP sent to your email!");
      setIsOtpSent(true); // Switch to OTP input view
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/verify-forgot-otp/`, { email, otp });
      toast.success("OTP Verified!");
      // Go to new password page, passing the email so we know who to reset
      navigate('/reset-password', { state: { email: email } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div className="main-login-container">
      <div className="login-wrapper" style={{justifyContent:'center'}}>
        <div className="login-form-section" style={{width: '100%', maxWidth:'400px'}}>
          
          <div className="form-title">
            <h2>Forgot Password</h2>
            <p>{isOtpSent ? "Enter the OTP sent to your email" : "Enter your email to reset password"}</p>
          </div>

          {!isOtpSent ? (
            // Form 1: Email Input
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <button type="submit" className="submit-btn">SEND OTP</button>
            </form>
          ) : (
            // Form 2: OTP Input (Shown when isOtpSent is true)
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                />
              </div>
              <button type="submit" className="submit-btn">VERIFY OTP</button>
              <p 
                style={{textAlign:'center', marginTop:'10px', cursor:'pointer', color:'#666'}}
                onClick={() => setIsOtpSent(false)}
              >
                Change Email
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;