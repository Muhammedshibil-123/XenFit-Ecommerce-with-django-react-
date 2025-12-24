import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import backarrow from '../assets/back-arrow.png'
import './detailsproducts.css'
import { toast } from "react-toastify";
import { CartContext } from "../component/cartcouter";
import shipping from '../assets/freeshipping.png'
import tick from '../assets/tick-home.png'

function Detailsproducts() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeImg, setActiveImg] = useState('')
    
    const getApiUrl = () => {
        try {
            return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
        } catch (e) {
            return 'http://127.0.0.1:8000/api';
        }
    };
    const API_URL = getApiUrl();
    const BASE_URL = API_URL.replace('/api', '').replace(/\/$/, '');

    const { CartHandleChange } = useContext(CartContext)

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_URL}/products/${id}/`)
            .then((res) => {
                setProduct(res.data)
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
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: true,
                theme: "dark",
                style: { fontSize: '13px' }
            });
            return;
        }
        CartHandleChange({ ...product, selectedSize: selectedSize });
    }

    if (loading) return <div className="loading-state">Loading...</div>
    if (!product) return <div className="loading-state">Product not found</div>

    const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    const getImageUrl = (img) => {
        if (!img) return 'https://via.placeholder.com/300';
        
        const imgStr = img.toString();
        
        if (imgStr.startsWith('http')) return imgStr;
       
        const path = imgStr.startsWith('/') ? imgStr : `/${imgStr}`;
        return `${BASE_URL}${path}`;
    }

    const allImages = [
        { id: 'main', image: product.image }, 
        ...(product.extra_images || [])
    ];

    const handleNextImage = () => {
        const currentIndex = allImages.findIndex(img => img.image === activeImg);
        const nextIndex = (currentIndex + 1) % allImages.length;
        setActiveImg(allImages[nextIndex].image);
    };

    const handlePrevImage = () => {
        const currentIndex = allImages.findIndex(img => img.image === activeImg);
        const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        setActiveImg(allImages[prevIndex].image);
    };

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
              
                <div className='image-section'>
                    <div className="main-image-container">
                        <img src={getImageUrl(activeImg)} alt={product.title} className="active-product-img" />
                        {discount > 0 && <span className="discount-tag">-{discount}%</span>}
                        
                        {allImages.length > 1 && (
                            <>
                                <button className="gallery-nav-btn prev" onClick={handlePrevImage}>&lt;</button>
                                <button className="gallery-nav-btn next" onClick={handleNextImage}>&gt;</button>
                            </>
                        )}
                    </div>

                    {allImages.length > 1 && (
                        <div className="thumbnail-gallery">
                            {allImages.map((imgObj, index) => (
                                <div 
                                    key={imgObj.id || index} 
                                    className={`gallery-thumb ${activeImg === imgObj.image ? 'selected' : ''}`}
                                    onClick={() => setActiveImg(imgObj.image)}
                                >
                                    <img src={getImageUrl(imgObj.image)} alt={`thumbnail ${index}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            
                <div className='info-section'>
                    <h2 className='brand-tag'>{product.brand}</h2>
                    <h1 className='product-title'>{product.title}</h1>
                    
                    <div className='price-block'>
                        <span className='current-price'>₹{product.price}</span>
                        {product.mrp && <span className='original-price'>MRP ₹{product.mrp}</span>}
                        <span className='tax-note'>Inc. of all taxes</span>
                    </div>

                    <div className="divider"></div>

                
                    {product.available_colors && product.available_colors.length > 0 && (
                        <div className="variants-section">
                            <h3 className="variants-header">Colors</h3>
                            <div className="variants-grid">
                                {product.available_colors.map((variant) => (
                                    <NavLink 
                                        to={`/${variant.id}`} 
                                        className="variant-card" 
                                        key={variant.id}
                                        title={variant.color}
                                    >
                                        <img src={getImageUrl(variant.image)} alt={variant.color} />
                                        <span>{variant.color}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    )}

                    
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
                                    <p className="no-stock-msg" style={{color: '#d32f2f', fontWeight: 600, fontSize: '13px'}}>Out of Stock</p>
                                )
                            ) : (
                                <p className="no-size" style={{color: '#666', fontSize: '13px'}}>One Size</p>
                            )}
                        </div>
                    </div>

                    <button 
                        className='add-to-bag-btn' 
                        onClick={handleAddToCart}
                        disabled={hasVariants && availableSizes.length === 0}
                    >
                        {(hasVariants && availableSizes.length === 0) ? "OUT OF STOCK" : "ADD TO BAG"}
                    </button>

                    <div className="product-specs">
                        <h3>Product Details</h3>
                        <p className='description'>{product.description}</p>
                        <div className="spec-grid">
                            <div className="spec-item">
                                <span className="label">Theme:</span>
                                <span className="value">{product.theme || '-'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="label">Fit:</span>
                                <span className="value">{product.sleeve_type || '-'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="label">Code:</span>
                                <span className="value">{product.product_code || '-'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="label">Color:</span>
                                <span className="value">{product.color || '-'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="delivery-note">
                        <p><img className='deliveryicons' src={shipping} alt="" />Free Delivery on orders above ₹999</p>
                        <p><img className='deliveryicons' src={tick} alt="" />7 Day Easy Return Policy</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detailsproducts