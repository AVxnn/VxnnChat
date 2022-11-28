import React, { useState, useEffect } from 'react';
import './style.sass'

import dots from '../../img/dotsb.png'
import pen from '../../img/pencil.png'
import chat from '../../img/chat.png'
import avatar from '../../features/message-item/img/avatar.png'
import {getAuth} from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query
} from "firebase/firestore";
import {db} from "../../shared/api/firebase";
import {useNavigate, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";

const Friends = () => {

  const params = useParams()
  const navigate = useNavigate()
  console.log(params)
  const [data, setData] = useState()
  const [users, setUsers] = useState([])

  const auth = getAuth()

  const user = auth.currentUser

  useEffect(() => {
    if (user && params.uid) {
      let unsub = onSnapshot(doc(db, 'users', params.uid), (doc) => {
        setData(doc.data())
        console.log(doc.data())
      })
      return () => unsub()
    }
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "users")), (querySnapshot) => {
      const res = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        data && data?.friends.map((i)  => {
          console.log(i.uid === doc.data().uid, i.uid, doc.data().uid)
          if (i.uid === doc.data().uid) {
            res.push(doc.data());
          }
        })
      });
      setUsers(res)
    });
    return () => unsub()
  }, [data])
  console.log(data)
  return (
    <>
      <Helmet>
        <title>{`PetChat - Friends`}</title>
      </Helmet>
      <main className="background">
        <section className="section-friends">
          <section className='friends-top'>
            <section className='friends-top-left'>
              <h2 className='friends-top-title'>Friends</h2>
              <span className='friends-top-subtitle'>({users?.length})</span>
            </section>
            <button className='friends-top-btn'><img className='friends-top-btn-img' src={pen} alt="pen"/>Add friend</button>
          </section>
          <section className='friends-list'>
            {
              users.length > 1 && users.map((i, index) => {
                return (
                  <section key={index} className='friends-item'>
                    <section className='friends-info'>
                      <img onClick={() => navigate(`/profile/${i.uid}`)} className='friends-img' src={i.avatar ? i.avatar : avatar} alt="avatar"/>
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
