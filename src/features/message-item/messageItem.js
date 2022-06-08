import React, {useEffect, useRef, useState} from 'react';
import './style.css'

import avatar from './img/avatar.png'
import {getAuth} from "firebase/auth";
import Moment from "react-moment";
import Popup from "../popup/popup";
import trash from './img/trash.png'
import {doc, query, deleteDoc, getFirestore} from "firebase/firestore";

const MessageItem = ({keyу, msg, chatImg, user2Avatar, deleteHandler, msgIds}) => {
    const scrollRef = useRef()

    const [open, setOpen] = useState(false)


    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [msg])

    const auth = getAuth()

    const openHandler = () => {
        open ? setOpen(false) : setOpen(true)
    }

    return (
        <>
            {open ? <Popup src={msg.media} text={msg.text} open={setOpen}/> : null}
            <section ref={scrollRef} key={keyу} className={`message-section ${msg.from === auth.currentUser.uid ? 'me' : 'you'}`}>
                <section className='avatar-time'>
                    <img className='message-avatar' src={`${msg.from === auth.currentUser.uid ? (auth.currentUser.photoURL ? auth.currentUser.photoURL : avatar) : (user2Avatar ? user2Avatar : avatar)}`} alt="avatar"/>
                    <span className='message-time'><Moment fromNow>{msg.createdAt.toDate()}</Moment></span>
                </section>
                <section className='message-block'>
                    {msg.media ? <img className='message-media' onClick={() => openHandler()} src={msg.media} alt={msg.text}/> : null}
                    <span className='message-text'>{msg.text}</span>
                </section>
                {msg.from === auth.currentUser.uid ? <img onClick={() => deleteHandler(msgIds, msg.from)} className='trash' src={trash} alt="delete"/> : null}
            </section>
        </>
    );
};

export default MessageItem;
