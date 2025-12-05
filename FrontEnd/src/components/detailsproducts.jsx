import axios from 'axios'
import React, { useEffect, useState,useContext } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import backarrow from '../assets/back-arrow.png'
import './detailsproducts.css'
import { toast } from "react-toastify";
import Notfound from './notfound'
import { CartContext } from "../component/cartcouter";




function Detailsproducts() {
    const { id } = useParams()
    const [product, setProduct] = useState()
    const userId = (localStorage.getItem("id"))
    const {updateCartCount ,CartHandleChange} = useContext(CartContext)
   

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
            .then((res) => setProduct(res.data))
            .catch((err) => console.error(err))
    }, [id])



  //   async function CartHandleChange(product) {
  //   if (!userId) {
  //     toast.error("Please log in to add to cart ", { positon: 'top-center' })
  //     return
  //   }

  //   const userRespone = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
  //   const userData = userRespone.data
  //   const currenCart = userData.cart || []

  //   const existingItem = currenCart.findIndex((item) => item.productId === product.id)
  //   let updatedCart;

  //   if (existingItem !== -1) {
  //     toast.warn('Product already in cart', {
  //       positon: 'top-center',
  //       autoClose: 1300,
  //       style: { marginTop: '60px' }
  //     })
  //   } else {
  //     updatedCart = [
  //       ...currenCart,
  //       {
  //         productId: product.id,
  //         title: product.title,
  //         price: product.price,
  //         image: product.image,
  //         quantity: 1,
  //       },
  //     ]
  //     toast.success('Item added to Cart', {
  //       positon: 'top-center',
  //       autoClose: 1300,
  //       style: { marginTop: '60px' }
  //     })

  //     await axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
  //       ...userData,
  //       cart: updatedCart,
  //     })

  //     updateCartCount()
  //   }

  // }

  if(!product){
    return <Notfound/>
  }


    return (

        <div className='main-details-container'>
            <NavLink to={'/shop'}>
            <div className='backbutton'>
                <img src={backarrow} alt="" />
            </div>
            </NavLink>
            <div className='details-container'>
                <img src={product?.image} alt="" />
                <div className='product-info'>
                <h1>{product?.title}</h1>
                <p className='description'>{product?.description}</p>
                <p className='brand'>Brand: {product?.brand}</p>
                <p className='type'>Product Type: {product?.type}</p>
                <p className='connectivity'>Connectivity: {product?.connectivity}</p>
                <p className='price'>₹{product?.price}</p>
                <button className='addcart'  onClick={() => CartHandleChange(product)}>Add TO Cart</button>
                </div>
            </div>
        </div>
    )
}

export default Detailsproducts