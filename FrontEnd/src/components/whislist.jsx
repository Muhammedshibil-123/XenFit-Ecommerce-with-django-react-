import axios from "axios";
import { useState, useEffect,useContext } from "react";
import './cart.css'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../component/cartcouter";
import { WishlistContext } from "../component/whislistcouter";




function Whislist() {

  const [user, setUser] = useState([])
  const userId = (localStorage.getItem("id"))
  const navigate = useNavigate()
  const {updateCartCount} = useContext(CartContext)
  const {updateWhislistCount} = useContext(WishlistContext)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
      .then((res) => setUser(res.data || []))
      .catch((err) => console.log(err))
  }, [userId])

  function removeproduct(id) {
    let updatedwhishlist = {
      ...user,
      whishlist: user.whishlist.filter((product) => product.productId !== id)
    }
    setUser(updatedwhishlist)
    axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, updatedwhishlist)
      .then((res)=>updateWhislistCount())
      .catch((err) => console.log(err))
  }

   async function CartHandleChange(product) {
    if (!userId) {
      toast.error("Please log in to add to cart ",
        {
          positon: 'top-center',
          autoClose: 1300,
          style: { marginTop: '60px' }
        })
      return
    }

    const userRespone = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
    const userData = userRespone.data
    const currenCart = userData.cart || []

    const productIdentifier = product.productId || product.id
    
    const existingproduct = currenCart.findIndex((cartItem) => cartItem.productId === productIdentifier)
    let updatedCart;

    if (existingproduct !== -1) {
      toast.warn('Product already in cart', {
        positon: 'top-center',
        autoClose: 1300,
        style: { marginTop: '60px' }
      })
    } else {
      updatedCart = [
        ...currenCart,
        {
          productId: product.productId,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
      toast.success('product added to Cart', {
        positon: 'top-center',
        autoClose: 1300,
        style: { marginTop: '60px' }
      })

      await axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        ...userData,
        cart: updatedCart,
      })
      updateCartCount()
    }

  }



  return (
    <div className="main-cart-conatainer">
      <div className="cart-container">
        <h1>Whishlist</h1>
        {!user.whishlist || user.whishlist.length === 0 ? (
          <p>Your Whishlist is Empty</p>
        ) : (
          <div>
            {user.whishlist.map((product) => (
              <div className="cartdiv" key={product.productId}>
                <img src={product.image} alt="" />
                <h3>{product.title}</h3>
                <p className="price">Price: ₹{product.price}</p>
                <p className="quantity">Quantity:{product.quantity}</p>
                <p className="total">Total: ₹{(product.price * product.quantity)}</p>



                <button className="remove-btn" onClick={() => removeproduct(product.productId)}>Remove</button>
                <button className="addtocart" onClick={() => CartHandleChange(product)}>Add to Cart</button>
              </div>
            ))}
            
          </div>
        )}

      </div>
    </div>
  );
}

export default Whislist;
