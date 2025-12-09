import axios from 'axios'
import React, { createContext, useState, useEffect, useCallback } from 'react'
import { toast } from "react-toastify";

export const CartContext = createContext()

export function CartProvider({ children }) {
    const [cartcount, setCartcount] = useState(0)

    const getApiUrl = () => {
        try {
            return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
        } catch (e) {
            return 'http://127.0.0.1:8000/api';
        }
    };
    const API_URL = getApiUrl();

    // Fetch Count
    const updateCartCount = useCallback(() => {
        // UPDATED: Get token and userId INSIDE the function to ensure they are fresh
        const token = localStorage.getItem('access_token');
        const userId = localStorage.getItem('id');

        if (userId && token) {
            axios.get(`${API_URL}/orders/cart/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                // Count total items
                setCartcount(res.data.items ? res.data.items.length : 0)
            })
            .catch((err) => console.error("Cart fetch error:", err))
        } else {
            setCartcount(0);
        }
    }, [API_URL])

    // Add to Cart Function
    async function CartHandleChange(product) {
        // UPDATED: Get token and userId INSIDE the function to ensure they are fresh
        const token = localStorage.getItem('access_token');
        const userId = localStorage.getItem('id');

        if (!userId) {
            toast.error("Please log in to add to cart", {
                position: 'top-center',
                autoClose: 1300,
                style: { marginTop: '60px' }
            })
            return
        }

        try {
            // Send request to backend
            await axios.post(`${API_URL}/orders/cart/add/`, 
                { product_id: product.id },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            toast.success('Item added to Bag', {
                position: 'top-center',
                autoClose: 1300,
                style: { marginTop: '60px' }
            })
            updateCartCount()
        } catch (err) {
            console.error(err)
            // Show more specific error if available from backend
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Failed to add to cart");
            }
        }
    }

    useEffect(() => {
        updateCartCount()
    }, [updateCartCount])

    return (
        <CartContext.Provider value={{ cartcount, updateCartCount, CartHandleChange }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider