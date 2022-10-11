import React, {useEffect, useState} from 'react';
import './style.css'
import like from '../../img/like.png'
import likefill from '../../img/likefill.png'
import check from '../../img/check.png'
import edit from '../../img/edit.png'
import trash from '../../img/trash.png'
import Popup from "../popup/popup";
import Moment from "react-moment";
import {collection, deleteDoc, doc, getFirestore, onSnapshot, query, updateDoc, where} from "firebase/firestore";
import admin from "../../img/admin.png";
import {Link} from "react-router-dom";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../shared/api/firebase";
import uploadimage from "../../img/uploadimage.png";

const Post = ({auth, post, postId}) => {
    const [data, setData] = useState({
        img: post.img,
        title: post.title,
        desc: post.desc
    })
    const [open, setOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(true)
    const [isLike, setIsLike] = useState(true)
    const [avatar, setAvatar] = useState('')

    const db = getFirestore()

    const isEditHandler = () => {
        setIsEditOpen(false)
        setData({
            img: post.img,
            title: post.title,
            desc: post.desc
        })
    }

    const isEditOpenHandler = async () => {
        setIsEditOpen(true)
        if (data.img) {
            const imgRef = ref(
                storage,
                `posts/${new Date().getTime()} - ${data.img.name}`
            )
            const snap = await uploadBytes(imgRef, data.img)
            const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
            data.img = dlUrl
        }
        await updateDoc(doc(db, "posts", postId), {
            title: data.title,
            desc: data.desc,
            img: data.img
        })
    }

    const deletePostHandler = async () => {
        await deleteDoc(doc(db, 'posts', postId))
    }

    const likeHandler = async (e) => {
        let myArray = [...post.counterLikes]
        console.log([...post.counterLikes])
        if (myArray) {
            console.log(myArray)
        }
        let myIndex = myArray.indexOf(auth.currentUser.uid)
        console.log(myIndex)
        if (myIndex !== -1) {
            myArray.splice(myIndex, 1);
            setIsLike(true)
            await updateDoc(doc(db, 'posts', postId), {
                counterLikes: [...myArray]
            })
        } else if (myIndex === -1) {
            setIsLike(false)
            await updateDoc(doc(db, 'posts', postId), {
                counterLikes: [...post.counterLikes, auth.currentUser.uid]
            })
        }
    }

    useEffect(() => {
        let myArray = [...post.counterLikes]
        console.log([...post.counterLikes])
        if (myArray) {
            console.log(myArray)
        }
        let myIndex = myArray.indexOf(auth.currentUser.uid)
        console.log(myIndex)
        if (myIndex !== -1) {
            myArray.splice(myIndex, 1);
            setIsLike(false)
        } else if (myIndex === -1) {
            setIsLike(true)
        }
    }, [])

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "users"), where('uid', 'in', [post.uid])), (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
                console.log(users)
            });
            setAvatar(users[0].avatar)
        });
        return () => unsub()
    }, [])

    return post ? (
        <>
            <section className='post'>
                <section className='post-header'>
                    <section className='header-user'>
                        <Link to={`/profile/${post.uid}`}>{avatar ? <img className='header-img' src={avatar} alt="avatar"/> : <div className='clo'></div>}</Link>
                        <span className='header-title'>{post.uName}{post.uid === "CmG7f8TGwDPEouwwNqnYUJmB5lr1" ? <img src={admin} className='header_admin' alt='Админ'></img> : null}</span>
                        {/*<img onClick={() => deletePostHandler()} className='header-trash' src={trash} alt="trash"/>*/}
                    </section>
                    <section className='header-tools'>
                        {
                            auth.currentUser.uid === post.uid || auth.currentUser.uid === 'CmG7f8TGwDPEouwwNqnYUJmB5lr1' ? (
                                <>
                                    {
                                        isEditOpen ? <img onClick={() => isEditHandler()} className='header-edit' src={edit} alt="edit"/> : <img onClick={() => isEditOpenHandler()} className='header-edit' src={check} alt="edit"/>
                                    }

                                    <img onClick={() => deletePostHandler()} className='header-trash' src={trash} alt="trash"/>
                                </>
                            ) : null
                        }

                    </section>
                </section>
                {open ? <Popup src={post.img} text={post.title} open={setOpen}/> : null}
                {
                    post.img && isEditOpen ?  <img onClick={() => {setOpen(true)}} className='post-img' src={post.img} alt="test"/> : null
                }
                {
                    !isEditOpen ?  (
                        <>
                            <input onChange={(e) => setData({...data, img: e.target.files[0]})} id='field__file-2' className='btn file-btn' type='file'/>
                            <label className="field__file" htmlFor="field__file-2">
                                <img className="post-upload" src={uploadimage} alt="uploadimage"/>
                                <span className='post-name'>{data.img.name}</span>
                            </label>
                        </>
                    ) : null
                }
                {
                    isEditOpen ? <h2 className='post-title'>{post.title}</h2> : <input onChange={(e) => setData({...data, title: e.target.value})} className='post-input post-input-title' type="text" value={data.title}/>
                }

                <div className='header-desh'></div>
                {
                    isEditOpen ? <p className='post-desc'>{post.desc}</p>  : <input onChange={(e) => setData({...data, desc: e.target.value})}  className='post-input post-input-desc' type="text" value={data.desc}/>
                }
                <section className='post-tools'>
                    <section className='post-like'>
                        {
                            isLike
                                ?
                                <img onClick={(e) => likeHandler()} className='post-like-img' src={like} alt="like"/>
                                :
                                <img onClick={(e) => likeHandler()} className='post-like-img' src={likefill} alt="like"/>
                        }
                        {
                            post.counterLikes.length ? <span className='post-like-counter'>{post.counterLikes.length}</span> : null
                        }

                    </section>
                    <span className='post-date'><Moment format="HH:mm:ss DD.MM.YYYY">{post.createdAt.toDate()}</Moment></span>
                </section>
            </section>
        </>
    ): null
};

export default Post;
