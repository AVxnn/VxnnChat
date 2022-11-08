import React from 'react';
import Header from "../../widgets/header/header";
import './style.sass'
import {getAuth} from "firebase/auth";
import arrowRight from "../../img/arrow-right.png";
import {NavLink} from "react-router-dom";
import Slider from "react-slick";

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

    const settings = {
      className: "slider variable-width",
      infinite: true,
      slidesToShow: 1,
      dots: false,
      arrows: false,
      slidesToScroll: 1,
      variableWidth: true
    };

    return (
        <>
            <main className="background">
                <Header />
                <section className="main">
                  <h1 className='main-title'>Welcome to the VxnnChat</h1>
                  <section className='main-list'>
                    {
                      !auth?.uid ? (
                        <section className='main-item-auth-container'>
                          <section className='main-item-auth'>
                            <NavLink to={'/login'} className='main-item_btn'>Sign In<img className='main-item-btn_icon' src={arrowRight} alt="arrowRight"/></NavLink>
                          </section>
                          <section className='main-item-auth'>
                            <NavLink to={'/registration'} className='main-item_btn'>Sign Up<img className='main-item-btn_icon' src={arrowRight} alt="arrowRight"/></NavLink>
                          </section>
                        </section>
                      ) : ''
                    }
                    <div className='main-list-info'>
                      <Slider {...settings}>
                        {
                          data.map((item, index) => {
                            if (item.format === 1) {
                              return (
                                <div className='main-item-container'>
                                  <div style={{backgroundImage: `url("${item.image}")`}}
                                       className='main-item main-item-big'>
                                    <h3 className='main-item_title'>{item.title}</h3>
                                    {
                                      item.link_format === 1 ? (
                                        <NavLink to={item.link} className='main-item_btn'>{item.btntext}<img className='main-item-btn_icon' src={arrowRight} alt="arrowRight"/></NavLink>
                                      ) : (
                                        <a href={item.link} target='_blank'  className='main-item_btn'>{item.btntext}<img className='main-item-btn_icon' src={arrowRight} alt="arrowRight"/></a>
                                      )
                                    }
                                  </div>
                                </div>
                              )
                            } else {
                              return (
                                <div className='main-item-container'>
                                  <div style={{backgroundImage: `url("${item.image}")`}}
                                           className='main-item'>
                                    <h3 className='main-item_title'>{item.title}</h3>
                                    {
                                      item.link_format === 1 ? (
                                        <NavLink to={item.link} className='main-item_btn'>{item.btntext}<img className='main-item-btn_icon' src={arrowRight} alt="arrowRight"/></NavLink>
                                      ) : (
                                        <a href={item.link} target='_blank' className='main-item_btn'>{item.btntext}<img className='main-item-btn_icon' src={arrowRight} alt="arrowRight"/></a>
                                      )
                                    }
                                  </div>
                                </div>
                              )
                            }
                          })
                        }
                      </Slider>
                    </div>
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
