import React, {useEffect, useState} from 'react';
import logo from '../../img/logo.png'
import "./style.css"

import {Link, NavLink} from "react-router-dom";
import SectionProfile from "../../features/section-profile/section-profile";
import {getAuth} from "firebase/auth";

const Header = () => {

    const auth = getAuth()

    return (
        <>
            <section className="container">
                <section className="section-logo">
                    <Link to='/' className="logotype_title"><img className="logotype_img" src={logo} alt="logotype"/></Link>
                </section>
                <nav className="navigation">
                    <NavLink to='/' className="nav-item home-y">HOME</NavLink>
                    <NavLink to='/lenta' className="nav-item lenta-y">LENTA</NavLink>
                    <span className='new'>new</span>
                    <NavLink to='/chat' className="nav-item chat-y">CHAT</NavLink>
                    <NavLink to={auth.currentUser ? `/profile/${auth.currentUser.uid}` : `/profile`} className="nav-item profile-y">PROFILE</NavLink>
                    <div className='down-trip'></div>
                </nav>
                <SectionProfile />
            </section>
        </>
    )
};

export default Header;


