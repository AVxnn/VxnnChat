import React, {useEffect, useState} from 'react';
import './style.sass'
import Header from "../../widgets/header/header";
import ItemMessage from "../../shared/item-message/itemMessage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query, setDoc, Timestamp,
  updateDoc,
  where
} from "firebase/firestore";
import {db, storage} from "../../shared/api/firebase";
import {getAuth} from "firebase/auth";
import edit from "../../img/edit.png";
import close from "../../img/x.png";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import avatar from "../../img/te.png";
import pin from "../../img/pin.png";
import message from "../../img/messageItem.png";
import Messenger from "../../features/messenger/messenger";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

const MobileChat = ({width}) => {

  const auth = getAuth()
  const user1 = auth.currentUser.uid
  const [localUser, setLocalUser] = useState([])
  const [activeLink, setActiveLink] = useState(false)
  const [data, setData] = useState([])
  const [chat, setChat] = useState('')
  const [msgs, setMsgs] = useState([])
  const [activeTab, setActiveTab] = useState('')
  const [msgIds, setMsgIds] = useState([])
  const [text, setText] = useState('')
  const [img, setImg] = useState('')
  const [dataPinned, setDataPinned] = useState([])

  const navigate = useNavigate()

  const params = useParams()

  let clickEventHandler = (id) => { setActiveTab(id) }

  const selectUser = async (user) => {
    setChat(user)
    console.log(user)
    const user2 = user.uid
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

    const msgsRef = collection(db, 'messages', id, 'chat')
    const q = query(msgsRef, orderBy('createdAt', 'asc'))

    onSnapshot(q, querySnapshot => {
      let msgs = []
      let msgIds = []
      querySnapshot.forEach(snapshot => {
        msgs.push({...snapshot.data(), tid: snapshot._document.key.path.segments[8]})
      })
      setMsgs(msgs)
      console.log(msgs, msgIds)
    })

    const docSnap = await getDoc(doc(db, 'lastMsg', id))
    if (docSnap.data()?.from !== user1){
      await updateDoc(doc(db, 'lastMsg', id), { unread: false })
    }
    await setActiveLink(true)
    await navigate(`/chat/${user.uid}`)
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

  const handleSubmit = async (e, text) => {
    if (e) {
      e.preventDefault();
    }

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

  useEffect(() => {
    if(data.length >= 1 || dataPinned.length >= 1 && user1) {
      setTimeout(() => {
        let res = dataPinned.filter(i => i.uid === params.uid) || data.filter(i => i.uid === params.uid)
        console.log(dataPinned.filter(i => i.uid === params.uid) || data.filter(i => i.uid === params.uid))
        if (res.length >= 1) {
          params.uid ? selectUser(res[0]) : setActiveLink(false)
        }
      }, 1000)
    }
  }, [data, dataPinned, user1])

  useEffect(() => {
    if (user1) {
      let unsub = onSnapshot(doc(db, 'users', user1), (doc) => {
        setLocalUser(doc.data())
      })
      return () => unsub()
    }
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "users"), where('uid', 'not-in', [auth.currentUser.uid])), (querySnapshot) => {
      const users = [];
      const usersPinned = [];
      querySnapshot.forEach((doc) => {
        if (localUser.uid && user1) {
          localUser.friends.map(async (i)  => {
            if (i.uid === doc.data().uid && !i.pinned) {
              users.push(doc.data());
            }
            if (i.uid === doc.data().uid && i.pinned) {
              usersPinned.push(doc.data());
            }
          })
        }
      });
      setDataPinned(usersPinned)
      setData(users)
    });
    return () => unsub()
  }, [localUser])

  return (
    <main className="background">
      <Header />
      <section className="section-chat">
        {activeLink ? (
          <Messenger handleSubmit={handleSubmit}
                     chatImg={chat.avatar}
                     msgs={msgs}
                     text={text}
                     width={width}
                     deleteHandler={deleteHandler}
                     msgIds={msgIds}
                     localUser={localUser}
                     setText={setText}
                     chat={chat}
                     setImg={setImg}
                     img={img}/>
        ) : (
          <section className="members">
            <section className='members-top'>
              <section className='members-container-info'>
                <h3 className='members-title'>Message</h3>
                <span className='members-subtitle'>({data.length + dataPinned.length})</span>
              </section>
            </section>
            {
              dataPinned.length >= 1 ? (
                <>
                  <section className='members-pinned'>
                    <img className='pinned-img' src={pin} alt="pin"/>
                    <span className='pinned-title'>PINNED</span>
                  </section>
                  <section className='members-container pinned'>
                    {
                      dataPinned ? dataPinned.map((user, i) => {
                        return <ItemMessage active={() => clickEventHandler(user.uid)}
                                            key={i}
                                            selectUser={selectUser}
                                            user={user}
                                            chat={chat}
                                            user1={user1}
                                            addedName={activeTab === user.uid ? "active" : ''}/>
                      }) : null
                    }
                  </section>
                </>
              ) : ''
            }
            <section className='members-all'>
              <img className='all-img' src={message} alt="message"/>
              <span className='all-title'>MESSAGE</span>
            </section>
            <section className='members-container'>
              {
                data ? data.map((user, i) => {
                  return <ItemMessage active={() => clickEventHandler(user.uid)}
                                      key={i}
                                      selectUser={selectUser}
                                      user={user}
                                      chat={chat}
                                      user1={user1}
                                      addedName={activeTab === user.uid ? "active" : ''}/>
                }) : null
              }
            </section>
          </section>
        )}
      </section>
    </main>
  );
};

export default MobileChat;
