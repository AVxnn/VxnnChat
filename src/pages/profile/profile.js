import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import './style.css'
import avatar from '../../img/te.png'
import camera from '../../img/camera.png'
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
    const [name, setName] = useState('')
    const [follow, setFollow] = useState(false)
    const [nameChanger, setNameChanger] = useState(true)
    const [img, setImg] = useState('')
    const db = getFirestore()
    const auth = getAuth()

    const {userId} = useParams()
    console.log(userId)

    const followUser = async () => {
        await updateDoc(doc(db, 'users', userId), {
            followers: [...us?.followers, auth.currentUser.uid]
        })
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            following: [...user?.following, userId]
        })
        setUs({...us, followers: [...us?.followers, auth.currentUser.uid]})
    }
    const unFollowUser = async () => {
        await updateDoc(doc(db, 'users', userId), {
            followers: us?.followers.filter((i) => i !== auth.currentUser.uid)
        })
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            following: user?.following.filter((i) => i !== userId)
        })
        setUs({...us, followers: us?.followers.filter((i) => i !== auth.currentUser.uid)})
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
        getDoc(doc(db, 'users' , userId)).then(docSnap => {
            if (docSnap.exists) {
                setUser(docSnap.data())
            }
        })
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
                        <section className='stats-block'>
                            <h4 className='stats-title'>{user?.friends ? us?.friends.length : 0}</h4>
                            <span className='stats-subtitle'>Friends</span>
                        </section>
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
                                      !follow ? (
                                        <button onClick={() => followUser()} className='follow-btn'>Add as Friend</button>
                                      ) : (
                                        <button onClick={() => unFollowUser()} className='unfollow-btn'>Delete Friend</button>
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
