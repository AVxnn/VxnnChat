import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import Github from "../../features/github/github";
import './style.css'
import avatar from '../../img/test.png'
import Moment from "react-moment";
import {NavLink} from "react-router-dom";
import {collection, onSnapshot, query} from "firebase/firestore";
import {auth, db} from "../../shared/api/firebase";

const Todo = () => {

  const [activeLink, setActiveLink] = useState(0)
  const [todos, setTodos] = useState([])
  const dateToFormat = new Date();
  const changeActiveLink = (i) => {
    switch (i) {
      case 'l':
        setActiveLink(0)
        break
      case 'o':
        setActiveLink(1)
        break
      case 'c':
        setActiveLink(2)
        break
      case 'a':
        setActiveLink(3)
        break
    }
  }

  const user = auth.currentUser.uid
  useEffect(() => {
    let unsub = null
    unsub = onSnapshot(query(collection(db, "todo", user, `${user}todo`)), (querySnapshot) => {
      const todos = [];
      querySnapshot.forEach((doc) => {
        todos.unshift(doc.data())
      });
      setTodos(todos)
    });
    return () => unsub()
  }, [])

  return (
    <main className="background">
      <Header />
      <section className='todo-container'>
        <section className='title-block'>
          <section className='title-block_left'>
            <h1 className='title-text'>Today’s Task</h1>
            <p className='title-data'><Moment format="dddd" withTitle>{dateToFormat}</Moment><span className='title-data_span'> <Moment format="D" withTitle>{dateToFormat}</Moment></span> <Moment format="MMM" withTitle>{dateToFormat}</Moment></p>
          </section>
          <NavLink to={'/todo/create'} className='title-block_btn'>+ New  Task</NavLink>
        </section>
        <section className='todo-filter'>
          <ul className='filter-list'>
            <li onClick={() => changeActiveLink('l')} className={`list-item ${0 == activeLink ? 'active' : ''}`}>All <div className='item-notification'>{todos.length}</div></li>
            <li onClick={() => changeActiveLink('o')} className={`list-item ${1 == activeLink ? 'active' : ''}`}>Open <div className='item-notification'>2</div></li>
            <li onClick={() => changeActiveLink('c')} className={`list-item ${2 == activeLink ? 'active' : ''}`}>Closed <div className='item-notification'>2</div></li>
            <li onClick={() => changeActiveLink('a')} className={`list-item ${3 == activeLink ? 'active' : ''}`}>Archived <div className='item-notification'>2</div></li>
          </ul>
        </section>
        <section className='todo-list'>
          {
            todos.map((i) => (
              <section className='todo-item'>
                <section className='item-top'>
                  <section className='item-top_left'>
                    <h3 className='item-top-title'>{i.title}</h3>
                    <p className='item-top-subtitle'>{i.description}</p>
                  </section>
                  <input className='item-top_check' type="checkbox"/>
                </section>
                <section className='item-bottom'>
                  <h3 className='item-bottom_title'>{i.date ? <Moment format='D MMM YYYY'>{i.date.toDate()}</Moment> : ''}</h3>
                  <section className='item-bottom_list'>
                    <img className='item-bottom_img' src={auth.currentUser.photoURL ? auth.currentUser.photoURL : avatar} alt="avatar"/>
                  </section>
                </section>
              </section>
            ))
          }
        </section>
      </section>
      <Github />
    </main>
  );
};

export default Todo;
