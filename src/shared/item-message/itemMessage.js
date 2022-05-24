import React, {useEffect, useState} from 'react';
import logo from "../../img/te.png";
import './style.css'
import {onSnapshot, doc, getFirestore} from "firebase/firestore";

const ChatItem = ({user, user1, active, addedName, selectUser, chat}) => {

    const db = getFirestore();
    const user2 = user?.uid
    const [data, setData] = useState('')

    useEffect(() => {
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
        let unsub = onSnapshot(doc(db, 'lastMsg', id), (doc) => {
            console.log(doc.data())
            setData(doc.data())
        })
        return () => unsub();
    }, [])
    console.log(data)
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
                    <span className={`member_time ${user.isOnline ? 'online' : 'offline'}`}></span>
                </section>
                <section className="member-content">
                    <section className="member_section">
                        <h4 className="member_name">{user.name}</h4>
                    </section>
                    <section className='member-new-info'>
                        {data && (
                            <>
                                <p className="member_description">{data.from == user1 ? '' : 'he: '}{data.text}</p>
                                {data?.from !== user1 && data?.unread ? <span className='member-new-msg'>1</span> : null}
                            </>
                        )
                        }
                    </section>
                </section>
            </section>
        </>
    );
};

export default ChatItem;
