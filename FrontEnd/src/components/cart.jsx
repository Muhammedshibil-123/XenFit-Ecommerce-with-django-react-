import axios from "axios";
import { useState, useEffect, useContext } from "react";
import './cart.css';
import { useNavigate } from "react-router-dom";
import { CartContext } from "../component/cartcouter";

function Cart() {
  const [user, setUser] = useState([]);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const { updateCartCount } = useContext(CartContext);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
      .then((res) => setUser(res.data || []))
      .catch((err) => console.log(err));
  }, [userId]);

  function removeitem(id) {
    let updatedCart = {
      ...user,
      cart: user.cart.filter((item) => item.productId !== id)
    };
    setUser(updatedCart);
    axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, updatedCart)
      .then((res) => updateCartCount())
      .catch((err) => console.log(err));
  }

  function incrementHandle(id) {
    const updatedcart = user.cart.map((item) => {
      if (item.productId === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    const updateduser = { ...user, cart: updatedcart };
    setUser(updateduser);
    axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, updateduser);
  }

  function decrementHandle(id) {
    const updatedcart = user.cart.map((item) => {
      if (item.productId === id) {
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });

    const updateduser = { ...user, cart: updatedcart };
    setUser(updateduser);
    axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, updateduser);
  }

  const totalCart = user.cart ? user.cart.reduce((total, item) => {
    return total + (item.quantity * item.price);
  }, 0) : 0;

  function orderhandle() {
    navigate('/checkout');
  }

  return (
    <div className="main-cart-conatainer">
      <div className="cart-container">
        <h1>YOUR BAG</h1> {/* EDITED: Changed "Your Cart" to "Your Bag" for a fashion feel */}
        
        {!user.cart || user.cart.length === 0 ? (
          <div className="empty-cart-msg">
            <p>Your bag is empty.</p>
            {/* ADDED: Button to go back to shop if empty */}
            <button onClick={() => navigate('/shop')}>Start Shopping</button>
          </div>
        ) : (
          <div>
            <div className="cart-header"> {/* ADDED: Header row for clearer layout */}
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span>Action</span>
            </div>

            {user.cart.map((item) => (
              <div className="cartdiv" key={item.productId}>
                
                <div className="product-info-col">
                    <img src={item.image} alt={item.title} />
                    <div className="product-text">
                        <h3>{item.title}</h3>
                        {/* ADDED: Placeholder for Size. You'll need to save 'size' to the cart in your database to use this dynamically. */}
                        {/* <p className="size-text">Size: M</p> */} 
                    </div>
                </div>

                <p className="price">₹{item.price}</p>

                <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => decrementHandle(item.productId)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => incrementHandle(item.productId)}>+</button>
                </div>

                <p className="total-price">₹{(item.price * item.quantity)}</p>

                <button className="remove-btn" onClick={() => removeitem(item.productId)}>
                    {/* EDITED: Changed text to an X or Icon usually looks better, but keeping text simple for now */}
                    Remove
                </button>
              </div>
            ))}
            
            <div className="pay">
              <div className="subtotal-info">
                  <span>Subtotal</span>
                  <h1>₹{totalCart}</h1>
              </div>
              <p className="shipping-note">Taxes and shipping calculated at checkout</p>
              <button onClick={orderhandle}>CHECKOUT</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;