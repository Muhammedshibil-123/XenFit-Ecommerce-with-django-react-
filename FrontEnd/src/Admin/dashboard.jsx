import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './dashboard.css'
import { FaUserFriends, FaBoxOpen, FaShoppingBag, FaRupeeSign } from 'react-icons/fa'

// --- 1. New Helper Component for Number Animation ---
const AnimatedCounter = ({ value, isCurrency = false }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    // If value is 0, no need to animate
    if (end === 0) {
        setCount(0);
        return;
    }

    // Animation settings
    let startTime = null;
    const duration = 1000; // 1 second duration (Fast)

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      
      // Calculate percentage (0 to 1)
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (EaseOutExpo) for a smooth "fast then slow" effect
      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      const current = Math.floor(ease * end);
      setCount(current);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure it ends on the exact number
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {isCurrency ? '₹' : ''}{count.toLocaleString()}
    </span>
  )
}


function Dashbaord() {
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])

  const userId = localStorage.getItem('id')

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, userRes, orderRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/products`),
          axios.get(`${import.meta.env.VITE_API_URL}/users`),
          axios.get(`${import.meta.env.VITE_API_URL}/orders`)
        ]);
        setProducts(prodRes.data);
        setUsers(userRes.data);
        setOrders(orderRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, [userId]);

  // --- Calculations ---

  // 1. Total Income
  const totalIncome = orders.reduce((total, order) => {
    const orderSubtotal = order.items.reduce((sub, item) => sub + (item.price * item.quantity), 0);
    return total + orderSubtotal;
  }, 0);

  // 2. Recent Orders (Last 5)
  const recentOrders = [...orders].reverse().slice(0, 5);

  // 3. Top Selling Products
  const topProducts = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      const existing = acc.find(p => p.productId === item.productId);
      if (existing) {
        existing.sales += item.quantity;
      } else {
        const originalProduct = products.find(p => p.id === item.productId);
        acc.push({ 
          ...item, 
          sales: item.quantity,
          category: originalProduct?.category || 'General' 
        });
      }
    });
    return acc;
  }, []).sort((a, b) => b.sales - a.sales).slice(0, 4);

  return (
    <div className='dashboard-wrapper'>
      
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Overview</h1>
          <p>Welcome back, Admin</p>
        </div>
        <div className="date-badge">{new Date().toDateString()}</div>
      </div>

      {/* Stats Grid - Using AnimatedCounter */}
      <div className='stats-grids'>
        
        <div className="stat-cards">
          <div className="icon-box purple"><FaUserFriends /></div>
          <div className="stat-info">
            <h4>Total Users</h4>
            {/* EDITED: Wrapped in AnimatedCounter */}
            <h2><AnimatedCounter value={users.length} /></h2>
          </div>
        </div>

        <div className="stat-cards">
          <div className="icon-box blue"><FaBoxOpen /></div>
          <div className="stat-info">
            <h4>Total Products</h4>
            {/* EDITED: Wrapped in AnimatedCounter */}
            <h2><AnimatedCounter value={products.length} /></h2>
          </div>
        </div>

        <div className="stat-cards">
          <div className="icon-box orange"><FaShoppingBag /></div>
          <div className="stat-info">
            <h4>Total Orders</h4>
            {/* EDITED: Wrapped in AnimatedCounter */}
            <h2><AnimatedCounter value={orders.length} /></h2>
          </div>
        </div>

        <div className="stat-cards">
          <div className="icon-box green"><FaRupeeSign /></div>
          <div className="stat-info">
            <h4>Total Revenue</h4>
            {/* EDITED: Wrapped in AnimatedCounter with currency */}
            <h2><AnimatedCounter value={totalIncome} isCurrency={true} /></h2>
          </div>
        </div>

      </div>

      {/* Main Content Split */}
      <div className="dashboard-split">
        
        {/* Left: Recent Orders Table */}
        <div className="recent-orders-section">
          <div className="section-header">
            <h3>Recent Orders</h3>
          </div>
          
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => {
                    const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    return (
                      <tr key={order.id}>
                        <td className="order-id">#{order.id}</td>
                        <td className="customer-name">{order.delivery?.name || order.username}</td>
                        <td>{order.items.length} Items</td>
                        <td className="amount">₹{orderTotal}</td>
                        <td>
                          <span className={`status-badge ${order.status?.toLowerCase().replace(/\s/g, '-') || 'pending'}`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Top Selling Products */}
        <div className="top-products-section">
          <div className="section-header">
            <h3>Top Selling</h3>
          </div>

          <div className="top-products-list">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div className="top-product-item" key={index}>
                  <div className="product-rank">0{index + 1}</div>
                  <img src={product.image} alt={product.title} />
                  <div className="product-desc">
                    <h5>{product.title}</h5>
                    <p>{product.category}</p>
                  </div>
                  <div className="product-sales">
                    <span>{product.sales} sold</span>
                    <strong>₹{product.price}</strong>
                  </div>
                </div>
              ))
            ) : (
              <p style={{color: '#888', textAlign: 'center', marginTop: '20px'}}>No sales data yet.</p>
            )}
          </div>
          
          <div className="view-all-btn">
             <button>View Inventory</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashbaord