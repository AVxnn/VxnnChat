import React, {useEffect, useState} from 'react';
import './style.css'
import like from '../../img/like.png'
import likefill from '../../img/likefill.png'
import test from '../../img/test.png'
import Popup from "../popup/popup";
import Moment from "react-moment";
import {doc, getFirestore, updateDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import admin from "../../img/admin.png";

const Post = ({auth, post, postId}) => {
    const [open, setOpen] = useState(false)
    const [isLike, setIsLike] = useState(true)

    const db = getFirestore()

    console.log(postId)

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

    return post ? (
        <>
            <section className='post'>
                <section className='post-header'>
                    <section className='header-user'>
                        <img className='header-img' src={post.uPhotoURL} alt="avatar"/>
                        <span className='header-title'>{post.uName}{auth.currentUser.uid === "MnNJHrLjWRWqUoMa1aBdoqnwPO43" ? <img src={admin} className='header_admin' alt='Админ'></img> : null}</span>
                    </section>
                </section>
                {open ? <Popup src={test} text={`New 2 Version in chat | add lenta`} open={setOpen}/> : null}
                {
                    post.img ? <img onClick={() => {setOpen(true)}} className='post-img' src={post.img} alt="test"/> : null
                }
                <h2 className='post-title'>{post.title}</h2>
                <hr/>
                <p className='post-desc'>{post.desc}</p>
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
