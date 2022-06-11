import React from 'react';
import bug from "../../img/bug.png";
import github from "../../img/github.png";

const Github = () => {
    return (
        <section className='github-info'>
            <a href="https://forms.gle/6L8ss6vvftnSFrym6" target='_blank'><img className='bug-icon' src={bug} alt="bug"/></a>
            <section className='github-container'>
                <img className='github-icon' src={github} alt="github"/>
                <a href='https://github.com/AVxnn/VxnnChat' target='_blank' className='github-title'>V2 - Vxnn</a>
            </section>
        </section>
    );
};

export default Github;
