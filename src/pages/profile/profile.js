import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import './style.css'
import avatar from '../../img/te.png'
import camera from '../../img/camera.png'
import edit from '../../img/edit.png'
import cog from '../../img/cog.png'
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
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
    const [nameChanger, setNameChanger] = useState(true)
    const [img, setImg] = useState('')
    const db = getFirestore()
    const auth = getAuth()

    const {userId} = useParams()
    console.log(userId)
    const changeName = () => {
        setNameChanger(false)
        setName(auth.currentUser.displayName)
    }

    const changeNameHandler = async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
            name: name,
        })
        setUs({
            ...us,
            name: name
        })
        await updateProfile(auth.currentUser, {
            displayName: name,
        })
        setNameChanger(true)
    }

    useEffect(() => {
        const gett = async () => {
            await getDoc(doc(db, "users", userId))
                .then((e) => {
                    return e.data()
                })
                .then((s) => {
                    setUs(s)
                    setLoading(true)
                    console.log(us)
                })
        }
        gett()
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
                    <div className='profile-background' style={{backgroundImage: `url(https://www.ixbt.com/img/n1/news/2022/8/3/minecraft-pervaya-igra-v-mire-s-trillionom-prosmotrov-na-youtube_1639557564843213899_large.jpg)`}}>
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
                        <button className='toolBar-btn'>
                            <NavLink to={`/profile/${auth.currentUser.uid}/edit`}><img className='toolBar-btn_img' src={edit} alt="edit"/></NavLink>
                        </button>
                    </section>
                    <section className='profile-stats'>
                        <section className='stats-block'>
                            <h4 className='stats-title'>{user?.followers ? user.followers : 0}</h4>
                            <span className='stats-subtitle'>Followers</span>
                        </section>
                        <section className='stats-block'>
                            <h4 className='stats-title'>{user?.following ? user.following : 0}</h4>
                            <span className='stats-subtitle'>Following</span>
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
                        <section className='follow-block'>
                            <button className='follow-btn'>Follow</button>
                        </section>
                    </section>

                    {/*{loading && us ? (*/}
                    {/*    <>*/}
                    {/*        <section className='info-block'>*/}
                    {/*            {nameChanger ? (*/}
                    {/*                <>*/}
                    {/*                    <span className='info-name-title'>Имя: </span>*/}
                    {/*                    <span className='info-name-description'>{us.name}</span>*/}
                    {/*                    {userId === auth.currentUser.uid ? (*/}
                    {/*                        <img onClick={() => changeName()} className='info-edit' src={edit} alt="edit"/>*/}
                    {/*                    ) : null}*/}
                    {/*                </>*/}
                    {/*            ) : (*/}
                    {/*                <>*/}
                    {/*                    <span className='info-name-title'>Имя: </span>*/}
                    {/*                    <input onChange={(e) => setName(e.target.value)} value={name} className='info-name-input' />*/}
                    {/*                    <img onClick={() => changeNameHandler()} className='info-edit' src={check} alt="check"/>*/}
                    {/*                </>*/}
                    {/*            )}*/}
                    {/*        </section>*/}
                    {/*        <section className='info-block'>*/}
                    {/*            <span className='info-name-title'>Email: </span>*/}
                    {/*            <span className='info-name-description'>{us.email}</span>*/}
                    {/*        </section>*/}
                    {/*        <section className='info-block'>*/}
                    {/*            <span className='info-name-title'>Joined on: </span>*/}
                    {/*            <span className='info-name-description'>{user.createdAt.toDate().toDateString()}</span>*/}
                    {/*        </section>*/}
                    {/*        <section className='info-block'>*/}
                    {/*            <span className='info-name-title'>Admin: </span>*/}
                    {/*            <span className='info-name-description'>{us.isAdmin ? 'True': 'False'}</span>*/}
                    {/*            <a href="https://t.me/romashkog" target='_blank'><img className='info-admin' src={lock} alt="lock"/></a>*/}
                    {/*        </section>*/}
                    {/*        <section className='info-block'>*/}
                    {/*        <span className='info-name-title'>ID: </span>*/}
                    {/*        <span className='info-name-description'>{us.uid}</span>*/}
                    {/*        </section>*/}
                    {/*    </>*/}
                    {/*    ) : null}*/}
                </section>
                <Github />
            </main>
        </>
    )
};

export default Profile;
