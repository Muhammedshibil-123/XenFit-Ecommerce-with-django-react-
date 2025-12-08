import { NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import './shop.css'
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { CartContext } from "../component/cartcouter";
import { WishlistContext } from "../component/whislistcouter";
import { SearchContext } from "../component/searchcontext";
import ReactPaginate from "react-paginate";

// Helper to safely get API URL
const getApiUrl = () => {
  try {
    // EDITED: Default fallback set to Django's port 8000 if .env is missing
    return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  } catch (e) {
    return 'http://127.0.0.1:8000/api';
  }
};

function Shop() {
  const [products, setProducts] = useState([]);
  const userId = localStorage.getItem("id");
  const API_URL = getApiUrl();

  // Sort and Filter States
  const [sortType, setSortType] = useState('default')
  const [themeSort, setThemeSort] = useState('all')
  const [brandSort, setBrandSort] = useState('all')

  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])
  const { searchTerm } = useContext(SearchContext)
  const { updateCartCount, CartHandleChange } = useContext(CartContext)
  const { updateWhislistCount } = useContext(WishlistContext)
  const [currentPage, setCurrentPage] = useState(0)
  const productsPerPage = 16

  useEffect(() => {
    axios
      .get(`${API_URL}/products/`)
      .then((res) => {
        console.log("Products Fetched:", res.data);
        let filterdata = res.data.filter((product) => {
          return product.status === 'active'
        })
        setProducts(filterdata)
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        // Optional: Show error to user if fetch fails completely
        // toast.error("Could not load products");
      });

    if (userId) {
      axios.get(`${API_URL}/users/${userId}/`) // Added slash here too for consistency
        .then((res) => setWishlist(res.data.whishlist || []))
        .catch(err => console.log(err));
    }
  }, [userId, API_URL]);

  // Filtering Logic
  let filterProducts = products.filter((product) =>
    (product.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (product.brand?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (product.theme?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (product.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )

  // Sorting Logic
  if (sortType === 'low to high') {
    filterProducts.sort((a, b) => a.price - b.price)
  } else if (sortType === 'high to low') {
    filterProducts.sort((a, b) => b.price - a.price)
  }

  // Theme Filtering
  if (themeSort !== 'all') {
    filterProducts = filterProducts.filter((product) =>
      product.theme && product.theme.toLowerCase() === themeSort.toLowerCase()
    )
  }

  // Brand Filtering
  if (brandSort !== 'all') {
    filterProducts = filterProducts.filter((product) =>
      product.brand && product.brand.toLowerCase() === brandSort.toLowerCase()
    )
  }

  async function WhishlistHandleChange(product) {
    if (!userId) {
      toast.error("Please log in to add to Wishlist ",
        {
          position: 'top-center',
          autoClose: 1300,
          style: { marginTop: '60px' }
        })
      return
    }

    try {
      const userRespone = await axios.get(`${API_URL}/users/${userId}`)
      const userData = userRespone.data
      const currenwhishlist = userData.whishlist || []

      const existingItem = currenwhishlist.findIndex((item) => item.productId === product.id)
      let updatedwihislist;

      if (existingItem !== -1) {
        toast.warn('Product already in wishlist', {
          position: 'top-center',
          autoClose: 1300,
          style: { marginTop: '60px' }
        })
      } else {
        updatedwihislist = [
          ...currenwhishlist,
          {
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        ]

        await axios.put(`${API_URL}/users/${userId}`, {
          ...userData,
          whishlist: updatedwihislist,
        })

        setWishlist(updatedwihislist)
        toast.success('Item added to Wishlist', {
          position: 'top-center',
          autoClose: 1300,
          style: { marginTop: '60px' }
        })
        updateWhislistCount()
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist");
    }
  }

  function whishlistcolor(productId) {
    return wishlist.find((item) => item.productId === productId)
  }

  const offset = currentPage * productsPerPage;
  const pageCount = Math.ceil(filterProducts.length / productsPerPage);
  const currentProducts = filterProducts.slice(offset, offset + productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <div className="filters-container">
        {/* Sort Price */}
        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="default">Featured</option>
            <option value="low to high">Price: Low to High</option>
            <option value="high to low">Price: High to Low</option>
          </select>
        </div>

        {/* Theme Filter */}
        <div className="filter-group">
          <label>Theme</label>
          <select value={themeSort} onChange={(e) => setThemeSort(e.target.value)}>
            <option value="all">All Themes</option>
            <option value="Anime">Anime</option>
            <option value="Sports">Sports</option>
            <option value="Movie">Movie</option>
            <option value="Motivational">Motivational</option>
            <option value="Minimal">Minimal</option>
            <option value="Vintage">Vintage</option>
          </select>
        </div>

        {/* Brand Filter */}
        <div className="filter-group">
          <label>Brand</label>
          <select value={brandSort} onChange={(e) => setBrandSort(e.target.value)} >
            <option value="all">All Brands</option>
            <option value="Otaku Wear">Otaku Wear</option>
            <option value="Xenfit Originals">Xenfit Originals</option>
            <option value="Grind Gear">Grind Gear</option>
            <option value="Xenfit Essentials">Xenfit Essentials</option>
            <option value="Hoops Nation">Hoops Nation</option>
            <option value="Cinema Cult">Cinema Cult</option>
          </select>
        </div>
      </div>

      <div className="main-shop-container">
        {currentProducts.map((product, index) => {
          // Calculate discount percentage
          const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

          return (
            <div className="shop-container" key={index}>

              <div className="whislist-contaniner"
                onClick={() => WhishlistHandleChange(product)}>
                <FaHeart style={{
                  color: whishlistcolor(product.id) ? '#e63946' : '#ccc',
                  width: '18px',
                  height: '18px'
                }} />
              </div>

              <NavLink to={`/${product.id}`} style={{ textDecoration: 'none' }}>
                <div className="product-image-box">
                  <img
                    src={
                      product.image.startsWith('http')
                        ? product.image
                        : `http://127.0.0.1:8000${product.image}`
                    }
                    alt={product.title}
                  />

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <span className="discount-badge">{discount}% OFF</span>
                  )}
                </div>
                <div className="product-info-box">
                  <h3>{product.title}</h3>
                  <h4>{product.brand}</h4>

                  <div className="price-row">
                    <span className="selling-price">₹{product.price}</span>
                    {product.mrp && <span className="mrp-price">₹{product.mrp}</span>}
                  </div>
                </div>
              </NavLink>

              <div className="button-wrapper">
                <button className="addtocart" onClick={() => CartHandleChange(product)}>ADD TO BAG</button>
              </div>
            </div>
          )
        })}
      </div>

      <ReactPaginate
        previousLabel={"Prev"}
        nextLabel={'Next'}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
      />
    </>
  );
}

export default Shop;