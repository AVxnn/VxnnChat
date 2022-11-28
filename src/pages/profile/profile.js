import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import './style.sass'
import avatar from '../../img/te.png'
import camera from '../../img/camerab.png'
import edit from '../../img/edit.png'
import cog from '../../img/cog.png'
import {collection, doc, getDoc, getFirestore, onSnapshot, query, updateDoc, where} from "firebase/firestore";
import {ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
import {db, storage} from '../../shared/api/firebase'
import {getAuth, updateProfile} from "firebase/auth";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import Github from "../../features/github/github";
import EmojiPicker from "emoji-picker-react";
import {Helmet} from "react-helmet";

const Profile = () => {

    const [us, setUs] = useState(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState()
    const [users, setUsers] = useState()
    const [curUser, setCurUser] = useState({})
    const [friend, setFriend] = useState(false)
    const [emoji, setEmoji] = useState('')
    const [pickerOpen, setPickerOpen] = useState(false)
    const [nameChanger, setNameChanger] = useState(true)
    const [img, setImg] = useState('')
    const db = getFirestore()
    const auth = getAuth()

    const navigate = useNavigate()

    const {userId} = useParams()

    const requestFriend = async (item, type) => {
        let res = 0
        curUser.friends.map(async (i)  => {
            if (type === 'add') {
                setFriend(true)
                await updateDoc(doc(db, "users", item.uid), {
                    notifications: [...item?.notifications, {uid: curUser.uid, random: Math.round(Math.random(1000000) * 1000), name: curUser.name ? curUser.name : 'anonymous', avatar: curUser.avatar ? curUser.avatar : avatar, type: 'reqFriend'}]
                });
                await updateDoc(doc(db, "users", curUser.uid), {
                    notifications: [...curUser?.notifications, {uid: item.uid, name: item.name ? item.name : 'anonymous', avatar: item.avatar ? item.avatar : avatar, type: 'resFriend'}]
                });
            }
            if (type === 'del') {
                setFriend(false)
                let resF = item.friends.filter(i => i.uid !== curUser.uid)
                await updateDoc(doc(db, "users", item.uid), {
                    notifications: [...item?.notifications, {uid: curUser.uid, name: curUser.name ? curUser.name : 'anonymous', avatar: curUser.avatar ? curUser.avatar : avatar, type: 'delete'}],
                    friends: [...resF]
                });
                let resC = curUser.friends.filter(i => i.uid !== item.uid)
                await updateDoc(doc(db, "users", curUser.uid), {
                    friends: [...resC]
                });
            }
            console.log(item, curUser)
        })
    }

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "users"), where('uid', 'in', [userId])), (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            setUs(users[0])
            setLoading(true)
            // setFollow(users[0]?.followers.filter((i) => i === auth.currentUser.uid).length >= 1)
        });
        return () => unsub()
    }, [userId])

    useEffect(() => {
        if (img) {
            const uploadImg = async () => {
                const imgRef = ref(
                    storage,
                    `avatar/${new Date().getTime()} - ${img.name}`
                )
                try{
                    if (user.avatarPath) {
                        await deleteObject(ref(storage, user.avatarPath))
                    }
                    const snap = await uploadBytes(imgRef, img)
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath))

                    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath
                    })
                    await updateProfile(auth.currentUser, {
                        displayName: us.name,
                        photoURL: url,
                    })
                    setImg('')
                } catch (e) {
                    console.log(e.message)
                }
            }
            uploadImg()
        }
    }, [img, userId])

    const updateStatus = async () => {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            emoji: emoji
        })
        console.log('work', emoji)
        setPickerOpen(!pickerOpen)
    }

    useEffect(() => {
        getDoc(doc(db, 'users' , userId)).then(docSnap => {
            if (docSnap.exists) {
                setUser(docSnap.data())
            }
        })

        getDoc(doc(db, 'users' , auth.currentUser.uid)).then(docSnap => {
            if (docSnap.exists) {
                setCurUser(docSnap.data())

            }
        })
    }, [userId])

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "users")), (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.data())
                user?.friends.map((i)  => {
                    console.log(i.uid === doc.data().uid, i.uid, doc.data().uid)
                    if (i.uid === doc.data().uid) {
                        data.push(doc.data());
                    }
                })
            });
            setUsers(data)
        });
        return () => unsub()
    }, [user])

    useEffect(() => {
        curUser?.friends?.map(i => {
            if (i.uid === userId) {
                setFriend(true)
            }
        })
    }, [curUser])

    return (
        <>
            <Helmet>
                <title>{`PetChat - Profile`}</title>
            </Helmet>
            <main className="background">
                <section className="block-profile">
                    <div className='profile-background' style={{backgroundImage: `url(${user?.background ? user.background : ''})`}}>
                    </div>
                    <section className='profile-avatar-block'>
                        {user ? (
                          <>
                              {userId === auth.currentUser.uid ? (
                                <input id='file'
                                       accept='image/*'
                                       type="file"
                                       onChange={e => setImg(e.target.files[0])}/>) : null }

                              <label htmlFor='file' className='section-upload_avatar'>
                                  <img className='profile-avatar' src={user.avatar || avatar} alt="avatar"/>
                                  {userId === auth.currentUser.uid ? (
                                    <>
                                        <img className='profile-avatar_add' src={camera} alt=""/>
                                    </>
                                  ) :  null
                                  }
                              </label>
                          </>
                        ) : null}
                        <div onClick={() => userId === auth.currentUser.uid && setPickerOpen(!pickerOpen)} className='status-change'>
                            <span className='status-btn'>{user?.emoji}</span>
                            {pickerOpen && (
                              <section onClick={() => updateStatus()} className='smile-picker'>
                                  <EmojiPicker onEmojiClick={(e) => setEmoji(e.emoji, 'emoji')} />
                              </section>
                            )}
                        </div>

                    </section>
                    <section className='toolBar'>
                        {userId === auth.currentUser.uid ? (
                                <button className='toolBar-btn'>
                                    <NavLink to={`/profile/${auth.currentUser.uid}/edit`}><img className='toolBar-btn_img' src={edit} alt="edit"/></NavLink>
                                </button>
                            ) : ''
                        }
                    </section>
                    <section className='profile-stats'>
                        <NavLink to={`/friends/${userId}`}>
                            <section className='stats-block'>
                                <div className='stats-friends-avatars-container'>
                                    {
                                        users && users.map((i, key) => {
                                            if (key <= 3) {
                                                return (
                                                  <div className='stats-avatar-friends'>
                                                      <img src={i.avatar} alt=""/>
                                                  </div>
                                                )
                                            }
                                        })
                                    }
                                    <h4 className='stats-title'>{user?.friends ? us?.friends.length : 0}</h4>

                                </div>
                                <span className='stats-subtitle'>Friends</span>
                            </section>
                        </NavLink>
                        <section className='stats-block'>
                            <h4 className='stats-title'>0</h4>
                            <span className='stats-subtitle'>Posts</span>
                        </section>
                    </section>
                    <section className='info-newBlock'>
                        <h4 className='info-title'>{loading && us.name}</h4>
                        {
                            user?.isAdmin ? <span className='info-premium'>Premium</span> : <span className='info-premium'></span>
                        }
                        <span className='info-description'>{user?.description ? user.description : ''}</span>
                        {
                            user?.link && (
                            <a href={user?.link} className='info-link'>
                            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.93791 6.58762C5.59883 5.9267 6.75149 5.9267 7.41241 6.58762L7.82483 7.00004L8.64966 6.1752L8.23724 5.76279C7.68716 5.21212 6.95449 4.9082 6.17516 4.9082C5.39583 4.9082 4.66316 5.21212 4.11308 5.76279L2.87524 7.00004C2.32941 7.54762 2.02292 8.28925 2.02292 9.06241C2.02292 9.83557 2.32941 10.5772 2.87524 11.1248C3.14584 11.3958 3.46731 11.6106 3.82119 11.757C4.17507 11.9033 4.55438 11.9783 4.93733 11.9776C5.32038 11.9784 5.69981 11.9035 6.0538 11.7571C6.40779 11.6108 6.72935 11.3959 6.99999 11.1248L7.41241 10.7124L6.58758 9.88754L6.17516 10.3C5.84643 10.6272 5.40147 10.8109 4.93762 10.8109C4.47377 10.8109 4.0288 10.6272 3.70008 10.3C3.37254 9.97138 3.18861 9.52636 3.18861 9.06241C3.18861 8.59847 3.37254 8.15344 3.70008 7.82487L4.93791 6.58762Z" fill="#BDBDBD"/>
                                <path d="M7.00001 2.87527L6.58759 3.28768L7.41242 4.11252L7.82484 3.7001C8.15357 3.37284 8.59853 3.18912 9.06238 3.18912C9.52623 3.18912 9.9712 3.37284 10.2999 3.7001C10.6275 4.02867 10.8114 4.4737 10.8114 4.93764C10.8114 5.40159 10.6275 5.84661 10.2999 6.17518L9.06209 7.41243C8.40117 8.07335 7.24851 8.07335 6.58759 7.41243L6.17518 7.00002L5.35034 7.82485L5.76276 8.23727C6.31284 8.78793 7.04551 9.09185 7.82484 9.09185C8.60417 9.09185 9.33684 8.78793 9.88692 8.23727L11.1248 7.00002C11.6706 6.45243 11.9771 5.7108 11.9771 4.93764C11.9771 4.16448 11.6706 3.42285 11.1248 2.87527C10.5773 2.32915 9.83564 2.02246 9.06238 2.02246C8.28913 2.02246 7.54744 2.32915 7.00001 2.87527V2.87527Z" fill="#BDBDBD"/>
                            </svg>
                                {user?.link ? user?.link.replace('https://www.', '') : ''}
                        </a>
                          )
                        }

                        {
                            userId !== auth.currentUser.uid ? (
                              <section className='follow-block'>
                                  {
                                      !friend ? (
                                        <button onClick={() => requestFriend(user, 'add')} className='follow-btn'>Add as Friend</button>
                                      ) : (
                                        <button onClick={() => requestFriend(user, 'del')} className='unfollow-btn'>Delete Friend</button>
                                      )
                                  }
                                  <button onClick={() => navigate(`/chat/${user.uid}`)} className='send-message-btn'>Send Message</button>
                              </section>
                            ) : ''
                        }
                    </section>
                </section>
            </main>
        </>
    )
};

export default Profile;
