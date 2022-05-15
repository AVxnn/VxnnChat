import {Route, Routes} from "react-router-dom";
import Main from "./pages/main/main";
import Login from "./pages/login/login";
import './style.css'
import Chat from "./pages/chat/chat";
import Profile from "./pages/profile/profile";
import Error from "./pages/error/error";


function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Main />}/>
                <Route path="auth" element={<Login />}/>
                <Route path="chat" element={<Chat />}/>
                <Route path="profile" element={<Profile />}/>
                <Route path="*" element={<Error />}/>
            </Routes>
        </>
    );
}

export default App;
