import React, {useState} from 'react';
import './style.css'

const Login = () => {
    const [login, setLogin] = useState(true)



    return login ? (
        <>
            <section className="login">
                <h3 className="login-title">Login</h3>
                <label className="form-section" htmlFor="email">
                    <span className="form-title">Email</span>
                    <input className="form-input" id='email' type="text"/>
                </label>
                <label className="form-section" htmlFor="Password">
                    <span className="form-title">Password</span>
                    <input className="form-input" id='Password' type="text"/>
                </label>
                <button className="form-button">Let's Go</button>
                <span onClick={() => {setLogin(true ? false : true)}} className="form-skip">Registration</span>
            </section>
        </>
    ) : (
        <>
            <section className="register">
                <h3 className="login-title">Registration</h3>
                <label className="form-section" htmlFor="name">
                    <span className="form-title">Name</span>
                    <input className="form-input" id='name' type="text"/>
                </label>
                <label className="form-section" htmlFor="email">
                    <span className="form-title">Email</span>
                    <input className="form-input" id='email' type="text"/>
                </label>
                <label className="form-section" htmlFor="Password">
                    <span className="form-title">Password</span>
                    <input className="form-input" id='Password' type="text"/>
                </label>
                <button className="form-button">Let's Go</button>
                <span onClick={() => {setLogin(false ? false : true)}} className="form-skip">Login</span>
            </section>
        </>
    )
};

export default Login;
