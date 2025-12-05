import axios from "axios";
import { useState, useEffect } from "react";
import './cart.css'
import { useNavigate } from "react-router-dom";

function Myorders() {
  const [orders, setOrders] = useState([])
  const userId = parseInt(localStorage.getItem("id")) 
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/orders`)
      .then((res) => {
        const userOrders = res.data.filter(order => order.userid === userId)
        setOrders(userOrders || [])
      })
      .catch((err) => console.log(err))
  }, [userId])


   function handleProductClick(productId){
       navigate(`/${productId}`)
   }
   
  return (
    <div className="main-cart-conatainer">
      <div className="cart-container">
        <h1>My Orders</h1>
        {!orders || orders.length === 0 ? (
          <p>You haven't placed any orders yet</p>
        ) : (
          <div>
            {orders.map((order) => (
              order.items.map((product) => (
                <div className="cartdiv" key={order.id}
                style={{cursor:'pointer'}}
                onClick={()=>handleProductClick(product.productId)}
                >
                 
                  <img src={product.image}  />
                  <h3>{product.title}</h3>
                  <p>Product Id: {product.productId}</p>
                  <p className="price">Price: ₹{product.price}</p>
                  <p className="quantity">Quantity: {product.quantity}</p>
                  <p className="total">Total: ₹{(product.price * product.quantity)}</p>
                </div>
              ))
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Myorders;