import axios from "axios";
import { useState, useEffect, useContext } from "react";
import './whislist.css'; // Updated CSS import
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../component/cartcouter";
import { WishlistContext } from "../component/whislistcouter";

// Helper to safely get API URL
const getApiUrl = () => {
  try {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
  } catch (e) {
    return 'http://localhost:3000';
  }
};

function Whislist() {
  const [user, setUser] = useState([]);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const { updateCartCount } = useContext(CartContext);
  const { updateWhislistCount } = useContext(WishlistContext);
  const API_URL = getApiUrl();

  useEffect(() => {
    if (userId) {
      axios.get(`${API_URL}/users/${userId}`)
        .then((res) => setUser(res.data || []))
        .catch((err) => console.log(err));
    }
  }, [userId, API_URL]);

  function removeproduct(id) {
    let updatedwhishlist = {
      ...user,
      whishlist: user.whishlist.filter((product) => product.productId !== id)
    };
    setUser(updatedwhishlist);
    axios.put(`${API_URL}/users/${userId}`, updatedwhishlist)
      .then((res) => updateWhislistCount())
      .catch((err) => console.log(err));
  }

  async function CartHandleChange(product) {
    if (!userId) {
      toast.error("Please log in to add to cart", {
        position: 'top-center',
        autoClose: 1300,
        style: { marginTop: '60px' }
      });
      return;
    }

    try {
      const userRespone = await axios.get(`${API_URL}/users/${userId}`);
      const userData = userRespone.data;
      const currenCart = userData.cart || [];

      const productIdentifier = product.productId || product.id;
      const existingproduct = currenCart.findIndex((cartItem) => cartItem.productId === productIdentifier);
      
      let updatedCart;

      if (existingproduct !== -1) {
        toast.warn('Product already in bag', {
          position: 'top-center',
          autoClose: 1300,
          style: { marginTop: '60px' }
        });
      } else {
        updatedCart = [
          ...currenCart,
          {
            productId: productIdentifier,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        ];
        
        toast.success('Moved to Bag', {
          position: 'top-center',
          autoClose: 1300,
          style: { marginTop: '60px' }
        });

        await axios.put(`${API_URL}/users/${userId}`, {
          ...userData,
          cart: updatedCart,
        });
        updateCartCount();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to bag");
    }
  }

  return (
    <div className="main-wishlist-container">
      <div className="wishlist-content">
        <h1>YOUR WISHLIST</h1>
        
        {!user.whishlist || user.whishlist.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is currently empty.</p>
            <button onClick={() => navigate('/shop')}>Continue Shopping</button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {user.whishlist.map((product) => (
              <div className="wishlist-card" key={product.productId}>
                <div className="card-image">
                  <img src={product.image} alt={product.title} />
                  <button 
                    className="remove-icon" 
                    onClick={() => removeproduct(product.productId)}
                    title="Remove from Wishlist"
                  >
                    ×
                  </button>
                </div>
                
                <div className="card-details">
                  <h3>{product.title}</h3>
                  <p className="price">₹{product.price}</p>
                  
                  <button 
                    className="move-to-bag-btn" 
                    onClick={() => CartHandleChange(product)}
                  >
                    MOVE TO BAG
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Whislist;