import "./signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Signup() {
  const [Users, setUsers] = useState({
    username: "",
    age: "",
    email: "",
    mobile: "",
    password: "",
    status:"active"
  });
  const navigate = useNavigate();
  const [Validate, setValidate] = useState({});

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
    if (Users.age.length === 0) errors.age = "Age is required";
    else if(Number(Users.age) < 18){
      errors.age='Age must be more than 18'
    }
    if (Users.email.length === 0) {
      errors.email = "Email is required";
    } else if (!Users.email.includes("@") || !Users.email.includes(".")) {
      errors.email = "Email not valid";
    }
    if (Users.mobile.length === 0) {
      errors.mobile = "Mobile number required";
    } else if (Users.mobile.length !== 10) {
      errors.mobile = "Mobile number 10 digits needed";
    }
    if (Users.password.length === 0) errors.password = "Password is required";
    else if (Users.password.length < 6)
      errors.password = "More than 6 characters needed ";

    return errors;
  }

  async function submit(e) {
    e.preventDefault();
    const ValidateErrors = validate(Users);
    setValidate(ValidateErrors);

    if (Object.keys(ValidateErrors).length === 0) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/users/register/`, {
            username: Users.username,
            email: Users.email,
            password: Users.password,
            mobile: Users.mobile,
            age: Users.age
        });

        navigate('/login');
        
      } catch (err) {
        console.error("Signup Error:", err);
        if (err.response && err.response.data) {
            const djangoErrors = err.response.data;
            alert(JSON.stringify(djangoErrors)); 
        } else {
            alert("Signup failed. Please try again.");
        }
      }
    }
  }

  return (
    <div className="main-signup-container">
      <div className="signup-container">
        <div>Signup</div>
        <form onSubmit={submit} action="" noValidate>
          <label> Username</label>
          <input
            type="text"
            value={Users.username}
            name="username"
            onChange={handlechange}
          />
          {Validate.username && <p>{Validate.username}</p>}
          <label>Age</label>
          <input
            type="number"
            value={Users.age}
            name="age"
            onChange={handlechange}
          />
          {Validate.age && <p>{Validate.age}</p>}
          <label>Email</label>
          <input
            type="email"
            value={Users.email}
            name="email"
            onChange={handlechange}
          />
          {Validate.email && <p>{Validate.email}</p>}
          <label>Mobile No</label>
          <input
            type="tel"
            value={Users.mobile}
            name="mobile"
            onChange={handlechange}
          />
          {Validate.mobile && <p>{Validate.mobile}</p>}
          <label>Password</label>
          <input
            type="password"
            value={Users.password}
            name="password"
            onChange={handlechange}
          />
          {Validate.password && <p>{Validate.password}</p>}

          <button type="submit">Submit</button>
        </form>
        <p>
          already have an account?
          <NavLink to={"/login"} style={{ textDecoration: "none" }}>
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Signup;
