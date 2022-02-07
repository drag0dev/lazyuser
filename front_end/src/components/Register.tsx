import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import URLs from '../ApiURLs';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../TypeInterfaces';

const Register = () => {
    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [enteredEmail, setEnteredEmail] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    const navigate = useNavigate();
    const userInfo:userInfoContextType = useContext(UserContext);

    useEffect(() => {
        if(userInfo.userInfo.logged)navigate('/');
    }, [userInfo.userInfo.logged]);

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

    // TODO: more rigorous checking
    const validateUsername = (username: string): boolean => {
        if (username.length <7 ){
            setLoginMessage('Username must be at least 7 characters long!')
            return false;
        }
        return true;
    }

    const validatePassword = (password: string): boolean => {
        if(password.length < 7){
            setLoginMessage('Password must be at least 7 characters long!');
            return false;
        }
        return true;
    }

    const registerOnClick = async () =>{
        setLoginMessage('');
        if(!validateUsername(enteredUsername))return;
        if(!validatePassword(enteredPassword))return;
         if(enteredPassword != confirmPassword){
            setLoginMessage('Passwords do not match!');
            return;
        }
       if(!validateEmail(enteredEmail))return;
        const res = await fetch(URLs.urlRegister, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({username: enteredUsername, password: enteredPassword, email: enteredEmail})
        });

        if(res.status == 200){
            userInfo.setUserInfo({username: enteredUsername, logged: true, email: enteredEmail, emailVerified: false});
            navigate('/');
        }
        else if(res.status == 400){
            let error = await res.json();
            if (error.error == 'username already in use'){
                setLoginMessage('Username already in use!');
                return;
            }
            else if(error.error = 'email already in use'){
                setLoginMessage('Email already in use!');
                return;
            }
        }
    }

    return(
        <div className='form-wrapper-div'>
            <div className='register-form'>
                    <h1 className="login-h">Sign up</h1> 

                    <p className="message">{loginMessage}</p>

                    <div className="input-field">
                        <input placeholder="Username"  className="username-input" type="text" value={enteredUsername} onChange={(e: React.ChangeEvent<HTMLInputElement>)=> {setEnteredUsername(e.currentTarget.value)}}/>
                    </div>

                    <div className="input-field">
                        <input placeholder="Password" className="password-input" type="password" value={enteredPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>)=> {setEnteredPassword(e.currentTarget.value)}}/>
                    </div>

                    <div className='input-field'>
                        <input placeholder="Confirm password" className='password-input' type='password' value={confirmPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setConfirmPassword(e.currentTarget.value)}}></input>
                    </div>

                    <div className="input-field">
                        <input placeholder="E-mail" className="email-input" type="text" value={enteredEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setEnteredEmail(e.currentTarget.value)}}/>
                    </div>

                    <button className="register-button" onClick={registerOnClick}>Sign up</button>

                    <div className='login-message-div'>
                        <p className="login-message">Already have an account? <Link to='/login'>Sign in</Link></p>
                    </div>
                    
                </div>
            </div>
    );
}

export default Register;