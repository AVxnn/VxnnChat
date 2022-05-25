import React from 'react';
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {doc, getFirestore, setDoc, Timestamp} from "firebase/firestore";
import {useState} from "react";
import { useNavigate } from "react-router-dom";

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
                    email: data.email,
                    uid: user.uid,
                    createdAt: Timestamp.fromDate(new Date()),
                    isOnline: true
                });
                console.log(data)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage)
            });
        navigate(`/`)
    }

    return (
        <>
            <section className="register">
                <h3 className="login-title">Registration</h3>
                <label className="form-section" htmlFor="name">
                    <span className="form-title">Name</span>
                    <input onChange={(e) => {setData({
                        ...data, name: e.currentTarget.value
                    })}} className="form-input" id='name' type="text"/>
                    {
                        data.error ? <span className='form-error'>{data.error}</span> : null
                    }
                </label>
                <label className="form-section" htmlFor="email">
                    <span className="form-title">Email</span>
                    <input onChange={(e) => {setData({
                        ...data, email: e.currentTarget.value
                    })}} className="form-input" id='email' type="text"/>
                </label>
                <label className="form-section" htmlFor="Password">
                    <span className="form-title">Password</span>
                    <input onChange={(e) => {setData({
                        ...data, password: e.currentTarget.value
                    })}} className="form-input" id='Password' type="text"/>
                </label>
                <button onClick={() => register()} className="form-button">Let's Go</button>
                <span onClick={() => {navigate(`/login`)}} className="form-skip">Login</span>
            </section>
        </>
    );
};

export default Registration;
