import axios from "axios";
import { useState, useEffect } from "react";
import './myorders.css'; 
import { useNavigate } from "react-router-dom";

function Myorders() {
  const [orders, setOrders] = useState([])
  const token = localStorage.getItem("access_token") 
  const navigate = useNavigate()

  
  const getApiUrl = () => {
    try {
        return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
    } catch (e) {
        return 'http://127.0.0.1:8000/api';
    }
  };
  const API_URL = getApiUrl();

  useEffect(() => {
    if (!token) {
        navigate('/login'); 
        return;
    }

    axios.get(`${API_URL}/orders/my-orders/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setOrders(res.data || [])
      })
      .catch((err) => {
          console.log("Error fetching orders:", err);
      })
  }, [token, API_URL, navigate])


   function handleProductClick(productId){
       navigate(`/product/${productId}`) 
   }

   const getStatusIndex = (status) => {
     const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
     return steps.indexOf(status);
   };

   const getProgressWidth = (status) => {
     const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
     const index = steps.indexOf(status);
     
     if (index === -1) return 5; 
     if (index === 3) return 100; 

     const segmentWidth = 100 / 3;
     const baseWidth = index * segmentWidth;
     const extraProgress = segmentWidth * 0.50; 

     return baseWidth + extraProgress;
   };
   
   const getImageUrl = (img) => {
        if (!img) return 'https://via.placeholder.com/150';
        return img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`;
   };

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <h1>My Orders</h1>
        {!orders || orders.length === 0 ? (
          <p style={{textAlign:'center', marginTop:'20px', color:'#666'}}>You haven't placed any orders yet</p>
        ) : (
          <div>
            {orders.map((order) => {
                const activeIndex = getStatusIndex(order.status || "Order Placed");
                const progressWidth = getProgressWidth(order.status || "Order Placed");
                
                return (
                <div className="track-order-card" key={order.id}>

                    <div className="track-order-header">
                        <div>
                            <span className="track-order-id">Order ID: #{order.id}</span>
                            <span className="track-order-date">Placed on: {order.orderDate}</span>
                        </div>
                        <div className="track-status-text">
                           {order.status}
                        </div>
                    </div>

                    <div className="track-delivery-info">
                        <h4>Delivery Address</h4>
                        <p><strong>{order.name}</strong> | {order.mobile}</p>
                        <p>{order.address}, {order.place} - {order.pincode}</p>
                    </div>

                    <div className="track-items-list">
                        {order.items.map((item, idx) => (
                            <div className="track-item-row" key={idx}
                                onClick={()=>handleProductClick(item.product_id)}
                                style={{cursor: 'pointer'}}
                            >
                                <img src={getImageUrl(item.product_image)} alt={item.product_title} />
                                <div className="track-item-details">
                                    <h3>{item.product_title}</h3>
                                    <p className="size-text">Size: {item.size}</p>
                                    <p>Qty: {item.quantity}</p>
                                    <p className="price-text">₹{item.price}</p>
                                </div>
                                <div className="track-item-total">
                                    ₹{Number(item.price) * item.quantity}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="track-progress-wrapper">
                        <div className="track-progress-bar">
                            <div className="track-line-bg"></div>
                            <div 
                                className="track-line-fill" 
                                style={{ width: `${progressWidth}%` }}
                            ></div>
                            
                            {["Order Placed", "Shipped", "Out for Delivery", "Delivered"].map((step, i) => (
                                <div key={step} className={`track-step ${activeIndex >= i ? 'active' : ''}`}>
                                    <div className="track-dot"></div>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}

export default Myorders;