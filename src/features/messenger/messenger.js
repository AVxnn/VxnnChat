import React, {useEffect, useState, useContext} from 'react';
import './style.sass'
import send from './img/send.png'
import MessageItem from "../message-item/messageItem";
import {getAuth} from "firebase/auth";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import SecondMessageItem from "../secondMessageItem/secondMessageItem";
import logo from "../../img/te.png";
import addImage from "../../img/addImage.png";
import arrow from "../../img/arrow-right.png";
import pin from "../../img/pin.png";
import smile from "../../img/smile.png";
import {Link} from "react-router-dom";
import {db} from "../../shared/api/firebase";
import avatar from "../message-item/img/avatar.png";
import {AuthContext} from "../../shared/contextauth/auth";
import Moment from "react-moment";
import EmojiPicker from 'emoji-picker-react';
import img from "../../img/te.png";
import settings from "../../img/cog.png";


const Messenger = ({chat, handleSubmit, width = false, deleteHandler, localUser, text, setText, setImg, img, msgs, chatImg, msgIds}) => {

    const auth = getAuth()
    const [data, setData] = useState({})
    const [pickerOpen, setPickerOpen] = useState(false)
    const [pinned, setPinned] = useState(false)
    const [lastMsg, setLastMsg] = useState()
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [imgMessenger, setImgMessenger] = useState()

    const {user} = useContext(AuthContext)

    const changeImg = (e) => {
        setImg(e)
        var fileReader = new FileReader();
        fileReader.onload = function() {
            let res = fileReader.result;
            setImgMessenger(res)
        }

        fileReader.readAsDataURL(e);
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            console.log('enter press here!')
            handleSubmit('', text)
        }
    }

    const pinnedMessage = async (e, type) => {
        let result = localUser.friends.filter((i) => i.uid !== e.uid)
        if (type === 'pinned') {
            console.log('1')
            await updateDoc(doc(db, "users", user.uid), {
                friends : [
                    ...result,
                    {uid: e.uid, avatar: e.avatar ? e.avatar : avatar, name: e.name ? e.name : 'anonymous', pinned: true}
                ]
            });
            setPinned(false)
        } else {
            console.log('2')
            await updateDoc(doc(db, "users", user.uid), {
                friends : [
                    ...result,
                    {uid: e.uid, avatar: e.avatar ? e.avatar : avatar, name: e.name ? e.name : 'anonymous', pinned: false}
                ]
            });
            setPinned(true)
        }
        setSettingsOpen(false)
    }

    const linkHandler = () => {

    }

    const changeMessage = async (e, type) => {
        if (type === 'text') {
            setText(e)
        } else {
            setText(text + e)
        }
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
        localUser?.friends.map((i) => {
            if (i.uid === data.uid && i.pinned === false) {
                setPinned(false)
            } else {
                setPinned(true)
            }
        })
    }, [localUser])

    useEffect(() => {
        if (user) {
            let unsub = onSnapshot(doc(db, 'users', chat.uid), (doc) => {
                setData(doc.data())
            })
            return () => unsub()
        }
    }, [user, msgIds])

    useEffect(() => {
        const id = user.uid > data.uid ? `${user.uid + data.uid}` : `${data.uid + user.uid}`
        if (user) {
            let unsub = onSnapshot(doc(db, 'lastMsg', id), (doc) => {
                setLastMsg(doc.data()?.from ? doc.data() : '')
            })
            return () => unsub()
        }
    }, [user, data])

    return (
        <>
            <section className="chat">
                <section className='user-bar'>
                    <section className='user-container'>
                        {
                          !width && (
                            <img onClick={() => linkHandler()} className='user-bar-arrow' src={arrow}/>
                          )
                        }
                        <section className='user-avatar'>
                            <Link to={`/profile/${chat.uid}`}><img className="user-avatar-img" src={chat.avatar ? chat.avatar : logo} alt="avatar"/></Link>
                            <span className={`user-avatar-icon ${chat.isOnline ? 'online' : 'offline'}`}></span>
                        </section>
                        <section className='user-info'>
                            <span className='user-name'>{chat.name}</span>
                            {
                                data.lastOnline ? <span className='user-typing'>{data.typing ? (<><section className='user-typing-logo'><div></div><div></div><div></div></section>Typing</>) : chat?.isOnline && chat?.lastOnline ? "online" : (<Moment fromNow>{chat?.lastOnline.toDate()}</Moment>)}</span> : null
                            }
                        </section>
                    </section>
                    <section className='user-right'>
                        <section onClick={() => setSettingsOpen(!settingsOpen)} className="user-item settings-y">
                            <img className="user-item_img" src={settings} alt="user"/>
                        </section>
                        {
                            settingsOpen && (
                            <section className='item-list-p'>
                                {
                                    pinned ? (
                                    <section onClick={() => pinnedMessage(data, 'pinned')} className="user-item">
                                        <img className="user-item_img-pin" src={pin} alt="pinned"/>
                                    </section>
                                    ) : (
                                      <section onClick={() => pinnedMessage(data, 'unpinned')} className="user-item">
                                          <img className="user-item_img-pin" src={pin} alt="pinned"/>
                                      </section>
                                    )
                                }
                            </section>
                            )
                        }
                    </section>
                </section>
                <section className='message-list'>
                    {msgs.length ? msgs.map((msg, i) => {
                        if (i < 1) {
                            return (
                              <MessageItem lastMsg={lastMsg} msgIds={msgIds[i]} deleteHandler={deleteHandler} name={chat.name} chat={chat} user2Avatar={chat.avatar} chatImg={chatImg} keyу={i} msg={msg}/>
                            )
                        } else {
                            if (msg.from === msgs[i - 1].from) {
                                return (
                                  <SecondMessageItem lastMsg={lastMsg} msgIds={msgIds[i]} deleteHandler={deleteHandler} name={chat.name} chat={chat} user2Avatar={chat.avatar} chatImg={chatImg} keyу={i} msg={msg}/>
                                )
                            } else {
                                return (
                                  <MessageItem lastMsg={lastMsg} msgIds={msgIds[i]} deleteHandler={deleteHandler} name={chat.name} chat={chat} user2Avatar={chat.avatar} chatImg={chatImg} keyу={i} msg={msg}/>
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
                    <input onChange={(e) => changeImg(e.target.files[0])} id='field__file-2' className='btn file-btn' type='file'/>
                    <section className='send-avatar'>
                        <img src={user.photoURL} alt=""/>
                    </section>
                    <input onKeyPress={(e) => handleKeyPress(e)} onClick={() => setPickerOpen(false)} onChange={e => changeMessage(e.currentTarget.value, 'text')} className='text-form' type="text" value={text} placeholder='Type a message'/>
                    {imgMessenger && <img className='field_img' src={imgMessenger} alt="imgMessenger"/>}
                    <label className="field__file" htmlFor="field__file-2">
                        <img src={addImage} className={`field__file-img ${img ? 'apply' : ''}`} alt="clip"/>
                    </label>
                    <button onClick={() => setPickerOpen(!pickerOpen)} className='btn emoji'>
                        <img src={smile} alt="smile"/>
                    </button>
                    {pickerOpen && (
                        <section className='smile-picker'>
                            <EmojiPicker onEmojiClick={(e) => changeMessage(e.emoji, 'emoji')} />
                        </section>
                    )}
                    <button onClick={(e) => handleSubmit(e, text)} className='btn send-btn'>
                        <img src={send} alt="send message"/>
                    </button>
                </section>
            </section>
        </>
    );
};

export default Messenger;
