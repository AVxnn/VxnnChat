import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import './style.css'
import newPost from '../../img/pencil.png'
import check from '../../img/check.png'
import uploadimage from '../../img/uploadimage.png'
import Post from "../../features/post/post";
import {getAuth} from "firebase/auth";
import {addDoc, collection, getFirestore, onSnapshot, orderBy, query, Timestamp} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../shared/api/firebase";
import Github from "../../features/github/github";

const Lenta = () => {

    const auth = getAuth()
    const db = getFirestore()

    const [open, setOpen] = useState(true)
    const [error, setError] = useState('')
    const [isAll, setIsAll] = useState(true)
    const [data, setData] = useState({
        img: '',
        title: '',
        desc: '',
        uid: '',
        createdAt: ''
    })
    const [posts, setPosts] = useState([])
    const [postsFilter, setPostsFilter] = useState([])
    const [postId, setPostId] = useState([])

    const openPostHandler = () => {
        setOpen(false)
    }

    const changleFilter = (e) => {
        if (isAll) {
            setPostsFilter(posts.filter(e => e.recommendation === true))
        } else {
            setPostsFilter(posts)
        }
        if (e === 'rec') {
            setIsAll(false)
        } else {
            setIsAll(true)
        }
    }

    const sendPostHandler = async (e) => {
        e.preventDefault();
        let rec = false
        if (data.title.length <= 10 && data.desc.length <= 10) return null
        if (!data.title && !data.desc) return null

        if (data.title.length >= 20 && data.desc.length >= 60 && data.img) {
            rec = true
        }

        if (data.img) {
            const imgRef = ref(
                storage,
                `posts/${new Date().getTime()} - ${data.img.name}`
            )
            const snap = await uploadBytes(imgRef, data.img)
            const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
            data.img = dlUrl
        }

        setOpen(false)

        await addDoc(collection(db, "posts"), {
            img: data.img || '',
            title: data.title,
            desc: data.desc,
            createdAt: Timestamp.fromDate(new Date()),
            counterLikes: [],
            id: Math.round(Math.random() * 10000000),
            uid: auth.currentUser.uid,
            uPhotoURL: auth.currentUser.photoURL,
            uName: auth.currentUser.displayName,
            recommendation: rec
        })
        setData({
            img: '',
            title: '',
            desc: '',
            uid: '',
            createdAt: ''
        })
    }

    useEffect(() => {
        let unsub = null
        unsub = onSnapshot(query(collection(db, "posts"), orderBy('createdAt')), (querySnapshot) => {
            const posts = [];
            const postId = [];
            querySnapshot.forEach((doc) => {
                posts.unshift(doc.data());
                postId.push(doc._document.key.path.segments[6])
            });
            setPosts(posts)
            postId.reverse()
            setPostId(postId)
            setPostsFilter(posts)
        });
        return () => unsub()
    }, [])

    return (
        <>
            <main className="background">
                <Header />
                <section className='lenta-container'>
                    <section className='lenta-tools'>
                        <nav className='lenta-nav'>
                            <span onClick={() => changleFilter()} className={`lenta-nav_item ${isAll ? 'active' : ''}`}>All posts</span>
                            <span onClick={() => changleFilter('rec')} className={`lenta-nav_item ${isAll ? '' : 'active'}`}>Recommendations</span>
                        </nav>
                        {
                            open ? <img
                                className='lenta-newpost'
                                onClick={() => openPostHandler()}
                                src={newPost}
                                alt="pencil"/> : <img onClick={() => setOpen(true)} className='lenta-newpost' src={check} alt="check"/>
                        }
                    </section>
                    {
                        !open ? (
                            <section className="addpost">
                                <input onChange={(e) => setData({...data, img: e.target.files[0]})} id='field__file-2' className='btn file-btn' type='file'/>
                                <label className="field__file" htmlFor="field__file-2">
                                    <img className="addpost-upload" src={uploadimage} alt="uploadimage"/>
                                    <span className='addpost-name'>{data.img.name}</span>
                                </label>
                                <label className='title' htmlFor="title">
                                    <span className='title-span'>Title:</span>
                                    <input onChange={(e) => setData({...data, title: e.target.value})} value={data.title} className='title-input' id='title' type="text"/>
                                </label>
                                <label className='title' htmlFor="title">
                                    <span className='title-span'>Desc:</span>
                                    <input onChange={(e) => setData({...data, desc: e.target.value})} value={data.desc}  className='title-input' id='title' type="text"/>
                                </label>
                                <section className='btn-container'>
                                    <span className='error'>{error}</span>
                                    <button onClick={(e) => sendPostHandler(e)} className='btn-send'>Send</button>
                                </section>
                            </section>
                        ) : null
                    }
                    <section className="posts">
                        {
                            postsFilter ? postsFilter.map((e, i) => {
                                return <Post key={e.id} auth={auth} post={e} postId={postId[i]}/>
                            }) : (
                                <section className='pin-user'>
                                    <h1 className='pin-title'>Пусто</h1>
                                </section>
                            )
                        }

                    </section>
                </section>
                <Github />
            </main>
        </>
    )
};

export default Lenta;
