import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import './style.css'
import avatar from '../../img/te.png'
import camera from '../../img/camerab.png'
import edit from '../../img/edit.png'
import cog from '../../img/cog.png'
import {collection, doc, getDoc, getFirestore, onSnapshot, query, updateDoc, where} from "firebase/firestore";
import {ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
import { storage } from '../../shared/api/firebase'
import {getAuth, updateProfile} from "firebase/auth";
import {NavLink, useParams} from "react-router-dom";
import Github from "../../features/github/github";

const Profile = () => {

    const [us, setUs] = useState(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState()
    const [curUser, setCurUser] = useState({})
    const [friend, setFriend] = useState(false)
    const [follow, setFollow] = useState(false)
    const [nameChanger, setNameChanger] = useState(true)
    const [img, setImg] = useState('')
    const db = getFirestore()
    const auth = getAuth()

    const {userId} = useParams()
    console.log(userId)

    const requestFriend = async (item, type) => {
        let res = 0
        curUser.friends.map(async (i)  => {
            if (type === 'add') {
                setFriend(true)
                await updateDoc(doc(db, "users", item.uid), {
                    notifications: [...item?.notifications, {uid: curUser.uid, name: curUser.name ? curUser.name : 'anonymous', avatar: curUser.avatar ? curUser.avatar : avatar, type: 'reqFriend'}]
                });
                await updateDoc(doc(db, "users", curUser.uid), {
                    notifications: [...curUser?.notifications, {uid: item.uid, name: item.name ? item.name : 'anonymous', avatar: item.avatar ? item.avatar : avatar, type: 'resFriend'}]
                });
            }
            if (type === 'del') {
                setFriend(false)
                let resF = item.friends.filter(i => i.uid !== curUser.uid)
                await updateDoc(doc(db, "users", item.uid), {
                    notifications: [...item?.notifications, {uid: curUser.uid, name: curUser.name ? curUser.name : 'anonymous', avatar: curUser.avatar ? curUser.avatar : avatar, type: 'delete'}]
                });
                await updateDoc(doc(db, "users", item.uid), {
                    friends: [...resF]
                });
                let resC = curUser.friends.filter(i => i.uid !== item.uid)
                await updateDoc(doc(db, "users", curUser.uid), {
                    friends: [...resC]
                });
            }

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
            console.log(us)
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
        console.log(curUser)
        curUser?.friends?.map(i => {
            if (i.uid === userId) {
                setFriend(true)
            }
        })
    }, [curUser])

    return (
        <>
            <main className="background">
                <Header />
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
                        <NavLink to={`/friends`}>
                            <section className='stats-block'>
                                <h4 className='stats-title'>{user?.friends ? us?.friends.length : 0}</h4>
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
                        <section className='info-stats-game'>
                            <section className='game-info'>
                                <span className='game-lvl'>9 lvl</span>
                                <span className='game-exp'>3000/8000 exp</span>
                            </section>
                            <div className='game-bar'><div style={{width: '30%'}} className='game-bar_active'></div></div>
                        </section>
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
