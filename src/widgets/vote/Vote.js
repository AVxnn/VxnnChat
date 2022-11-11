import React, {useEffect, useState} from 'react';
import './style.sass'
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../shared/api/firebase";

const Vote = () => {

  const [data, setData] = useState([])

  useEffect(() => {
    let unsub = onSnapshot(doc(db, 'vote', 'main'), (doc) => {
      setData(doc.data())
      console.log(doc.data())
    })
    return () => unsub()
  }, [])

  const submitVote = (type) => {
    console.log(data)
  }

  return (
    <>
      <section className='main-sublist'>
        <section className='main-vote'>
          <h3 className='vote-title'>Что добавить следущее?</h3>
          <section className='vote-list'>
            <button onClick={() => {submitVote('first')}} className='vote-item_btn first'>SleepTimer</button>
            <button onClick={() => {submitVote('second')}} className='vote-item_btn second'>Update Profile</button>
            <button onClick={() => {submitVote('third')}} className='vote-item_btn third'>Add new features</button>
          </section>
        </section>
      </section>
    </>
  );
};

export default Vote;
