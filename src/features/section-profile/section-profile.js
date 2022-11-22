import React, {useContext, useState, useEffect, useRef} from 'react';
import img from "../../img/te.png";
import {getAuth} from "firebase/auth";
import './style.sass'
import signIn from '../../img/signin.png'
import {AuthContext} from '../../shared/contextauth/auth'
import {useNavigate} from "react-router-dom";
import {signOut} from "firebase/auth"
import {
    updateDoc,
    doc,
    getFirestore,
    onSnapshot,
    query,
    collection,
    Timestamp
} from "firebase/firestore"
import exit from "../../img/exit.png";
import menu from "../../img/menu.svg";
import bell from "../../img/bell.svg";
import todo from "../../img/yeye.png";
import FriendNotification from "../../components/notification/friend/friendNotification";
import Profile from "../../components/userHeader/Profile/Profile";
import Notification from "../../components/userHeader/Notification/Notification";
import Menu from "../../components/userHeader/Menu/Menu";

const SectionProfile = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [isOpenNotifications, setIsOpenNotifications] = useState(false)
    const [isOpenProfile, setIsOpenProfile] = useState(false)
    const [isOpenMenu, setIsOpenMenu] = useState(false)
    const [data, setData] = useState(false)
    const [focus, setFocus] = useState(false)

    const labelRef = useRef(null);
    const popupRef = useRef(null);

    const openHandler = () => {
        setFocus(!focus)
    }

    const auth = getAuth()
    const {user} = useContext(AuthContext)
    const db = getFirestore();
    const navigate = useNavigate()

    const handleClickOutside = (e) => {
        if (focus) {
            if (popupRef.current &&
              !popupRef.current.contains(e.target) &&
              !labelRef.current?.contains(e.target)) {
                setFocus(false)
            }
        }
    }

    useEffect(() => {
        if (typeof document !== "undefined" && focus) {
            document.addEventListener('click', (e) => {
                handleClickOutside(e);
            })
            return document.removeEventListener('click', (e) => {
                handleClickOutside(e);
            })
        }
    })

    useEffect(() => {
        if (user) {
            let unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
                setData(doc.data())
            })
            console.log(data)
            return () => unsub()
        }
    }, [user])

    return !user ? (
        <>
            <section className="section-auth">
                <button onClick={() => navigate('/login')} className='profile-login btn'><img src={signIn} alt="signIn"/><span>Sign In</span></button>
                <button onClick={() => navigate('/register')} className='profile-register btn'>Sign Up</button>
            </section>
        </>
    ):(
        <>
            <section className="section-block">
                <Profile data={data}/>
                <Notification data={data}/>
                <Menu data={data}/>
            </section>

        </>
    )
};

export default SectionProfile;
