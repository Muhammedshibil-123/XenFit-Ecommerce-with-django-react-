import "./login.css";
import {  NavLink,  useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const [Users, setUsers] = useState({
    username: "",
    password: ""
  });

  const [Validate, setValidate] = useState({});
  const [fetch, setFetch] = useState([])
  const [error, setError] = useState('')
  const navigate=useNavigate()

  function handlechange(e) {
    setUsers((perv) => ({
      ...perv,
      [e.target.name]: e.target.value,
    }));
  }


  function validate(Users) {
    const errors = {};

    if (Users.username.length === 0)
      errors.username = "Name is required";
    if (Users.password.length === 0) errors.password = "Password is required";
    else if (Users.password.length < 6)
      errors.password = "More than 6 characters needed ";

    return errors;
  }

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users`)
      .then((res) => setFetch(res.data))
      .catch((err) => console.error(err))
  }, [])

 async function submit(e) {
    e.preventDefault();
    const ValidateErrors = validate(Users);
    setValidate(ValidateErrors);

    if (Object.keys(ValidateErrors).length === 0) {
      try {
   
        setError(''); 
        

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/`, {
            username: Users.username,
            password: Users.password
        });

       
        const data = response.data;
        
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('id', data.id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
      
        navigate('/', { replace: true });
        window.location.reload();

      } catch (err) {
        console.error("Login Error:", err);
        if (err.response && err.response.status === 401) {
            setError('Invalid username or password');
        } else {
            setError('Login failed. Is the server running?');
        }
      }
    }
  }

 return (
    <div className="main-login-container">
      <div className="login-wrapper">
        
        {/* Left Side: Aesthetic Image */}
        <div className="login-image-section">
          {/* UPDATED: Hanging T-Shirts (No Person) */}
          <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop" alt="Fashion" />
          <div className="text-overlay">
            <h1>XenFit.</h1>
            <p>Streetwear Reimagined</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-section">
          <div className="form-title">
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={submit}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text"
                name="username"
                placeholder="Enter your username"
                value={Users.username}
                onChange={handlechange}
              />
              {Validate.username && <span className="error-msg">{Validate.username}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password"
                name="password"
                placeholder="••••••••"
                value={Users.password}
                onChange={handlechange}
              />
              {Validate.password && <span className="error-msg">{Validate.password}</span>}
            </div>

            <button type="submit" className="submit-btn">LOG IN</button>
            
            {error && <p className="error-msg" style={{textAlign:'center'}}>{error}</p>}
          </form>

          {/* Google Login Section */}
          <div className="divider"><span>OR</span></div>
          <button className="google-btn">
             <FcGoogle size={20} />
             <span>Sign in with Google</span>
          </button>

          <div className="login-footer">
            <p>Don't have an account? 
              <NavLink to={"/signup"}>Create Account</NavLink>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;