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

function Shop() {
  const [products, setProducts] = useState([]);
  const userId = (localStorage.getItem("id"))
  const [sortType, setSortType] = useState('default')
  const [typesort, setTypesort] = useState('types')
  const [brandsort, setBrandsort] = useState('brand')
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])
  const { searchTerm } = useContext(SearchContext)
  const { updateCartCount } = useContext(CartContext)
  const { updateWhislistCount } = useContext(WishlistContext)
  const [currentPage,setCurrentPage]=useState(0)
  const productsPerPage = 16

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        let filterdata = res.data.filter((product) => {
          return product.status === 'active'
        })
        setProducts(filterdata)
      })
      .catch((err) => console.log(err));

    if (userId) {
      axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
        .then((res) => setWishlist(res.data.whishlist || []))
    }
  }, [userId]);




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


  let filterProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (sortType === 'low to high') {
    filterProducts.sort((a, b) => a.price - b.price)

  } else if (sortType === 'high to low') {
    filterProducts.sort((a, b) => b.price - a.price)
  }


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

  if (brandsort === 'boat') {
    filterProducts = filterProducts.filter((product) =>
      product.brand.toLowerCase().includes('boat')
    )
  } else if (brandsort === 'oneplus') {
    filterProducts = filterProducts.filter((product) =>
      product.brand.toLowerCase().includes('oneplus')
    )
  } else if (brandsort === 'realme') {
    filterProducts = filterProducts.filter((product) =>
      product.brand.toLowerCase().includes('realme')
    )
  } else if (brandsort === 'apple') {
    filterProducts = filterProducts.filter((product) =>
      product.brand.toLowerCase().includes('apple')
    )
  } else if (brandsort === 'sony') {
    filterProducts = filterProducts.filter((product) =>
      product.brand.toLowerCase().includes('sony')
    )
  } else if (brandsort === 'jbl') {
    filterProducts = filterProducts.filter((product) =>
      product.brand.toLowerCase().includes('jbl')
    )
  }

  //  function showMoreHandle(){
  //    navigate(`/${filterProducts.id}`)
  //  }

  async function WhishlistHandleChange(product) {
    if (!userId) {
      toast.error("Please log in to add to Whislist ",
        {
          positon: 'top-center',
          autoClose: 1300,
          style: { marginTop: '60px' }
        })
      return
    }

    const userRespone = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
    const userData = userRespone.data
    const currenwhishlist = userData.whishlist || []

    const existingItem = currenwhishlist.findIndex((item) => item.productId === product.id)
    let updatedwihislist;

    if (existingItem !== -1) {
      toast.warn('Product already in whishlist', {
        positon: 'top-center',
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
      toast.success('Item added to Whishlist', {
        positon: 'top-center',
        autoClose: 1300,
        style: { marginTop: '60px' }
      })

      await axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        ...userData,
        whishlist: updatedwihislist,
      })
      setWishlist(updatedwihislist)
    }

    updateWhislistCount()

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
        <select name="" id="" value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="default">Default</option>
          <option value="low to high">Low to high</option>
          <option value="high to low">High to low </option>
        </select>
        <select name="" id="" value={typesort} onChange={(e) => setTypesort(e.target.value)}>
          <option value="types">Product Type</option>
          <option value="headphone">Headphone</option>
          <option value="headset">Headset</option>
          <option value="earbuds">Earbuds</option>
          <option value="neckband">Neckband</option>
          <option value="speaker">Speaker</option>
        </select>
        <select name="" id="" value={brandsort} onChange={(e) => setBrandsort(e.target.value)} >
          <option value="brand">Brand</option>
          <option value="boat">boAt</option>
          <option value="oneplus">OnePlus</option>
          <option value="realme">Realme</option>
          <option value="apple">Apple</option>
          <option value="sony">Sony</option>
          <option value="jbl">JBL</option>
        </select>
      </div>

      <div className="main-shop-container">
        {currentProducts.map((product, index) => (
          <div className="shop-container" key={index}>

            <div className="whislist-contaniner"
              onClick={() => WhishlistHandleChange(product)}>
              <FaHeart style={{
                color: whishlistcolor(product.id) ? 'red' : 'gray',
                width: '20px',
                height: '20px'
              }} />
            </div>
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

      <ReactPaginate
      previousLabel={"Previous"}
      nextLabel={'Next'}
      pageCount={pageCount}
      onPageChange={handlePageClick}
      containerClassName={'pagination'}
      activeClassName={'active'}
      />
    </>
  );
}

export default Shop;
