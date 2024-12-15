import { useEffect } from "react";
import axios from "axios";

const AuthRoutes = () => {
    const apiUrl = `http://localhost:8080/authRoutes`
    axios.defaults.withCredentials = true;
    useEffect(()=> {
        axios.post(apiUrl)
    })
}

export default AuthRoutes;