import React, {useEffect, useState, useContext} from 'react';
import './style.css'
import send from './img/send.png'
import clip from './img/clip.png'
import MessageItem from "../message-item/messageItem";
import {getAuth} from "firebase/auth";
import {collection, doc, onSnapshot, updateDoc} from "firebase/firestore";
import SecondMessageItem from "../secondMessageItem/secondMessageItem";
import logo from "../../img/te.png";
import {Link} from "react-router-dom";
import {db} from "../../shared/api/firebase";
import avatar from "../message-item/img/avatar.png";
import {AuthContext} from "../../shared/contextauth/auth";
import Moment from "react-moment";

const Messenger = ({chat, handleSubmit, deleteHandler, text, setText, setImg, img, msgs, chatImg, msgIds}) => {

    const auth = getAuth()
    const [data, setData] = useState({})

    const {user} = useContext(AuthContext)

    const changeMessage = async (e) => {
        setText(e.currentTarget.value)
        setTimeout(async () => {
            setTimeout(async () => {
                await updateDoc(doc(db, "users", auth.currentUser.uid), {
                    typing: false
                });
            }, 3000)
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                typing: true
            });
        },200)
    }
    useEffect(() => {
        if (user) {
            let unsub = onSnapshot(doc(db, 'users', chat.uid), (doc) => {
                setData(doc.data())
            })
            return () => unsub()
        }
    }, [user, msgIds])

    return (
        <>
            <section className="chat">
                <section className='user-bar'>
                    <section className='user-container'>
                        <section className='user-avatar'>
                            <Link to={`/profile/`}><img className="user-avatar-img" src={chat.avatar ? chat.avatar : logo} alt="avatar"/></Link>
                            <span className={`user-avatar-icon ${chat.isOnline ? 'online' : 'offline'}`}></span>
                        </section>
                        <section className='user-info'>
                            <span className='user-name'>{chat.name}</span>
                            {
                                data.lastOnline ? <span className='user-typing'>{data.typing ? (<><section className='user-typing-logo'><div></div><div></div><div></div></section>Typing</>) : chat?.isOnline && chat?.lastOnline ? "online" : (<Moment fromNow>{chat?.lastOnline.toDate()}</Moment>)}</span> : null

                            }
                        </section>
                    </section>
                </section>
                <section className='message-list'>
                    {msgs.length ? msgs.map((msg, i) => {
                        if (i < 1) {
                            return (
                              <MessageItem msgIds={msgIds[i]} deleteHandler={deleteHandler} name={chat.name} msgIds={msgIds[i]} user2Avatar={chat.avatar} chatImg={chatImg} keyу={i} msg={msg}/>
                            )
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
                    <input onChange={e => changeMessage(e)} className='text-form' type="text" value={text} placeholder='Type a message'/>
                    <button onClick={(e) => handleSubmit(e, text)} className='btn send-btn'>
                        <img src={send} alt="send message"/>
                    </button>
                </section>
            </section>
        </>
    );
};

export default Messenger;
