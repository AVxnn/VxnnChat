import React, {useEffect, useState} from 'react';
import Header from "../../widgets/header/header";
import {NavLink, useNavigate} from "react-router-dom";
import avatar from "../../img/test.png";
import DatePicker from "react-datepicker";
import Github from "../../features/github/github";
import createImg from './img/create.png'
import user from './img/user.png'
import teams from './img/teams.png'
import './style.css'
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import {addDoc, collection, onSnapshot, orderBy, query, Timestamp} from "firebase/firestore";
import {auth, db} from "../../shared/api/firebase";

const TodoCreate = () => {

  const [data, setData] = useState({
    title: '',
    category: 0,
    description: '',
    date: '',
    time: ''
  })

  let navigate = useNavigate();

  const changeDate = (type, item) => {
    setData({...data, [type]: item})
  }

  const user = auth.currentUser.uid

  const createTodo = async () => {
    await addDoc(collection(db, 'todo', user, `${user}todo`), {
      title: data.title,
      description: data.description,
      category: data.category,
      uid: user,
      date: data.date,
      time: data.time,
      archived: false,
      open: true,
      closed: false
    })
    navigate('/todo')
  }

  return (
    <main className="background">
      <Header />
      <section className='todo-container'>
        <section className='title-task'>
          <h2 className='title-task_title'>Title Task</h2>
          <input onChange={(i) => changeDate('title', i.currentTarget.value)} className='title-task_input' type="text" placeholder='Add Task Name..'/>
        </section>
        <section className='category-task'>
          <h2 className='category_title'>Category</h2>
          <section className='category-input'>
            <section onClick={() => changeDate('category',0)} className={`input-left ${data.category == 0 ? 'active' : ''}`}>
              <img className='category_icon' src={user} alt=""/>
              <span className='category_subtitle'>Personal</span>
            </section>
            <section onClick={() => changeDate('category',0)} className={`input-right ${data.category == 1 ? 'active' : ''}`}>
              <img className='category_icon' src={teams} alt='Не работает'/>
              <span className='category_subtitle'>Teams soon</span>
              {/*<span className="tooltiptext">Soon...</span>*/}
            </section>
            <div className='category-dash'></div>
          </section>
        </section>
        <section className='description'>
          <h2 className='description_title'>Description</h2>
          <textarea onChange={(i) => changeDate('description', i.currentTarget.value)} className='description_input' placeholder='Add Description..'/>
        </section>
        <section className='date'>
          <section className='date-section'>
            <h2 className='date_title'>Date</h2>
            <section className='date-btn'>
              <DatePicker selected={data.date} onChange={(e) => setData({...data, date: e})} className='date-input'/>
            </section>
          </section>
          <section className='time-section'>
            <h2 className='time_title'>Time</h2>
            <section className='time-btn'>
              <TimePicker className='time-input' onChange={(e) => setData({...data, time: e})}/>
            </section>
          </section>
        </section>
        <section className='create'>
          <section className='create-left'>
            <button onClick={() => navigate('/todo')} className='cancel-btn'>Cancel</button>
          </section>
          <section className='create-right'>
            <button onClick={() => createTodo()} className='create-btn'>Create</button>
          </section>
        </section>
      </section>
      <Github />
    </main>
  );
};

export default TodoCreate;
