import axios from 'axios'
import React, { createContext, useState, useEffect, useCallback } from 'react'


export const WishlistContext = createContext()

export function WhishlistProvider({ children }) {

    const [Whishlistcount, setWhislistcount] = useState(0)
    const userId = localStorage.getItem('id')



    const updateWhislistCount = useCallback(() => {
        if (userId) {
            axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
                .then((res) => {
                    const userData = res.data
                    setWhislistcount(userData.whishlist ? userData.whishlist.length : 0)
                })
                .catch((err) => console.error(err))
        }
    }, [userId])

    useEffect(() => {
        updateWhislistCount()
    }, [updateWhislistCount])

    return (
        <div>
            <WishlistContext.Provider value={{ Whishlistcount, updateWhislistCount }}>
                {children}
            </WishlistContext.Provider>

        </div>
    )
}

export default WhishlistProvider