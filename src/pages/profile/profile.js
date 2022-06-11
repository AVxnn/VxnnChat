import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import './style.css'
import avatar from '../../img/te.png'
import camera from '../../img/camera.png'
import edit from '../../img/edit.png'
import lock from '../../img/lock.png'
import check from '../../img/check.png'
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import {ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
import { storage } from '../../shared/api/firebase'
import {getAuth, updateProfile} from "firebase/auth";
import {useParams} from "react-router-dom";
import bug from "../../img/bug.png";
import github from "../../img/github.png";
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
                    <h2 className='block-title'>Profile</h2>
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
                                        <span className='profile-upload_text'>Upload a photo...</span>
                                    </>
                                ) :  null
                                }
                            </label>
                        </>
                    ) : null
                    }
                    {loading && us ? (
                        <>
                            <section className='info-block'>
                                {nameChanger ? (
                                    <>
                                        <span className='info-name-title'>Имя: </span>
                                        <span className='info-name-description'>{us.name}</span>
                                        {userId === auth.currentUser.uid ? (
                                            <img onClick={() => changeName()} className='info-edit' src={edit} alt="edit"/>
                                        ) : null}
                                    </>
                                ) : (
                                    <>
                                        <span className='info-name-title'>Имя: </span>
                                        <input onChange={(e) => setName(e.target.value)} value={name} className='info-name-input' />
                                        <img onClick={() => changeNameHandler()} className='info-edit' src={check} alt="check"/>
                                    </>
                                )}
                            </section>
                            <section className='info-block'>
                                <span className='info-name-title'>Email: </span>
                                <span className='info-name-description'>{us.email}</span>
                            </section>
                            <section className='info-block'>
                                <span className='info-name-title'>Joined on: </span>
                                <span className='info-name-description'>{user.createdAt.toDate().toDateString()}</span>
                            </section>
                            <section className='info-block'>
                                <span className='info-name-title'>Admin: </span>
                                <span className='info-name-description'>{us.isAdmin ? 'True': 'False'}</span>
                                <a href="https://t.me/romashkog" target='_blank'><img className='info-admin' src={lock} alt="lock"/></a>
                            </section>
                            <section className='info-block'>
                            <span className='info-name-title'>ID: </span>
                            <span className='info-name-description'>{us.uid}</span>
                            </section>
                        </>
                        ) : null}
                </section>
                <Github />
            </main>
        </>
    )
};

export default Profile;
