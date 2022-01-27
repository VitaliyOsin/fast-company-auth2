import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const LogOut = () => {
    const { logout } = useAuth();
    useEffect(() => {
        logout();
    }, []);
    return (<h1>Loading ...</h1>);
};

export default LogOut;
