import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import './style.sass'
import button from "../../shared/button/button";
import imageSnap from "../../shared/snap/image/imageSnap";
import TextareaAutosize from "react-textarea-autosize";
import addImage from "../../img/addImage.png";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {db, storage} from "../../shared/api/firebase";
import {addDoc, collection, doc, Timestamp} from "firebase/firestore";
import {useNavigate} from "react-router-dom";

const Title = ({text, id, handlerTitle}) => {
  return (
    <TextareaAutosize onChange={(e) => handlerTitle(e.target.value, id)} placeholder={'Type title'} className={'title'} />
  )
}

const Description = ({text}) => {
  return (
    <TextareaAutosize placeholder={'Type description'} className={'description'} />
  )
}

const Quote = ({text}) => {
  return (
    <div className={'quote'}>
      <TextareaAutosize placeholder={'Type quote'} className={'quote'} />
    </div>
  )
}

const Image = ({handleSubmit, uid, url}) => {

  const addImageHandler = (img) => {
    handleSubmit(img, uid)
  }


  return (
    <div className={url ? 'image-active' : 'image'}>
      <input onChange={(e) => addImageHandler(e.target.files[0])} id='field__file-2' className='btn file-btn' type='file'/>
      <label className="field__file" htmlFor="field__file-2">
        {
          url ? (
            <img src={url} alt=""/>
          ) : (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="13" width="6" height="32" rx="3" fill="#D9D9D9"/>
              <rect x="32" y="13" width="6" height="32" rx="3" transform="rotate(90 32 13)" fill="#D9D9D9"/>
            </svg>
          )
        }
      </label>
    </div>
  )
}

const Button = ({text, link}) => {
  return (
    <button className={'button'}>
      <a href={link}>{text}</a>
    </button>
  )
}

const PostCreate = () => {

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [openRelease, setOpenRelease] = useState(false)
  const [data, setData] = useState([])
  const [img, setImg] = useState()
  const [link, setLink] = useState('')

  const openHandler = () => {
    setOpen(!open)
  }

  const list = [
    {title: 'title', color: '#00FFB2'},
    {title: 'description', color: '#00C2FF'},
    {title: 'quote', color: '#FF3D00'},
    {title: 'image', color: '#E00086'},
    {title: 'button', color: '#F2C94C'},
  ]

  const createBlock = (type) => {
    setData([...data,{
      type: type,
      id: data.length
    }])
    console.log(data)
  }

  const handlerTitle = (text, id) => {
    let oldData = data.filter((item) => item.id === id);
    setData([...data.filter((item) => item.id !== id), {
      type: oldData[0].type,
      id: id,
      text: text
    }])
  }

  const handleSubmit = async (img, id) => {
    let url
    if (img) {
      const imgRef = ref(
        storage,
        `news/${new Date().getTime()} - ${img.name}`
      )
      const snap = await uploadBytes(imgRef, img)
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
      url = dlUrl
    }
    let oldData = data.filter((item) => item.id === id);
    setData([...data.filter((item) => item.id !== id), {
      type: oldData[0].type,
      id: id,
      url: url
    }])
  }


  const savePost = async (id) => {
    await addDoc(collection(db, "news", id, 'data'), {data})
    setOpenRelease(false)
    navigate(`/post/${id}`)
  }
  console.log(link)
  return (
    <main className="background">
      <Header />
      <div className='post-create-container'>
        <div className='post-header'>
          <h1 className='post-create-title'>Новый пост</h1>
          <button className='post-create-save' onClick={() => setOpenRelease(!openRelease)}>{openRelease ? 'Закрыть' : 'Опубликовать'}</button>
        </div>
        {
          openRelease ? (
            <div className='post-create-link'>
              <h2>Сome up with an ID</h2>
              <input onChange={(e) => setLink(e.target.value)} placeholder={'post/ > *type id* <'} type="text"/>
              <button onClick={() => savePost(link)}>Опубликовать</button>
            </div>
          ) : (
            <div>
              {
                data && data.map((item, index) => {
                  switch (item.type) {
                    case 'title':
                      return <Title handlerTitle={handlerTitle} id={item.id}/>
                    case 'description':
                      return <Description uid={item.id}/>
                    case 'quote':
                      return <Quote uid={item.id}/>
                    case 'image':
                      return <Image handleSubmit={handleSubmit} uid={item.id} setImg={setImg} url={item?.url}/>
                    case 'button':
                      return <Button uid={item.id} link={item.link}/>
                  }
                })
              }
              {
                !open ? (
                  <div onClick={() => openHandler()} className='post-create-add'>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="13" width="6" height="32" rx="3" fill="#D9D9D9"/>
                      <rect x="32" y="13" width="6" height="32" rx="3" transform="rotate(90 32 13)" fill="#D9D9D9"/>
                    </svg>
                  </div>
                ) : (
                  <>
                    <div onClick={() => openHandler()} className='post-create-add-active'>
                      {
                        list.map((item) => (
                          <>
                            <span onClick={() => createBlock(item.title)} style={{backgroundColor: item.color}} className='post-create-add-active-btn'>{item.title}</span>
                          </>
                        ))
                      }
                    </div>
                  </>
                )
              }
            </div>
          )
        }
      </div>
    </main>
  );
};

export default PostCreate;
