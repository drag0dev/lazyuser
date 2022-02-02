import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, userInfoContextType } from '../UserContext';

const Settings = () => {
    let navigate = useNavigate();
    let userInfo: userInfoContextType = useContext(UserContext);

    useEffect(() => {
        if(!userInfo.userInfo.logged)navigate('/')
    }, [userInfo.userInfo.logged]);

    return(
        <div className='settings-div'>
            
            <div className='settings-wrapper-div'>

                <div>
                    <p>Username: {userInfo.userInfo.username}</p>
                    <button>Change your username</button>
                </div>

                
                <div>
                    <p>Email: {userInfo.userInfo.email}</p>
                    <button>Change your email</button>
                </div>

                <div>
                    <button>Change your password</button>
                </div>

            </div>

        </div>
    );
}

export default Settings;