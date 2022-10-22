import React, {useEffect, useState} from 'react';
import "./style.css"
import home from '../../img/home.png'
import news from '../../img/news.png'
import chat from '../../img/chat.png'
import musicHeader from '../../img/musicHeader.png'
import user from '../../img/user.png'
import todo from '../../img/yeye.png'

import logo_home from '../../img/lhome.png'
import logo_news from '../../img/lnews.png'
import logo_chat from '../../img/lchat.png'
import logo_music from '../../img/lmusic.png'
import logo_profile from '../../img/lprofile.png'
import logo_todo from '../../img/ltodo.png'
import logo_friends from '../../img/lfriends.png'
import cat from '../../img/cat.png'


import {Link, NavLink, useLocation} from "react-router-dom";
import SectionProfile from "../../features/section-profile/section-profile";
import {getAuth} from "firebase/auth";

const Header = () => {

    const [logo, setLogo] = useState()
    const auth = getAuth()
    const navigate = useLocation()

    useEffect(() => {
        let i = navigate.pathname.split('/')[1]
        switch (i) {
            case '':
                setLogo(logo_home)
            break
            case 'lenta':
                setLogo(logo_news)
            break
            case 'chat':
                setLogo(logo_chat)
            break
            case 'news':
                setLogo(logo_news)
            break
            case 'music':
                setLogo(logo_music)
            break
            case 'profile':
                setLogo(logo_profile)
            break
            case 'todo':
                setLogo(logo_todo)
            break
            case 'test':
                setLogo(logo_todo)
            break
            case 'friends':
                setLogo(logo_friends)
            break

        }
    }, [navigate])
    return (
        <>
            <section className="container">
                <section className="section-logo">
                    {logo ? <Link to='/' className="logotype_title"><img className="logotype_img" src={logo} alt="logotype"/></Link> : <Link to='/' className="logotype_title"><img className="logotype_img" src={cat} alt="logotype"/></Link>}
                </section>
                <nav className="navigation">
                    <NavLink to='/' className="nav-item home-y">
                        <section className="nav-item home-y">
                            <img className="nav-item_img" src={home} alt="home"/>
                        </section>
                    </NavLink>
                    <NavLink to='/lenta' className="nav-item lenta-y">
                        <section className="nav-item lenta-y">
                            <img className="nav-item_img" src={news} alt="news"/>
                        </section>
                    </NavLink>
                    <NavLink to='/chat' className="nav-item chat-y">
                        <section className="nav-item chat-y">
                            <img className="nav-item_img" src={chat} alt="chat"/>
                        </section>
                    </NavLink>
                    <NavLink to='/music' className="nav-item music-y">
                        <section className="nav-item music-y">
                            <img className="nav-item_img" src={musicHeader} alt="music"/>
                        </section>
                    </NavLink>
                    <NavLink to={auth.currentUser ? `/profile/${auth.currentUser.uid}` : `/profile`} className="nav-item profile-y">
                        <section className="nav-item profile-y">
                            <img className="nav-item_img" src={user} alt="user"/>
                        </section>
                    </NavLink>
                    <NavLink to='/todo' className="nav-item todo-y">
                        <section className="nav-item todo-y">
                            <img className="nav-item_img" src={todo} alt="todo"/>
                        </section>
                    </NavLink>
                    <div className='down-trip'></div>
                </nav>
                <SectionProfile />
            </section>
        </>
    )
};

export default Header;


