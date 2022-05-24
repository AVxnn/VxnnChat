import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import './style.css'
import avatar from '../../img/te.png'
import edit from '../../img/edit.png'
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import {ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
import { storage } from '../../shared/api/firebase'
import {getAuth} from "firebase/auth";

const Profile = () => {

    const [us, setUs] = useState(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState()
    const [img, setImg] = useState('')
    const db = getFirestore()
    const auth = getAuth()

    useEffect(() => {
        const gett = async () => {
            await getDoc(doc(db, "users", auth.currentUser.uid))
                .then((e) => {
                    return e.data()
                })
                .then((s) => {
                    setUs(s)
                    setLoading(true)
                })
        }
        gett()

    }, [])

    useEffect(() => {
        getDoc(doc(db, 'users' , auth.currentUser.uid)).then(docSnap => {
            if (docSnap.exists) {
                setUser(docSnap.data())
            }
        })
        console.log(auth.currentUser)
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
                    console.log(snap.ref.fullPath)
                    console.log(url)
                    setImg('')
                } catch (e) {
                    console.log(e.message)
                }
            }
            uploadImg()
        }
    }, [img])

    return (
        <>
            <main className="background">
                <Header />
                <section className="block-profile">
                    <h2 className='block-title'>Profile</h2>
                    {user ? (
                        <>
                            <input id='file'
                                   accept='image/*'
                                   type="file"
                                   onChange={e => setImg(e.target.files[0])}/>
                            <label htmlFor='file' className='section-upload_avatar'>
                                <img className='profile-avatar' src={user.avatar || avatar} alt="avatar"/>
                                <span className='profile-upload_text'>Загрузить фото...</span>
                            </label>
                        </>
                    ) : null
                    }
                    {loading ? (
                        <>
                            <section className='info-block'>
                                <span className='info-name-title'>Имя: </span>
                                <span className='info-name-description'>{us.name}</span>
                                <img className='info-edit' src={edit} alt=""/>
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
                            <span className='info-name-title'>ID: </span>
                            <span className='info-name-description'>{us.uid}</span>
                            </section>
                        </>
                        ) : null}
                </section>
            </main>
        </>
    )
};

export default Profile;
