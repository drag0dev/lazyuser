import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import URLs from '../ApiURLs';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../TypeInterfaces';

const ConfirmEmail = () => {
    const [message, setMessage] = useState<string>('');
    const { vid } = useParams();
    const navigate = useNavigate();
    const userInfo: userInfoContextType = useContext(UserContext);

    const verifyEmail = async () => {
        let res = await fetch(URLs.urlVerifyEmail, {
           method: 'POST',
           headers: {
               'Content-type': 'application/json'
           }, 
           body: JSON.stringify({vid: vid})
        });

        if(res.status == 200){
            let data = await res.json();
            if(userInfo.userInfo.username == data.username){
                userInfo.setUserInfo({
                    ...userInfo.userInfo,
                    emailVerified: true
                });
            }
            setMessage('Email verified successfully!\nRedirecting to home page...');
            const timer = setTimeout(()=> {
                navigate('/');
            }, 2000);
        }
        else{
            setMessage('Email was not verified successfully, bad requst!')
            const timer = setTimeout(()=>{
                navigate('/');
            }, 2000);
        }
    }

    useEffect(() => {
        if(vid==''){ // empty vid
            setMessage('Bad link, please try again!');
            const timer = setTimeout(() => {
              navigate('/');
           }, 2000);
       }        
       else{   
           setMessage('Verifying email...');
           verifyEmail();
       }
    }, [vid]);
       
    return(
        <div className='form-wrapper'>
            <div className='verification-form'>
                <p>
                    {message}
                </p>
            </div>
        </div>
    );
}

export default ConfirmEmail;