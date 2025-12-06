import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import backarrow from '../assets/back-arrow.png'
import './detailsproducts.css'
import { toast } from "react-toastify";
import Notfound from './notfound'
import { CartContext } from "../component/cartcouter";

function Detailsproducts() {
    const { id } = useParams()
    const [product, setProduct] = useState()
    // EDITED: Added state for selected size
    const [selectedSize, setSelectedSize] = useState(null)
    
    const userId = (localStorage.getItem("id"))
    const { updateCartCount, CartHandleChange } = useContext(CartContext)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
            .then((res) => setProduct(res.data))
            .catch((err) => console.error(err))
    }, [id])

    // EDITED: Wrapper function to handle Size Validation
    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Please select a size', {
                position: 'top-center',
                autoClose: 1500,
                hideProgressBar: true,
                theme: "dark"
            });
            return;
        }
        
        // Pass the product with the selected size (Note: Your current CartContext 
        // might need updating to save the size property to the backend, 
        // but this sends it correctly from the UI)
        CartHandleChange({ ...product, selectedSize: selectedSize });
    }

    if (!product) {
        return <div className="loading-state">Loading...</div>
    }

    // Calculate discount
    const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    return (
        <div className='main-details-wrapper'>
            {/* Back Button */}
            <div className="breadcrumb-nav">
                <NavLink to={'/shop'} className="back-link">
                    <img src={backarrow} alt="Back" /> 
                    <span>Back to Shop</span>
                </NavLink>
            </div>

            <div className='details-grid'>
                {/* Left Column: Image */}
                <div className='image-section'>
                    <div className="main-image-container">
                        <img src={product.image} alt={product.title} />
                        {discount > 0 && <span className="discount-tag">-{discount}%</span>}
                    </div>
                </div>

                {/* Right Column: Info */}
                <div className='info-section'>
                    <h2 className='brand-tag'>{product.brand}</h2>
                    <h1 className='product-title'>{product.title}</h1>
                    
                    <div className='price-block'>
                        <span className='current-price'>₹{product.price}</span>
                        {product.mrp && <span className='original-price'>MRP ₹{product.mrp}</span>}
                        <span className='tax-note'>Pix. of all taxes</span>
                    </div>

                    <div className="divider"></div>

                    {/* EDITED: Size Selector Section */}
                    <div className="size-section">
                        <div className="size-header">
                            <h3>Select Size</h3>
                           
                        </div>
                        <div className="size-options">
                            {product.sizes && product.sizes.length > 0 ? (
                                product.sizes.map((size) => (
                                    <button 
                                        key={size} 
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))
                            ) : (
                                <p className="no-size">One Size</p>
                            )}
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button className='add-to-bag-btn' onClick={handleAddToCart}>
                        ADD TO BAG
                    </button>

                    {/* Product Details Accordion/List */}
                    <div className="product-specs">
                        <h3>Product Details</h3>
                        <p className='description'>{product.description}</p>
                        
                        <div className="spec-grid">
                            <div className="spec-item">
                                <span className="label">Theme</span>
                                <span className="value">{product.theme || 'Streetwear'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="label">Fit</span>
                                <span className="value">{product.category || 'Regular'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="label">Gender</span>
                                <span className="value">{product.gender || 'Unisex'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="label">Material</span>
                                <span className="value">100% Cotton</span>
                            </div>
                        </div>
                    </div>

                    <div className="delivery-note">
                        <p>✅ Free Delivery on orders above ₹999</p>
                        <p>✅ 7 Day Return Policy</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detailsproducts