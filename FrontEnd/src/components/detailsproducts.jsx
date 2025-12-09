import axios from 'axios'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import backarrow from '../assets/back-arrow.png'
import './detailsproducts.css'
import { toast } from "react-toastify";
import { CartContext } from "../component/cartcouter";
// Optional: You can import arrow icons if you have them, or use text < >
// import rightArrow from '../assets/right-arrow.png' 

function Detailsproducts() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeImg, setActiveImg] = useState('') // State for the main large image
    const scrollRef = useRef(null) // Ref for scrolling the gallery
    
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
        axios.get(`${API_URL}/products/${id}/`)
            .then((res) => {
                setProduct(res.data)
                // Set initial main image
                setActiveImg(res.data.image) 
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

    // Scroll Logic for Thumbnails
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 100; // Adjust scroll distance
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount;
            } else {
                current.scrollLeft += scrollAmount;
            }
        }
    };

    if (loading) return <div className="loading-state">Loading...</div>
    if (!product) return <div className="loading-state">Product not found</div>

    const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    const getImageUrl = (img) => {
        if (!img) return 'https://via.placeholder.com/300';
        if (img.toString().startsWith('http')) return img;
        return `http://127.0.0.1:8000${img}`;
    }

    // Combine Main Image + Extra Images into one array for the gallery
    const allImages = [
        { id: 'main', image: product.image }, 
        ...(product.extra_images || [])
    ];

    const hasVariants = product.sizes && product.sizes.length > 0;
    const availableSizes = hasVariants ? product.sizes.filter(s => s.stock > 0) : [];

    return (
        <div className='main-details-wrapper'>
            <div className="breadcrumb-nav">
                <NavLink to={'/shop'} className="back-link">
                    <img src={backarrow} alt="Back" /> 
                    <span>Back to Shop</span>
                </NavLink>
            </div>

            <div className='details-grid'>
                {/* --- IMAGE SECTION UPDATED --- */}
                <div className='image-section'>
                    {/* Main Large Image */}
                    <div className="main-image-container">
                        <img src={getImageUrl(activeImg)} alt={product.title} className="active-product-img" />
                        {discount > 0 && <span className="discount-tag">-{discount}%</span>}
                    </div>

                    {/* Thumbnail Gallery with Scroll Buttons */}
                    {allImages.length > 1 && (
                        <div className="gallery-wrapper">
                            <button className="gallery-btn left" onClick={() => scroll('left')}>&lt;</button>
                            
                            <div className="gallery-track" ref={scrollRef}>
                                {allImages.map((imgObj, index) => (
                                    <div 
                                        key={imgObj.id || index} 
                                        className={`gallery-thumb ${activeImg === imgObj.image ? 'selected' : ''}`}
                                        onClick={() => setActiveImg(imgObj.image)}
                                    >
                                        <img src={getImageUrl(imgObj.image)} alt="thumb" />
                                    </div>
                                ))}
                            </div>

                            <button className="gallery-btn right" onClick={() => scroll('right')}>&gt;</button>
                        </div>
                    )}
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

                    {/* Color Variants */}
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

                    {/* Size Selector */}
                    <div className="size-section">
                        <div className="size-header">
                            <h3>Select Size</h3>
                        </div>
                        <div className="size-options">
                            {hasVariants ? (
                                availableSizes.length > 0 ? (
                                    availableSizes.map((sizeObj) => (
                                        <div key={sizeObj.id} className="size-wrapper">
                                            {sizeObj.stock < 10 && (
                                                <span className="stock-alert">{sizeObj.stock} left</span>
                                            )}
                                            <button 
                                                className={`size-btn ${selectedSize === sizeObj.size ? 'active' : ''}`}
                                                onClick={() => setSelectedSize(sizeObj.size)}
                                            >
                                                {sizeObj.size}
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-stock-msg">Out of Stock</p>
                                )
                            ) : (
                                <p className="no-size">One Size</p>
                            )}
                        </div>
                    </div>

                    <button 
                        className='add-to-bag-btn' 
                        onClick={handleAddToCart}
                        disabled={hasVariants && availableSizes.length === 0}
                        style={{ opacity: (hasVariants && availableSizes.length === 0) ? 0.5 : 1 }}
                    >
                        {(hasVariants && availableSizes.length === 0) ? "OUT OF STOCK" : "ADD TO BAG"}
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