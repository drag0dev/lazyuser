import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userInfoContextType} from '../TypeInterfaces';
import { UserContext } from '../UserContext';
import URLs from '../ApiURLs';

const ForgotPW = () => {
    const [enteredString, setEnteredString] = useState('')
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate();
    const userInfo: userInfoContextType = useContext(UserContext);

   useEffect(() => {
        if(!userInfo.userInfo.logged && !userInfo.userInfo.loading)navigate('/');
    }, [userInfo.userInfo.logged, userInfo.userInfo.loading]);


    const validateEmail = (email: string): boolean => {
        if(email.length == 0){
            setMessage('You need to enter an email!');
            return false;
        }
        let temp = email.split('@');
        if (temp.length!=2){
            setMessage('Entered email has to be correct!');
            return false;
        }

        temp = temp[1].split('.');
        if (temp.length!=2){
            setMessage('Entered email has to be correct!');
            return false;
        }

        return true;
    }

    const handleChangesOnServer = async (newField: string) => {
        let body: string;
        if(newField.includes('@')) body = JSON.stringify({email: newField});
        else body = JSON.stringify({username: newField});

        let res = await fetch(URLs.urlForgot, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: body
        });

        if(res.status == 200){
            setMessage('Email with a new password has been sent if a user exists with a given email/username!')
            const timer = setTimeout(() => {
                navigate('/login');
            }, 2000); 
        }
        else setMessage('There was a problem sending a password request, please try again later!');
    }

    const onClickSubmit = () => {
        setMessage('');
        if(!enteredString){
            setMessage('You need to enter an email/username!');
            return;
        }
        else if(enteredString.includes('@') && !validateEmail(enteredString))return;

        handleChangesOnServer(enteredString);                
    }

    return(
        <div className='form-wrapper-div'>
            <div className='forgot-form'>

                <div className='header-div'>
                    <h1>Reset password</h1>
                    <p>{message}</p>
                </div>

                <div>
                    <p>Enter your email or username: </p>
                    <input type='text' value={enteredString} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnteredString(e.currentTarget.value)}></input>
                </div>

                <div>
                    <button onClick={onClickSubmit}>Submit</button>
                </div>

                <div>
                    <button className='home-button' onClick={() => navigate('/')}>Home</button>
                </div>
                
            </div>
        </div>
    );

}

export default ForgotPW;