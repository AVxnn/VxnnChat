import React, {useEffect, useState} from 'react';
import './style.sass'
import Popup from "../popup/popup";
import Moment from "react-moment";
import {collection, deleteDoc, doc, getFirestore, onSnapshot, query, updateDoc, where} from "firebase/firestore";
import {Link} from "react-router-dom";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../shared/api/firebase";
import uploadImage from "../../img/uploadimage.png";
import dots from "../../img/dots.png";

const Post = ({auth, post, postId, index}) => {
    const [data, setData] = useState({
        img: post.img,
        video: post.video,
        title: post.title,
        desc: post.desc
    })
    const [open, setOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(true)
    const [isLike, setIsLike] = useState(true)
    const [animation, setAnimation] = useState(!isLike)
    const [delay, setDelay] = useState(0)
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
        setAnimation(false)
        if (animation ) {
            setAnimation(false)
            setDelay(1000)
        } else {
            setAnimation(true)
            setDelay(0)
        }
        let myIndex = myArray.indexOf(auth.currentUser.uid)
        setTimeout(async () => {
            setAnimation(true)
            if (!animation) {
                setAnimation(false)
                setDelay(1000)
            } else {
                setAnimation(true)
                setDelay(0)
            }
            if (myIndex !== -1) {
                setIsLike(true)
                myArray.splice(myIndex, 1);
                await updateDoc(doc(db, 'posts', postId), {
                    counterLikes: [...myArray]
                })
            } else if (myIndex === -1) {
                setIsLike(false)
                await updateDoc(doc(db, 'posts', postId), {
                    counterLikes: [...post.counterLikes, auth.currentUser.uid]
                })
            }
        }, delay)

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
            setDelay(0)
        } else if (myIndex === -1) {
            setIsLike(true)
            setDelay(1000)
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
            <section className='post' style={{animationDelay: index * 200 + 'ms'}}>
                {open ? <Popup src={post.img} text={post.title} open={setOpen}/> : null}
                <section className='post-left'>
                    <Link className='header-a' to={`/profile/${post.uid}`}>{avatar ? <img className='header-img' src={avatar} alt="avatar"/> : <div className='header-img'></div>}</Link>
                </section>
                <section className='post-middle'>
                    <section className='post-header'>
                        <h4 className='post-header-title'>{post.uName}</h4>
                        {post.uid === "CmG7f8TGwDPEouwwNqnYUJmB5lr1" ? <span className='post-header-premium'>Premium</span> : null}
                        <span className='post-header-date'><Moment format="HH:mm DD.MM.YYYY">{post.createdAt.toDate()}</Moment></span>
                    </section>
                    {
                        isEditOpen ? <h2 className='post-title'>{post.title}</h2> : <input onChange={(e) => setData({...data, title: e.target.value})} className='post-input post-input-title' type="text" value={data.title}/>
                    }
                    {
                        post.img && isEditOpen ?  <img onClick={() => {setOpen(true)}} className='post-img' src={post.img} alt="test"/> : null
                    }
                    {
                        post.video ?  <video src={post.video} controls className='post-video'/> : null
                    }
                    <section className='post-tools'>
                        <section className='post-tools-like'>
                            {
                                isLike
                                    ?
                                    <span onClick={(e) => likeHandler(e)} className={`post-like-img ${animation ? 'animation' : ''}`}/>
                                    :
                                    <span onClick={(e) => animation ? '' : likeHandler(e)} className='post-like-img active'/>
                            }
                            {
                                post.counterLikes.length ? <span className='post-like-counter'>{post.counterLikes.length}</span> : null
                            }
                        </section>
                    </section>
                </section>
                <section className='post-right'>
                    {
                        auth.currentUser.uid === post.uid || auth.currentUser.uid === 'CmG7f8TGwDPEouwwNqnYUJmB5lr1' ? (
                            <section className="post-right-dots">
                                <img className="post-right-dots_img" src={dots} alt="dots"/>
                            </section>
                        ) : (
                            <section className="post-right-dots">
                                <img className="post-right-dots_img" src={dots} alt="dots"/>
                            </section>
                        )
                    }
                </section>
            </section>
        </>
    ): null
};

export default Post;
