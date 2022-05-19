import React, {useEffect} from 'react';
import Header from "../../widgets/header/header";
import './style.css'

import ItemMessage from "../../shared/item-message/itemMessage";
import Messenger from "../../features/messenger/messenger";
import {useState} from "react";
import { collection, onSnapshot, getFirestore, query } from "firebase/firestore";

const data = [
    {id: '1', title: 'Mike Jones', msg: 'Goodbye!', avatar: '', time: '23:51'},
    {id: '2', title: 'Alex Blender', msg: 'Hi there, How are you?', avatar: '', time: '15:36'},
    {id: '3', title: 'Frank', msg: 'Hello, bro', avatar: '', time: '12:41'},
]

const Chat = () => {

    const [activeTab, setActiveTab] = useState('')
    let clickEventHandler = (id) => { setActiveTab(id) }
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const db = getFirestore()

    onSnapshot(query(collection(db, "users")), (querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
            cities.push(doc.data());
        });
        setData(cities)
        setLoading(true)
    });

    return (
        <>
            <main className="background">
                <Header />
                <section className="section-chat">
                    <section className="members">
                        {
                            loading ? data.map(e => {
                                return <ItemMessage active={() => clickEventHandler(e.uid)}
                                                    key={e.uid}
                                                    id={e.uid}
                                                    title={e.name}
                                                    msg={e.msg}
                                                    avatar={e.avatar}
                                                    time={e.time}
                                                    addedName={activeTab === e.uid ? "active" : ''}
                                                    isOnline={e.isOnline} />
                            }) : null
                        }
                    </section>
                    <Messenger />
                    <section className="block">

                    </section>
                </section>
            </main>
        </>
    );
};

export default Chat;
