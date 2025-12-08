import "./signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; 

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: ""
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email";
    if (formData.mobile.length !== 10) newErrors.mobile = "10 digit mobile required";
    if (formData.password.length < 6) newErrors.password = "Min 6 chars";
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = "Passwords do not match";
    
    return newErrors;
  }

  async function submit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/users/register/`, formData);
        
        toast.success("OTP Sent to your email!");
        navigate('/otp-verify', { state: { email: formData.email } });
        
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data) {
           toast.error(JSON.stringify(err.response.data));
        } else {
           toast.error("Signup Failed");
        }
      }
    }
  }

  return (
    <div className="main-signup-container">
      <div className="signup-container">
        <div>Create Account</div>
        <form onSubmit={submit} noValidate>
          
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
          {errors.username && <p>{errors.username}</p>}

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p>{errors.email}</p>}

          <label>Mobile No</label>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} />
          {errors.mobile && <p>{errors.mobile}</p>}

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p>{errors.password}</p>}

          <label>Confirm Password</label>
          <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} />
          {errors.confirm_password && <p>{errors.confirm_password}</p>}

          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <NavLink to="/login">Login</NavLink></p>
      </div>
    </div>
  );
}

export default Signup;