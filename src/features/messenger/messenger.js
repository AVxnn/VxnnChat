import React from 'react';
import './style.css'
import send from './img/send.png'
import clip from './img/clip.png'

const Messenger = () => {
    return (
        <>
            <section className="chat">
                <section className='message-list'>

                </section>
                <section className='send-bar'>
                    <button className='btn file-btn'>
                        <img src={clip} alt="send message"/>
                    </button>
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
