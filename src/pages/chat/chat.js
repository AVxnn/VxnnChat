import React, {useEffect} from 'react';
import Header from "../../widgets/header/header";
import './style.css'

import ItemMessage from "../../shared/item-message/itemMessage";
import Messenger from "../../features/messenger/messenger";
import {useState} from "react";
import { storage } from '../../shared/api/firebase'
import {
    collection,
    onSnapshot,
    getFirestore,
    query,
    where,
    addDoc,
    Timestamp,
    orderBy,
    doc,
    setDoc, getDoc, updateDoc, deleteDoc
} from "firebase/firestore";
import pin from '../../img/pin.png'
import edit from '../../img/edit.png'
import avatar from '../../img/te.png'
import message from '../../img/messageItem.png'
import close from '../../img/x.png'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import {getAuth} from "firebase/auth";

const Chat = () => {

    const [activeTab, setActiveTab] = useState('')
    let clickEventHandler = (id) => { setActiveTab(id) }
    const [data, setData] = useState([])
    const [allData, setAllData] = useState([])
    const [localUser, setLocalUser] = useState([])
    const [filterData, setFilterData] = useState([])
    const [openContext, setOpenContext] = useState({
        status: false,
        currentTarget : {}
    })
    const [openContextCords, setOpenContextCords] = useState({
        x: 0,
        y: 0
    })
    const [pinned, setPinned] = useState(false)
    const [openFriend, setOpenFriend] = useState({
        status: false,
        currentTarget: ''
    })
    const [chat, setChat] = useState('')
    const [img, setImg] = useState('')
    const [msgs, setMsgs] = useState([])
    const [user, setUser] = useState([])
    const [msgIds, setMsgIds] = useState([])
    const [text, setText] = useState('')
    const auth = getAuth()

    const user1 = auth.currentUser.uid

    const db = getFirestore()

    useEffect(() => {
        if (user1) {
            let unsub = onSnapshot(doc(db, 'users', user1), (doc) => {
                setLocalUser(doc.data())
            })
            console.log(localUser)
            return () => unsub()
        }
    }, [])

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "users"), where('uid', 'not-in', [auth.currentUser.uid])), (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                if (localUser.uid && user1) {
                    localUser.friends.map(async (i)  => {
                        if (i.uid === doc.data().uid) {
                            users.push(doc.data());
                        }
                    })
                }
            });

            setData(users)
        });
        return () => unsub()
    }, [localUser])

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "users"), where('uid', 'not-in', [auth.currentUser.uid])), (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });

            setAllData(users)
        });
        return () => unsub()
    }, [])

    const selectUser = async (user) => {
        setChat(user)

        const user2 = user.uid
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

        const msgsRef = collection(db, 'messages', id, 'chat')
        const q = query(msgsRef, orderBy('createdAt', 'asc'))

        onSnapshot(q, querySnapshot => {
            let msgs = []
            let msgIds = []
            querySnapshot.forEach(snapshot => {
                msgs.push(snapshot.data())
                msgIds.push(snapshot._document.key.path.segments[8])
            })
            setMsgs(msgs)
            setMsgIds(msgIds)
        })

        const docSnap = await getDoc(doc(db, 'lastMsg', id))
        if (docSnap.data()?.from !== user1){
            await updateDoc(doc(db, 'lastMsg', id), { unread: false })
        }

    }

    const handleSubmit = async (e, text) => {
        e.preventDefault();

        if (!text && img) {
        } else if (!text) {
            return null
        }

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

        await setDoc(doc(db, 'lastMsg', id), {
            text,
            from: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || "",
            unread: true,
        })

        setImg('')
        setText('')

    }

    const rightClick = (e, type) => {
        if (type === 'open') {
            e.preventDefault()
            setOpenContext({status: !openContext.status, currentTarget: {}})
            let x = e.clientX;
            let y = e.clientY;
            let g = e;
            setOpenContextCords({x: x, y: y})
            return false
        } else {
            setOpenContext(false)
        }
    }

    const filterFriends = async (item) => {
        setTimeout(() => {
            let filterData = allData.filter((e) => e.name.includes(item.target.value) === true)
            setFilterData(filterData)
            setOpenFriend({status: openFriend.status})
        }, 1000)
    }

    const requestFriend = async (item) => {
        localUser.friends.map(async (i)  => {
            console.log(i, item)
            if (i.uid !== item.uid) {
                await updateDoc(doc(db, "users", item.uid), {
                    notifications: [...item?.notifications, {uid: localUser.uid, name: localUser.name ? localUser.name : 'anonymous', avatar: localUser.avatar ? localUser.avatar : avatar, type: 'reqFriend'}]
                });
                await updateDoc(doc(db, "users", localUser.uid), {
                    notifications: [...localUser?.notifications, {uid: item.uid, name: item.name ? item.name : 'anonymous', avatar: item.avatar ? item.avatar : avatar, type: 'resFriend'}]
                });
            }
        })
    }

    const pinnedMessage = (e) => {

    }

    const deleteHandler = async (e, u2) => {
        const user2 = chat.uid
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
        await deleteDoc(doc(db, 'messages', id, 'chat', e))
    }

    const onlineHandler = async () => {
        if (auth.currentUser.uid) {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                isOnline: true,
            });
        }
    }
    return (
        <>
            <main onClick={() => rightClick('', 'close')} className="background">
                <Header />
                <section className="section-chat" onClick={() => onlineHandler()}>
                    <section className="members">
                        <section className='members-top'>
                            <section className='members-container-info'>
                                <h3 className='members-title'>Message</h3>
                                <span className='members-subtitle'>({data.length})</span>
                            </section>
                            {
                                !openFriend.status ? (
                                  <button onClick={() => setOpenFriend({status: !openFriend.status, currentTarget: openFriend.currentTarget})} className='members-btn'><img className='members-icon' src={edit} alt="edit"/>Add Friend</button>
                                ) : (
                                  <button onClick={() => setOpenFriend({status: !openFriend.status, currentTarget: openFriend.currentTarget})} className='members-btn'><img className='members-icon' src={close} alt="close"/>Close</button>
                                )
                            }
                        </section>
                        {
                            openFriend.status ? (
                                <section className='members-subtop'>
                                    <input onChange={(e) => filterFriends(e)} className='members-find' type="text" placeholder='Type Name...'/>
                                    <section className='members-find-list'>
                                        {
                                            filterData ? filterData.map((e) => {
                                                return (
                                                    <section className='find-item'>
                                                        <section className='find-item-container'>
                                                            <img className='find-item-avatar' src={e.avatar ? e.avatar : avatar} alt="avatar"/>
                                                            <span className='find-item-name'>{e.name}</span>
                                                        </section>
                                                        <button onClick={() => requestFriend(e)} className='find-item-btn'>Add</button>
                                                    </section>
                                                )
                                          }) : (
                                                <section className='find-item'>
                                                    <span className='find-item-name'>404</span>
                                                </section>
                                            )
                                        }
                                    </section>
                                </section>
                            ) : null
                        }
                        {
                            pinned ? (
                              <section className='members-pinned'>
                                  <img className='pinned-img' src={pin} alt="pin"/>
                                  <span className='pinned-title'>PINNED</span>
                              </section>
                            ) : ''
                        }
                        <section className='members-all'>
                            <img className='all-img' src={message} alt="message"/>
                            <span className='all-title'>MESSAGE</span>
                        </section>
                        <section className='members-container'>
                            {
                                data && msgIds ? data.map((user, i) => {
                                    return <ItemMessage active={() => clickEventHandler(user.uid)}
                                                        key={i}
                                                        rightClick={rightClick}
                                                        selectUser={selectUser}
                                                        user={user}
                                                        chat={chat}
                                                        user1={user1}
                                                        addedName={activeTab === user.uid ? "active" : ''}/>
                                }) : null
                            }
                        </section>
                        {
                            openContext.status ? (
                              <section style={{left: `${openContextCords.x}px`, top: `${openContextCords.y}px`}} className='contextMenu'>
                                  <button onClick={() => pinnedMessage()} className='contextMenu-btn'><section className='contextMenu-btn-container'><img className='contextMenu-btn-pin' src={pin} alt="pin"/>Pinned</section></button>
                              </section>
                            ) : null
                        }
                    </section>
                    {chat ? (
                        <>
                            <Messenger handleSubmit={handleSubmit}
                                       chatImg={chat.avatar}
                                       msgs={msgs}
                                       text={text}
                                       deleteHandler={deleteHandler}
                                       msgIds={msgIds}
                                       setText={setText}
                                       chat={chat}
                                       setImg={setImg}
                                       img={img}/>
                        </>
                    ) : (
                        <section className='pin-user'>
                            <h1 className='pin-title'>Select a user to start conversation</h1>
                        </section>
                    )

                    }
                </section>
            </main>
        </>
    );
};

export default Chat;
