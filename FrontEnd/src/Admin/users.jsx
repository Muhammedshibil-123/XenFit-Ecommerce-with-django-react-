// Users.jsx (replace your existing file)
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './users.css'

function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [typesort, setTypesort] = useState('types')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Try both common storage keys so token mismatch won't silently fail
  const token = localStorage.getItem('access_token') || localStorage.getItem('access')

  const getApiUrl = () => {
    try {
      return import.meta.env.VITE_API_URL || 'http://localhost:8000'
    } catch (e) {
      return 'http://localhost:8000'
    }
  }

  useEffect(() => {
    const API_URL = getApiUrl()
    if (!token) {
      setError('No access token found. Please log in.')
      return
    }

    setLoading(true)
    setError(null)

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    }

    axios
      .get(`${API_URL}/api/users/`, config)
      .then((res) => {
        setUsers(res.data)
      })
      .catch((err) => {
        console.error('Error fetching users:', err)
        if (err.response) {
          if (err.response.status === 401) {
            setError('Unauthorized (401) — your session may have expired. Please log in again.')
          } else if (err.response.status === 403) {
            setError('Forbidden (403) — you need admin privileges to view user list.')
          } else {
            setError(`Error fetching users: ${err.response.statusText} (${err.response.status})`)
          }
        } else {
          setError('Network or CORS error while fetching users.')
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  function toggleusersStatus(id) {
    const user = users.find((p) => p.id === id)
    if (!user) return

    const prevStatus = user.status
    const newStatus = prevStatus === 'active' ? 'inactive' : 'active'

    // optimistic UI update
    setUsers((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)))

    const API_URL = getApiUrl()
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    axios
      .patch(`${API_URL}/api/users/${id}/`, { status: newStatus }, config)
      .catch((err) => {
        console.error('Error updating status:', err)
        // rollback UI change
        setUsers((prev) => prev.map((p) => (p.id === id ? { ...p, status: prevStatus } : p)))
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Permission error while updating status. Make sure you are an admin.')
        } else {
          setError('Failed to update user status.')
        }
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
      product.status?.toLowerCase() === ('active')
    )
  } else if (typesort === 'inactive') {
    filterProducts = filterProducts.filter((product) =>
      product.status?.toLowerCase() === ('inactive')
    )
  }

  return (
    <div className='users-page-wrapper'>
      <div className='main-users-container'>
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

        {loading && <p>Loading users...</p>}
        {error && <p style={{ color: 'tomato' }}>{error}</p>}

        <div className="table-header-row">
          <span className='col-id'>ID</span>
          <span className='col-user'>USER</span>
          <span className='col-email'>EMAIL</span>
          <span className='col-mobile'>MOBILE</span>
          <span className='col-status'>STATUS</span>
          <span className='col-action'>ACTION</span>
        </div>

        <div className="users-list">
          {!loading && filterProducts.length > 0 ? (
            filterProducts.map((user) => (
              <div className="user-row" key={user.id}>
                <span className='col-id'>#{user.id}</span>
                <span className='col-user'>{user.username}</span>
                <span className='col-email'>{user.email}</span>
                <span className='col-mobile'>{user.mobile || 'N/A'}</span>
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
            !loading && <p className="no-data">No users found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Users
