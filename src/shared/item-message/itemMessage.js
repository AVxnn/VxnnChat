import React from 'react';
import logo from "../../img/te.png";
import './style.css'

const ChatItem = ({user, active, addedName, selectUser}) => {

    return (
        <>
            <section onClick={() => {
                selectUser(user)
                active(user.id)
            }} id={user.id} className={`member-item ${addedName}`} >
                <img className="member_avatar online" src={user.avatar ? user.avatar : logo} alt="avatar"/>
                <section className="member-content">
                    <section className="member_section">
                        <h4 className="member_name">{user.name}</h4>
                        <span className={`member_time ${user.isOnline ? 'online' : 'offline'}`}></span>
                    </section>
                    <p className="member_description">{user.msg}</p>
                </section>
            </section>
        </>
    );
};

export default ChatItem;
