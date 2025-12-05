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
  const [typesort, setTypesort] = useState('types')
  const [newProduct, setNewProducts] = useState({
    title: '',
    brand: '',
    type: '',
    description: '',
    price: '',
    image: '',
    connectivity: '',
    status: 'active'
  })
  const userId = localStorage.getItem('id')

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`)
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
      .patch(`${import.meta.env.VITE_API_URL}/products/${id}`, { status: newStatus })
      .catch((err) => {
        console.error(err)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProducts(prev => ({ ...prev, [name]: value }))
  }



  function submit(e) {
    e.preventDefault()
    axios.post(`${import.meta.env.VITE_API_URL}/products`, newProduct)
      .then((res) => {
        setProducts((prev) => [...prev, res.data])
        setpopAdd(false)
        setNewProducts({
          title: '',
          brand: '',
          type: '',
          description: '',
          price: '',
          image: '',
          connectivity: '',
          status: 'active'
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

    axios.patch(`${import.meta.env.VITE_API_URL}/products/${currentProduct.id}`, currentProduct)
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
    axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => {
        const updatedProducts = products.filter((product) => product.id !== id)
        setProducts(updatedProducts)
      })
      .catch((err) => console.error(err))

  }

  function handleSearch(e) {
    setSearch(e.target.value)

  }

  let filterProducts = products.filter((product) => (
    product.title?.toLowerCase().includes(search.toLowerCase()) ||
    product.brand?.toLowerCase().includes(search.toLowerCase()) ||
    product.status?.toLowerCase().includes(search.toLowerCase()) ||
    product.id?.toString().toLowerCase().includes(search.toLowerCase())) ||
    product.description?.toLowerCase().includes(search.toLowerCase())

  )

  if (typesort === 'headphone') {
    filterProducts = filterProducts.filter((product) =>
      product.type.toLowerCase().includes('headphone')
    )
  } else if (typesort === 'headset') {
    filterProducts = filterProducts.filter((product) =>
      product.type.toLowerCase().includes('headset')
    )
  } else if (typesort === 'earbuds') {
    filterProducts = filterProducts.filter((product) =>
      product.type.toLowerCase().includes('earbuds')
    )
  } else if (typesort === 'neckband') {
    filterProducts = filterProducts.filter((product) =>
      product.type.toLowerCase().includes('neckband')
    )
  } else if (typesort === 'speaker') {
    filterProducts = filterProducts.filter((product) =>
      product.type.toLowerCase().includes('speaker')
    )
  }

  return (
    <div style={{ marginLeft: '290px' }}>
      <div className='main-products-container'>
        <div className="first-part">
          <h1>Products</h1>
          <div className="mainsearch">
            <div className="serach">
              <input type="text"
                onChange={handleSearch}
                placeholder='  search product...'
                value={search}
              />
            </div>
            <div className="filters">
              <select name="" id="" value={typesort} onChange={(e) => setTypesort(e.target.value)}>
                <option value="types">Product Type</option>
                <option value="headphone">Headphone</option>
                <option value="headset">Headset</option>
                <option value="earbuds">Earbuds</option>
                <option value="neckband">Neckband</option>
                <option value="speaker">Speaker</option>
              </select>
            </div>
          </div>
          <div className="add-product">
            <button onClick={() => setpopAdd(true)}>Add Product</button>
          </div>
        </div>
        <div className="tableheadline">
          <h4 className='tableId'>Id</h4>
          <h4 className='tableImage'>Image</h4>
          <h4 className='tableTitle'>Title</h4>
          <h4 className='tableBrand'>Brand</h4>
          <h4 className='tableDec'>Description</h4>
          <h4 className='tablePrice'>Price</h4>
          <h4 className='tablestatus'>Status <br />
            <p style={{ fontSize: '7px', marginLeft: '-4px' }}>(Active/Inactive)</p>
          </h4>
          <h4 className='tableActions'>Actions</h4>
        </div>

        <div className="products-container">
          {filterProducts.map((product, index) => (
            <div className="product-row" key={index}>
              <p className='Id'>{product.id}</p>

              <div className='Image'>
                <img src={product.image} />
              </div>

              <h3 className='titile'>{product.title}</h3>
              <p className='Brand'>{product.brand}</p>
              <p className='description'>{product.description}</p>
              <p className='price'>₹{product.price}</p>

              <p className='status'>
                <button
                  onClick={() => toggleProductStatus(product.id)}
                  className={`toggle-btn ${product.status === "active" ? "active" : ""}`}
                >
                  <div className={`toggle-circle ${product.status === "active" ? "active" : ""}`}></div>
                </button>
              </p>

              <p className='Actions'>
                <button onClick={() => handleEditClick(product)}>Edit</button>
                <button onClick={() => removeproduct(product.id)}>Delete</button>
              </p>
            </div>
          ))}
        </div>

        {popAdd && (
          <div className="main-addpop-container">
            <div className="addpop-container">
              <img src={closing} onClick={() => setpopAdd(false)} alt="" />
              <h2>Add Product</h2>
              <form onSubmit={submit} action="">
                <label>Title</label>
                <input type="text"
                  name='title'
                  value={newProduct.title}
                  onChange={handleInputChange}
                  required
                />
                <label>Brand</label>
                <input type="text"
                  name='brand'
                  value={newProduct.brand}
                  onChange={handleInputChange}
                  required
                />
                <label>Type</label>
                <input type="text"
                  name='type'
                  value={newProduct.type}
                  onChange={handleInputChange}
                  required
                />
                <label>Connectivity</label>
                <input type="text"
                  name='connectivity'
                  value={newProduct.connectivity}
                  onChange={handleInputChange}
                  required
                />
                <label>Description</label>
                <input type="text"
                  name='description'
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                />
                <label>Price</label>
                <input type="number"
                  name='price'
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                />
                <label>Image Url</label>
                <input type="text"
                  name='image'
                  value={newProduct.image}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit">ADD</button>

              </form>
            </div>
          </div>
        )}

        {popEdit && currentProduct && (
          <div className="main-addpop-container">
            <div className="addpop-container">
              <img src={closing} onClick={() => setpopEdit(false)} alt="" />
              <h2>Edit Product</h2>
              <form onSubmit={handleUpdate} action="">
                <label>Title</label>
                <input type="text"
                  name='title'
                  value={currentProduct.title}
                  onChange={handleInputChangeedit}
                  required
                />
                <label>Brand</label>
                <input type="text"
                  name='brand'
                  value={currentProduct.brand}
                  onChange={handleInputChangeedit}
                  required
                />
                <label>Type</label>
                <input type="text"
                  name='type'
                  value={currentProduct.type}
                  onChange={handleInputChangeedit}
                  required
                />
                <label>Connectivity</label>
                <input type="text"
                  name='connectivity'
                  value={currentProduct.connectivity}
                  onChange={handleInputChangeedit}
                  required
                />
                <label>Description</label>
                <input type="text"
                  name='description'
                  value={currentProduct.description}
                  onChange={handleInputChangeedit}
                  required
                />
                <label>Price</label>
                <input type="number"
                  name='price'
                  value={currentProduct.price}
                  onChange={handleInputChangeedit}
                  required
                />
                <label>Image Url</label>
                <input type="text"
                  name='image'
                  value={currentProduct.image}
                  onChange={handleInputChangeedit}
                  required
                />
                <button type="submit">SAVE</button>

              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
