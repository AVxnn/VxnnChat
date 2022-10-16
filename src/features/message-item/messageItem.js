import React, {useEffect, useRef, useState} from 'react';
import './style.css'

import avatar from './img/avatar.png'
import {getAuth} from "firebase/auth";
import Moment from "react-moment";
import Popup from "../popup/popup";
import dots from '../../img/dots.png'
import {doc, query, deleteDoc, getFirestore} from "firebase/firestore";
import {Link} from "react-router-dom";

const MessageItem = ({keyу, msg, name, chatImg, user2Avatar, deleteHandler, msgIds}) => {
    const scrollRef = useRef()

    const [open, setOpen] = useState(false)

    const auth = getAuth()

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [msg])

    const openHandler = () => {
        open ? setOpen(false) : setOpen(true)
    }
    console.log(msg)
    return (
        <>
            {open ? <Popup src={msg.media} text={msg.text} open={setOpen}/> : null}
            <section ref={scrollRef} key={keyу} className={`message-container-m ${msg.from === auth.currentUser.uid ? 'me' : 'you'}`}>
                <section className='message-first'>
                    <Link to={`/profile/${msg.from !== auth.currentUser.uid ? msg.from : auth.currentUser.uid}`}>
                        <img className='message-avatar' src={`${msg.from === auth.currentUser.uid ? (auth.currentUser.photoURL ? auth.currentUser.photoURL : avatar) : (user2Avatar ? user2Avatar : avatar)}`} alt="avatar"/>
                    </Link>
                </section>
                <section className='message-second'>
                    <section className={`message-second-info ${msg.from === auth.currentUser.uid ? 'mey' : 'youy'}`}>
                        <span className='message-second-name'>{msg.from === auth.currentUser.uid ? auth.currentUser.displayName : name}</span>
                        <span className='message-second-date'><Moment fromNow>{msg.createdAt.toDate()}</Moment></span>
                    </section>
                    <section className='message-text-container'>
                    {
                        msg.media ? (
                            <img className='message-img' style={msg.text ? (msg.from === auth.currentUser.uid ? {borderRadius: '14px 0 0 0'} : {borderRadius: '0 14px 0 0'}) : null} onClick={() => openHandler()} src={msg.media} alt="chat"/>
                        ) : ''
                    }
                    {
                        msg.text ? (
                          <span className='message-text' style={msg.media ? (msg.from === auth.currentUser.uid ? {borderRadius: '14px 0 0 0'} : {borderRadius: '0 14px 0 0'}) : (msg.from === auth.currentUser.uid ? {borderRadius: '14px 0 14px 14px'} : {borderRadius: '0 14px 14px 14px'})}>{msg.text}</span>
                        ) : ''
                    }
                    </section>
                </section>
            </section>
        </>
    );
};

export default MessageItem;
