import React from 'react';
import Header from "../../widgets/header/header";
import block from '../../img/block.png'
import './style.css'
import Button from "../../shared/button/button";
import {getAuth} from "firebase/auth";
import Github from "../../features/github/github";
import arrowRight from "../../img/arrow-right.png";
import bg from "../../img/bgbg.png";
import bg2 from "../../img/bg2.png";
import {NavLink} from "react-router-dom";

const Main = () => {

    const auth = getAuth().currentUser

    const data = [
      {
        title: 'Новая версия чата',
        format: 1,
        image: 'https://p4.wallpaperbetter.com/wallpaper/377/893/142/vector-landscape-minimalism-hd-wallpaper-preview.jpg',
        btntext: 'Узнать больше',
        link_format: 1,
        link: '/lenta'
      },
      {
        title: 'Обновленный профиль 💪',
        format: 2,
        image: 'https://assets-global.website-files.com/5e6a544cadf84b1393e2e022/611ab4ae1a89e8fb54119d5b_Vectornator_illustration_space_futuristic.png',
        btntext: 'Заценить',
        link_format: 2,
        link: `/profile/CmG7f8TGwDPEouwwNqnYUJmB5lr1`
      },
      {
        title: 'Набор админов 👌🏼',
        format: 2,
        image: '',
        btntext: 'Заявиться',
        link_format: 2,
        link: 'https://t.me/romashkog'
      }
    ]

    return (
        <>
            <main className="background">
                <Header />
                <section className="main">
                  <h1 className='main-title'>Welcome to the VxnnChat</h1>
                  <section className='main-list'>
                    {
                      data.map((item, index) => {
                        if (item.format === 1) {
                          return (
                            <section style={{backgroundImage: `url("${item.image}")`}}
                                     className='main-item main-item-big'>
                              <h3 className='main-item_title'>{item.title}</h3>
                              {
                                item.link_format === 1 ? (
                                  <NavLink to={item.link} className='main-item_btn'>{item.btntext}<img src={arrowRight} alt="arrowRight"/></NavLink>
                                ) : (
                                  <a href={item.link} target='_blank'  className='main-item_btn'>{item.btntext}<img src={arrowRight} alt="arrowRight"/></a>
                                )
                              }
                            </section>
                          )
                        } else {
                          return (
                            <section style={{backgroundImage: `url("${item.image}")`}}
                                     className='main-item'>
                              <h3 className='main-item_title'>{item.title}</h3>
                              {
                                item.link_format === 1 ? (
                                  <NavLink to={item.link} className='main-item_btn'>{item.btntext}<img src={arrowRight} alt="arrowRight"/></NavLink>
                                ) : (
                                  <a href={item.link} target='_blank' className='main-item_btn'>{item.btntext}<img src={arrowRight} alt="arrowRight"/></a>
                                )
                              }
                            </section>
                          )
                        }
                      })
                    }
                  </section>
                  <section className='main-sublist'>
                    <section className='main-vote'>
                      <h3 className='vote-title'>Что добавить следущее?</h3>
                      <section className='vote-list'>
                        <button className='vote-item_btn first'>SleepTimer</button>
                        <button className='vote-item_btn second'>Update Profile</button>
                        <button className='vote-item_btn thirt'>Add new features</button>
                      </section>
                    </section>
                  </section>
                </section>
            </main>

        </>
    );
};

export default Main;
