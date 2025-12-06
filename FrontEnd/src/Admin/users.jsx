import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './users.css'
// EDITED: Importing search icon if you want to use it inside the input wrapper, 
// otherwise standard input is fine.

function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [typesort, setTypesort] = useState('types')
  const userId = localStorage.getItem('id')

  useEffect(() => {
    // Using the environment variable correctly
    const getApiUrl = () => {
      try {
        return import.meta.env.VITE_API_URL || 'http://localhost:3000';
      } catch (e) {
        return 'http://localhost:3000';
      }
    };
    const API_URL = getApiUrl();

    axios.get(`${API_URL}/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
  }, [userId])

  function toggleusersStatus(id) {
    const user = users.find((p) => p.id === id)
    if (!user) return

    const newStatus = user.status === "active" ? "inactive" : "active"

    setUsers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    )
    
    const getApiUrl = () => {
      try {
        return import.meta.env.VITE_API_URL || 'http://localhost:3000';
      } catch (e) {
        return 'http://localhost:3000';
      }
    };

    axios
      .patch(`${getApiUrl()}/users/${id}`, { status: newStatus })
      .catch((err) => {
        console.error(err)
      })
  }

  function handleSearch(e) {
    setSearch(e.target.value)
  }

  let filterProducts = users.filter((user) => (
    (user.username?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.id?.toString().toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.status?.toLowerCase() || '').includes(search.toLowerCase())
  ))


  if (typesort === 'active') {
    filterProducts = filterProducts.filter((product) =>
      product.status.toLowerCase() === ('active')
    )
  } else if (typesort === 'inactive') {
    filterProducts = filterProducts.filter((product) =>
      product.status.toLowerCase() === ('inactive')
    )
  }

  return (
    // EDITED: Removed inline margin-left. The Sidebar layout handles the spacing now.
    <div className='users-page-wrapper'>
      <div className='main-users-container'>
        
        {/* Header Section */}
        <div className="users-header">
          <h1>CUSTOMER DATABASE</h1>
          <div className="controls-container">
            <div className="search-box">
              <input type="text"
                onChange={handleSearch}
                placeholder='Search customers...'
                value={search}
              />
            </div>
            <div className="filter-box">
                <select value={typesort} onChange={(e) => setTypesort(e.target.value)}>
                  <option value="types">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Blocked</option>
                </select>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="table-header-row">
          <span className='col-id'>ID</span>
          <span className='col-user'>USER</span>
          <span className='col-email'>EMAIL</span>
          <span className='col-mobile'>MOBILE</span>
          <span className='col-status'>STATUS</span>
          <span className='col-action'>ACTION</span>
        </div>

        {/* Table Body */}
        <div className="users-list">
          {filterProducts.length > 0 ? (
             filterProducts.map((user) => (
              <div className="user-row" key={user.id}>
                <span className='col-id'>#{user.id}</span>
                <span className='col-user'>{user.username}</span>
                <span className='col-email'>{user.email}</span>
                <span className='col-mobile'>{user.mobile}</span>
                
                <span className='col-status'>
                  <span className={`status-badge ${user.status === 'active' ? 'active' : 'inactive'}`}>
                    {user.status}
                  </span>
                </span>

                <span className='col-action'>
                  <button
                    onClick={() => toggleusersStatus(user.id)}
                    className={`toggle-btn ${user.status === "active" ? "on" : "off"}`}
                    title={user.status === "active" ? "Block User" : "Unblock User"}
                  >
                    <div className="toggle-circle"></div>
                  </button>
                </span>
              </div>
            ))
          ) : (
            <p className="no-data">No users found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Users