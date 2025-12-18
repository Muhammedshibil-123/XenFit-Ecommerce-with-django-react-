import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './users.css'

function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [typesort, setTypesort] = useState('all')

  const token = localStorage.getItem('access_token') || localStorage.getItem('access')
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!token) return

    axios.get(`${API_URL}/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUsers(res.data))
  }, [API_URL, token])

  const toggleUserStatus = (id) => {
    const user = users.find(u => u.id === id)
    if (!user) return

    const status = user.status === 'active' ? 'inactive' : 'active'

    setUsers(prev =>
      prev.map(u => u.id === id ? { ...u, status } : u)
    )

    axios.patch(
      `${API_URL}/users/${id}/`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  let filteredUsers = users.filter(u => {
    const s = search.toLowerCase()
    return (
      u.username?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.id.toString().includes(s)
    )
  })

  if (typesort !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.status === typesort)
  }

  return (
    <div className="users-page-wrapper">
      <div className="main-users-container">
        <div className="users-header">
          <h1>Customer Database</h1>
          <div className="controls-container">
            <div className="search-box">
              <input
                placeholder="Search by name, email, or ID"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <select value={typesort} onChange={e => setTypesort(e.target.value)}>
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        <div className="users-list-container">
          <div className="table-header-row">
            <div className="col-id">ID</div>
            <div className="col-user">User</div>
            <div className="col-email">Email</div>
            <div className="col-mobile">Mobile</div>
            <div className="col-status">Status</div>
            <div className="col-action"></div>
          </div>

          <div className="users-list">
            {filteredUsers.map(user => (
              <div className="user-row" key={user.id}>
                <div className="col-id">#{user.id}</div>
                <div className="col-user">
                  <strong>{user.username}</strong>
                </div>
                <div className="col-email" title={user.email}>
                  {user.email}
                </div>
                <div className="col-mobile">
                  {user.mobile || 'N/A'}
                </div>
                <div className="col-status">
                  <span className={`status-pill ${user.status}`}>
                    {user.status}
                  </span>
                </div>
                <div className="col-action">
                  <button
                    className={`toggle-btn ${user.status === 'active' ? 'on' : 'off'}`}
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    <span className="toggle-circle" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users