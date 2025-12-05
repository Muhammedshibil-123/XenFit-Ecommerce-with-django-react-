import React from 'react'
import './dashboard.css'
import { useState,useEffect } from 'react'
import axios from 'axios'


function Dashbaord() {
  const [products,setProducts]=useState([])
  const [users,setUsers]=useState([])
  const [orders,setOrders]=useState([])

  const userId=localStorage.getItem('id')

   useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        setProducts(res.data)
      })
      .catch((err) => console.log(err))
  }, [userId])

   useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users`)
      .then((res) => {
        setUsers(res.data)
      })
      .catch((err) => console.log(err))
  }, [userId])

   useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/orders`)
      .then((res) => {
        setOrders(res.data)
      })
      .catch((err) => console.log(err))
  }, [userId])

   let totalincome=orders.reduce((total,order)=>{
    const orderSubtotal=order.items.reduce((subtotal,item)=>{
      return subtotal+(item.price*item.quantity)
    },0)
    return total+orderSubtotal
   },0)
  return (
    <div style={{marginLeft:'290px',marginTop:'200px'}}>
   <h1 style={{textAlign:'center',marginTop: '30px'}}>Dashboard</h1>
      <div className='main-dashboard-container'>
           
        <div className="dashboard-container">
          
          <div className="users">
            <h4>Users</h4>
            <p>{users.length}</p>
          </div>
          <div className="products">
            <h4>Products</h4>
            <p>{products.length}</p>
          </div>
          <div className="income">
            <h4>Total Income</h4>
            <p>₹{totalincome}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashbaord