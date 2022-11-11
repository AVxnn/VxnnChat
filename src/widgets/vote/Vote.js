import React, {useContext, useEffect, useState} from 'react';
import './style.sass'
import {updateDoc, collection, doc, onSnapshot} from "firebase/firestore";
import {db} from "../../shared/api/firebase";
import {AuthContext} from "../../shared/contextauth/auth";

const Vote = () => {

  const [data, setData] = useState([])
  const [vote, setVote] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user } = useContext(AuthContext)

  useEffect(() => {
    let unsub = onSnapshot(doc(db, 'vote', 'main'), (doc) => {
      setData(doc.data())
      console.log(doc.data())
    })
    return () => unsub()
  }, [])

  const submitVote = async (type) => {
    if (!vote) {
      setLoading(false)
      setData({...data, [type]: [...data[type], user.uid]})
      await updateDoc(doc(db, "vote", 'main'), {...data, [type]: [...data[type], user.uid]})
    }
  }

  useEffect( () => {
    if (data.first) {
      if ([...data.first.filter(i => i === user.uid), ...data.second.filter(i => i === user.uid), ...data.third.filter(i => i === user.uid)].length > 0) {
        setVote(true)
      } else {
        setVote(false)
      }
    }
  }, [data])

  return data.first && (
    <>
      <section className='main-sublist'>
        <section className='main-vote'>
          <h3 className='vote-title'>Голосование (что добавить следущее)</h3>
          <section className='vote-list'>
            <div onClick={() => submitVote('first')} className='vote-item_btn first'>
              {
                vote && <div className='vote-dash' style={{width: 100 * (data.first.length / (data.first.length + data.second.length + data.third.length)) + '%'}}></div>
              }
              <span className='vote-span'>SleepTimer</span>
            </div>
            <div onClick={() => submitVote('second')} className='vote-item_btn second'>
              {
                vote && <div className='vote-dash' style={{width: 100 * (data.second.length / (data.first.length + data.second.length + data.third.length)) + '%'}}></div>
              }
              <span className='vote-span'>Update Profile</span>
            </div>
            <div onClick={() => submitVote('third')} className='vote-item_btn third'>
              {
                vote && <div className='vote-dash' style={{width: 100 * (data.third.length / (data.first.length + data.second.length + data.third.length)) + '%'}}></div>
              }
              <span className='vote-span'>Add new features</span>
            </div>
            {/*<button onClick={() => {submitVote('first')}} className='vote-item_btn first'><span></span> </button>*/}
            {/*<button onClick={() => {submitVote('second')}} className='vote-item_btn second'><span>Update Profile</span> {100 * (data.second.length / (data.first.length + data.second.length + data.third.length))}</button>*/}
            {/*<button onClick={() => {submitVote('third')}} className='vote-item_btn third'><span>Add new features</span> {100 * (data.third.length / (data.first.length + data.second.length + data.third.length))}</button>*/}
          </section>
        </section>
      </section>
    </>
  );
};

export default Vote;
