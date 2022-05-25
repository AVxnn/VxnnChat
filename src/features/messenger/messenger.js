import React, {useEffect} from 'react';
import './style.css'
import send from './img/send.png'
import clip from './img/clip.png'
import MessageItem from "../message-item/messageItem";
import {getAuth} from "firebase/auth";
import {collection} from "firebase/firestore";

const Messenger = ({chat, handleSubmit, text, setText, setImg, img, msgs, chatImg}) => {

    useEffect(() => {
        console.log(img)
    }, [img])

    return (
        <>
            <section className="chat">
                <section className='message-list'>
                    {msgs.length ? msgs.map((msg, i) =>
                        <MessageItem chatImg={chatImg} keyу={i} msg={msg}/>) : null
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
