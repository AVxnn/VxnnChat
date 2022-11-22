import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import avatar from "../../img/te.png";
import camera from "../../img/camera.png";
import edit from "../../img/edit.png";
import Github from "../../features/github/github";
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import {getAuth, updateProfile} from "firebase/auth";
import {useNavigate, useParams} from "react-router-dom";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../shared/api/firebase";
import './style.sass'

const ProfileEdit = () => {


  const [us, setUs] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [nameChanger, setNameChanger] = useState(true)
  const [img, setImg] = useState('')
  const [imgBg, setImgBg] = useState('')
  const db = getFirestore()
  const auth = getAuth()

  const navigate = useNavigate();

  const {userId} = useParams()

  const changeName = () => {
    setNameChanger(false)
    setName(auth.currentUser.displayName)
  }

  const changeNameHandler = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      name: name ? name : user?.name,
      description: description ? description : user?.description,
      link: link ? link : user?.link
    })
    setUs({
      ...us,
      name: name,
      description: description,
      link: link
    })
    await updateProfile(auth.currentUser, {
      displayName: name,
    })
    setNameChanger(true)
    navigate(`/profile/${auth.currentUser.uid}`)
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
          if (user?.avatarPath) {
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
          console.log(e.message, e)
        }
      }
      uploadImg()
    }
  }, [img, userId])

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

    if (imgBg) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `background/${new Date().getTime()} - ${imgBg.name}`
        )
        try{
          if (user?.backgroundPath) {
            await deleteObject(ref(storage, user.backgroundPath))
          }
          const snap = await uploadBytes(imgRef, imgBg)
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath))

          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            background: url,
            backgroundPath: snap.ref.fullPath
          })
          setImgBg('')
        } catch (e) {
          console.log(e.message)
        }
      }
      uploadImg()
    }
  }, [imgBg])

  console.log(user)
  return (
    <>
      <main className="background">
        <section className="block-profile">
          <div className='profile-background' style={{backgroundImage: `url(${user?.background})`}}>
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
          {userId === auth.currentUser.uid ? (
          <section className='toolBar-edit'>
            <button className='toolBar-btn'>
              {user ? (
                <>
                  {userId === auth.currentUser.uid ? (
                    <input id='file_bg'z
                           accept='image/*'
                           type="file"
                           onChange={e => setImgBg(e.target.files[0])}/>) : null }
                </>
              ) : null}
              <label className='toolBar-btn_label' htmlFor="file_bg">
                <img className='toolBar-btn_img' src={edit} alt="edit"/>
              </label>
            </button>
          </section>
          ): ''}
          <section className='info-newBlock-edit'>
            {
              user && (
                <>
                  <section className='info-name'>
                    <h2 className='info-name_title'>Name</h2>
                    <input onChange={(e) => setName(e.currentTarget.value)} className='info-name_input' type="text" placeholder={`${user.name}...`}/>
                  </section>
                  <section className='info-desc'>
                    <h2 className='info-desc_title'>Description</h2>
                    <input onChange={(e) => setDescription(e.currentTarget.value)} className='info-desc_input' type="text" placeholder={`${user.description}...`}/>
                  </section>
                  <section className='info-link'>
                    <h2 className='info-link_title'>Link</h2>
                    <input onChange={(e) => setLink(e.currentTarget.value)} className='info-link_input' type="text" placeholder={`${user.link}...`}/>
                  </section>
                </>
              )
            }
            <section className='save'>
              <section className='save-left'>
                <button onClick={() => navigate(`/profile/${auth.currentUser.uid}`)} className='cancel-btn'>Cancel</button>
              </section>
              <section className='save-right'>
                <button onClick={() => changeNameHandler()} className='save-btn'>Create</button>
              </section>
            </section>
          </section>
        </section>
      </main>
    </>
  )
};

export default ProfileEdit;
