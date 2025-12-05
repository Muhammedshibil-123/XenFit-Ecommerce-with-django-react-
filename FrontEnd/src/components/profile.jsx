import profileimg from '../assets/account-profile.png'
import './login.css'
import { NavLink,useNavigate } from 'react-router-dom'

function Profile() {

    const username = localStorage.getItem('username')
     const age = localStorage.getItem('age')
      const email = localStorage.getItem('email')
       const mobile = localStorage.getItem('mobile')
       const navigate=useNavigate()
     
       function logouthandlechange(){
        localStorage.clear()
        navigate('/login')
       }

  return (
    <div className='profile-container'>
        <img src={profileimg} alt="" />
        <p className="username">Username: {username}</p>
        <p className="age">Age: {age}</p>
        <p className="email">Email: {email}</p>
        <p className="mobile">Mobile: {mobile}</p>
        
        <button onClick={logouthandlechange}><span>Logout</span></button>
       
       
    </div>
  )
}

export default Profile