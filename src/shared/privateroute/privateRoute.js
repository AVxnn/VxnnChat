import React, {useContext} from 'react';
import { AuthContext } from '../contextauth/auth'
import { useNavigate } from "react-router-dom";
import Login from "../../pages/login/login";

const PrivateRoute = ({children}) => {

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    if (user) {
        return children
    } else {
        return <Login />

    }
};

export default PrivateRoute;
