import {Route, Routes} from "react-router-dom";
import Main from "./pages/main/main";
import Login from "./pages/login/login";
import './style.css'
import Chat from "./pages/chat/chat";
import Profile from "./pages/profile/profile";
import Error from "./pages/error/error";
import Registration from "./pages/registration/registration";
import PrivateRoute from "./shared/privateroute/privateRoute";
import {useEffect} from "react";
import {doc, getFirestore, updateDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import Lenta from "./pages/lenta/lenta";
import Music from "./pages/music/music";

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
        window.addEventListener('beforeunload', leaveHandler);
    }, [])

    if (window.innerWidth <= 822) {
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
                <Route path="music" element={
                    <PrivateRoute>
                        <Music />
                    </PrivateRoute>
                }/>
                <Route path="profile/:userId" element={
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
