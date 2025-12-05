import axios from "axios";
import { useState, useEffect,useContext } from "react";
import './cart.css'
import { useNavigate } from "react-router-dom";
import { CartContext } from "../component/cartcouter";



function Cart() {

  const [user, setUser] = useState([])
  const userId = (localStorage.getItem("id"))
  const navigate = useNavigate()
  const {updateCartCount} = useContext(CartContext)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
      .then((res) => setUser(res.data || []))
      .catch((err) => console.log(err))
  }, [userId])

  function removeitem(id) {
    let updatedCart = {
      ...user,
      cart: user.cart.filter((item) => item.productId !== id)
    }
    setUser(updatedCart)
    axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, updatedCart)
      .then((res)=> updateCartCount())
      .catch((err) => console.log(err))

     
  }


  function incrementHandle(id) {
    const updatedcart = user.cart.map((item) => {
      if (item.productId === id) {
        return { ...item, quantity: item.quantity + 1 }
      }
      return item
    })

    const updateduser = { ...user, cart: updatedcart }

    setUser(updateduser)
    axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, updateduser)
  }

  function decrementHandle(id) {
    const updatedcart = user.cart.map((item) => {
      if (item.productId === id) {
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 }
        }

      }
      return item
    })

    const updateduser = { ...user, cart: updatedcart }

    setUser(updateduser)
    axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, updateduser)
  }


  const totalCart = user.cart ? user.cart.reduce((total, item) => {
    return total + (item.quantity * item.price)
  }, 0) : 0

  function orderhandle(){
    navigate('/checkout')
  }

  return (
    <div className="main-cart-conatainer">
      <div className="cart-container">
        <h1>Your Cart</h1>
        {!user.cart || user.cart.length === 0 ? (
          <p>Your Cart is Empty</p>
        ) : (
          <div>
            {user.cart.map((item) => (
              <div className="cartdiv" key={item.productId}>
                <img src={item.image} alt="" />
                <h3>{item.title}</h3>
                <p className="price">Price: ₹{item.price}</p>
                <p className="quantity">Quantity:{item.quantity}</p>
                <p className="total">Total: ₹{(item.price * item.quantity)}</p>

                <button id="decrement" className="increment" onClick={() => decrementHandle(item.productId)}>-</button>
                <span>{item.quantity}</span>
                <button id="increment" className="increment" onClick={() => incrementHandle(item.productId)}>+</button>

                <button className="remove-btn" onClick={() => removeitem(item.productId)}>Remove</button>
              </div>
            ))}
            <div className="pay">
              <h1>Total Amount: ₹{totalCart}</h1>
              <button onClick={orderhandle}>Proceed to Pay</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;
