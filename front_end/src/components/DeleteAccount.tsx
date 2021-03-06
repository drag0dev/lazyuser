import React, {useState, useContext, useEffect} from 'react';
import {useNavigate } from 'react-router-dom';
import { userInfoContextType, userInfoInterface } from '../TypeInterfaces';
import { UserContext } from '../UserContext';
import URLs from '../ApiURLs';

const DeleteAccount = () => {
    const [confirmedUsername, setConfirmedUsername] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    let userInfo: userInfoContextType = useContext(UserContext); 
    
    useEffect(() => {
        if(!userInfo.userInfo.logged && !userInfo.userInfo.loading)navigate('/');
    }, [userInfo.userInfo.logged, userInfo.userInfo.loading]);

    const deleteAccount = async ( username: string) => {
        let res = await fetch(URLs.urlDelUser, {
            method: 'DELETE',
            credentials: 'include'
        });

        if(res.status == 200){
            setMessage('Account successfully deleted, redirecting to home...');
            
            userInfo.setUserInfo({
                username: '',
                email: '',
                emailVerified: false,
                loading: false,
                games: [],
                logged: false
            });

            const timer = setTimeout(()=>{
                navigate('/')
            }, 2000);
        }
        else{
            setMessage('There was a problem deleteing your account, please try again.')
        }

    }

    const onClickSubmit = () => {
        setMessage('');
        if(userInfo.userInfo.username != confirmedUsername){
            setMessage('Entered username is not correct!');
            return;
        }
        else{
            deleteAccount(confirmedUsername);            
            setMessage('Requesting deletion...')
        }
    }

    return(
        <div className='form-wrapper'>
            <div className='delete-form'>

                <h1>Delete account</h1>

                <p>Enter your username to confirm deletion</p>

                <p>{message}</p>

                <div>
                    <input type='text' value={confirmedUsername} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setConfirmedUsername(e.currentTarget.value)}}></input>
                </div>

                <div>
                    <button onClick={() => navigate('/settings')}>Back</button>
                    <button onClick={onClickSubmit} className='submit-button'>Submit</button>
                </div>

            </div>
        </div>
    );
}

export default DeleteAccount;