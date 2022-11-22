import React, {useContext, useState, useEffect} from 'react';
import img from "../../img/te.png";
import {getAuth} from "firebase/auth";
import './style.sass'
import avatar from '../../features/message-item/img/avatar.png'
import signIn from '../../img/signin.png'
import {AuthContext} from '../../shared/contextauth/auth'
import {NavLink, useNavigate} from "react-router-dom";
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
import settings from "../../img/cog.png";
import exit from "../../img/exit.png";
import menu from "../../img/menu.svg";
import bell from "../../img/bell.svg";
import downArrow from "../../img/downArrow.svg";
import profile from "../../img/profile.svg";
import cog from "../../img/cog.svg";
import logout from "../../img/logout.svg";
import todo from "../../img/yeye.png";
import FriendNotification from "../../components/notification/friend/friendNotification";

const SectionProfile = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [isOpenNotifications, setIsOpenNotifications] = useState(false)
    const [isOpenProfile, setIsOpenProfile] = useState(false)
    const [isOpenMenu, setIsOpenMenu] = useState(false)
    const [data, setData] = useState(false)
    const [user2, setUser2] = useState({})
    const [users, setUsers] = useState([])

    const auth = getAuth()
    const {user} = useContext(AuthContext)
    const db = getFirestore();
    const navigate = useNavigate()
    const handleSignOut = async () => {
        if (auth.currentUser.uid) {
            await updateDoc(doc(db, "users", user.uid), {
                isOnline: false,
                lastOnline: Timestamp.fromDate(new Date())
            })
            await signOut(auth);
            navigate('/login')
            console.log('exit', auth.currentUser)
        } else {
            console.log('non')
        }

    }

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
            <section  className="section-block">
                <section className='section-profile-container'>
                    <section onClick={() => setIsOpenProfile(!isOpenProfile)} className='section-profile'>
                        <img className="profile_img" src={auth.currentUser.photoURL ? auth.currentUser.photoURL : avatar} alt="Avatar"/>
                        <p className='profile-name'>MetaVxnn</p>
                        <img style={{transform: isOpenProfile && 'rotate(180deg)'}} className='profile-downArrow' src={downArrow} alt=""/>
                    </section>
                    {
                        isOpenProfile ? (
                            <div className='profile-dropMenu'>
                                <section onClick={() => navigate(`/profile/${user.uid}`)} className='profile-dropMenu-item'>
                                    <img className='profile-dropMenu-item_img' src={profile} alt=""/>
                                    <p className='profile-dropMenu-item_title'>Profile</p>
                                </section>
                                <section onClick={() => navigate(`/profile/${user.uid}/edit`)} className='profile-dropMenu-item'>
                                    <img className='profile-dropMenu-item_img' src={cog} alt=""/>
                                    <p className='profile-dropMenu-item_title'>Settings</p>
                                </section>
                                <button onClick={() => handleSignOut()} className='profile-dropMenu-out'>
                                    <img className='profile-dropMenu-out_img' src={logout} alt=""/>
                                    <span className='profile-dropMenu-out_title'>
                                        Login Out
                                    </span>
                                </button>
                            </div>
                        ) : ''
                    }
                </section>
                <section onClick={() => setIsOpenNotifications(!isOpenNotifications)} className='profile-bell-container'>
                    <div>
                        <img className='profile-bell' src={bell} alt="bell"/>
                        {
                            data.notifications && data.notifications.length >= 1 ? (
                              <div className='profile-bell-span'>{data.notifications.length}</div>
                            ) : ''
                        }
                        { isOpenNotifications && data.notifications.length > 0 ? (
                          <section className={`profile-bell-list ${data.notifications.length > 0 ? '' : 'empty'}`}>
                              {
                                  data.notifications.length > 0 ? data.notifications.map((e) => {
                                      if (e.type) {
                                          return (
                                            <FriendNotification data={data} item={e}/>
                                          )
                                      }
                                  }) : ''

                              }
                          </section>
                        ) : null
                        }
                    </div>
                </section>
                <section onClick={() => setIsOpenMenu(!isOpenMenu)} className='profile-menu-container'>
                    <img className='profile-menu' src={menu} alt="bell"/>
                    { isOpenMenu ? (
                      <section className={`profile-menu-list`}>
                        <section onClick={() => navigate(`/todo`)} className={`profile-menu-list-item`}>
                            <img src={todo} alt=""/>
                        </section>
                      </section>
                    ) : null
                    }
                </section>
            </section>

        </>
    )
};

export default SectionProfile;
