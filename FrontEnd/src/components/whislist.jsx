import axios from "axios";
import { useState, useEffect, useContext } from "react";
import './whislist.css';
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
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("access"); // Assuming you store JWT access token
  const navigate = useNavigate();
  const { updateCartCount } = useContext(CartContext);
  const { updateWhislistCount } = useContext(WishlistContext);
  const API_URL = getApiUrl();

  // Axios instance with auth header
  const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const fetchWishlist = () => {
    if (userId && token) {
      setLoading(true);
      authAxios.get(`/orders/wishlist/`)
        .then((res) => {
          // backend returns { id, user, products: [] }
          setWishlistProducts(res.data.products || []);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  function removeProduct(productId) {
    authAxios.post(`/orders/wishlist/toggle/`, { product_id: productId })
      .then((res) => {
        toast.success("Removed from wishlist", {
          position: 'top-center',
          autoClose: 1000,
          style: { marginTop: '60px' }
        });
        fetchWishlist(); // Refresh list
        updateWhislistCount(); // Update global counter
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to remove");
      });
  }

  async function moveToBag(product) {
    if (!userId) {
      toast.error("Please log in to add to cart");
      return;
    }

    try {
      // 1. Add to Cart (Using your Backend Cart API)
      // Note: backend expects product_id and optional size. 
      // If product has sizes, you might want to default to 'M' or handle selection.
      await authAxios.post(`/orders/cart/add/`, {
         product_id: product.id,
         size: 'M' // Default size, or you can add logic to select size
      });

      toast.success('Moved to Bag', {
        position: 'top-center',
        autoClose: 1300,
        style: { marginTop: '60px' }
      });
      
      updateCartCount();

      // 2. Remove from Wishlist
      removeProduct(product.id);

    } catch (err) {
      console.error(err);
      toast.error("Failed to add to bag");
    }
  }

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading...</div>;

  return (
    <div className="main-wishlist-container">
      <div className="wishlist-content">
        <h1>YOUR WISHLIST</h1>
        
        {wishlistProducts.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is currently empty.</p>
            <button onClick={() => navigate('/shop')}>Continue Shopping</button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistProducts.map((product) => (
              <div className="wishlist-card" key={product.id}>
                <div className="card-image">
                  <img src={product.image} alt={product.title} />
                  <button 
                    className="remove-icon" 
                    onClick={() => removeProduct(product.id)}
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
                    onClick={() => moveToBag(product)}
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