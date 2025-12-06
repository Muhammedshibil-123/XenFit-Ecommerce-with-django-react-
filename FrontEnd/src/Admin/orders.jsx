import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './orders.css'
import { toast } from "react-toastify";

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Status options matching your My Orders section
  const statusOptions = [
    "Order Placed", 
    "Shipped", 
    "Out for Delivery", 
    "Delivered"
  ];

  const fetchOrders = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/orders`)
      .then((res) => {
        // Sort by ID descending (newest first)
        const sortedOrders = res.data.reverse(); 
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      })
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Function to handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      // 1. Optimistic UI update
      const updatedOrders = orders.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      // 2. API Call
      await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
        status: newStatus
      });

      toast.success(`Order #${id} marked as ${newStatus}`, {
        position: 'bottom-right',
        theme: "dark",
        autoClose: 2000
      });

    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update status");
      fetchOrders(); // Revert on error
    }
  }

  const pendingCount = orders.filter(o => o.status !== 'Delivered').length;

  return ( 
   <div className='orders-page-wrapper'>
      
      <div className="orders-header">
        <div>
          <h1>Order Management</h1>
          <p>Manage and track customer orders</p>
        </div>
        <div className="order-stats">
            <span>Pending Orders: <strong>{pendingCount}</strong></span>
        </div>
      </div>

      <div className='orders-table-container'>
        {loading ? (
          <p className="loading-text">Loading orders...</p>
        ) : orders.length > 0 ? (
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th style={{width: '80px'}}>ID</th>
                <th style={{width: '200px'}}>Customer</th>
                <th>Products Ordered</th> {/* EDITED: Label changed */}
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const totalAmount = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                
                // Determine class for status badge color
                const statusClass = order.status 
                  ? order.status.toLowerCase().replace(/\s/g, '-') 
                  : 'order-placed';

                return (
                  <tr key={order.id}>
                    <td className="id-col">#{order.id}</td>
                    
                    <td className="customer-col">
                      <div className="customer-info">
                        <span className="name">{order.delivery?.name || order.username}</span>
                        <span className="sub-text">{order.delivery?.mobile}</span>
                      </div>
                    </td>

                    {/* EDITED: Full Item List Display */}
                    <td className="items-col">
                      <div className="items-list-detailed">
                        {order.items.map((item, idx) => (
                           <div key={idx} className="item-row-detail">
                              <img src={item.image} alt={item.title} />
                              <div className="item-text">
                                 <span className="item-title">{item.title}</span>
                                 <span className="item-qty">Qty: {item.quantity}</span>
                              </div>
                           </div>
                        ))}
                      </div>
                    </td>

                    <td className="price-col">₹{totalAmount}</td>
                    
                    <td className="date-col">{order.orderDate || 'N/A'}</td>

                    <td>
                      <span className={`status-pill ${statusClass}`}>
                        {order.status || "Order Placed"}
                      </span>
                    </td>

                    <td>
                      <select 
                        className="status-select"
                        value={order.status || "Order Placed"}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {!order.status && <option value="Order Placed">Order Placed</option>}
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-orders">
             <p>No orders found in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders