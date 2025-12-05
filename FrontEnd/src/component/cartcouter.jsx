import axios from 'axios'
import React, { createContext, useState, useEffect, useCallback } from 'react'
import { toast } from "react-toastify";

export const CartContext = createContext()

export function CartProvider({ children }) {

    const [cartcount, setCartcount] = useState(0)
    const userId = localStorage.getItem('id')
    
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


    const updateCartCount = useCallback(() => {
        if (userId) {
            axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
                .then((res) => {
                    const userData = res.data
                    setCartcount(userData.cart ? userData.cart.length : 0)
                })
                .catch((err) => console.error(err))
        }
    }, [userId])

    useEffect(() => {
        updateCartCount()
    }, [updateCartCount])

    return (
        <div>
            <CartContext.Provider value={{ cartcount, updateCartCount ,CartHandleChange}}>
                {children}
            </CartContext.Provider>

        </div>
    )
}

export default CartProvider