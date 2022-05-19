import React from 'react';
import logo from "../../img/te.png";
import './style.css'

const ChatItem = ({title, msg, avatar, time, id, active, addedName, isOnline}) => {

    return (
        <>
            <section onClick={active} id={id} className={`member-item ${addedName}`} >
                <img className="member_avatar online" src={avatar ? avatar : logo} alt="avatar"/>
                <section className="member-content">
                    <section className="member_section">
                        <h4 className="member_name">{title}</h4>
                        <span className={`member_time ${isOnline ? 'online' : 'offline'}`}></span>
                    </section>
                    <p className="member_description">{msg}</p>
                </section>
            </section>
        </>
    );
};

export default ChatItem;
