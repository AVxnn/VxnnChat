import {Route, Routes, useLocation} from "react-router-dom";
import React from 'react';
import Main from "./pages/main/main";
import Login from "./pages/login/login";
import './style.css'
import Chat from "./pages/chat/chat";
import Profile from "./pages/profile/profile";
import Error from "./pages/error/error";
import Registration from "./pages/registration/registration";
import PrivateRoute from "./shared/privateroute/privateRoute";
import {useEffect} from "react";
import {doc, getFirestore, Timestamp, updateDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import Lenta from "./pages/lenta/lenta";
import Music from "./pages/music/music";
import NewChat from "./pages/NewChat/newchat";
import Todo from "./pages/todo/todo";
import TodoCreate from "./pages/todoCreate/todocreate";

import {
    TransitionGroup,
    CSSTransition
} from "react-transition-group";
import ProfileEdit from "./pages/profileEdit/profileEdit";
import TodoOpen from "./pages/todoOpen/todoOpen";
import Friends from "./pages/friends/friends";

const App = () => {

    const auth = getAuth();
    const db = getFirestore();
    const location = useLocation()

    const leaveHandler = async (event) => {
        event.preventDefault()
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
            isOnline: false,
            lastOnline: Timestamp.fromDate(new Date())
        });
    }

    useEffect(() => {
        window.addEventListener('beforeunload', leaveHandler);
    }, [])

    if (window.innerWidth <= 320) {
        return (
            <>
                <section className='mobile-info'>
                    <h1 className='mobile-h1'>Сайт готов для пк версий Full HD и HD</h1>
                    <p className='mobile-p'>Скоро будет доступна мобильная версия</p>
                    <p className='mobile-p'>Предлагаю зайти с пк и оценить)</p>
                </section>
            </>
        )
    }

    return (
        <>
            <Routes>
                <Route path="/" element={<Main />}/>
                <Route path="login" element={<Login />}/>
                <Route path="register" element={<Registration />}/>
                <Route path="lenta" element={
                    <PrivateRoute>
                        <Lenta />
                    </PrivateRoute>
                }/>
                <Route path="chat" element={
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                }/>
                <Route path="newchat" element={
                    <PrivateRoute>
                        <NewChat />
                    </PrivateRoute>
                }/>
                <Route path="music" element={
                    <PrivateRoute>
                        <Music />
                    </PrivateRoute>
                }/>
                <Route path="todo" element={
                    <PrivateRoute>
                        <Todo />
                    </PrivateRoute>
                }/>
                <Route path="todo/:tid" element={
                    <PrivateRoute>
                        <TodoOpen />
                    </PrivateRoute>
                }/>
                <Route path="todo/create" element={
                    <PrivateRoute>
                        <TodoCreate />
                    </PrivateRoute>
                }/>
                <Route path="test" element={
                    <PrivateRoute>
                        <NewChat />
                    </PrivateRoute>
                }/>
                <Route path="profile/:userId" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }/>
                <Route path="friends" element={
                    <PrivateRoute>
                        <Friends />
                    </PrivateRoute>
                }/>
                <Route path="profile/:userId/edit" element={
                    <PrivateRoute>
                        <ProfileEdit />
                    </PrivateRoute>
                }/>
                <Route path="*" element={<Error />}/>
            </Routes>
        </>
    );
}

export default App;
