import axios from "axios";
import { useState, useEffect } from "react";
import './myorders.css'; 
import { useNavigate } from "react-router-dom";

function Myorders() {
  const [orders, setOrders] = useState([])
  const userId = parseInt(localStorage.getItem("id")) 
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/orders`)
      .then((res) => {
        // Filter orders for the current user and reverse to show newest first
        const userOrders = res.data.filter(order => Number(order.userid) === Number(userId)).reverse()
        setOrders(userOrders || [])
      })
      .catch((err) => console.log(err))
  }, [userId])


   function handleProductClick(productId){
       navigate(`/${productId}`)
   }

   // 1. Get the index of the current status
   const getStatusIndex = (status) => {
     const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
     return steps.indexOf(status);
   };

   // 2. Calculate the Green Line Width (70% logic)
   const getProgressWidth = (status) => {
     const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
     const index = steps.indexOf(status);
     
     if (index === -1) return 0; // Default if status is unknown
     if (index === 3) return 100; // Delivered = 100% full

     // We have 3 intervals (segments) between 4 dots.
     // Each segment represents 100 / 3 = 33.33% of the total width.
     const segmentWidth = 100 / 3;

     // Base width is the distance to the current active dot
     const baseWidth = index * segmentWidth;

     // Add 70% of the NEXT segment
     const extraProgress = segmentWidth * 0.70;

     return baseWidth + extraProgress;
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
                    
                    {/* Header Info */}
                    <div className="track-order-header">
                        <div>
                            <span className="track-order-id">Order ID: #{order.id}</span>
                            <span className="track-order-date">Placed on: {order.orderDate || 'Recent'}</span>
                        </div>
                        <div className="track-status-text">
                           {order.status}
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="track-delivery-info">
                        <h4>Delivery Address</h4>
                        <p><strong>{order.delivery.name}</strong> | {order.delivery.mobile}</p>
                        <p>{order.delivery.address}, {order.delivery.place} - {order.delivery.pincode}</p>
                    </div>

                    {/* Product List */}
                    <div className="track-items-list">
                        {order.items.map((product) => (
                            <div className="track-item-row" key={product.productId}
                                onClick={()=>handleProductClick(product.productId)}
                            >
                                <img src={product.image} alt={product.title} />
                                <div className="track-item-details">
                                    <h3>{product.title}</h3>
                                    <p>Price: ₹{product.price}</p>
                                    <p>Qty: {product.quantity}</p>
                                </div>
                                <div className="track-item-total">
                                    ₹{(product.price * product.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar (Stepper) */}
                    <div className="track-progress-wrapper">
                        <div className="track-progress-bar">
                            
                            {/* Background Gray Line */}
                            <div className="track-line-bg"></div>
                            
                            {/* Active Green Line (Dynamic Width) */}
                            <div 
                                className="track-line-fill" 
                                style={{ width: `${progressWidth}%` }}
                            ></div>
                            
                            {/* Steps */}
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