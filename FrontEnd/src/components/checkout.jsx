import axios from "axios"
import { useState, useEffect } from "react"
import './checkout.css'
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState({
    username: localStorage.getItem('username') || "",
    email: localStorage.getItem('email') || "",
    mobile: localStorage.getItem('mobile') || "",
    id: localStorage.getItem('id') || ""
  })
  
  const [details, setdetails] = useState({
    name: localStorage.getItem('username') || "",
    mobile: localStorage.getItem('mobile') || "",
    address: "",
    place: "",
    pincode: "",
  });
  
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')

  // Helper to get API URL
  const getApiUrl = () => {
    try {
        return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
    } catch (e) {
        return 'http://127.0.0.1:8000/api';
    }
  };
  const API_URL = getApiUrl();

  function handlechange(e) {
    setdetails((perv) => ({
      ...perv,
      [e.target.name]: e.target.value,
    }));
  }

  // Fetch Cart from Backend
  useEffect(() => {
    if(token) {
        axios.get(`${API_URL}/orders/cart/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
            setCartItems(res.data.items || []);
        })
        .catch((err) => {
            console.log(err);
            toast.error("Failed to load checkout details");
        });
    } else {
        navigate('/login');
    }
  }, [token, navigate, API_URL])

  // Helper for Images
  const getImageUrl = (img) => {
      if (!img) return 'https://via.placeholder.com/150';
      return img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`;
  };

  // --- Calculations ---
  const totalCart = cartItems.reduce((total, item) => {
    return total + (item.quantity * Number(item.product.price))
  }, 0)

  const discount = totalCart * 0.10;
  const discountedPrice = totalCart - discount;
  const gst = discountedPrice * 0.18;
  const grandprice = discountedPrice + gst;

  function orderhandle(){
    if(!details.name || !details.address || !details.pincode || !details.mobile || !details.place){
      toast.warn('Please fill all delivery details')
    } else {
      // NOTE: You will need to create a dedicated 'create order' endpoint in your Django backend.
      // The code below assumes you might have or will create an endpoint at '/orders/create/' 
      // or similar. For now, I'm keeping your structure but using the real data.
      
      const orderData = {
        user: user.id,
        items: cartItems.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            size: item.size,
            price: item.product.price // Store price at time of purchase
        })),
        delivery_address: details,
        total_amount: grandprice,
        status: "Order Placed"
      }

      // Example POST - Update URL to your actual Order Creation endpoint
      axios.post(`${API_URL}/orders/place-order/`, orderData, { // Update this endpoint
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(()=>{
        toast.success("Order Placed Successfully!")
        navigate('/success')
      })
      .catch((err)=>{
        console.error(err);
        // Fallback for demo/testing if backend endpoint isn't ready
        // toast.success("Order simulated (Backend endpoint needed)");
        // navigate('/success');
        toast.error("Failed to place order. Please check backend.");
      })
    }
  }

  return (
    <div className="main-checkout-conatainer">
      <div className="checkout-grid">
        
        {/* --- LEFT SIDE: Shipping Details --- */}
        <div className="checkout-left">
          <div className="header-section">
            <h1>SHIPPING DETAILS</h1>
            <div className="underline"></div>
          </div>

          <div className="user-details-form">
            <div className="form-row">
                <div className="input-group">
                    <label>Full Name</label>
                    <input type="text"
                    value={details.name}
                    name="name"
                    placeholder="e.g. John Doe"
                    onChange={handlechange}
                    />
                </div>
                <div className="input-group">
                    <label>Mobile Number</label>
                    <input type="tel"
                    value={details.mobile}
                    name="mobile"
                    placeholder="10-digit number"
                    onChange={handlechange}
                    />
                </div>
            </div>

            <div className="input-group">
                <label>Address</label>
                <input type="text"
                value={details.address}
                name="address"
                placeholder="House No, Street, Landmark"
                onChange={handlechange}
                />
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label>City / District</label>
                    <input type="text"
                    value={details.place}
                    name="place"
                    onChange={handlechange}
                    />
                </div>
                <div className="input-group">
                    <label>Pincode</label>
                    <input type="tel"
                    value={details.pincode}
                    name="pincode"
                    onChange={handlechange}
                    />
                </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Order Summary --- */}
        <div className="checkout-right">
            <div className="summary-card">
                <h2>ORDER SUMMARY</h2>
                
                {/* Product List Scrollable Area */}
                <div className="summary-items">
                    {cartItems.length === 0 ? (
                        <p>Your bag is empty</p>
                    ) : (
                        cartItems.map((item) => (
                            <div className="summary-item" key={item.id}>
                                <img src={getImageUrl(item.product.image)} alt={item.product.title} />
                                <div className="summary-info">
                                    <h4>{item.product.title}</h4>
                                    <p className="size-text">Size: {item.size || "N/A"}</p>
                                    <p className="qty-text">Qty: {item.quantity}</p>
                                    <p className="price-text">₹{Number(item.product.price) * item.quantity}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Price Calculations */}
                <div className="price-breakdown">
                    <div className="row">
                        <span>Subtotal</span>
                        <span>₹{totalCart}</span>
                    </div>
                    <div className="row">
                        <span>Discount (10%)</span>
                        <span className="discount">- ₹{Math.round(discount)}</span>
                    </div>
                    <div className="row">
                        <span>GST (18%)</span>
                        <span>+ ₹{Math.round(gst)}</span>
                    </div>
                    <div className="divider"></div>
                    <div className="row total">
                        <span>Grand Total</span>
                        <span>₹{Math.round(grandprice)}</span>
                    </div>
                </div>

                <button className="place-order-btn" onClick={orderhandle}>PLACE ORDER</button>
            </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout