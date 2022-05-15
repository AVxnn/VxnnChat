import React from 'react';
import './style.css'
import {Link} from "react-router-dom";

const Button = ({url, text}) => {
    return (
        <>
            <Link to={`/${url}`} className="content-button">{text}</Link>
        </>
    );
};

export default Button;
