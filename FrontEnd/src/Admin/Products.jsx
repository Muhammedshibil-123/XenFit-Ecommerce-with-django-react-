import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './products.css'
import closing from '../assets/closing.png'

function Products() {
  const [products, setProducts] = useState([])
  const [popAdd, setpopAdd] = useState(false)
  const [popEdit, setpopEdit] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [catSort, setCatSort] = useState('all')
  
  // EDITED: Updated state to match T-shirt data structure
  const [newProduct, setNewProducts] = useState({
    title: '',
    brand: '',
    category: '', // e.g., Oversized, Polo
    theme: '',    // e.g., Anime, Minimal
    gender: '',
    description: '',
    price: '',
    mrp: '',
    image: '',
    status: 'active'
  })
  
  const userId = localStorage.getItem('id')

  // Helper to get API URL
  const getApiUrl = () => {
    try {
      return import.meta.env.VITE_API_URL || 'http://localhost:3000';
    } catch (e) {
      return 'http://localhost:3000';
    }
  };
  const API_URL = getApiUrl();

  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then((res) => {
        setProducts(res.data)
      })
      .catch((err) => console.log(err))
  }, [userId])

  function toggleProductStatus(id) {
    const product = products.find((p) => p.id === id)
    if (!product) return

    const newStatus = product.status === "active" ? "inactive" : "active"

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    )

    axios
      .patch(`${API_URL}/products/${id}`, { status: newStatus })
      .catch((err) => console.error(err))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProducts(prev => ({ ...prev, [name]: value }))
  }

  function submit(e) {
    e.preventDefault()
    // EDITED: Posting new fashion fields
    axios.post(`${API_URL}/products`, newProduct)
      .then((res) => {
        setProducts((prev) => [...prev, res.data])
        setpopAdd(false)
        setNewProducts({
          title: '', brand: '', category: '', theme: '', gender: '',
          description: '', price: '', mrp: '', image: '', status: 'active'
        })
      })
      .catch((err) => console.error(err))
  }

  const handleInputChangeedit = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }))
  }

  function handleEditClick(product) {
    setCurrentProduct(product)
    setpopEdit(true)
  }

  function handleUpdate(e) {
    e.preventDefault()
    if (!currentProduct) return;

    axios.patch(`${API_URL}/products/${currentProduct.id}`, currentProduct)
      .then((res) => {
        setProducts((prev) =>
          prev.map((p) => p.id === currentProduct.id ? res.data : p)
        )
        setpopEdit(false)
        setCurrentProduct(null)
      })
      .catch((err) => console.error(err))
  }

  function removeproduct(id) {
    if(window.confirm("Are you sure you want to delete this product?")) {
        axios.delete(`${API_URL}/products/${id}`)
        .then((res) => {
            const updatedProducts = products.filter((product) => product.id !== id)
            setProducts(updatedProducts)
        })
        .catch((err) => console.error(err))
    }
  }

  // Search Logic
  let filterProducts = products.filter((product) => (
    (product.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (product.brand?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (product.category?.toLowerCase() || '').includes(search.toLowerCase())
  ))

  // Category Filter
  if (catSort !== 'all') {
    filterProducts = filterProducts.filter((product) =>
      product.category && product.category.toLowerCase() === catSort.toLowerCase()
    )
  }

  return (
    <div className='products-page-wrapper'>
      <div className='main-products-container'>
        
        {/* Header Section */}
        <div className="products-header">
          <h1>INVENTORY</h1>
          <div className="controls-container">
            <div className="search-box">
              <input type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search products...'
                value={search}
              />
            </div>
            <div className="filter-box">
              <select value={catSort} onChange={(e) => setCatSort(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="oversized">Oversized</option>
                <option value="regular fit">Regular Fit</option>
                <option value="polo">Polos</option>
                <option value="hoodie">Hoodies</option>
              </select>
            </div>
            <button className="add-btn" onClick={() => setpopAdd(true)}>+ NEW DROP</button>
          </div>
        </div>

        {/* Table Header */}
        <div className="table-header-row">
          <span className='col-id'>ID</span>
          <span className='col-img'>IMAGE</span>
          <span className='col-title'>PRODUCT DETAILS</span>
          <span className='col-cat'>CATEGORY</span>
          <span className='col-price'>PRICE</span>
          <span className='col-status'>STATUS</span>
          <span className='col-action'>ACTION</span>
        </div>

        {/* Table Body */}
        <div className="products-list">
          {filterProducts.map((product) => (
            <div className="product-row" key={product.id}>
              <span className='col-id'>#{product.id}</span>
              
              <span className='col-img'>
                <img src={product.image} alt="" />
              </span>

              <span className='col-title'>
                <strong>{product.title}</strong>
                <p>{product.brand}</p>
              </span>

              <span className='col-cat'>{product.category || '-'}</span>
              
              <span className='col-price'>
                 ₹{product.price}
                 {product.mrp && <span className="mrp-mini"> ₹{product.mrp}</span>}
              </span>

              <span className='col-status'>
                <button
                  onClick={() => toggleProductStatus(product.id)}
                  className={`toggle-btn ${product.status === "active" ? "on" : "off"}`}
                >
                  <div className="toggle-circle"></div>
                </button>
              </span>

              <span className='col-action'>
                <button className="action-btn edit" onClick={() => handleEditClick(product)}>EDIT</button>
                <button className="action-btn delete" onClick={() => removeproduct(product.id)}>DEL</button>
              </span>
            </div>
          ))}
        </div>

        {/* --- ADD PRODUCT MODAL --- */}
        {popAdd && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>ADD NEW DROP</h2>
                <img src={closing} onClick={() => setpopAdd(false)} alt="Close" />
              </div>
              
              <form onSubmit={submit} className="modal-form">
                <div className="form-grid">
                    <div className="input-group">
                        <label>Product Title</label>
                        <input type="text" name='title' value={newProduct.title} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label>Brand</label>
                        <input type="text" name='brand' value={newProduct.brand} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label>Category (e.g. Oversized)</label>
                        <input type="text" name='category' value={newProduct.category} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label>Theme (e.g. Anime)</label>
                        <input type="text" name='theme' value={newProduct.theme} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <label>Price (Selling)</label>
                        <input type="number" name='price' value={newProduct.price} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label>MRP (Original)</label>
                        <input type="number" name='mrp' value={newProduct.mrp} onChange={handleInputChange} />
                    </div>
                    <div className="input-group full-width">
                        <label>Image URL</label>
                        <input type="text" name='image' value={newProduct.image} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group full-width">
                        <label>Description</label>
                        <textarea name='description' rows="3" value={newProduct.description} onChange={handleInputChange} required />
                    </div>
                </div>
                <button type="submit" className="save-btn">PUBLISH PRODUCT</button>
              </form>
            </div>
          </div>
        )}

        {/* --- EDIT PRODUCT MODAL --- */}
        {popEdit && currentProduct && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>EDIT PRODUCT</h2>
                <img src={closing} onClick={() => setpopEdit(false)} alt="Close" />
              </div>
              
              <form onSubmit={handleUpdate} className="modal-form">
                <div className="form-grid">
                    <div className="input-group">
                        <label>Product Title</label>
                        <input type="text" name='title' value={currentProduct.title} onChange={handleInputChangeedit} required />
                    </div>
                    <div className="input-group">
                        <label>Brand</label>
                        <input type="text" name='brand' value={currentProduct.brand} onChange={handleInputChangeedit} required />
                    </div>
                    <div className="input-group">
                        <label>Category</label>
                        <input type="text" name='category' value={currentProduct.category} onChange={handleInputChangeedit} required />
                    </div>
                    <div className="input-group">
                        <label>Theme</label>
                        <input type="text" name='theme' value={currentProduct.theme} onChange={handleInputChangeedit} />
                    </div>
                    <div className="input-group">
                        <label>Price</label>
                        <input type="number" name='price' value={currentProduct.price} onChange={handleInputChangeedit} required />
                    </div>
                    <div className="input-group">
                        <label>MRP</label>
                        <input type="number" name='mrp' value={currentProduct.mrp} onChange={handleInputChangeedit} />
                    </div>
                    <div className="input-group full-width">
                        <label>Image URL</label>
                        <input type="text" name='image' value={currentProduct.image} onChange={handleInputChangeedit} required />
                    </div>
                    <div className="input-group full-width">
                        <label>Description</label>
                        <textarea name='description' rows="3" value={currentProduct.description} onChange={handleInputChangeedit} required />
                    </div>
                </div>
                <button type="submit" className="save-btn">UPDATE PRODUCT</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products