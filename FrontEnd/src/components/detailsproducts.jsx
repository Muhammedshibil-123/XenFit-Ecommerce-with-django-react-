import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { NavLink, useParams } from 'react-router-dom' // Ensure NavLink is imported
import backarrow from '../assets/back-arrow.png'
import './detailsproducts.css'
import { toast } from "react-toastify";
import { CartContext } from "../component/cartcouter";

function Detailsproducts() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [loading, setLoading] = useState(true)
    
    // Get API URL Helper
    const getApiUrl = () => {
        try {
            return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
        } catch (e) {
            return 'http://127.0.0.1:8000/api';
        }
    };
    const API_URL = getApiUrl();

    const { CartHandleChange } = useContext(CartContext)

    useEffect(() => {
        // Fetch specific product by ID
        axios.get(`${API_URL}/products/${id}/`)
            .then((res) => {
                setProduct(res.data)
                // Reset size when product changes (e.g. clicking a color variant)
                setSelectedSize(null) 
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error fetching product:", err)
                setLoading(false)
            })
    }, [id, API_URL])

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.error('Please select a size', {
                position: 'top-center',
                autoClose: 1500,
                hideProgressBar: true,
                theme: "dark"
            });
            return;
        }
        CartHandleChange({ ...product, selectedSize: selectedSize });
    }

    if (loading) return <div className="loading-state">Loading...</div>
    if (!product) return <div className="loading-state">Product not found</div>

    const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    // Helper for Image URLs
    const getImageUrl = (img) => {
        return img 
            ? (img.toString().startsWith('http') ? img : `http://127.0.0.1:8000${img}`)
            : 'https://via.placeholder.com/300';
    }

    return (
        <div className='main-details-wrapper'>
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
                        <img src={getImageUrl(product.image)} alt={product.title} />
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
                        <span className='tax-note'>Inc. of all taxes</span>
                    </div>

                    <div className="divider"></div>

                    {/* --- ADDED: Color Variants Section --- */}
                    {product.available_colors && product.available_colors.length > 0 && (
                        <div className="variants-section">
                            <h3 className="variants-header">More Colors</h3>
                            <div className="variants-grid">
                                {product.available_colors.map((variant) => (
                                    <NavLink 
                                        to={`/${variant.id}`} 
                                        className="variant-card" 
                                        key={variant.id}
                                    >
                                        <img src={getImageUrl(variant.image)} alt={variant.color} />
                                        <span>{variant.color}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* ------------------------------------- */}

                    {/* Size Selector */}
                    <div className="size-section">
                        <div className="size-header">
                            <h3>Select Size</h3>
                        </div>
                        <div className="size-options">
                            {product.sizes && product.sizes.length > 0 ? (
                                product.sizes.map((sizeObj) => (
                                    <button 
                                        key={sizeObj.id} 
                                        className={`size-btn ${selectedSize === sizeObj.size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(sizeObj.size)}
                                        disabled={sizeObj.stock <= 0}
                                        style={{ opacity: sizeObj.stock <= 0 ? 0.5 : 1 }}
                                    >
                                        {sizeObj.size}
                                    </button>
                                ))
                            ) : (
                                <p className="no-size">One Size</p>
                            )}
                        </div>
                    </div>

                    <button className='add-to-bag-btn' onClick={handleAddToCart}>
                        ADD TO BAG
                    </button>

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
                                <span className="value">{product.sleeve_type || 'Regular'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="label">Code</span>
                                <span className="value">{product.product_code || '-'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="label">Color</span>
                                <span className="value">{product.color || '-'}</span>
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