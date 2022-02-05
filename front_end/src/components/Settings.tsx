import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../TypeInterfaces';

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
                    <h1>Settings</h1>
                </div>

                <div>
                    <p>Username: {userInfo.userInfo.username}</p>
                </div>

                <div>
                    <p>Email: {userInfo.userInfo.email}</p>
                    <button onClick={() => navigate('/changeemail')}>Change your email</button>
                </div>

                <div>
                    <button onClick={() => navigate('/changepw')}>Change your password</button>
                </div>

                <div>
                   <button onClick={() => navigate('/')}>Home</button> 
                </div>

            </div>

        </div>
    );
}

export default Settings;