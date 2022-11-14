import React from 'react';
import './style.sass'

const Popup = ({src, alt, text, open}) => {
    return (
        <>
            <div className='popup-container' onClick={() => open(false)}>
                <img className='popup-img' src={src} alt={alt}/>
                {text === ' ' ? null : text ? <span className='popup-text'>{text}</span> : null}
            </div>
        </>
    );
};

export default Popup;
