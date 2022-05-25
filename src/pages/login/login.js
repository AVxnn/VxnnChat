import React, {useState, useEffect} from 'react';
import { getAuth, signInWithEmailAndPassword, updateProfile  } from "firebase/auth";
import {updateDoc, doc, getFirestore, Timestamp, getDoc} from "firebase/firestore";

import './style.css'
import {useNavigate} from "react-router-dom";

const Login = () => {

    const [us, setUs] = useState(null)
    const [error, setError] = useState('')
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

    const login = async () => {
        if (!data.email || !data.password) {
            return setData({
                ...data, error: 'invalid'
            })
        }
        await signInWithEmailAndPassword (auth, data.email, data.password)
            .then( async (userCredential) => {
                const user = userCredential.user;
                await updateDoc(doc(db, "users", user.uid), {
                    isOnline: true,
                });
            })
            .catch((error) => {
                setError('Неправильно набран email или пароль')
                console.log(error.code, error.message)
                setData({
                    ...data,
                    password: '',
                    email: '',
                })
            });
        await getDoc(doc(db, "users", auth.currentUser.uid))
            .then((e) => {
                return e.data()
            })
            .then((s) => {
                setUs(s)
            })

        try {
            await updateProfile(auth.currentUser, {
                displayName: us.name,
                photoURL: us.avatar
            })
        } catch (e) {
            console.log('error: ', e)
        }
        navigate(`/`)
    }

    return (
        <>
            <section className="login">
                <h3 className="login-title">Login</h3>
                <label className="form-section" htmlFor="email">
                    <span className="form-title">Email</span>
                    <input onChange={(e) => {setData({
                        ...data, email: e.currentTarget.value
                    })}} className="form-input" value={data.email} id='email' type="text"/>
                    {
                        error ? <span className='form-error'>{error}</span> : null
                    }

                </label>
                <label className="form-section" htmlFor="Password">
                    <span className="form-title">Password</span>
                    <input onChange={(e) => {setData({
                        ...data, password: e.currentTarget.value
                    })}} className="form-input" value={data.password} id='Password' type="text"/>
                </label>
                <button onClick={() => login()} className="form-button">Let's Go</button>
                <span onClick={() => {navigate(`/register`)}} className="form-skip">Registration</span>
            </section>
        </>
    )
};

export default Login;
