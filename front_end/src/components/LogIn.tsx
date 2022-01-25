import React, { useRef, useContext } from 'react';
import URIs from '../ApiURIs';
import { userInfoInterface } from '../App';
import { userInfoContextType } from '../UserContext';
import { UserContext } from '../UserContext';

const LogIn = () => {
    const messageP = useRef('');
    const usernameInput = useRef('');
    const passwordInput = useRef('');
    const userInfo:userInfoContextType = useContext(UserContext);

    const loginOnClick = async () => {
        let username = usernameInput.current;
        let password = passwordInput.current;
        messageP.current = '';
        if(!username){
            messageP.current = 'You need to enter a username!';
            return;
        }
        if(!password){
            messageP.current = 'You need to enter a password!';
            return;
        }

        let res = await fetch(URIs.urlCheckLogin, {
            method: 'POST',
            credentials: 'include'
        });

        if(res.status == 200){
            let data = await res.json();
            userInfo.setUserInfo({username: data.username, logged: true});
        }
        else{
            messageP.current = 'Incorrect credintials!';
        }

    };

    return (
            <div className='login-form'>
                <h1 className="login-h">Sign in</h1> 

                <p className="message" ref={messageP}></p>

                <div className="input-field">
                    <input ref={usernameInput} placeholder="Username"  className="username-input" type="text" />
                </div>

                <div className="input-field">
                    <input placeholder="Password" ref={passwordInput} className="password-input" type="password"/>
                </div>

                <button className="sign-in-button" onClick={loginOnClick}>Sign in</button>

                <div className='register-message-div'>
                    <p className="register-message">Don't have an account? <a className="register-redirect">Sign Up</a></p>
                </div>
                
            </div>
    )
};

export default LogIn;