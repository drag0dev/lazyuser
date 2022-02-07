import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { setFlagsFromString } from 'v8';
import URLs from '../ApiURLs';

const ConfirmEmail = () => {
    const [message, setMessage] = useState<string>(''); 
    const [status, setStatus] = useState<string>('');
    const { vid } = useParams();
    const navigate = useNavigate();

    const verifyEmail = async () => {
        let res = await fetch(URLs.urlVerifyEmail, {
           method: 'POST',
           headers: {
               'Content-type': 'application/json'
           }, 
           body: JSON.stringify({vid: vid})
        });

        if(res.status == 200){
            setMessage('Email verified successfully!\nRedirecting to home page...');
            const timer = setTimeout(()=> {
                navigate('/');
            }, 2000);
        }
        else{
            setMessage('Email was not verified successfullt, bad requst!')
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
        <div className='confirm-email'>
                <p>
                    {message}
                </p>
        </div>
    );
}

export default ConfirmEmail;