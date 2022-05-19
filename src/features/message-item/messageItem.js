import React from 'react';
import './style.css'

import avatar from './img/avatar.png'

const MessageItem = ({message}) => {
    return (
        <>
            <section className={`message-section ${message}`}>
                <section className='avatar-time'>
                    <img className='message-avatar' src={avatar} alt="avatar"/>
                    <span className='message-time'>12:12</span>
                </section>
                <span className='message-text'>Hi there, how are you?</span>
            </section>
        </>
    );
};

export default MessageItem;
