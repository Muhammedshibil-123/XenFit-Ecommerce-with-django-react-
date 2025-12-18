import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './users.css'

const ExpandableCell = ({ text }) => {
  const [open, setOpen] = useState(false)

  return (
    <span
      className={`expandable-cell ${open ? 'expanded' : ''}`}
      onClick={() => setOpen(!open)}
    >
      {text}
    </span>
  )
}

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
          <h1>CUSTOMER DATABASE</h1>
          <div className="controls">
            <input
              placeholder="Search by name, email, or ID"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select value={typesort} onChange={e => setTypesort(e.target.value)}>
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Blocked</option>
            </select>
          </div>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>EMAIL</th>
              <th>MOBILE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="col-id">#{user.id}</td>
                <td className="col-user"><ExpandableCell text={user.username} /></td>
                <td className="col-email"><ExpandableCell text={user.email} /></td>
                <td className="col-mobile">{user.mobile || 'N/A'}</td>
                <td className="col-status">
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td className="col-action">
                  <button
                    className={`toggle-btn ${user.status === 'active' ? 'on' : 'off'}`}
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    <span className="toggle-circle" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users