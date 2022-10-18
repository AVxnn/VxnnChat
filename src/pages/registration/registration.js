import React, {useEffect} from 'react';
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {doc, getFirestore, setDoc, Timestamp} from "firebase/firestore";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import './style.css'
import bg from './img/bg.png'
import logo from '../../img/logo.png'

const Registration = () => {

    const [reg, setReg] = useState(true)
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        loading: false
    })

    let navigate = useNavigate();

    const db = getFirestore();
    const auth = getAuth();

    const register = () => {
        console.log(data)
        if (!data.name || !data.email || !data.password) {
            return setData({
                ...data, error: 'Все поля должны быть заполнены'
            })
        }
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then( async (userCredential) => {
                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {
                    name: data.name,
                    description: '',
                    email: data.email,
                    uid: user.uid,
                    createdAt: Timestamp.fromDate(new Date()),
                    isOnline: true,
                    isAdmin: false,
                    stats: 0,
                    friends: [],
                    notifications: [],
                    bgPhoto: '',
                });
                console.log(data)
            })
            .catch((error) => {
                setData({
                    ...data,
                    error: true
                })
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage)
            });
        navigate(`/`)
    }

    return (
        <>
            <section className='register-container'>
                <section className='register-img-container'>
                    <img className='register-img' src={bg} alt=""/>
                </section>
                <section className="register">
                    <section className='register-c'>
                        <section className='register-logotype'>
                            <img onClick={() => {navigate(`/`)}} className='register-logotype-img' src={logo} alt="logotype cat"/>
                        </section>
                        <h3 className="register-title">Register</h3>
                        <label className="form-section" htmlFor="name">
                            <span className="form-title">Name</span>
                            <input onChange={(e) => {setData({
                                ...data, name: e.currentTarget.value
                            })}} className={`form-input ${data.error ? 'error': ''}`} id='name' type="text"/>
                            {
                                data.error ? <span className='form-error'>{data.error}</span> : null
                            }
                        </label>
                        <label className="form-section" htmlFor="email">
                            <span className="form-title">Email</span>
                            <input onChange={(e) => {setData({
                                ...data, email: e.currentTarget.value
                            })}} className={`form-input ${data.error ? 'error': ''}`} id='email' type="text"/>
                        </label>
                        <label className="form-section" htmlFor="Password">
                            <span className="form-title">Password</span>
                            <input onChange={(e) => {setData({
                                ...data, password: e.currentTarget.value
                            })}} className={`form-input ${data.error ? 'error': ''}`} id='Password' type="password"/>
                        </label>
                        <button onClick={() => register()} className="form-button">Create Account</button>
                        <section className='form-login-container'>
                            <p color='form-login_p'>Already have an account? <span onClick={() => {navigate(`/login`)}} className="form-login_span">Login now</span></p>
                        </section>
                    </section>
                </section>
            </section>
        </>
    );
};

export default Registration;
