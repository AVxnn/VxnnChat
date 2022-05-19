import React from 'react';
import logo from '../../img/logo.png'
import "./style.css"

import img from '../../img/te.png'
import login from '../../img/login.svg'
import {Link, NavLink} from "react-router-dom";
import SectionProfile from "../../features/section-profile/section-profile";

const Header = () => {

    return (
        <>
            <section className="container">
                <section className="section-logo">
                    <img className="logotype_img" src={logo} alt="logotype"/>
                    <Link to='/' className="logotype_title">PetChat</Link>
                </section>
                <nav className="navigation">
                    <NavLink to='/' className="nav-item">HOME</NavLink>
                    <NavLink to='/chat' className="nav-item">CHAT</NavLink>
                    <NavLink to='/profile' className="nav-item">PROFILE</NavLink>
                </nav>
                <SectionProfile />
            </section>
        </>
    );
};

export default Header;


