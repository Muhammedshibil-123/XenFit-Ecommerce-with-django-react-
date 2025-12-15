import "./login.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
  const [Users, setUsers] = useState({
    username: "",
    password: ""
  });

  const [Validate, setValidate] = useState({});
  const [fetch, setFetch] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

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


  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // 1. We got the code/token from Google. Now send it to backend.
        // Note: useGoogleLogin by default gives an access_token. 
        // If you used the <GoogleLogin /> component, it gives a credential (ID token).
        // Let's assume we want the ID token or we fetch user info to send to backend.

        // OPTION A: If backend expects an ID Token (Recommended for security), 
        // using <GoogleLogin /> component is often easier, but for a custom button:

        // Let's fetch the userInfo using the access token Google gave us, 
        // OR simply pass the access token to backend and let backend fetch info.

        // HOWEVER, the simplest flow with the backend code I wrote above 
        // expects an ID Token (credential). 

        console.log("Google Response:", tokenResponse);

        // To keep it simple with your custom UI button, we will use the access_token 
        // logic or switch to the pre-built component. 
        // Let's stick to your Custom Button UI:

        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        // Now we verify/login with our backend using the email we just got
        // Note: For higher security, you should pass the ID Token directly, 
        // but passing the access_token to backend to verify is also valid.
        // Let's modify the flow to send the ID token if available, or just the email if you trust frontend (Not recommended for prod).

        // BETTER APPROACH: Use the component or 'flow: auth-code'. 
        // But to make it work strictly with your code:

      } catch (error) {
        console.error("Google Login Error", error);
      }
    },
  });

  // WAIT! A better way for your specific backend setup (id_token verification):
  // We should use the component or configure the hook to give us an ID token.

  // Revised Google Handler for your custom button:
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Send the access token to backend, Backend will use it to get user info
        // (Note: You might need to slightly adjust backend to use 'verify_oauth2_token' 
        // OR just requests.get('https://www.googleapis.com/oauth2/v3/userinfo')

        // Let's assume we adjusted the backend to accept 'access_token' for simplicity
        // OR we use the GoogleLogin component which provides the `credential` (ID Token).

        // Let's stick to the cleanest integration: 
        // We will send the access_token to the backend.

        // CALL BACKEND
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/google-login/`, {
          token: response.access_token // Send the token
        });

        // HANDLE RESPONSE (Same as your normal submit)
        const data = res.data;
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('id', data.id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);

        navigate('/', { replace: true });
        window.location.reload();

      } catch (err) {
        console.error("Backend Google Login Failed", err);
        setError("Google Login Failed");
      }
    },
    onError: () => setError("Google Login Failed"),
  });

  return (
    <div className="main-login-container">
      <div className="login-wrapper">


        <div className="login-image-section">
          <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop" alt="Fashion" />
          <div className="text-overlay">
            <h1>XenFit.</h1>
            <p>Streetwear Reimagined</p>
          </div>
        </div>


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

            {error && <p className="error-msg" style={{ textAlign: 'center' }}>{error}</p>}
          </form>


          <div className="divider"><span>OR</span></div>
          <button
            className="google-btn"
            type="button" 
            onClick={() => handleGoogleLogin()}
          >
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