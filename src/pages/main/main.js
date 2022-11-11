import React from 'react';
import Header from "../../widgets/header/header";
import './style.sass'
import {getAuth} from "firebase/auth";
import arrowRight from "../../img/arrow-right.png";
import {NavLink} from "react-router-dom";
import Slider from "react-slick";
import Vote from "../../widgets/vote/Vote";

const Main = () => {

    const auth = getAuth().currentUser

    const data = [
      {
        title: 'Beta V4.5',
        format: 1,
        description: 'Posts, share, animation',
        image: 'https://firebasestorage.googleapis.com/v0/b/petprojectchat.appspot.com/o/main%2FGroup%20177.png?alt=media&token=26385319-4983-477b-a38f-b92678987422',
        btntext: 'Прочитать пост',
        link_format: 1,
        link: '/post/BetaV4.5'
      },
      {
        title: 'Обновленный профиль 💪',
        format: 2,
        description: '',
        image: 'https://assets-global.website-files.com/5e6a544cadf84b1393e2e022/611ab4ae1a89e8fb54119d5b_Vectornator_illustration_space_futuristic.png',
        btntext: 'Заценить',
        link_format: 2,
        link: `/profile/CmG7f8TGwDPEouwwNqnYUJmB5lr1`
      },
      {
        title: 'Набор админов 👌🏼',
        format: 2,
        description: '',
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
                                    <div>
                                      <h3 className='main-item_title'>{item.title}</h3>
                                      <p className='main-item_description'>{item.description}</p>
                                    </div>
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
                                    <div>
                                      <h3 className='main-item_title'>{item.title}</h3>
                                      <p className='main-item_description'>{item.description}</p>
                                    </div>
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
                  <Vote />
                </section>
            </main>

        </>
    );
};

export default Main;
