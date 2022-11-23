import React, {useEffect, useState, useContext, useRef} from 'react';
import './style.sass'
import TextareaAutosize from 'react-textarea-autosize';
import pen from '../../img/pencil.png'
import avatar from "../../features/message-item/img/avatar.png";
import video from '../../img/video.png'
import Post from "../../features/post/post";
import {getAuth} from "firebase/auth";
import {addDoc, collection, doc, getDoc, getFirestore, onSnapshot, orderBy, query, Timestamp} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../shared/api/firebase";
import {AuthContext} from "../../shared/contextauth/auth";
import addImage from "../../img/addImage.png";
import {Helmet} from "react-helmet";

const Lenta = () => {

    const auth = getAuth()
    const db = getFirestore()

    const {user} = useContext(AuthContext)

    const listRef = useRef(null)

    const viewsPage = 999

    const [dataUser, setDataUser] = useState({})
    const [iImgMessenger, setImgMessenger] = useState()
    const [VideoMessenger, setVideoMessenger] = useState('')
    const [data, setData] = useState({
        img: '',
        video: '',
        title: '',
        desc: '',
        uid: '',
        createdAt: ''
    })
    const [posts, setPosts] = useState([])
    const [postsFilter, setPostsFilter] = useState([])
    const [postId, setPostId] = useState([])

    const [list, setList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const currentCompanies = postsFilter.slice(0, currentPage * viewsPage)
        setList(currentCompanies)
    }, [posts, currentPage])

    useEffect(() => {
        getDoc(doc(db, 'users' , user.uid)).then(docSnap => {
            if (docSnap.exists) {
                setDataUser(docSnap.data())
            }
        })

    }, [user])

    const changeImg = (e, type) => {
        if (type === 'image') {
            setData({...data, img: e})
            let fileReader = new FileReader();
            fileReader.onload = function() {
                let res = fileReader.result;
                setImgMessenger(res)
            }

            fileReader.readAsDataURL(e);
        } else {
            setData({...data, video: e})
            let fileReader = new FileReader();
            fileReader.onload = function() {
                let res = fileReader.result;
                setVideoMessenger(res)
            }

            fileReader.readAsDataURL(e);
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
            let dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
            data.img = dlUrl
        }

        if (data.video) {
            const imgRef = ref(
                storage,
                `posts/${new Date().getTime()} - ${data.video.name}`
            )
            const snap = await uploadBytes(imgRef, data.video)
            const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
            data.video = dlUrl
        }

        await addDoc(collection(db, "posts"), {
            img: data.img || '',
            video: data.video || '',
            title: data.title,
            desc: data.desc,
            createdAt: Timestamp.fromDate(new Date()),
            counterLikes: [],
            id: Math.round(Math.random() * 10000000),
            uid: dataUser.uid,
            uPhotoURL: dataUser.avatar,
            uName: dataUser.name,
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
    console.log(list)
    return (
        <>
            <Helmet>
                <title>{`PetChat - Lenta`}</title>
            </Helmet>
            <main className="background">
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
                                <span className='lenta-span'>Post In</span>
                            </button>
                        </section>
                        {
                            data?.title?.length >= 1 && (
                              <section className='lenta-tools-bottom'>
                                  <input onChange={(e) => changeImg(e.target.files[0], 'image')} id='field__file-2' className='btn file-btn' type='file'/>
                                  <div className='empty'></div>
                                  <label className="lenta-image-btn" htmlFor="field__file-2">
                                      <img className='lenta-btn' src={addImage} alt=""/>
                                  </label>
                                  {
                                  iImgMessenger && (
                                      <img className='added-img' src={iImgMessenger} alt=""/>
                                  )
                                  }
                                  <input onChange={(e) => changeImg(e.target.files[0], 'video')} id='field__file-3' className='btn file-btn' type='file'/>
                                  <label className="lenta-video-btn" htmlFor="field__file-3">
                                      <img className='lenta-btn-video' src={video} alt=""/>
                                  </label>
                                  {
                                      VideoMessenger && (
                                          <>
                                              <video src={VideoMessenger} width="750" height="500" className='added-img'>
                                              </video>
                                          </>
                                      )
                                  }
                              </section>
                          )
                        }
                    </section>
                    <section ref={listRef} className="posts">
                        {
                            list ? list.map((e, i) => {
                                return <Post key={e.id} auth={auth} post={e} postId={postId[i]} index={i}/>
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
