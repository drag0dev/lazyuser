import React, { useContext} from 'react';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../UserContext';
import { userInfoInterface } from '../App';
import { Link } from 'react-router-dom';
import URLs from '../ApiURLs';
interface headerStateProp{
    state: boolean;
  }

const Header = ({state}: headerStateProp) => {
    const {userInfo, setUserInfo} = useContext(UserContext);
    const onClickLogOut = async () => {
        let res = await fetch(URLs.urlLogout, {
            method: 'GET',
            credentials: 'include'
        });
        if(res.status == 200)setUserInfo({username: '',logged: false });
    }
    return (
        <div className='navbar'>
            <Link to='/'><h1 className='appTitle'>Lazy User</h1></Link>
            {!state &&  // to prevent rendering as if user is not logged in while the session is being checked
                <div className='userInteractionNavBar'>
                {userInfo.logged && <div><p>{`Welcome, ${userInfo.username}`}</p></div>}
                {userInfo.logged && <div><a><Link to='/settings'>Settings</Link></a></div>}
                {userInfo.logged && <div><p className='logOutButton' onClick={onClickLogOut}>Log out</p></div>}
                {!userInfo.logged && <div><Link to='/login'>Log in</Link></div> }
                {!userInfo.logged && <div><Link to='/register'>Register</Link></div> }
                </div>
            }
            
        </div>
    )
}

export default Header;
