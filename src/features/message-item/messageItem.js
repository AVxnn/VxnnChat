import React, {useEffect, useRef} from 'react';
import './style.css'

import avatar from './img/avatar.png'
import {getAuth} from "firebase/auth";
import Moment from "react-moment";

const MessageItem = ({key, msg}) => {
    const scrollRef = useRef()

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [msg])

    const auth = getAuth()
    return (
        <>
            <section ref={scrollRef} key={key} className={`message-section ${msg.from === auth.currentUser.uid ? 'me' : 'you'}`}>
                <section className='avatar-time'>
                    <img className='message-avatar' src={avatar} alt="avatar"/>
                    <span className='message-time'><Moment fromNow>{msg.createdAt.toDate()}</Moment></span>
                </section>
                <section className='message-block'>
                    {msg.media ? <img className='message-media' src={msg.media} alt={msg.text}/> : null}
                    <span className='message-text'>{msg.text}</span>
                </section>
            </section>
        </>
    );
};

export default MessageItem;