import axios from 'axios'
import React, { createContext, useState, useEffect, useCallback } from 'react'
import { toast } from "react-toastify";

export const WishlistContext = createContext()

export function WhishlistProvider({ children }) {

    const [wishlist, setWishlist] = useState([]) 
    const [Whishlistcount, setWhislistcount] = useState(0)
    
    // Helper to get API URL
    const getApiUrl = () => {
        try {
            return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
        } catch (e) {
            return 'http://127.0.0.1:8000/api';
        }
    };
    const API_URL = getApiUrl();

    // 1. Fetch Wishlist Data
    const fetchWishlist = useCallback(() => {
        // GET TOKEN FRESH HERE
        const token = localStorage.getItem('access')
        const userId = localStorage.getItem('id')

        if (userId && token) {
            axios.get(`${API_URL}/orders/wishlist/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    const products = res.data.products || [];
                    setWishlist(products);
                    setWhislistcount(products.length);
                })
                .catch((err) => console.error("Error fetching wishlist:", err))
        } else {
            setWishlist([]);
            setWhislistcount(0);
        }
    }, [API_URL])

    // Initial Fetch
    useEffect(() => {
        fetchWishlist()
    }, [fetchWishlist])


    // 2. Handle Add/Remove Logic
    async function WishlistHandleChange(product) {
        // GET TOKEN FRESH HERE (Fixes the 401 Error)
        const token = localStorage.getItem('access')
        const userId = localStorage.getItem('id')

        if (!userId || !token) {
            toast.error("Please log in to add to Wishlist", {
                position: 'top-center',
                autoClose: 1300,
                style: { marginTop: '60px' }
            })
            return
        }

        try {
            const response = await axios.post(
                `${API_URL}/orders/wishlist/toggle/`,
                { product_id: product.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const action = response.data.action; // 'added' or 'removed'

            if (action === 'added') {
                setWishlist((prev) => [...prev, product]); 
                toast.success('Item added to Wishlist', {
                    position: 'top-center',
                    autoClose: 1300,
                    style: { marginTop: '60px' }
                });
            } else {
                setWishlist((prev) => prev.filter((item) => item.id !== product.id)); 
                toast.warn('Removed from Wishlist', {
                    position: 'top-center',
                    autoClose: 1300,
                    style: { marginTop: '60px' }
                });
            }
            
            // Update the count immediately based on action
            setWhislistcount(prev => action === 'added' ? prev + 1 : prev - 1);

        } catch (err) {
            console.error(err);
            // If token is expired, it might fail here
            if (err.response && err.response.status === 401) {
                toast.error("Session expired. Please login again.");
            } else {
                toast.error("Failed to update wishlist");
            }
        }
    }

    return (
        <WishlistContext.Provider value={{ 
            wishlist, 
            Whishlistcount, 
            WishlistHandleChange, 
            updateWhislistCount: fetchWishlist 
        }}>
            {children}
        </WishlistContext.Provider>
    )
}

export default WhishlistProvider