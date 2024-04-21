import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const isUserAuthenticated = () => {

    let isAuthenticated = Cookies.get('accessToken') ? true : false;

    if (!isAuthenticated) {
        isAuthenticated = Cookies.get('refreshToken') ? true : false;
    }
    return isAuthenticated;
}

const logoutUser = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    return <Navigate to="/login" />;
}

export { isUserAuthenticated, logoutUser };