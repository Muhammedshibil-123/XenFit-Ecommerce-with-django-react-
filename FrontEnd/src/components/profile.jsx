import React, { useContext, useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import profileimg from '../assets/account-profile.png'
import './profile.css'
import { CartContext } from '../component/cartcouter'
import { WishlistContext } from '../component/whislistcouter'
import { FaBoxOpen, FaHeart, FaShoppingBag, FaSignOutAlt, FaUserEdit, FaTimes } from 'react-icons/fa'
import axios from 'axios'
import { toast } from "react-toastify"

function Profile() {
    const navigate = useNavigate()
    
    // Safe API URL
    const getApiUrl = () => {
      try {
        return import.meta.env.VITE_API_URL || 'http://localhost:3000';
      } catch (e) {
        return 'http://localhost:3000';
      }
    };
    const API_URL = getApiUrl();

    // User Data State
    const [userData, setUserData] = useState({
        id: localStorage.getItem('id'),
        username: localStorage.getItem('username') || '',
        age: localStorage.getItem('age') || '',
        email: localStorage.getItem('email') || '',
        mobile: localStorage.getItem('mobile') || ''
    })

    // Edit Modal State
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({ ...userData })

    const { cartcount } = useContext(CartContext)
    const { Whishlistcount } = useContext(WishlistContext)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        if(!editForm.username || !editForm.email || !editForm.mobile){
             toast.warn("Please fill required fields");
             return;
        }

        axios.patch(`${API_URL}/users/${userData.id}`, editForm)
            .then((res) => {
                setUserData(editForm);
                localStorage.setItem('username', editForm.username);
                localStorage.setItem('age', editForm.age);
                localStorage.setItem('email', editForm.email);
                localStorage.setItem('mobile', editForm.mobile);
                
                setIsEditing(false);
                toast.success("Profile Updated", { position: 'top-center', theme: "dark" });
            })
            .catch((err) => {
                console.error(err);
                toast.error("Update failed");
            });
    }

    function logouthandlechange(){
        localStorage.clear()
        navigate('/login')
        window.location.reload()
    }

    const openEditModal = () => {
        setEditForm({ ...userData });
        setIsEditing(true);
    }

    return (
        <div className='profile-page-wrapper'>
            <div className="profile-header-section">
                <h1>MY ACCOUNT</h1>
                <div className="underline"></div>
            </div>

            <div className='profile-grid'>
                {/* Left Column */}
                <div className='profile-card'>
                    <div className="avatar-container">
                        <img src={profileimg} alt="User" />
                    </div>
                    
                    <h2 className="profile-name">{userData.username}</h2>
                    <p className="profile-email">{userData.email}</p>

                    <button className="logout-btn" onClick={logouthandlechange}>
                        <FaSignOutAlt /> LOGOUT
                    </button>
                </div>

                {/* Right Column */}
                <div className='profile-details-section'>
                    
                    {/* Stats in Single Row */}
                    <div className="stats-grid">
                        <div className="stat-card" onClick={() => navigate('/cart')}>
                            <div className="icon"><FaShoppingBag /></div>
                            <div className="info">
                                <h3>{cartcount}</h3>
                                <p>In Bag</p>
                            </div>
                        </div>
                        <div className="stat-card" onClick={() => navigate('/whishlist')}>
                            <div className="icon"><FaHeart /></div>
                            <div className="info">
                                <h3>{Whishlistcount}</h3>
                                <p>Wishlist</p>
                            </div>
                        </div>
                        <div className="stat-card" onClick={() => navigate('/myorders')}>
                            <div className="icon"><FaBoxOpen /></div>
                            <div className="info">
                                <h3>Orders</h3>
                                <p>Track</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="info-box">
                        <div className="box-header">
                            <h3>PERSONAL DETAILS</h3>
                            <button className="edit-btn" onClick={openEditModal}>
                                <FaUserEdit /> Edit
                            </button>
                        </div>
                        
                        <div className="details-grid-view">
                            <div className="detail-item">
                                <label>Full Name</label>
                                <span>{userData.username}</span>
                            </div>
                            <div className="detail-item">
                                <label>Email Address</label>
                                <span>{userData.email}</span>
                            </div>
                            <div className="detail-item">
                                <label>Mobile Number</label>
                                <span>{userData.mobile || "Not Added"}</span>
                            </div>
                            <div className="detail-item">
                                <label>Age</label>
                                <span>{userData.age || "Not Added"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="quick-actions">
                        <NavLink to="/about" className="action-link">
                            📞 Support
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isEditing && (
                <div className="profile-modal-overlay">
                    <div className="profile-modal-content">
                        <div className="profile-modal-header">
                            <h2>EDIT PROFILE</h2>
                            <FaTimes className="close-icon" onClick={() => setIsEditing(false)} />
                        </div>
                        
                        <div className="profile-modal-body">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="username" value={editForm.username} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={editForm.email} onChange={handleInputChange} />
                            </div>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Mobile</label>
                                    <input type="tel" name="mobile" value={editForm.mobile} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Age</label>
                                    <input type="number" name="age" value={editForm.age} onChange={handleInputChange} />
                                </div>
                            </div>
                            <button className="save-profile-btn" onClick={handleSave}>SAVE CHANGES</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile