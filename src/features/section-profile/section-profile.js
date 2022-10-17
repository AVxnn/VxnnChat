import React, {useContext, useState, useEffect} from 'react';
import img from "../../img/te.png";
import {getAuth} from "firebase/auth";
import './style.css'
import avatar from '../../features/message-item/img/avatar.png'
import signIn from '../../img/signin.png'
import {AuthContext} from '../../shared/contextauth/auth'
import {NavLink, useNavigate} from "react-router-dom";
import {signOut} from "firebase/auth"
import {updateDoc, doc, getFirestore, onSnapshot, query, collection, where} from "firebase/firestore"
import settings from "../../img/cog.png";
import exit from "../../img/exit.png";
import bell from "../../img/bell.png";

const SectionProfile = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [isOpenNotifications, setIsOpenNotifications] = useState(false)
    const [data, setData] = useState(false)

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

    useEffect(() => {
        let unsub = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
            setData(doc.data())
        })
        console.log(data)
        return () => unsub()
    }, [])

    return !user ? (
        <>
            <section className="section-profile">
                <button onClick={() => navigate('/login')} className='profile-login btn'><img src={signIn} alt="signIn"/><span>Sign In</span></button>
                <button onClick={() => navigate('/register')} className='profile-register btn'>Sign Up</button>
            </section>
        </>
    ):(
        <>
            <section className="section-profile-log">
                <section onClick={() => setIsOpenNotifications(!isOpenNotifications)} className='profile-bell-container'>
                    <img className='profile-bell' src={bell} alt="bell"/>
                    {
                        data.notifications ? (
                          <div className='profile-bell-span'>{data.notifications.length}</div>
                        ) : ''
                    }
                </section>
                { isOpenNotifications ? (
                    <section className='profile-bell-list'>
                        {
                            data.notifications ? data.notifications.map((e) => {
                                console.log(data.notifications)
                                return (
                                  <section className='bell-item'>
                                      <section className='bell-item-container'>
                                          <img className='bell-item-avatar' src={e.avatar ? e.avatar : avatar} alt="avatar"/>
                                          <section className='bell-info'>
                                              <span className='bell-item-name'>{e.name}</span>
                                              <span className='bell-item-subtitle'>Wants to be friends</span>
                                          </section>
                                      </section>
                                      <section className='bell-btn-list'>
                                          <button className='bell-item-btn accept'>Accept</button>
                                          <button className='bell-item-btn reject'>Reject</button>
                                      </section>
                                  </section>
                                )
                            }) : null
                        }
                    </section>
                    ) : null
                }
                <img onClick={() => setIsOpen(!isOpen)} className="profile_img" src={auth.currentUser.photoURL ? auth.currentUser.photoURL : avatar} alt="Avatar"/>
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
