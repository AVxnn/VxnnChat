import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import Github from "../../features/github/github";
import './style.css'
import avatar from '../../img/test.png'
import Moment from "react-moment";
import {NavLink, useNavigate} from "react-router-dom";
import {collection, doc, onSnapshot, query, updateDoc} from "firebase/firestore";
import {auth, db} from "../../shared/api/firebase";

const Todo = () => {

  const navigate = useNavigate()

  const [activeLink, setActiveLink] = useState(0)
  const [todos, setTodos] = useState([])
  const [todosFilter, setTodosFilter] = useState([])
  const [closed, setClosed] = useState(false)
  const dateToFormat = new Date();
  const changeActiveLink = (i) => {
    switch (i) {
      case 'l':
        setActiveLink(0)
        setTodosFilter(todos)
        break
      case 'o':
        setActiveLink(1)
        setTodosFilter(todos.filter(i => !i.closed))
        break
      case 'c':
        setActiveLink(2)
        setTodosFilter(todos.filter(i => i.closed))
        break
      case 'a':
        setActiveLink(3)
        break
    }
  }

  const changeChecked = async (e) => {
    if (e.closed) {
      setClosed(true)
      await updateDoc(doc(db, 'todo', user, `${user}todo`, e.tid), {
        closed: false,
      })
    } else {
      setClosed(true)
      await updateDoc(doc(db, 'todo', user, `${user}todo`, e.tid), {
        closed: true,
      })
    }
  }

  const openTodo = async (e) => {
    navigate(`/todo/${e.tid}`)
  }

  const user = auth.currentUser.uid
  useEffect(() => {
    let unsub = null
    unsub = onSnapshot(query(collection(db, "todo", user, `${user}todo`)), (querySnapshot) => {
      const todos = [];
      querySnapshot.forEach((doc) => {
        console.log()
        todos.unshift({...doc.data(), tid: doc._document.key.path.segments[8]})
      });
      setTodos(todos)
      setTodosFilter(todos)
      setActiveLink(0)
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
            <li onClick={() => changeActiveLink('o')} className={`list-item ${1 == activeLink ? 'active' : ''}`}>Open <div className='item-notification'>{todos.filter(i => !i.closed).length}</div></li>
            <li onClick={() => changeActiveLink('c')} className={`list-item ${2 == activeLink ? 'active' : ''}`}>Closed <div className='item-notification'>{todos.filter(i => i.closed).length}</div></li>
            <li onClick={() => changeActiveLink('a')} className={`list-item ${3 == activeLink ? 'active' : ''}`}>Archived <div className='item-notification'>2</div></li>
          </ul>
        </section>
        <section className='todo-list'>
          {
            todosFilter.map((i, index) => (
              <section key={index} className='todo-item' style={{borderLeft: `10px solid ${i.color ? i.color : '#FFFFFF'}`}}>
                <section className='item-top'>
                  {/*onClick={() => openTodo(i)}*/}
                  <section className='item-top_left'>
                    <h3 className={`item-top-title ${i.closed ? 'closed' : ''}`}>{i.title}</h3>
                    <p className='item-top-subtitle'>{i.description}</p>
                  </section>
                  <input checked={i.closed} className='item-top_check' id='happy' type="checkbox"/>
                  <label onClick={() => changeChecked(i)} htmlFor="happy"><div className='item-top_check-div'></div></label>
                </section>
                <section className='item-bottom'>
                  <h3 className='item-bottom_title'>{(i.date ? <Moment format='D MMM'>{i.date.toDate()}</Moment> : '')} <span>{i?.time ? i.time : ''}</span></h3>
                  <section className='item-bottom_list'>
                    <img className='item-bottom_img' src={auth.currentUser.photoURL ? auth.currentUser.photoURL : avatar} alt="avatar"/>
                  </section>
                </section>
              </section>
            ))
          }
        </section>
      </section>
    </main>
  );
};

export default Todo;