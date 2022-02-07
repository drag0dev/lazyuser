import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../TypeInterfaces';
import URLs from '../ApiURLs';

const Settings = () => {
    const [verificationMessage, setVerificaitonMessage] = useState('');
    let navigate = useNavigate();
    let userInfo: userInfoContextType = useContext(UserContext);

    const requestVerification = async () => {
        let res = await fetch(URLs.urlRequestEmailVerification, {
            method: 'POST',
            credentials: 'include'
        });
        if(res.status==200){
            setVerificaitonMessage('Verification email has been sent!');
        }else{
            setVerificaitonMessage('There was a problem sending you verification email!');
        }
    }

    const onClickVerify = () => {
        setVerificaitonMessage('Requesting verificaiton...');
        requestVerification();
    }

    useEffect(() => {
        if(!userInfo.userInfo.logged)navigate('/')
    }, [userInfo.userInfo.logged]);

    return(
        <div className='settings-div'>
            
            <div className='settings-wrapper-div'>

               {!userInfo.userInfo.emailVerified && 
                    <div>
                        <p>{verificationMessage}</p>
                    </div>
                } 

                <div>
                    <h1>Settings</h1>
                </div>

                <div>
                    <p>Username: {userInfo.userInfo.username}</p>
                </div>

                <div>
                    <p>Email: {userInfo.userInfo.email} {userInfo.userInfo.emailVerified ? '(Verified)' : '(Unverified)'}</p>
                    <button onClick={() => navigate('/changeemail')}>Change your email</button>
                    {!userInfo.userInfo.emailVerified && <button onClick={onClickVerify}>Verify your email</button>}
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