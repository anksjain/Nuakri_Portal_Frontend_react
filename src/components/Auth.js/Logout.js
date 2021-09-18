import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom';
import MyHelmet from '../MyHelmet';

export default function Logout(props) {
    const {onLogout}=props;
    console.log(props.isLogin)
    useEffect(() => {
        onLogout();
        console.log("in Logout useeefct")
    }, [])
    console.log("in Logout Component")
    if (!props.isLogin)
        return <Redirect to="/login"></Redirect>
    return (
        <div>
            <MyHelmet title="Logout" name="Logout user"/>
            logout
        </div>
    )
}
