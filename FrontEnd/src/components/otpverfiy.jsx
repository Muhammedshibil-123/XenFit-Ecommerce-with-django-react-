import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import { useAuth } from '../component/AuthContext'; 

function OtpVerify() {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    if(!otp) return toast.error("Please enter OTP");

    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/verify-otp/`, {
            email: email,
            otp: otp
        });

        if(res.status === 200) {
            toast.success("Verification Successful!");
            login(res.data, {
                access: res.data.access,
                refresh: res.data.refresh
            });
            navigate('/'); 
        }
    } catch (err) {
        toast.error(err.response?.data?.error || "Verification Failed");
    }
  }

  return (
    <div className="main-login-container"> 
        <div className="login-container">
            <div>Verify OTP</div>
            <p style={{color:'#666', fontSize:'13px', marginBottom:'20px'}}>
                Code sent to: <strong>{email}</strong>
            </p>
            <form onSubmit={handleVerify}>
                <label>Enter 6-Digit Code</label>
                <input 
                    type="text" 
                    maxLength="6"
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    style={{letterSpacing: '5px', textAlign: 'center', fontSize: '18px'}}
                />
                <button type="submit">Verify & Login</button>
            </form>
        </div>
    </div>
  );
}

export default OtpVerify;