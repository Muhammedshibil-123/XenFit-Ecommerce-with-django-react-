import axios from 'axios'
import React, { createContext, useState, useEffect, useCallback } from 'react'

export const WishlistContext = createContext()

export function WhishlistProvider({ children }) {

    const [Whishlistcount, setWhislistcount] = useState(0)
    const userId = localStorage.getItem('id')
    const token = localStorage.getItem('access')

    const updateWhislistCount = useCallback(() => {
        if (userId && token) {
            axios.get(`${import.meta.env.VITE_API_URL}/orders/wishlist/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    // Check if products array exists and get its length
                    const count = res.data.products ? res.data.products.length : 0;
                    setWhislistcount(count);
                })
                .catch((err) => console.error(err))
        } else {
            setWhislistcount(0);
        }
    }, [userId, token])

    useEffect(() => {
        updateWhislistCount()
    }, [updateWhislistCount])

    return (
        <WishlistContext.Provider value={{ Whishlistcount, updateWhislistCount }}>
            {children}
        </WishlistContext.Provider>
    )
}

export default WhishlistProvider