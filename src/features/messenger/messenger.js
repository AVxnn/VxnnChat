import React, {useEffect} from 'react';
import './style.css'
import send from './img/send.png'
import clip from './img/clip.png'
import MessageItem from "../message-item/messageItem";
import {getAuth} from "firebase/auth";
import {collection} from "firebase/firestore";
import SecondMessageItem from "../secondMessageItem/secondMessageItem";
import logo from "../../img/te.png";
import {Link} from "react-router-dom";

const Messenger = ({chat, handleSubmit, deleteHandler, text, setText, setImg, img, msgs, chatImg, msgIds}) => {

    useEffect(() => {
        console.log(img)
    }, [img])

    return (
        <>
            <section className="chat">
                <section className='user-bar'>
                    <section className='user-avatar'>
                        <Link to={`/profile/`}><img className="user-avatar-img" src={chat.avatar ? chat.avatar : logo} alt="avatar"/></Link>
                        <span className={`user-avatar-icon ${chat.isOnline ? 'online' : 'offline'}`}></span>
                    </section>
                </section>
                <section className='message-list'>
                    {msgs.length ? msgs.map((msg, i) => {
                        if (i < 1) {
                            console.log('true')
                        } else {
                            if (msg.from === msgs[i - 1].from) {
                                return (
                                  <SecondMessageItem msgIds={msgIds[i]} deleteHandler={deleteHandler} name={chat.name} msgIds={msgIds[i]} user2Avatar={chat.avatar} chatImg={chatImg} keyу={i} msg={msg}/>
                                )
                            } else {
                                return (
                                  <MessageItem msgIds={msgIds[i]} deleteHandler={deleteHandler} name={chat.name} msgIds={msgIds[i]} user2Avatar={chat.avatar} chatImg={chatImg} keyу={i} msg={msg}/>
                                )
                            }
                        }

                      })
                        :
                        <section className='message-container'>
                            <h1 className='message-title'>Write a message to start chatting</h1>
                        </section>
                    }
                </section>
                <section className='send-bar'>
                    <input onChange={(e) => setImg(e.target.files[0])} id='field__file-2' className='btn file-btn' type='file'/>
                    <label className="field__file" htmlFor="field__file-2">
                        <img src={clip} className={`field__file-img ${img ? 'apply' : ''}`} alt="clip"/>
                    </label>
                    <input onChange={e => setText(e.currentTarget.value)} className='text-form' type="text" value={text} placeholder='Type a message'/>
                    <button onClick={(e) => handleSubmit(e, text)} className='btn send-btn'>
                        <img src={send} alt="send message"/>
                    </button>
                </section>
            </section>
        </>
    );
};

export default Messenger;
