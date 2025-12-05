import React from 'react'
import { NavLink, Outlet,useNavigate } from 'react-router-dom'
import './sidebar.css'

function Sidebar() {
     const navigate=useNavigate()  

     function handlelogout(){
           navigate('/login')
        localStorage.clear()
       }
    return (
        <div>
            <div className='admin-container'>
                <div className="main-sidebar">
                    <h1>Bassify</h1>
                    <div className='text-div'>
                        <NavLink to={'/admin'} className='nav' ><p>Dashboard</p></NavLink>
                        <NavLink to={'/admin/users'} className='nav'><p>Users</p></NavLink>
                        <NavLink to={'/admin/products'} className='nav'><p>Products</p></NavLink>
                        <NavLink to={'/admin/orders'} className='nav'><p>Orders</p></NavLink>
                        <NavLink to={'/'} className='nav' ><p>Product Home</p></NavLink>
                    </div>
                    <button onClick={handlelogout}>Logout</button>
                </div>
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>

    )
}

export default Sidebar