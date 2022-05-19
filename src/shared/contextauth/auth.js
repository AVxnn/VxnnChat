import React, {createContext, useEffect, useState} from 'react';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from "../api/firebase"
import { doc, getDoc } from "firebase/firestore";
import db from '../api/firebase'

export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            setUser(user)
        })
        setLoading(false)
    }, [])

    if(loading) {
        return "loading"
    }
    return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
}

export default AuthProvider