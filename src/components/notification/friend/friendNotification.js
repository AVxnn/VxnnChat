import React, {useEffect, useState} from 'react';
import avatar from "../../../features/message-item/img/avatar.png";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../../shared/api/firebase";

const FriendNotification = ({item, data}) => {

  console.log(data, item)

  const [user2, setUser2] = useState(false)

  useEffect(() => {
    if (item.uid) {
      let unsub = onSnapshot(doc(db, 'users', item.uid), (doc) => {
        setUser2(doc.data())
      })
      console.log(user2)
      return () => unsub()
    }
  }, [item.uid])

  const acceptFriend = async (e, type) => {
    if (type === 0 && data) {
      let result1 = data.notifications.filter(i => i.uid !== user2.uid && i.type !== user2.type)
      let result2 = user2.notifications.filter(i => i.uid !== data.uid && i.type !== data.type)
      await updateDoc(doc(db, "users", data.uid), {
        notifications: result1,
        friends: [...data.friends, {name: user2.name ? user2.name : 'anonymous', uid: user2.uid, avatar: user2.avatar ? user2.avatar : avatar}]
      });
      await updateDoc(doc(db, "users", user2.uid), {
        notifications: result2,
        friends: [...user2.friends, {name: data.name ? data.name : 'anonymous', uid: data.uid, avatar: data.avatar ? data.avatar : avatar}]
      });
    }
    console.log('accept')
  }

  const rejectFriend = async (e, type) => {
    if (type === 0 && data) {
      let result1 = data.notifications.filter(i => i.uid !== user2.uid && i.type !== user2.type)
      let result2 = user2.notifications.filter(i => i.uid !== data.uid && i.type !== data.type)
      await updateDoc(doc(db, "users", data.uid), {
        notifications: result1,
        friends: [...data.friends]
      });
      await updateDoc(doc(db, "users", user2.uid), {
        notifications: [...result2, {name: data.name ? data.name : 'anonymous', type: 'delete', uid: data.uid, avatar: data.avatar ? data.avatar : avatar}],
        friends: [...user2.friends]
      });
    }
    console.log('reject')
  }

  const closeNotification = async (e) => {
    const user1 = data.notifications.filter(i => i.uid !== e.uid)
    await updateDoc(doc(db, "users", data.uid), {
      notifications: [...user1],
    });
    console.log('close')
  }

  if (item.type === 'reqFriend') {
    return (
      <section className='bell-item'>
        <section className='bell-item-container'>
          <img className='bell-item-avatar' src={item.avatar ? item.avatar : avatar} alt="avatar"/>
          <section className='bell-info'>
            <span className='bell-item-name'>{item.name}</span>
            <span className='bell-item-subtitle'>Wants to be friends</span>
          </section>
        </section>
        <section className='bell-btn-list'>
          <button onClick={() => acceptFriend(item, 0)} className='bell-item-btn accept'>Accept</button>
          <button onClick={() => rejectFriend(item, 0)} className='bell-item-btn reject'>Reject</button>
        </section>
      </section>
    )} else if (item.type === 'resFriend') {
    return (
      <section className='bell-item'>
        <section className='bell-item-container'>
          <img className='bell-item-avatar' src={avatar} alt="avatar"/>
          <section className='bell-info'>
            <span className='bell-item-name'>{item.name}</span>
            <span className='bell-item-subtitle'>You sent a friend request</span>
          </section>
        </section>
        <section className='bell-btn-list'>
          <button onClick={() => closeNotification(item, 0)} className='bell-item-btn reject'>Reject</button>
        </section>
      </section>
    )
  } else if (item.type === 'delete') {
    return (
      <section className='bell-item'>
        <section className='bell-item-container'>
          <img className='bell-item-avatar' src={avatar} alt="avatar"/>
          <section className='bell-info'>
            <span className='bell-item-name'>{item.name}</span>
            <span className='bell-item-subtitle'>Didn't accept friend request</span>
          </section>
        </section>
        <section className='bell-btn-list'>
          <button onClick={() => closeNotification(item)} className='bell-item-btn reject'>Close ;(</button>
        </section>
      </section>
    )
  }
  return <></>
};

export default FriendNotification;
