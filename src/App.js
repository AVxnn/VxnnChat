import {Route, Routes} from "react-router-dom";
import React from 'react';
import Main from "./pages/main/main";
import Login from "./pages/login/login";
import './style.css'
import Profile from "./pages/profile/profile";
import Error from "./pages/error/error";
import Registration from "./pages/registration/registration";
import PrivateRoute from "./shared/privateroute/privateRoute";
import {useEffect} from "react";
import {doc, getFirestore, Timestamp, updateDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import Lenta from "./pages/lenta/lenta";
import Music from "./pages/music/music";
import NewChat from "./pages/MobileChat/mobileChat";
import Todo from "./pages/todo/todo";
import TodoCreate from "./pages/todoCreate/todocreate";
import ProfileEdit from "./pages/profileEdit/profileEdit";
import TodoOpen from "./pages/todoOpen/todoOpen";
import Friends from "./pages/friends/friends";
import LayoutChat from "./shared/LayoutChat/LayoutChat";
import Post from "./pages/post/Post";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {

    const auth = getAuth();
    const db = getFirestore();

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

    useEffect(() => {
        if (window.closed) {
            leaveHandler()
        }
    }, [window])

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
                        <LayoutChat />
                    </PrivateRoute>
                }/>
                <Route path="chat/:uid" element={
                    <PrivateRoute>
                        <LayoutChat />
                    </PrivateRoute>
                }/>
                <Route path="post/:uid" element={
                    <PrivateRoute>
                        <Post />
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
