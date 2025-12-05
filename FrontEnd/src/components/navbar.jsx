import React, { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './navbar.css'

// Importing assets using correct relative paths and exact filenames from your list
import cart from '../assets/cart.png'
import search from '../assets/serach.png'  // Kept your filename typo 'serach.png'
import whishlist from '../assets/whishlist.png' // Kept your filename typo 'whishlist.png'
import account from '../assets/account.png'
import adminimg from '../assets/admin.png'

// Importing contexts from 'src/component/' (singular folder)
import { CartContext } from '../component/cartcouter.jsx'
import { WishlistContext } from '../component/whislistcouter.jsx'
import { SearchContext } from '../component/searchcontext.jsx'

function Navbar() {
    const userId = (localStorage.getItem("username"))
    const [searchnav, setSearchnav] = useState('')
    const navigate = useNavigate()
    const { cartcount } = useContext(CartContext)
    const { Whishlistcount } = useContext(WishlistContext)
    const { setSearchTerm } = useContext(SearchContext)
    const admin = localStorage.getItem('role')
    const [menuOpen, setMenuOpen] = useState(false)

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            setSearchTerm(searchnav);
            navigate('/shop')
        }
    }

    function handleImgeClick() {
        setSearchTerm('')
        navigate('/shop')
    }

    function shopRefresh() {
        setSearchTerm('');
        navigate('/shop');
    }

    return (
        <div className='main-navbar-container'>
            <div className='navbar-container'>
                <div className="hambarg">
                    {/* SVG Burger Icon */}
                    <svg 
                        className="burger" 
                        onClick={() => setMenuOpen(!menuOpen)}
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>

                    <div className={`left-navbar ${menuOpen ? 'open' : ''}`}>
                        {/* Mobile Menu Close Icon */}
                        <svg 
                            className="burger inside-burger"
                            onClick={() => setMenuOpen(false)}
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>

                        <div className='admincss'>
                            <NavLink to={'/admin'}>
                                <img src={adminimg} style={{ display: admin === 'admin' ? 'block' : 'none' }} alt="Admin Panel" />
                            </NavLink>
                        </div>
                        
                        {/* Mobile Brand Name (Clickable Home Link) */}
                        <div className='brand-mobile'>
                            <NavLink to="/" onClick={() => setMenuOpen(false)} style={{textDecoration: 'none', color: 'inherit'}}>
                                Xenfit
                            </NavLink>
                        </div>

                        {/* REMOVED: Home link div as requested */}
                        
                        <div className='shop'>
                            <NavLink to={'/shop'} onClick={() => { shopRefresh(); setMenuOpen(false); }}>Shop</NavLink>
                        </div>
                        <div className='myorders'>
                            <NavLink to={'/myorders'} onClick={() => setMenuOpen(false)}>My Orders</NavLink>
                        </div>
                        <div className='about'>
                            <NavLink to={'/about'} onClick={() => setMenuOpen(false)}>About</NavLink>
                        </div>
                    </div>
                </div>

                {/* Desktop Brand Name */}
                <div className='brand-desktop'>
                    <NavLink to="/" style={{textDecoration: 'none'}}>
                        Xenfit.
                    </NavLink>
                </div>

                <div className='right-navbar'>
                    <div className='serach-bar'>
                        <input type="text"
                            placeholder="Search..."
                            value={searchnav}
                            onChange={(e) => setSearchnav(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />

                        <img src={search} alt="Search" onClick={handleImgeClick} />
                    </div>
                    <div className="whishlist">
                        <NavLink to={'/whishlist'} >
                            <img src={whishlist} alt="Wishlist" />
                        </NavLink>
                        <div className="whislistcouter">
                            <p className='whishlistcount'>{Whishlistcount}</p>
                        </div>
                    </div>
                    <div className="cart">
                        <NavLink to={'/cart'} >
                            <img src={cart} alt="Cart" />
                        </NavLink>
                        <div className="cartcouter">
                            <p className='cartcount'>{cartcount}</p>
                        </div>
                    </div>

                    {
                        userId &&
                        <div className="account">
                            <NavLink to={'/profile'} className="account-btn" >
                                <button className='btn'><span>Hi, {userId} </span>
                                </button>
                                <img className='account-img' src={account} alt="Account" />
                            </NavLink>
                        </div>
                    }
                    {
                        !userId &&
                        <div className="login">
                            <NavLink to={'/login'} >
                                <button><span>Login</span></button>
                            </NavLink>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar