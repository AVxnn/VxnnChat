import React, {useContext, useEffect, useRef, useState} from 'react';
import img from "../../../img/te.png";
import menu from "../../../img/menu.svg";
import './style.sass'
import todo from "../../../img/todo.svg";
import taskman from "../../../img/taskman.svg";
import {Link, useNavigate} from "react-router-dom";
import {getAuth} from "firebase/auth";
import {AuthContext} from "../../../shared/contextauth/auth";

const Menu = () => {

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
      <section ref={labelRef} onClick={() => openHandler()} className='profile-menu-container'>
        <img className='profile-menu' src={menu} alt="bell"/>
        { focus ? (
          <section ref={popupRef} className={`profile-menu-list`}>
            <section style={{backgroundColor: '#E00086'}} onClick={() => navigate(`/todo`)} className={`profile-menu-list-item`}>
              <img className={'profile-menu-list-item_img'} src={todo} alt=""/>
            </section>
            <a href={`https://vxnntaskman.vercel.app/`} style={{backgroundColor: '#9685FF'}} target='_blank' className={`profile-menu-list-item`}>
              <img className={'profile-menu-list-item_img'} src={taskman} alt=""/>
            </a>
            <section style={{backgroundColor: '#1C1E21'}} onClick={() => navigate(`/todo`)} className={`profile-menu-list-item`}>
            </section>
            <section style={{backgroundColor: '#1C1E21'}} onClick={() => navigate(`/todo`)} className={`profile-menu-list-item`}>
            </section>
          </section>
        ) : null
        }
      </section>
    </>
  );
};

export default Menu;
