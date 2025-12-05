import React from 'react'
import { NavLink } from 'react-router-dom'
import './navbar.css'
import cart from '../assets/cart.png'
import search from '../assets/serach.png'
import whishlist from '../assets/whishlist.png'
import account from '../assets/account.png'
import adminimg from '../assets/admin.png'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../component/cartcouter'
import { WishlistContext } from '../component/whislistcouter'
import { SearchContext } from '../component/searchcontext'
import { GiHamburgerMenu } from "react-icons/gi";


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
                    <GiHamburgerMenu
                        className='burger'
                        onClick={() => setMenuOpen(!menuOpen)}
                    />
                    <div className={`left-navbar ${menuOpen ? 'open' : ''}`}>
                        
                        <GiHamburgerMenu
                            className="burger inside-burger"
                            onClick={() => setMenuOpen(false)}
                        />
                        <div className='admincss'>
                            <NavLink to={'/admin'}>
                                <img src={adminimg} style={{ display: admin === 'admin' ? 'block' : 'none' }} alt="" />
                            </NavLink>
                        </div>
                        <div className='Bassify'>
                            Bassify</div>
                        <div className='home'>
                            <NavLink to={'/'}>Home</NavLink>
                        </div>
                        <div className='shop'>
                            <NavLink to={'/shop'} onClick={shopRefresh}>Shop</NavLink>
                        </div>
                        <div className='myorders'>
                            <NavLink to={'/myorders'}>My Orders</NavLink>
                        </div>
                        <div className='about'>
                            <NavLink to={'/about'}>About</NavLink>
                        </div>
                    </div>
                </div>
                <div className='right-navbar'>
                    <div className='serach-bar'>
                        <input type="text"
                            value={searchnav}
                            onChange={(e) => setSearchnav(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />

                        <img src={search} alt="" onClick={handleImgeClick} />
                    </div>
                    <div className="whishlist">
                        <NavLink to={'/whishlist'} >
                            <img src={whishlist} alt="" />

                        </NavLink>
                        <div className="whislistcouter">
                            <p className='whishlistcount'>{Whishlistcount}</p>
                        </div>
                    </div>
                    <div className="cart">
                        <NavLink to={'/cart'} >

                            <img src={cart} alt="" />
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
                                <img className='account-img' src={account} alt="" />
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