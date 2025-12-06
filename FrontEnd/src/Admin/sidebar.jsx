import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './sidebar.css'

function Sidebar() {
    const navigate = useNavigate()

    function handlelogout() {
        navigate('/login')
        localStorage.clear()
    }
    
    return (
        <div className="admin-layout"> {/* Added wrapper class for layout control */}
            <div className='admin-container'>
                <div className="main-sidebar">
                    {/* EDITED: Changed Brand Name to match Frontend */}
                    <h1>XENFIT.</h1> 
                    
                    <div className='text-div'>
                        {/* EDITED: Added end prop to Dashboard for exact matching */}
                        <NavLink to={'/admin'} className='nav' end>
                            <p>Dashboard</p>
                        </NavLink>
                        <NavLink to={'/admin/users'} className='nav'>
                            <p>Users</p>
                        </NavLink>
                        <NavLink to={'/admin/products'} className='nav'>
                            <p>Products</p>
                        </NavLink>
                        <NavLink to={'/admin/orders'} className='nav'>
                            <p>Orders</p>
                        </NavLink>
                        {/* EDITED: Changed text to "Visit Store" for clarity */}
                        <NavLink to={'/'} className='nav'>
                            <p>Visit Store</p>
                        </NavLink>
                    </div>
                    
                    <button onClick={handlelogout}>LOGOUT</button>
                </div>
                
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Sidebar