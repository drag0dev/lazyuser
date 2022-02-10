import './App.css';
import URLs from './ApiURLs';

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import { UserContext } from './UserContext';
import {userInfoInterface } from './TypeInterfaces';

import Header from './components/Header';
import LogIn from './components/LogIn';
import Footer from './components/Footer';
import Register from './components/Register';
import Search from './components/Search';
import JumpDiv from './components/JumpDiv';
import DetailedGame from './components/DetailedGame';
import Settings from './components/Settings';
import ChangePassword from './components/ChangePassword';
import ChangeEmail from './components/ChangeEmail';
import ForgotPW from './components/ForgotPW';
import ConfirmEmail from './components/ConfirmEmail';
import DeleteAccount from './components/DeleteAccount';

function App() {
  const [userInfo, setUserInfo] = useState<userInfoInterface>({
    username: '', logged: false,
    games: [], email: '',
    emailVerified: false,
    loading: true
  });

  const [gameId, setGameId] = useState([]);

  const checkLogged = async() => {
    setUserInfo({
      ...userInfo,
      loading: true 
    });

    let res = await fetch(URLs.urlCheckLogin, {
        method: 'POST',
        credentials: 'include'
    });
    if(res.status==200){ // if the session is valid
        let data;
        data = await res.json();
        setUserInfo({
          username: data.username,
          email: data.email,
          logged: true,
          games: [],
          emailVerified: data.emailStatus,
          loading: false
        })
    }else{ // if the session is not valid
      setUserInfo({
        username: '',
        email: '',
        logged: false,
        games: [],
        emailVerified: false,
        loading: false
      })
    }

 }  

  const getUserGames = async () => {
    let res = await fetch(URLs.urlGames, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({username: userInfo.username})
    });

    if(res.status==200){
      let data = await res.json();
      setUserInfo({
        ...userInfo,
        games: data
      })
    }
    else{
      setUserInfo({
        ...userInfo,
        games: []
      })
    }
  }

  const emptyGameArray = async () =>{
    await setGameId([]);
  }

  useEffect(()=>{
      checkLogged();
  }, []);

  useEffect(() => {
    emptyGameArray();
    // if user is logged grab games
    if(userInfo.logged) getUserGames();

  }, [userInfo.logged]);

  return (
    <div className="App">
      <UserContext.Provider value = {{userInfo: userInfo, setUserInfo: setUserInfo}} >
        <Header/>

        <Routes>

          <Route path='/' element={<> <Search gameId={gameId} setGameId={setGameId} getUserGames={getUserGames}/> 
                                      <JumpDiv gameId={gameId} setGameId={setGameId} getUserGames={getUserGames}/>
                                      <DetailedGame gameId={gameId} setGameId={setGameId} getUserGames={getUserGames} /> </>}
          />
          <Route path='/login' element={<LogIn />}/>
          <Route path='/register' element={<Register />} />
          <Route path='/settings' element={<Settings />}/>
          <Route path='/changeemail' element={<ChangeEmail />}/>
          <Route path='/changepw' element={<ChangePassword />}/>
          <Route path='/forgot' element={<ForgotPW />}/>
          <Route path='/verifyem/:vid' element={<ConfirmEmail/>}/>
          <Route path='/delacc' element={<DeleteAccount />}/>
          <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
        <Footer />
      </UserContext.Provider>
    </div>
  );
}

export default App;
