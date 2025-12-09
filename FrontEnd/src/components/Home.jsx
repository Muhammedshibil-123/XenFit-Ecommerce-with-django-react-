import React, { useState, useEffect, useContext } from 'react'
import './navbar.css'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import './home.css'
import shipping from '../assets/freeshipping.png'
import refund from '../assets/tick-home.png'
import wallet from '../assets/wallet.png'
import technical from '../assets/admin.png' 
import { CartContext } from "../component/cartcouter.jsx"; 

function Home() {
  const [products, setProducts] = useState([])
  
  const { CartHandleChange } = useContext(CartContext)

  const getApiUrl = () => {
    try {
        return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
    } catch (e) {
        return 'http://127.0.0.1:8000/api';
    }
  };
  const API_URL = getApiUrl();
  const BASE_URL = API_URL.replace('/api', '');

  const getImageUrl = (img) => {
      if (!img) return 'https://via.placeholder.com/300';
      if (img.startsWith('http')) return img; 
      return `${BASE_URL}${img}`; 
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/products/`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [API_URL]);

  const reversedProducts = [...products].reverse();
  const freshDrops = reversedProducts.slice(0, 4); 
  const bestSellers = reversedProducts.slice(4, 8); 

  
  const hasDiscount = (product) => {
    const mrp = parseFloat(product.mrp);
    const price = parseFloat(product.price);
    return mrp && price && mrp > price;
  };

  return (
    <>
     
      <div className="hero-section">
        <div className="hero-content">
          <h1>XENFIT <br /> COLLECTION.</h1>
          <p>Premium oversized tees & polos for the modern generation.</p>
          <NavLink to={'/shop'}>
            <button className="hero-btn">SHOP NOW</button>
          </NavLink>
        </div>
      </div>

     
      <div className="category-section">
        <NavLink to={'/shop'} className="cat-card">
           <div className="overlay"><h2>OVERSIZED</h2></div>
        </NavLink>
        <NavLink to={'/shop'} className="cat-card cat-polo">
           <div className="overlay"><h2>Minimal</h2></div>
        </NavLink>
        <NavLink to={'/shop'} className="cat-card cat-women">
           <div className="overlay"><h2>Printed</h2></div>
        </NavLink>
      </div>

      
      <div className='section-title'>
        <h1>FRESH DROPS 🔥</h1>
        <div className="underline"></div>
      </div>

      <div className="main-shop-container">
        {freshDrops.length > 0 ? (
          freshDrops.map((product) => (
            <div className="product-card" key={product.id}>
              <NavLink to={`/${product.id}`} style={{ textDecoration: 'none' }}>
                <div className="image-wrapper">
                  <img src={getImageUrl(product.image)} alt={product.title} />
                  
                  
                  {hasDiscount(product) && (
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
                    
                    {hasDiscount(product) && (
                        <span className="mrp">₹{product.mrp}</span>
                    )}
                  </div>
                </div>
              </NavLink>
              <button className="add-btn" onClick={() => CartHandleChange(product)}>
                ADD TO BAG
              </button>
            </div>
          ))
        ) : (
          <p className="loading-text">Loading fresh drops...</p>
        )}
      </div>

      
      <div className='banner-break'>
         <h2>LEVEL UP YOUR FIT</h2>
         <p>Use Code <strong>XENFIT20</strong> for 20% Off</p>
      </div>

      
      <div className='section-title'>
        <h1>BEST SELLERS ⚡</h1>
        <div className="underline"></div>
      </div>

      <div className="main-shop-container">
        {bestSellers.length > 0 ? (
          bestSellers.map((product) => (
            <div className="product-card" key={product.id}>
              <NavLink to={`/${product.id}`} style={{ textDecoration: 'none' }}>
                <div className="image-wrapper">
                  <img src={getImageUrl(product.image)} alt={product.title} />
                  
                 
                  {hasDiscount(product) && (
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
                   
                    {hasDiscount(product) && (
                        <span className="mrp">₹{product.mrp}</span>
                    )}
                  </div>
                </div>
              </NavLink>
              <button className="add-btn" onClick={() => CartHandleChange(product)}>
                ADD TO BAG
              </button>
            </div>
          ))
        ) : (
          <p className="loading-text">Loading best sellers...</p>
        )}
      </div>

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