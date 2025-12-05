import React, { useState, useEffect ,useContext} from 'react'
import banner from '../assets/banner.png'
import './navbar.css'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { toast } from "react-toastify";
import './home.css'
import shipping from '../assets/freeshipping.png'
import refund from '../assets/tick-home.png'
import wallet from '../assets/wallet.png'
import technical from '../assets/headphones.png'
import { CartContext } from "../component/cartcouter";


function Home() {

  const [products, setProducts] = useState([])
  const userId = (localStorage.getItem("id"))
  const {updateCartCount} = useContext(CartContext)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

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

    const existingItem = currenCart.findIndex((item) => item.productId === product.id)
    let updatedCart;

    if (existingItem !== -1) {
      toast.warn('Product already in cart', {
        positon: 'top-center',
        autoClose: 1300,
        style: { marginTop: '60px' }
      })
    } else {
      updatedCart = [
        ...currenCart,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
      toast.success('Item added to Cart', {
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



  const trendingProducts = products.filter((item) => {
    return (item.id === 3 || item.id === 17 || item.id === 6 || item.id === 12)
  })

  const hotDealsProducts = products.filter((item) => {
    return (item.id === 7 || item.id === 15 || item.id === 2 || item.id === 18)
  })

  return (
    <>
      <div className="banner-container">
        <img src={banner}
          className="banner-img"
        />
        <NavLink to={'/shop'}>
          <button className="banner-btn">
            Explore Collection
          </button>
        </NavLink>

      </div>
      <div className='trending-container'>
        <h1>Trending🚀</h1>
        <div className="main-shop-container">
          {hotDealsProducts.map((product, index) => (
            <div className="shop-container" key={index}>
              <NavLink to={`/${product.id}`} style={{ textDecoration: 'none' }}>
                <div >
                  <img src={product.image} alt="" />
                  <h3>{product.title}</h3>
                  <h4>{product.brand}</h4>
                  <p className="description"> {product.description}</p>
                  <p className="price">₹{product.price}</p>
                </div>
              </NavLink>
              <button className="addtocart" onClick={() => CartHandleChange(product)}>Add to Cart</button>


            </div>
          ))}
        </div>
      </div>
      <div className='hot-deals'>
        <h1>Hot Deals🔥</h1>
        <div className="main-shop-container" >
          {trendingProducts.map((product, index) => (
            <div className="shop-container" key={index}>
              <NavLink to={`/${product.id}`} style={{ textDecoration: 'none' }}>
                <div >
                  <img src={product.image} alt="" />
                  <h3>{product.title}</h3>
                  <h4>{product.brand}</h4>
                  <p className="description"> {product.description}</p>
                  <p className="price">₹{product.price}</p>
                </div>
              </NavLink>
              <button className="addtocart" onClick={() => CartHandleChange(product)}>Add to Cart</button>


            </div>
          ))}
        </div>
      </div>

      <div className="services-container">
        <div className="service-box">
          <img src={shipping} alt="" />
          <div>
            <h2>Free Shipping</h2>
            <p>Free Shipping On All Order</p>
          </div>
        </div>

        <div className="service-box">
          <img src={refund} alt="" />
          <div>
            <h2>Safe Refund</h2>
            <p>7 Days Money Back</p>
          </div>
        </div>

        <div className="service-box">
          <img src={wallet} alt="" />
          <div>
            <h2>Secure Payment</h2>
            <p>All Payment Secure</p>
          </div>
        </div>

        <div className="service-box">
          <img src={technical} alt="" />
          <div>
            <h2>Online Support 24/7</h2>
            <p>Technical Support 24/7</p>
          </div>
        </div>
      </div>


      <footer className="footer">
      <div className="footer-container">

        <div className="footer-about">
          <h2 className="logo">Bassify</h2>
          <p className="made-with">Made with React💖 by The Coding Journey</p>
          <a href="https://www.linkedin.com/in/mhdshibil/">
          <button className="yt-btn" >Visit My Linkdin</button>
          </a>
          
        </div>

        <div className="footer-links">
          <h3>Important Links</h3>
          <ul>
            <NavLink to={'/'}><li>Home</li></NavLink>
             <NavLink to={'/shop'}><li>Shop</li></NavLink>
             <NavLink to={'/myorders'}><li>My Orders</li></NavLink>
             <NavLink to={'/about'}><li>About</li></NavLink>
       
          </ul>
        </div>


        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <NavLink to={'/'}><li>Home</li></NavLink>
             <NavLink to={'/shop'}><li>Shop</li></NavLink>
             <NavLink to={'/myorders'}><li>My Orders</li></NavLink>
             <NavLink to={'/about'}><li>About</li></NavLink>
          </ul>
        </div>

        <div className="footer-address">
          <h3>Address</h3>
          <p> Bridgeon , Manjeri Hub</p>
          <p> +91 1234567890</p>
          
        </div>
      </div>
    </footer>

    </>
  )
}

export default Home