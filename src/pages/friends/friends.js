import React, { useState, useEffect } from 'react';
import Header from "../../widgets/header/header";
import './style.css'

import dots from '../../img/dotsb.png'
import pen from '../../img/pencil.png'
import chat from '../../img/chat.png'
import avatar from '../../features/message-item/img/avatar.png'
import {getAuth} from "firebase/auth";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../shared/api/firebase";

const Friends = () => {

  const [data, setData] = useState([])

  const auth = getAuth()

  const user = auth.currentUser

  useEffect(() => {
    if (user) {
      let unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        setData(doc.data().friends)
        console.log(doc.data().friends)
      })
      return () => unsub()
    }
  }, [])

  return (
    <>
      <main className="background">
        <Header />
        <section className="section-friends">
          <section className='friends-top'>
            <section className='friends-top-left'>
              <h2 className='friends-top-title'>Friends</h2>
              <span className='friends-top-subtitle'>({data?.length})</span>
            </section>
            <button className='friends-top-btn'><img className='friends-top-btn-img' src={pen} alt="pen"/>Add friend</button>
          </section>
          <section className='friends-list'>
            {
              data?.length > 1 && data.map(i => {
                return (
                  <section className='friends-item'>
                    <section className='friends-info'>
                      <img className='friends-img' src={i.avatar ? i.avatar : avatar} alt="avatar"/>
                      <span className='friends-name'>{i.name ? i.name : 'anonymous'}</span>
                    </section>
                    <section className='friends-list-btn'>
                      <button className='friends-btn'><img className='friends-btn-img' src={chat} alt="chat"/>Send Message</button>
                      <button className='friends-btn-dots'><img className='friends-btn-img' src={dots} alt="dots"/></button>
                    </section>
                  </section>
                )
              })
            }
          </section>
        </section>
      </main>
    </>
  );
};

export default Friends;
