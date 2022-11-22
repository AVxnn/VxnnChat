import React from 'react';
import './style.sass'
import {Link} from "react-router-dom";

const Error = () => {
    return (
        <>
            <section className='error-page'>
                <section className='section-error'>
                    <h1 className='error-title'>404 error</h1>
                    <p className='error-description'>Страница не найдена, предлагаю <Link to={'/'} className='link'>вернуться обратно</Link></p>
                </section>
            </section>
        </>
    );
};

export default Error;
