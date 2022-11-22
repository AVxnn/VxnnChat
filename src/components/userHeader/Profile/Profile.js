import React, {useContext, useEffect, useRef, useState} from 'react';
import img from "../../../img/te.png";
import avatar from "../../../features/message-item/img/avatar.png";
import downArrow from "../../../img/downArrow.svg";
import profile from "../../../img/profile.svg";
import cog from "../../../img/cog.svg";
import logout from "../../../img/logout.svg";
import {useNavigate} from "react-router-dom";
import {getAuth, signOut} from "firebase/auth";
import {AuthContext} from "../../../shared/contextauth/auth";
import {doc, Timestamp, updateDoc} from "firebase/firestore";
import {db} from "../../../shared/api/firebase";
import './style.sass'

const Profile = ({data}) => {

  const navigate = useNavigate()

  const [focus, setFocus] = useState(false)

  const popupRef = useRef(null);
  const labelRef = useRef(null);

  const auth = getAuth()
  const {user} = useContext(AuthContext)

  const openHandler = () => {
    setFocus(!focus)
  }

  const handleClickOutside = (e) => {
    if (focus) {
      if (popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !labelRef.current?.contains(e.target)) {
        setFocus(false)
      }
    }
  }

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
      if (typeof document !== "undefined" && focus) {
        document.addEventListener('click', (e) => {
          handleClickOutside(e);
        })
        return document.removeEventListener('click', (e) => {
          handleClickOutside(e);
        })
      }
    })

  return (
    <>
      <section onClick={() => openHandler()} className='section-profile-container'>
        <section ref={popupRef} className='section-profile'>
          <img className="profile_img" src={auth.currentUser.photoURL ? auth.currentUser.photoURL : avatar} alt="Avatar"/>
          <p className='profile-name'>{data.name}</p>
          <img style={{transform: focus && 'rotate(180deg)'}} className='profile-downArrow' src={downArrow} alt=""/>
        </section>
        {
          focus ? (
            <div ref={labelRef} className='profile-dropMenu'>
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
    </>
  );
};

export default Profile;
