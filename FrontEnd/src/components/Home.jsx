import React, { useState, useEffect, useContext } from 'react'
import './navbar.css'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { toast } from "react-toastify";
import './home.css'
import shipping from '../assets/freeshipping.png'
import refund from '../assets/tick-home.png'
import wallet from '../assets/wallet.png'
import technical from '../assets/admin.png' 
import { CartContext } from "../component/cartcouter.jsx"; 


function Home() {

  const [products, setProducts] = useState([])
  const userId = (localStorage.getItem("id"))
  const { updateCartCount } = useContext(CartContext)

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
          position: 'top-center',
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
        position: 'top-center',
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
        position: 'top-center',
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

  // Filter for "Trending" - First 4 products (T-shirts 1-4)
  const trendingProducts = products.slice(0, 4) 
  
  // Filter for "Hot Deals" - Next 4 products (T-shirts 5-8)
  const hotDealsProducts = products.slice(4, 8) 

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>XENFIT <br /> COLLECTION.</h1>
          <p>Premium oversized tees & polos for the modern generation.</p>
          <NavLink to={'/shop'}>
            <button className="hero-btn">SHOP NOW</button>
          </NavLink>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="category-section">
        <NavLink to={'/shop'} className="cat-card">
           <div className="overlay">
             <h2>OVERSIZED</h2>
           </div>
        </NavLink>
        <NavLink to={'/shop'} className="cat-card cat-polo">
           <div className="overlay">
             <h2>Minimal</h2>
           </div>
        </NavLink>
        <NavLink to={'/shop'} className="cat-card cat-women">
           <div className="overlay">
             <h2>Printed</h2>
           </div>
        </NavLink>
      </div>

      {/* Fresh Drops Section */}
      <div className='section-title'>
        <h1>FRESH DROPS 🔥</h1>
        <div className="underline"></div>
      </div>

      <div className="main-shop-container">
        {trendingProducts.map((product, index) => (
          <div className="product-card" key={index}>
            <NavLink to={`/${product.id}`} style={{ textDecoration: 'none' }}>
              <div className="image-wrapper">
                <img src={product.image} alt={product.title} />
                {/* Discount Badge Calculation */}
                {product.mrp && product.price && (
                  <span className="discount-badge">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                )}
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <p className="brand-name">{product.brand}</p>
                <div className="price-row">
                  <span className="selling-price">₹{product.price}</span>
                  {product.mrp && <span className="mrp">₹{product.mrp}</span>}
                </div>
              </div>
            </NavLink>
            <button className="add-btn" onClick={() => CartHandleChange(product)}>ADD TO BAG</button>
          </div>
        ))}
      </div>

      {/* Promo Banner */}
      <div className='banner-break'>
         <h2>LEVEL UP YOUR FIT</h2>
         <p>Use Code <strong>XENFIT20</strong> for 20% Off</p>
      </div>

      {/* Best Sellers Section */}
      <div className='section-title'>
        <h1>BEST SELLERS ⚡</h1>
        <div className="underline"></div>
      </div>

      <div className="main-shop-container">
        {hotDealsProducts.map((product, index) => (
          <div className="product-card" key={index}>
            <NavLink to={`/${product.id}`} style={{ textDecoration: 'none' }}>
              <div className="image-wrapper">
                <img src={product.image} alt={product.title} />
                 {product.mrp && product.price && (
                  <span className="discount-badge">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                )}
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <p className="brand-name">{product.brand}</p>
                <div className="price-row">
                  <span className="selling-price">₹{product.price}</span>
                  {product.mrp && <span className="mrp">₹{product.mrp}</span>}
                </div>
              </div>
            </NavLink>
            <button className="add-btn" onClick={() => CartHandleChange(product)}>ADD TO BAG</button>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-item">
          <img src={shipping} alt="Free Shipping" />
          <h3>Free Shipping</h3>
          <p>On orders above ₹999</p>
        </div>
        <div className="feature-item">
          <img src={refund} alt="Easy Returns" />
          <h3>Easy Returns</h3>
          <p>7 Days replacement</p>
        </div>
        <div className="feature-item">
          <img src={wallet} alt="Secure Payment" />
          <h3>Secure Payment</h3>
          <p>100% Secure Transaction</p>
        </div>
        <div className="feature-item">
          <img src={technical} alt="Support" />
          <h3>24/7 Support</h3>
          <p>We are here to help</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>Xenfit.</h2>
            <p>Streetwear for the bold. Designed in India.</p>
            <div className="socials">
               <span>IG</span>
               <span>FB</span>
               <span>TW</span>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>SHOP</h4>
            <NavLink to={'/shop'}>Men</NavLink>
            <NavLink to={'/shop'}>Women</NavLink>
            <NavLink to={'/shop'}>New Arrivals</NavLink>
          </div>

          <div className="footer-col">
            <h4>COMPANY</h4>
            <NavLink to={'/about'}>Our Story</NavLink>
            <NavLink to={'/about'}>Careers</NavLink>
            <NavLink to={'/about'}>Terms</NavLink>
          </div>

          <div className="footer-col">
            <h4>SUPPORT</h4>
            <NavLink to={'/myorders'}>Track Order</NavLink>
            <NavLink to={'/about'}>Contact Us</NavLink>
            <NavLink to={'/about'}>Shipping</NavLink>
          </div>
        </div>
        <div className="footer-bottom">
           <p>© 2024 Xenfit Clothing. All rights reserved.</p>
        </div>
      </footer>

    </>
  )
}

export default Home