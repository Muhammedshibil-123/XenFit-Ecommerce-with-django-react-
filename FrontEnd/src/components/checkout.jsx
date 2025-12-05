import axios from "axios"
import { useState, useEffect } from "react"
import './checkout.css'
import { Navigate, useNavigate } from "react-router-dom"


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

  const totalCart = user.cart ? user.cart.reduce((total, item) => {
    return total + (item.quantity * item.price)
  }, 0) : 0

  const discount = totalCart * 0.10;
  const discountedPrice = totalCart - discount;
  const gst = discountedPrice * 0.18;
  const grandprice = discountedPrice + gst;

  function orderhandle(){
    if(!details.name || !details.address || !details.pincode || !details.mobile || !details.place){
      alert('please fill the delivery details')
    }else{
      // EDITED: Added status: "Order Placed" to the payload
      axios.post(`${import.meta.env.VITE_API_URL}/orders`,{
        username:user.username,
        useremail:user.email,
        userid:user.id,
        items:user.cart,
        delivery:details,
        status: "Order Placed", // Default status
        orderDate: new Date().toLocaleDateString() // Optional: good to have
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
      <h1>Checkout</h1>
      <div className="checkout-container">
        <div className="products">
          {!user.cart || user.cart.length === 0 ? (
            <p>Your Checkout Page is Empty</p>
          ) : (
            <div>
              {user.cart.map((item) => (
                <div className="cartdiv" key={item.productId}>
                  <img src={item.image} alt="" />
                  <h3>{item.title}</h3>
                  <p className="price-quantity">
                    {item.price} × {item.quantity}
                  </p>
                  <p className="total">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          )}

          <div className="user-details">
            <label htmlFor="">Name:</label>
            <input type="text"
              value={details.name}
              name="name"
              onChange={handlechange}
            />
            <label htmlFor="">Mobile No:</label>
            <input type="tel"
              value={details.mobile}
              name="mobile"
              onChange={handlechange}
            />
            <label htmlFor="">Address:</label>
            <input type="text"
              value={details.address}
              name="address"
              onChange={handlechange}
            />
            <label htmlFor="">Place:</label>
            <input type="text"
              value={details.place}
              name="place"
              onChange={handlechange}
            />
            <label htmlFor="">Pincode:</label>
            <input type="tel"
              value={details.pincode}
              name="pincode"
              onChange={handlechange}
            />
          </div>

          <div className="payment-section">
            <div className="pay">

              <p className="discount">(-) Discount 10% : {discount}</p>
              <p className="gst">(+) Gst 18% : {gst}</p>
              <h1>Total Amount: ₹{Math.round(grandprice)}</h1>
              <button onClick={orderhandle}>Place Order</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout