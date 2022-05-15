import React from 'react';
import logo from "../../img/te.png";
import './style.css'
import {useState} from "react";

const ChatItem = ({title, msg, avatar, time, id}) => {

    const [currentActive, setCurrentActive] = useState(null)

    let change = (e) => {
        document.querySelectorAll('.member-item').
            document.getElementById(currentActive).classList.remove('active')

        setCurrentActive(e)
        document.getElementById(e).classList.add('active')
        console.log(e)
    }

    return (
        <>
            <section onClick={e => change(e.currentTarget.id)} id={id} className={`member-item`} >
                <img className="member_avatar" src={avatar ? avatar : logo} alt="avatar"/>
                <section className="member-content">
                    <section className="member_section">
                        <h4 className="member_name">{title}</h4>
                        <span className="member_time">{time}</span>
                    </section>
                    <p className="member_description">{msg}</p>
                </section>
            </section>
        </>
    );
};

export default ChatItem;
