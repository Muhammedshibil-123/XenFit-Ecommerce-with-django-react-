import "./login.css";
import {  NavLink,  useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

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
      <div className="login-container">
        <div>Login</div>
        <form action="" onSubmit={submit}>
          <label>Username</label>
          <input type="text"
            name="username"
            value={Users.username}
            onChange={handlechange}
          />
          {Validate.username && <p>{Validate.username}</p>}

          <label>Password</label>
          <input type="password"
            name="password"
            value={Users.password}
            onChange={handlechange}
          />
          {Validate.password && <p>{Validate.password}</p>}

          <button type="submit">Login</button>
          {error&&<p style={{ marginTop: "8px"}}>{error}</p>}
        </form>
        <p>
          Dont have any account?
          <NavLink to={"/signup"} style={{ textDecoration: "none" }}>
            Signup
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
