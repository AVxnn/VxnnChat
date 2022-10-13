import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import {NavLink, useParams} from "react-router-dom";
import {collection, doc, onSnapshot, query} from "firebase/firestore";
import {auth, db} from "../../shared/api/firebase";
import trash from '../../img/trash.png'

const TodoOpen = ({e}) => {
  const params = useParams();
  console.log(params)

  const [todo, setTodo] = useState()

  const user = auth.currentUser.uid

  useEffect(() => {
    let unsub = null
    unsub = onSnapshot(query(doc(db, "todo", user, `${user}todo`, params.tid)), (querySnapshot) => {
      setTodo(querySnapshot.data())
    });
    return () => unsub()
  }, [])

  return (
    <>
      <main className="background">
        <Header />
        <section className='todo-container'>
          <section className='title-block'>
            <section className='title-block_left'>
              <h1 className='title-text'>Task Edit</h1>
            </section>
            <NavLink to={'/todo/create'} className='title-block_btn_trash'><img src={trash} alt="trash"/></NavLink>
          </section>
        </section>
      </main>
    </>
  );
};

export default TodoOpen;
