import React from 'react';
import Header from "../../widgets/header/header";
import './style.css'

import ItemChat from "../../shared/item-chat/itemChat";
import Messenger from "../../features/messenger/messenger";
import {useState} from "react";

const Chat = () => {

    const data = [
        {id: '1', title: 'Alex Blender', msg: 'Hi there, How are you?', avatar: '', time: '12:36'},
        {id: '2', title: 'Alex Blender', msg: 'Hi there, How are you?', avatar: '', time: '12:36'},
        {id: '3', title: 'Alex Blender', msg: 'Hi there, How are you?', avatar: '', time: '12:36'},
    ]

    return (
        <>
            <main className="background">
                <Header />
                <section className="section-chat">
                    <section className="members">
                        {
                            data.map(e => {
                                return <ItemChat key={e.id} id={e.id} title={e.title} msg={e.msg} avatar={e.avatar} time={e.time}/>
                            })
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
