import React, {useEffect, useRef, useState} from 'react';
import './style.sass'

import avatar from './img/avatar.png'
import arrowLook from '../../img/arrowLook.png'
import {getAuth} from "firebase/auth";
import Moment from "react-moment";
import Popup from "../popup/popup";
import {Link} from "react-router-dom";
import trash from "../../img/trash.png";
import {deleteDoc, doc} from "firebase/firestore";
import {db} from "../../shared/api/firebase";

const MessageItem = ({keyу, lastMsg, chat, msg, name, user2Avatar}) => {
    const scrollRef = useRef()

    const [open, setOpen] = useState(false)

    const [isDelete, setIsDelete] = useState(false)

    const auth = getAuth()

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'auto'})
    }, [msg])

    const user2 = auth.currentUser.uid
    const user1 = chat.uid

    const deleteHandler = async (item) => {
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
        await deleteDoc(doc(db, 'messages', id, `chat`, item.tid))
    }

    const openHandler = () => {
        open ? setOpen(false) : setOpen(true)
    }

    return (
        <>
            {open ? <Popup src={msg.media} text={msg.text} open={setOpen}/> : null}
            <section
              ref={scrollRef}
              onMouseEnter={() => setIsDelete(true)}
              onMouseLeave={() => setIsDelete(false)}
              key={keyу}
              className={`message-container-m ${msg.from === auth.currentUser.uid ? 'me' : 'you'}`}>
                <section
                  className='message-first'>
                    <Link
                      to={`/profile/${msg.from !== auth.currentUser.uid ? msg.from : auth.currentUser.uid}`}>
                        <img
                          className='message-avatar'
                          src={`${msg.from === auth.currentUser.uid ? (auth.currentUser.photoURL ? auth.currentUser.photoURL : avatar) : (user2Avatar ? user2Avatar : avatar)}`}
                          alt="avatar"/>
                    </Link>
                </section>
                <section
                  className='message-second'>
                    <section
                      className={`message-second-info ${msg.from === auth.currentUser.uid ? 'mey' : 'youy'}`}>
                        <span
                          className='message-second-name'>{msg.from === auth.currentUser.uid ? auth.currentUser.displayName : name}</span>
                        <span
                          className='message-second-date'>
                            <Moment fromNow>
                                {msg.createdAt.toDate()}
                            </Moment>
                        </span>
                    </section>
                    <section
                      className='message-text-container'>
                    {
                        msg.media ? (
                            <img
                              className='message-img'
                              style={msg.text ? (msg.from === auth.currentUser.uid ? {borderRadius: '14px 0 0 0'} : {borderRadius: '0 14px 0 0'}) : null}
                              onClick={() => openHandler()}
                              src={msg.media}
                              alt="chat"/>
                        ) : ''
                    }
                    {
                        msg.text ? (
                          <span
                            className='message-text'
                            style={msg.media ? (msg.from === auth.currentUser.uid ? {borderRadius: '14px 0 0 0'} : {borderRadius: '0 14px 0 0'}) : (msg.from === auth.currentUser.uid ? {borderRadius: '14px 0 14px 14px'} : {borderRadius: '0 14px 14px 14px'})}>
                              {msg.text}
                          </span>
                        ) : ''
                    }
                    </section>
                </section>
                {
                  isDelete && (
                    <button onClick={() => deleteHandler(msg)} className='second-delete'>
                        <img className='second-delete-img' src={trash} alt="trash"/>
                    </button>
                  )
                }
                {
                    lastMsg === msg.text && (
                        <section className='message-notlook'>
                            <img src={arrowLook} alt="notLook"/>
                        </section>
                    )
                }

            </section>
        </>
    );
};

export default MessageItem;
