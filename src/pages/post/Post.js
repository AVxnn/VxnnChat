import React, {useEffect, useState} from 'react';
import './style.sass'
import Header from "../../widgets/header/header";
import {useParams} from "react-router-dom";
import {collection, doc, getDoc, onSnapshot} from "firebase/firestore";
import {db} from "../../shared/api/firebase";
import button from "../../shared/button/button";
import Error from "../error/error";
import {Helmet} from "react-helmet";

const Title = ({text}) => {
  return (
    <h1 className={'title'}>{text}</h1>
  )
}

const Description = ({text}) => {
  return (
    <p className={'description'}>{text}</p>
  )
}

const Quote = ({text}) => {
  return (
    <div className={'quote'}>
      <p>{text}</p>
    </div>
  )
}

const Image = ({img, url}) => {
  return (
    <div className={'image-p'}>
      <img src={url}/>
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

const Post = () => {

  const params = useParams()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)

  useEffect(() => {
      let unsub = onSnapshot(collection(db, `news`, `${params.id}`, 'data'), (querySnapshot) => {

        querySnapshot.forEach(snapshot => {
          setData([...data, snapshot.data()])
        })
      })
      return () => unsub()
  }, [params])

  useEffect(() => {
    if (data.length <= 0) {
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [data])
  console.log(data)

  return (
    <>
      <Helmet>
        <title>{`PetChat - Post ${params.id}`}</title>
      </Helmet>
      <main className="background">
        <div className='post-container'>
          <div className='post-container-margin'>
            {
              empty && (
                <>
                  <Error />
                </>
              )
            }
            {
              loading ? (
                <>
                  {
                    data[0].data.map((item, index) => {
                      switch (item.type) {
                        case 'title':
                          return <Title text={item.text}/>
                        case 'description':
                          return <Description text={item.text}/>
                        case 'quote':
                          return <Quote text={item.text}/>
                        case 'image':
                          return <Image url={item.url}/>
                        case 'button':
                          return <Button text={item.text} link={item.link}/>
                      }
                    })
                  }
                </>
              ) : ''
            }
          </div>
        </div>
      </main>
    </>
  );
};

export default Post;
