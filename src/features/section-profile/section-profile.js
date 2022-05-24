import React, {useContext, useEffect, useState} from 'react';
import img from "../../img/te.png";
import login from "../../img/login.svg";
import {getAuth} from "firebase/auth";
import './style.css'
import {AuthContext} from '../../shared/contextauth/auth'
import {useNavigate} from "react-router-dom";
import {signOut} from "firebase/auth"
import {updateDoc, doc, getFirestore, getDoc} from "firebase/firestore"

const SectionProfile = () => {

    const auth = getAuth()
    const {user} = useContext(AuthContext)
    const db = getFirestore();
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
            isOnline: false,
        })
        await signOut(auth);
        navigate('/login')
        console.log('exit', auth.currentUser)
    }

    return !user ? (
        <>
            <section className="section-profile">
                <button onClick={() => navigate('/login')} className='profile-login btn'>Login</button>
                <button onClick={() => navigate('/register')} className='profile-register btn'>Registration</button>
            </section>
        </>
    ):(
        <>
            <section className="section-profile">
                <img className="profile_img" src={auth.currentUser.photoURL} alt="Avatar"/>
                <h3 className="profile_name">{auth.currentUser.displayName ? auth.currentUser.displayName : ''}</h3>
                <img onClick={handleSignOut} className="profile_icon" src={login} alt="icon"/>
            </section>
        </>
    )
};

export default SectionProfile;