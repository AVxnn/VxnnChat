import {Route, Routes} from "react-router-dom";
import Main from "./pages/main/main";
import Login from "./pages/login/login";
import './style.css'
import Chat from "./pages/chat/chat";
import Profile from "./pages/profile/profile";
import Error from "./pages/error/error";
import app from './shared/api/firebase'
import Registration from "./pages/registration/registration";
import PrivateRoute from "./shared/privateroute/privateRoute";
import {useEffect} from "react";
import {doc, getFirestore, updateDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const App = () => {

    const auth = getAuth();
    const db = getFirestore();

    const leaveHandler = async (event) => {
        event.preventDefault()
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
            isOnline: false,
        });
    }

    useEffect(() => {
        window.addEventListener('unload', leaveHandler);
    }, [])

    return (
        <>
            <Routes>
                <Route path="/" element={<Main />}/>
                <Route path="login" element={<Login />}/>
                <Route path="register" element={<Registration />}/>
                <Route path="chat" element={
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                }/>
                <Route path="profile" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }/>
                <Route path="*" element={<Error />}/>
            </Routes>
        </>
    );
}

export default App;
