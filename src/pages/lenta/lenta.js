import React, {useEffect, useState, useContext} from 'react';
import Header from "../../widgets/header/header";
import './style.css'
import TextareaAutosize from 'react-textarea-autosize';
import pen from '../../img/pencil.png'
import avatar from "../../features/message-item/img/avatar.png";
import uploadimage from '../../img/uploadimage.png'
import Post from "../../features/post/post";
import {getAuth} from "firebase/auth";
import {addDoc, collection, getFirestore, onSnapshot, orderBy, query, Timestamp} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../shared/api/firebase";
import {AuthContext} from "../../shared/contextauth/auth";
import addImage from "../../img/addImage.png";

const Lenta = () => {

    const auth = getAuth()
    const db = getFirestore()

    const {user} = useContext(AuthContext)

    const [open, setOpen] = useState(true)
    const [error, setError] = useState('')
    const [isAll, setIsAll] = useState(true)
    const [iImgMessenger, setImgMessenger] = useState()
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

    const changeImg = (e) => {
        setData({...data, img: e})
        var fileReader = new FileReader();
        fileReader.onload = function() {
            let res = fileReader.result;
            setImgMessenger(res)
        }

        fileReader.readAsDataURL(e);
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
                        <section className='lenta-tools-top'>
                            <img className='lenta-avatar' src={user?.photoURL ? user?.photoURL : avatar} alt="Avatar"/>
                            <TextareaAutosize onChange={e => setData({...data, title: e.target.value})}
                                              className='lenta-form'
                                              maxRows={10}
                                              value={data.title}
                                              placeholder='Type a message'/>
                            <button
                              onClick={(e) => sendPostHandler(e)}
                              className='lenta-send-btn'>
                                <img className='lenta-btn' src={pen} alt=""/>
                                <span>Post In</span>
                            </button>
                        </section>
                        {
                            data?.title?.length >= 1 && (
                              <section className='lenta-tools-bottom'>
                                  <input onChange={(e) => changeImg(e.target.files[0])} id='field__file-2' className='btn file-btn' type='file'/>
                                  <div className='empty'></div>
                                  <label className="lenta-image-btn" htmlFor="field__file-2">
                                      <img className='lenta-btn' src={addImage} alt=""/>
                                  </label>
                                  {
                                      iImgMessenger && (
                                      <img className='added-img' src={iImgMessenger} alt=""/>
                                    )
                                  }
                              </section>
                          )
                        }
                    </section>
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
            </main>
        </>
    )
};

export default Lenta;
