import axios from "axios"
import { useState, useEffect } from "react"
import './checkout.css'
import { useNavigate } from "react-router-dom"

function Checkout() {
  const [user, setUser] = useState([])
  const userId = (localStorage.getItem("id"))
  const [details, setdetails] = useState({
    name: "",
    mobile: "",
    address: "",
    place: "",
    pincode: "",
  });
  const navigate = useNavigate()

  function handlechange(e) {
    setdetails((perv) => ({
      ...perv,
      [e.target.name]: e.target.value,
    }));
  }

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
      .then((res) => setUser(res.data || []))
      .catch((err) => console.log(err))
  }, [userId])

  // --- Logic kept same as previous ---
  const totalCart = user.cart ? user.cart.reduce((total, item) => {
    return total + (item.quantity * item.price)
  }, 0) : 0

  const discount = totalCart * 0.10;
  const discountedPrice = totalCart - discount;
  const gst = discountedPrice * 0.18;
  const grandprice = discountedPrice + gst;

  function orderhandle(){
    if(!details.name || !details.address || !details.pincode || !details.mobile || !details.place){
      alert('Please fill all delivery details')
    }else{
      axios.post(`${import.meta.env.VITE_API_URL}/orders`,{
        username:user.username,
        useremail:user.email,
        userid:user.id,
        items:user.cart,
        delivery:details,
        status: "Order Placed", 
        orderDate: new Date().toLocaleDateString() 
      })
      .then(()=>{
        return axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`,{
          ...user,
          cart:[]
        })
      })
      .then(()=> navigate('/success'))
      .catch((err)=>console.error(err))
    }
  }

  return (
    <div className="main-checkout-conatainer">
      {/* EDITED: Wrapped everything in a Grid Container */}
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
                    {!user.cart || user.cart.length === 0 ? (
                        <p>Your bag is empty</p>
                    ) : (
                        user.cart.map((item) => (
                            <div className="summary-item" key={item.productId}>
                                <img src={item.image} alt="" />
                                <div className="summary-info">
                                    <h4>{item.title}</h4>
                                    <p className="qty-text">Qty: {item.quantity}</p>
                                    <p className="price-text">₹{item.price * item.quantity}</p>
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