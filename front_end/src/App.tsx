import './App.css';
import URLs from './ApiURLs';

import React, { useEffect, useState } from 'react';
import { Routes, Route} from 'react-router-dom';
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

function App() {
  const [userInfo, setUserInfo] = useState<userInfoInterface>({username: '', logged: false, games: [], email: '', emailVerified: false});
  const [loginCheckState, setloginCheckState] = useState(false); // false == it is not being currently checked, true == waiting for server to respond
  const [gameId, setGameId] = useState([]);

  const checkLogged = async() => {
    setloginCheckState(true);

    let res = await fetch(URLs.urlCheckLogin, {
        method: 'POST',
        credentials: 'include'
    });
    
    if(res.status==200){
        let data;
        data = await res.json();
        setUserInfo({username: data.username, email: data.email, logged: true, games: [], emailVerified: data.emailStatus});
    }

    setloginCheckState(false);
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
      setUserInfo({username: userInfo.username, logged: true, games: data, email: userInfo.email, emailVerified: userInfo.emailVerified});
    }
    else{
      setUserInfo({username: userInfo.username, logged: true, games: [], email: userInfo.email, emailVerified: userInfo.emailVerified});
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
        <Header state={loginCheckState}/>

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
          <Route path='/verifyem/:vid' element={<ConfirmEmail state={loginCheckState}/>}/>
        </Routes>
        <Footer />
      </UserContext.Provider>
    </div>
  );
}

export default App;
