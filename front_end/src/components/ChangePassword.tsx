import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import URLs from '../ApiURLs';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../TypeInterfaces';

const ChangePassword = () => {
    const [newPassword, setNewPassowrd]= useState('');
    const [confirmNewPassword, setConfirmNewPassowrd]= useState('');
    const [oldPassword, setOldPassowrd]= useState('');
    const [confirmOldPassword, setConfirmOldPassowrd]= useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const navigate = useNavigate();

    const userInfo: userInfoContextType = useContext(UserContext);

    useEffect(() => {
        if(!userInfo.userInfo.logged && !userInfo.userInfo.loading)navigate('/');
    }, [userInfo.userInfo.logged, userInfo.userInfo.loading]);

    const handleNewPassword = async (pw: string) => {
       let res = await fetch(URLs.urlChangeInfo, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({newPassword: newPassword, password: oldPassword})
       });
       if(res.status == 200) {
            navigate('/');
            return;            
       }
       else if(res.status == 401){
           setLoginMessage('There was a problem changing your passowrd, please try again later!');
           return;
       }
       else{
           setLoginMessage('Incorrect credentials!');
           return;
       }
    }

    const onClickSubmit = () => {
        setLoginMessage('');
        if(newPassword != confirmNewPassword){
            setLoginMessage('New passwords do not match!')
            return;
        }
        else if(newPassword.length < 7){
            setLoginMessage('New password must be at least 7 characters long!')
            return;
        }
        else if(oldPassword != confirmOldPassword){
            setLoginMessage('Current passwords do not match!')
            return;
        }

        handleNewPassword(newPassword);

    }

    return(
        <div className='form-wrapper'>
            <div className='change-form'>

                <div className='form-div'>
                    <h1>Changing your password</h1>
                </div>

                <div className='form-div'>
                    <p>{loginMessage}</p>
                </div>

                <div className='form-div'>
                    <p>Enter new password: </p>
                    <input type="password" value={newPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassowrd(e.currentTarget.value)}></input>
                </div>

                <div className='form-div'>
                    <p>Confirm  your new password: </p>
                    <input type='password' value={confirmNewPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setConfirmNewPassowrd(e.currentTarget.value)}></input>
                </div>

                <div className='form-div'>
                    <p>Enter your old password: </p>
                    <input type='password' value={oldPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setOldPassowrd(e.currentTarget.value)}></input>
                </div>

                <div className='form-div'>
                    <p>Confirm your old password: </p>
                    <input type='password' value={confirmOldPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmOldPassowrd(e.currentTarget.value)}></input>
                </div>

                <div className='form-div'>
                    <button onClick={() => navigate('/settings')}>Back</button>
                    <button onClick={onClickSubmit} >Submit</button>
                </div>

            </div>
        </div>
    );
}

export default ChangePassword;