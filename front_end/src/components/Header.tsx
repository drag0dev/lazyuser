import React, {useContext} from 'react';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../UserContext';
import { userInfoInterface } from '../App';

    // TODO: wait for checkLogin to finish then render

const Header = () => {
    const {userInfo}: userInfoContextType = useContext(UserContext);
    return (
        <div className='navbar'>
            <h1 className='appTitle'>Lazy User</h1>
            <div className='userInteractionNavBar'>
                {userInfo.logged && <div><p>{`Welcome, ${userInfo.username}`}</p></div>}
                {userInfo.logged && <div><a>Settings</a></div>}
                {userInfo.logged ? <div><a>Log out</a></div>: <div><a>Log in</a> <a>Register</a></div>}
            </div>
        </div>
    )
}

export default Header;
