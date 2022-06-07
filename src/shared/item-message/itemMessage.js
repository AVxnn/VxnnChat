import React, {useEffect, useState} from 'react';
import logo from "../../img/te.png";
import './style.css'
import {onSnapshot, doc, getFirestore} from "firebase/firestore";
import Moment from "react-moment";

const ChatItem = ({user, user1, active, addedName, selectUser, chat}) => {

    const db = getFirestore();
    const user2 = user?.uid
    const [data, setData] = useState('')

    useEffect(() => {
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
        let unsub = onSnapshot(doc(db, 'lastMsg', id), (doc) => {
            setData(doc.data())
        })
        return () => unsub();
    }, [])

    return (
        <>
            <section onClick={() => {
                        selectUser(user)
                        active(user.id)
                     }}
                     id={user.id}
                     className={`member-item ${addedName}`} >
                <section className='member-avatar-info'>
                    <img className="member_avatar online" src={user.avatar ? user.avatar : logo} alt="avatar"/>
                    <span className={`member_active ${user.isOnline ? 'online' : 'offline'}`}></span>
                </section>
                <section className="member-content">
                    <section className="member_section">
                        <h4 className="member_name">{user.name}</h4>
                        {data ? (
                            <span className="member_time"><Moment format="H:mm">{data.createdAt.toDate()}</Moment></span>
                        ) : <h2 style={{color: '#FFFFFF'}}></h2> }
                    </section>
                    <section className='member-new-info'>
                        {data ? (
                            <>
                                <p className="member_description">{data.from == user1 ? '' : 'he: '}{data.text}</p>
                                {data?.from !== user1 && data?.unread ? <span className='member-new-msg'>1</span> : null}
                            </>
                        ) : <p style={{color: '#FFFFFF'}}> </p> }
                    </section>
                </section>
            </section>
        </>
    );
};

export default ChatItem;
