import React, {useContext, useEffect, useRef, useState} from 'react';
import img from "../../../img/te.png";
import bell from "../../../img/bell.svg";
import FriendNotification from "../../notification/friend/friendNotification";
import {useNavigate} from "react-router-dom";
import {getAuth, signOut} from "firebase/auth";
import {AuthContext} from "../../../shared/contextauth/auth";
import './style.sass'

const Notification = ({data}) => {

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
      <section onClick={() => openHandler()} className='profile-bell-container'>
        <div ref={labelRef}>
          <img className='profile-bell' src={bell} alt="bell"/>
          {
            data.notifications && data.notifications.length >= 1 ? (
              <div className='profile-bell-span'>{data.notifications.length}</div>
            ) : ''
          }
          { focus && data.notifications.length > 0 ? (
            <section ref={popupRef} className={`profile-bell-list ${data.notifications.length > 0 ? '' : 'empty'}`}>
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
    </>
  );
};

export default Notification;
