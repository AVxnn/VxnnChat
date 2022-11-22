import React, {useEffect, useState} from 'react';
import logo from "../../img/te.png";
import admin from "../../img/admin.png";
import './style.css'
import {onSnapshot, doc, getFirestore} from "firebase/firestore";
import Moment from "react-moment";
import {Link} from "react-router-dom";
import {db} from "../api/firebase";
import {Helmet} from "react-helmet";

const ChatItem = ({user, user1, active, addedName, selectUser, chat}) => {

    const db = getFirestore();
    const user2 = user?.uid
    const [data, setData] = useState('')
    const [typing, setTyping] = useState(false)
    const [intervalTime, setIntervalTime] = useState(false)

    useEffect(() => {
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
        let unsub = onSnapshot(doc(db, 'lastMsg', id), (doc) => {
            setData(doc.data())
        })
        return () => unsub();
    }, [])

    useEffect(() => {
        // if (user) {
        //     let unsub = onSnapshot(doc(db, 'users', chat.uid), (doc) => {
        //         setTyping(doc.data().typing)
        //     })
        //     return () => unsub()
        // }
    }, [user])

    useEffect(() => {
        setInterval(() => {
            setIntervalTime(!intervalTime)
        }, 1000)
        return () => {
            clearInterval(() => {
                setIntervalTime(!intervalTime)
            }, 1000)
        }
    })

    return (
        <>
            <Helmet>
                <title>{`${intervalTime && data?.unread ? '🥵 NeW mEsSaGe 🥵' : 'PetChat - Chat '}`}</title>
            </Helmet>
            <section onClick={() => {
                        selectUser(user)
                        active(user.id)
                     }}
                     id={user.id}
                     className={`member-item ${addedName}`} >
                <section className='member-avatar-info'>
                    <img className="member_avatar" src={user.avatar ? user.avatar : logo} alt="avatar"/>
                    <span className={`member_active ${user.isOnline ? 'online' : 'offline'}`}></span>
                </section>
                <section className="member-content">
                    <section className="member_section">
                        <h4 className="member_name">{user.name}{user.isAdmin ? <img src={admin} className='member_admin' alt='Админ'></img> : null}</h4>
                        {data ? (
                            <span className="member_time"><Moment format="H:mm">{data.createdAt.toDate()}</Moment></span>
                        ) : <h2 style={{color: '#FFFFFF'}}></h2> }
                    </section>
                    <section className='member-new-info'>
                        {data ? (
                            <>
                                <p className="member_description">{data.text}</p>
                                {data?.from !== user1 && data?.unread ? <span className='member-new-msg'>1</span> : null}
                            </>
                        ) : <p style={{color: '#FFFFFF'}}> </p> }
                    </section>
                </section>

            </section>
        </>
    )
};

export default ChatItem;
