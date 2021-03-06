import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import URLs from '../ApiURLs';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../TypeInterfaces';

const LogIn = () => {
    const userInfo:userInfoContextType = useContext(UserContext);

    let [loginMessage, setLoginMessage] = useState('');
    let [enteredUsername, setEnteredUsername] = useState('');
    let [enteredPassword, setEnteredPassword] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if(userInfo.userInfo.logged && !userInfo.userInfo.loading)navigate('/');
    }, [userInfo.userInfo.logged, userInfo.userInfo.loading]);


    const loginOnClick = async () => {
        let username = enteredUsername;
        let password = enteredPassword;

        if (!username){
            setLoginMessage('You need to enter a username!');
            return;
        }
        if (!password){
            setLoginMessage('You need to enter a password!');
        }

        let res = await fetch(URLs.urlLogin, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
        });

        if(res.status == 200){
            let data = await res.json();
            userInfo.setUserInfo({
                username: data.username,
                logged: true,
                email: data.email,
                emailVerified: data.emailStatus,
                loading: false,
                games: []
            });
        }
        else{
            setLoginMessage('Incorrect credentials!');
        }

    };

    return (
        <div className='form-wrapper-div'>
            <div className='login-form'>
                <h1 className="login-h">Sign in</h1> 

                <p className="message">{loginMessage}</p>

                <div className="input-field">
                    <input placeholder="Username"  className="username-input" type="text" value={enteredUsername} onChange={(e: React.ChangeEvent<HTMLInputElement>)=> {setEnteredUsername(e.currentTarget.value)}}/>
                </div>

                <div className="input-field">
                    <input placeholder="Password" className="password-input" type="password" value={enteredPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>)=> {setEnteredPassword(e.currentTarget.value)}}/>
                </div>

                <button className="sign-in-button" onClick={loginOnClick}>Sign in</button>

                <div className='register-message-div'>
                    <p className="register-message">Don't have an account? <Link to='/register'>Sign Up</Link></p>
                </div>

                <div>
                    <p>Forgot password? <Link to='/forgot'>Reset it</Link></p>
                </div>
                
            </div>
        </div>
            
    )
};

export default LogIn;