import React, { useState, useEffect, useContext } from 'react';
import URLs from '../ApiURLs';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../TypeInterfaces';

const ChangeEmail = () => {

    const [loginMessage, setLoginMessage] = useState('');
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [confirmedPassword, setConfirmedPassowrd] = useState('');

    const navigate = useNavigate();
    const userInfo: userInfoContextType = useContext(UserContext);

    useEffect(() => {
        if(!userInfo.userInfo.logged && !userInfo.userInfo.loading)navigate('/');
    }, [userInfo.userInfo.logged, userInfo.userInfo.loading]);

    const validateEmail = (email: string): boolean => {
        if(email.length == 0){
            setLoginMessage('You need to enter an email!');
            return false;
        }
        let temp = email.split('@');
        if (temp.length!=2){
            setLoginMessage('Entered email has to be correct!');
            return false;
        }

        temp = temp[1].split('.');
        if (temp.length!=2){
            setLoginMessage('Entered email has to be correct!');
            return false;
        }

        return true;
    }

    const changeInfo = async () => {
        let res = await fetch(URLs.urlChangeInfo, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({newEmail: enteredEmail, password: enteredPassword})
        });

        if(res.status==200){
            navigate('/');
            userInfo.setUserInfo({
                ...userInfo.userInfo,
                email: enteredEmail
            });
        }
        else{
            setLoginMessage('There was a problem changing your email address, please try again later!');
        }

    }

    const onClickSubmit = () => {
        // setLoginMessage(''); not resetting msg
        if(!validateEmail(enteredEmail))return;
        if(enteredPassword.length ==0){
            setLoginMessage('You need to enter a password!');
            return;
        }
        if(enteredPassword != confirmedPassword){
            setLoginMessage('Passwords do not match!');
            return;
        }
        changeInfo();
    }

    return(
        <div className='form-wrapper'>

            <div className="change-form">

                <div className='form-div'>
                    <h1>Changing your e-mail address</h1>
                </div>

                <div className='form-div'>
                    <p>{loginMessage}</p>
                </div>

                <div className='form-div'> 
                    <p>Enter your new email: </p>
                    <input type="text" value={enteredEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnteredEmail(e.currentTarget.value)}></input>
                </div>
                
                <div className='form-div'>
                    <p>Enter you password: </p>
                    <input type="password" value={enteredPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnteredPassword(e.currentTarget.value)}></input>
                </div>

                <div className='form-div'>
                    <p>Confirm your password: </p>
                    <input type='password' value={confirmedPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmedPassowrd(e.currentTarget.value)}></input>

                </div>

                <div className='form-div'> 
                    <button onClick={() => navigate('/settings')}>Back</button>
                    <button onClick={onClickSubmit}>Submit</button>
                </div>

            </div>
        </div>
    );
}

export default ChangeEmail;