import React, {useEffect, useRef, useState} from 'react';
import {getAuth} from "firebase/auth";
import './style.sass'
import Popup from "../popup/popup";
import Moment from "react-moment";
import arrowLook from "../../img/arrowLook.png";
import trash from "../../img/trash.png";
import {deleteDoc, doc} from "firebase/firestore";
import {db} from "../../shared/api/firebase";

const SecondMessageItem = ({keyу, lastMsg, msg, name, chat, chatImg, user2Avatar, msgIds}) => {

  const scrollRef = useRef()
  console.log(msg)
  const auth = getAuth()

  const [open, setOpen] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const user2 = auth.currentUser.uid
  const user1 = chat.uid

  const deleteHandler = async (item) => {
    console.log(item)
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
    await deleteDoc(doc(db, 'messages', id, `chat`, item.tid))
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [msg])

  const openHandler = () => {
    open ? setOpen(false) : setOpen(true)
  }

  return msg && (
    <>
      {open ? <Popup src={msg.media} text={msg.text} open={setOpen}/> : null}
      <section onMouseEnter={() => setIsDelete(true)}
               onMouseLeave={() => setIsDelete(false)}
               ref={scrollRef}
               key={keyу}
               className={`message-container-m-f ${msg.from === auth.currentUser.uid ? 'me' : 'you'}`}>
        <section className='message-field'>
        </section>
        <section className='message-second'>
          <section
            onMouseEnter={() => setShowTime(true)}
            onMouseLeave={() => setShowTime(false)}
            className='message-text-container'>
            {
              msg?.media ? (
                <img className='message-img' style={msg?.text ? (msg.from === auth.currentUser.uid ? {borderRadius: '14px 0 0 0'} : {borderRadius: '0 14px 0 0'}) : null}  onClick={() => openHandler()} src={msg.media} alt="chat"/>
              ) : ''
            }
            {
              msg?.text ? (
                <span className='message-text' style={msg.media ? (msg.from === auth.currentUser.uid ? {borderRadius: '0 0 14px 14px'} : {borderRadius: '0 0 14px 14px'}) : null} >{msg.text ? msg.text : ''}</span>
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

      </section>
    </>
  );
};

export default SecondMessageItem;
