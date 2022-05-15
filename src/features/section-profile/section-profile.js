import React from 'react';
import img from "../../img/te.png";
import login from "../../img/login.svg";

const SectionProfile = () => {
    return (
        <>
            <section className="section-profile">
                <img className="profile_img" src={img} alt="Avatar"/>
                <h3 className="profile_name">George Vxnn</h3>
                <img className="profile_icon" src={login} alt="icon"/>
            </section>
        </>
    );
};

export default SectionProfile;
