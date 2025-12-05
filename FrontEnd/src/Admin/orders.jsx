import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './orders.css'

function Orders() {
    const [orders,setOrders]=useState([])
 const userId = localStorage.getItem('id')


  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_API_URL}/orders`)
    .then((res)=>setOrders(res.data))
    .catch((err)=>console.error(err))
  },[userId])

 const items=orders.items
 console.log(items)
  return ( 
   <div className='orders-page-container'  style={{marginLeft:'290px'}}>
      <h1 style={{textAlign:'center'}}>All Orders</h1>
      <div className='main-order-container'>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className='order-card'>
              <div className='order-header'>
               
                <h3>Order ID: {order.id}</h3>
                <strong>User: {order.username}</strong>
              </div>

              <div className='order-body'>
                <div className='order-items-list'>
                  <h4>Items</h4>
                  {order.items.map((item) => (
                    <div key={item.productId} className='order-item'>
                      <img src={item.image} alt={item.title} className='item-image' />
                      <div className='item-details'>
                        <p className='item-title'>{item.title}</p>
                        <p className='quantity'>Quantity: {item.quantity}</p>
                        <p className='price'>Price: ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='delivery-details'>
                  <h4>Delivery Address</h4>
                  <p><strong>Name:</strong> {order.delivery.name}</p>
                  <p><strong>Mobile:</strong> {order.delivery.mobile}</p>
                  <p><strong>Address:</strong> {order.delivery.address}, {order.delivery.place}</p>
                  <p><strong>Pincode:</strong> {order.delivery.pincode}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}


export default Orders