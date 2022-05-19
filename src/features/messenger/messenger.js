import React from 'react';
import './style.css'
import send from './img/send.png'
import clip from './img/clip.png'
import MessageItem from "../message-item/messageItem";

const data = [
    {message: 'me', id: '1'},
    {message: 'you', id: '2'},
    {message: 'me', id: '3'},
    {message: 'you', id: '4'},
]

const Messenger = () => {
    return (
        <>
            <section className="chat">
                <section className='message-list'>
                    {
                        data.map(e => {
                            return (
                                <MessageItem message={e.message} key={e.id}/>
                            )
                        })
                    }
                </section>
                <section className='send-bar'>
                    <input id='field__file-2' className='btn file-btn' type='file'/>
                    <label className="field__file" htmlFor="field__file-2">
                        <img src={clip} className='field__file-img' alt="clip"/>
                    </label>
                    <input className='text-form' type="text" placeholder='Type a message'/>
                    <button className='btn send-btn'>
                        <img src={send} alt="send message"/>
                    </button>
                </section>
            </section>
        </>
    );
};

export default Messenger;
