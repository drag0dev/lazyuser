import React, { useEffect, useState } from 'react';
import { Routes, Route} from 'react-router-dom';
import { UserContext } from './UserContext';
import { userInfoContextType } from './UserContext';

import './App.css';
import URLs from './ApiURLs';

import Header from './components/Header';
import LogIn from './components/LogIn';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import Register from './components/Register';
import Search from './components/Search';
import JumpDiv from './components/JumpDiv';
import DetailedGame from './components/DetailedGame';
export interface userInfoInterface{
  username: string
  logged: boolean
  games?: string[]
  email?: string  // TODO: make api endpoint for changing user info
}

export interface DeatiledGameInterface{
  gameId: string,
  setGameId: Function
}

function App() {
  const [userInfo, setUserInfo] = useState({username: '', logged: false});
  const [loginCheckState, setloginCheckState] = useState(false); // false == it is not being currently checked, true == waiting for server to respond
  const [gameId, setGameId] = useState('');

  const checkLogged = async() => {
    setloginCheckState(true);
    let res = await fetch(URLs.urlCheckLogin, {
        method: 'POST',
        credentials: 'include'
    });
    
    if(res.status==200){
        let data;
        data = await res.json();
        setUserInfo({username: data.username, logged: true});
    }
    setloginCheckState(false);
  }  

  useEffect(()=>{
      checkLogged();
  }, []);

  return (
    <div className="App">
      <UserContext.Provider value = {{userInfo: userInfo, setUserInfo: setUserInfo}} >
        <Header state={loginCheckState}/>

        <Routes>
          <Route path='/' element={<> <Search gameId={gameId} setGameId={setGameId}/> <JumpDiv /> <DetailedGame gameId={gameId} setGameId={setGameId}/> </>}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/register' element={<Register />} />
        </Routes>
        <Footer />
      </UserContext.Provider>
    </div>
  );
}

export default App;
