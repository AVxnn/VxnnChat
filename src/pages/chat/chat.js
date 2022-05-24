import React, {useEffect} from 'react';
import Header from "../../widgets/header/header";
import './style.css'

import ItemMessage from "../../shared/item-message/itemMessage";
import Messenger from "../../features/messenger/messenger";
import {useState} from "react";
import { storage } from '../../shared/api/firebase'
import {collection, onSnapshot, getFirestore, query, where, addDoc, Timestamp, orderBy} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import {getAuth} from "firebase/auth";

const data = [
    {id: '1', title: 'Mike Jones', msg: 'Goodbye!', avatar: '', time: '23:51'},
    {id: '2', title: 'Alex Blender', msg: 'Hi there, How are you?', avatar: '', time: '15:36'},
    {id: '3', title: 'Frank', msg: 'Hello, bro', avatar: '', time: '12:41'},
]

const Chat = () => {

    const [activeTab, setActiveTab] = useState('')
    let clickEventHandler = (id) => { setActiveTab(id) }
    const [data, setData] = useState([])
    const [chat, setChat] = useState('')
    const [img, setImg] = useState('')
    const [msgs, setMsgs] = useState([])
    const [text, setText] = useState('')
    const auth = getAuth()

    const db = getFirestore()

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "users"), where('uid', 'not-in', [auth.currentUser.uid])), (querySnapshot) => {
            const cities = [];
            querySnapshot.forEach((doc) => {
                cities.push(doc.data());
            });
            setData(cities)
        });
        return () => unsub()
    }, [])


    const selectUser = (user) => {
        setChat(user)
        console.log(user)

        const user2 = user.uid
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

        const msgsRef = collection(db, 'messages', id, 'chat')
        const q = query(msgsRef, orderBy('createdAt', 'asc'))

        onSnapshot(q, querySnapshot => {
            let msgs = []
            querySnapshot.forEach(snapshot => {
                msgs.push(snapshot.data())
            })
            setMsgs(msgs)
        })
    }

    console.log(msgs)

    const user1 = auth.currentUser.uid

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user2 = chat.uid

        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

        let url
        if (img) {
            const imgRef = ref(
                storage,
                `images/${new Date().getTime()} - ${img.name}`
            )
            const snap = await uploadBytes(imgRef, img)
            const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
            url = dlUrl
        }

        await addDoc(collection(db, "messages", id, "chat"), {
            text,
            from: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || "",
        })
        setText('')

    }

    return (
        <>
            <main className="background">
                <Header />
                <section className="section-chat">
                    <section className="members">
                        {
                            data ? data.map(user => {
                                return <ItemMessage active={() => clickEventHandler(user.uid)}
                                                    selectUser={selectUser}
                                                    user={user}
                                                    addedName={activeTab === user.uid ? "active" : ''}/>
                            }) : null
                        }
                    </section>
                    {chat ? (
                        <>
                            <Messenger handleSubmit={handleSubmit} msgs={msgs} text={text} setText={setText} chat={chat} setImg={setImg}/>
                        </>
                    ) : <h1>Select a user to start conversation</h1>

                    }

                    <section className="block">

                    </section>
                </section>
            </main>
        </>
    );
};

export default Chat;
