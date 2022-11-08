import React from 'react';
import avatar from "../../../features/message-item/img/avatar.png";
import usersSnap from "../../../shared/snap/users/usersSnap";

const FriendNotification = (item) => {

  console.log(usersSnap)

  // const acceptFriend = async (e, type) => {
  //   const user2 = .filter(i => i.uid === e.uid)
  //   if (type === 0) {
  //     console.log(data, user2)
  //     let result1 = data.notifications.filter(i => i.uid !== user2[0].uid)
  //     let result2 = user2[0].notifications.filter(i => i.uid !== data.uid)
  //     console.log(result1, result2)
  //     await updateDoc(doc(db, "users", data.uid), {
  //       notifications: result1,
  //       friends: [...data.friends, {name: user2[0].name ? user2[0].name : 'anonymous', uid: user2[0].uid, avatar: user2[0].avatar ? user2[0].avatar : avatar}]
  //     });
  //     await updateDoc(doc(db, "users", user2[0].uid), {
  //       notifications: result2,
  //       friends: [...user2[0].friends, {name: data.name ? data.name : 'anonymous', uid: data.uid, avatar: data.avatar ? data.avatar : avatar}]
  //     });
  //   } else {
  //
  //   }
  // }

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
          {/*<button onClick={() => acceptFriend(e, 0)} className='bell-item-btn accept'>Accept</button>*/}
          {/*<button onClick={() => acceptFriend(e, 1)} className='bell-item-btn reject'>Reject</button>*/}
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
          {/*<button onClick={() => acceptFriend(e, 1)} className='bell-item-btn reject'>Reject</button>*/}
        </section>
      </section>
    )
  }
};

export default FriendNotification;
