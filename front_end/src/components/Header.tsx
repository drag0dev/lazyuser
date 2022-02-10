import URLs from '../ApiURLs';
import React, { useContext} from 'react';
import { UserContext } from '../UserContext';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const {userInfo, setUserInfo} = useContext(UserContext);

    const onClickLogOut = async () => {
        let res = await fetch(URLs.urlLogout, {
            method: 'GET',
            credentials: 'include'
        });
        if(res.status == 200){
            setUserInfo({username: '', logged: false, loading: false });
            navigate('/');
        }
    }

    return (
        <div className='navbar'>
    
            <Link to='/'><h1 className='appTitle'>Lazy User</h1></Link>
    
            {!userInfo.loading &&  // to prevent rendering as if user is not logged in while the session is being checked
                <div className='userInteractionNavBar'>
                {userInfo.logged && <div><p>{`Welcome, ${userInfo.username}`}</p></div>}
                {userInfo.logged && <div><Link to='/settings'>Settings</Link></div>}
                {userInfo.logged && <div><p className='logOutButton' onClick={onClickLogOut}>Log out</p></div>}
                {!userInfo.logged && <div><Link to='/login'>Log in</Link></div> }
                {!userInfo.logged && <div><Link to='/register'>Register</Link></div> }
                </div>
            }
            
        </div>
    )
}

export default Header;
