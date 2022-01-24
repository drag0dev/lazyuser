import React from 'react';
import {useState, useEffect} from 'react';
import URIs from '../ApiURIs';
interface userInfoInterface{
    username: string
    logged: boolean
}

const Header = () => {
    const [userInfo, setUserInfo] = useState<userInfoInterface>({username: '', logged: false});

    const checkLogged = async() => {
        let res = await fetch(URIs.urlCheckLogin, {
            method: 'POST',
            credentials: 'include'
        });
        
        if(res.status==200){
            let data;
            data = await res.json();
            setUserInfo({username: data.username, logged: true});
        }
    }  

    useEffect(()=>{
        checkLogged();
    }, []);
    

    return (
        <div className='navbar'>
            <h1 className='appTitle'>Lazy User</h1>
            <div className='userInteractionNavBar'>
                {userInfo.logged && <div><p>{`Welcome, ${userInfo.username}`}</p></div>}
                {userInfo.logged && <div><a>Settings</a></div>}
                {userInfo.logged ? <div><a>Log out</a></div>: <div><a>Log in</a></div>}
            </div>
        </div>
    )
}

export default Header;
