import React, {useContext, useState} from 'react';
import img from "../../img/te.png";
import login from "../../img/login.png";
import {getAuth} from "firebase/auth";
import './style.css'
import avatar from '../../features/message-item/img/avatar.png'
import signIn from '../../img/signin.png'
import {AuthContext} from '../../shared/contextauth/auth'
import {NavLink, useNavigate} from "react-router-dom";
import {signOut} from "firebase/auth"
import {updateDoc, doc, getFirestore} from "firebase/firestore"
import user from "../../img/user.png";
import todo from "../../img/yeye.png";
import settings from "../../img/cog.png";
import exit from "../../img/exit.png";

const SectionProfile = () => {

    const [isOpen, setIsOpen] = useState(false)

    const auth = getAuth()
    const {user} = useContext(AuthContext)
    const db = getFirestore();
    const navigate = useNavigate()

    const handleSignOut = async () => {
        if (auth.currentUser.uid) {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                isOnline: false,
            })
            await signOut(auth);
            navigate('/login')
            console.log('exit', auth.currentUser)
        } else {
            console.log('non')
        }

    }

    return !user ? (
        <>
            <section className="section-profile">
                <button onClick={() => navigate('/login')} className='profile-login btn'><img src={signIn} alt="signIn"/><span>Sign In</span></button>
                <button onClick={() => navigate('/register')} className='profile-register btn'>Sign Up</button>
            </section>
        </>
    ):(
        <>
            <section onClick={() => setIsOpen(!isOpen)} className="section-profile-log">
                <img className="profile_img" src={auth.currentUser.photoURL ? auth.currentUser.photoURL : avatar} alt="Avatar"/>
                <section className={`profile-dropMenu ${isOpen && 'active'}`}>
                    <NavLink to={auth.currentUser ? `/profile/${auth.currentUser.uid}` : `/profile`} className="profile-item settings-y">
                        <section className="profile-item settings-y">
                            <img className="profile-item_img" src={settings} alt="user"/>
                        </section>
                    </NavLink>
                    <NavLink to='/' className="profile-item exit-y">
                        <section className="profile-item exit-y">
                            <img onClick={() => handleSignOut()} className="profile-item_img" src={exit} alt="todo"/>
                        </section>
                    </NavLink>
                    <div className='down-trip'></div>
                </section>
            </section>

        </>
    )
};

export default SectionProfile;
