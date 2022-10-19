import React, {useEffect, useRef, useState} from 'react';
import {getAuth} from "firebase/auth";
import './style.css'
import Popup from "../popup/popup";
import Moment from "react-moment";
import arrowLook from "../../img/arrowLook.png";

const SecondMessageItem = ({keyу, lastMsg, msg, name, chatImg, user2Avatar, deleteHandler, msgIds}) => {

  const scrollRef = useRef()

  const auth = getAuth()

  const [open, setOpen] = useState(false)
  const [showTime, setShowTime] = useState(false)


  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [msg])

  const openHandler = () => {
    open ? setOpen(false) : setOpen(true)
  }
  return (
    <>
      {open ? <Popup src={msg.media} text={msg.text} open={setOpen}/> : null}
      <section ref={scrollRef} key={keyу} className={`message-container-m-f ${msg.from === auth.currentUser.uid ? 'me' : 'you'}`}>
        <section className='message-field'>
        </section>
        <section className='message-second'>
          <section
            onMouseEnter={() => setShowTime(true)}
            onMouseLeave={() => setShowTime(false)}
            className='message-text-container'>
            {
              msg.media ? (
                <img className='message-img' style={msg.text ? (msg.from === auth.currentUser.uid ? {borderRadius: '14px 0 0 0'} : {borderRadius: '0 14px 0 0'}) : null}  onClick={() => openHandler()} src={msg.media} alt="chat"/>
              ) : ''
            }
            {
              msg.text ? (
                <span className='message-text' style={msg.media ? (msg.from === auth.currentUser.uid ? {borderRadius: '0 0 14px 14px'} : {borderRadius: '0 0 14px 14px'}) : null} >{msg.text}</span>
              ) : ''
            }
          </section>
          {
            showTime && (
              <section className='second-data'>
                <Moment fromNow>
                  {msg.createdAt.toDate()}
                </Moment>
              </section>
            )
          }
        </section>
        {
          lastMsg.text === msg.text && lastMsg.unread && (
            <section className='message-notlook'>
              <img src={arrowLook} alt="notLook"/>
            </section>
          )
        }
      </section>
    </>
  );
};

export default SecondMessageItem;
