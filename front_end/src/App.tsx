import React, {createContext, useEffect, useState} from 'react';
import { Routes, Route} from 'react-router-dom';
import { UserContext } from './UserContext';
import { userInfoContextType } from './UserContext';

import './App.css';
import URIs from './ApiURIs';

import Header from './components/Header';
import LogIn from './components/LogIn';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';

export interface userInfoInterface{
  username: string
  logged: boolean
  games?: string[]
  email?: string  // TODO: make api endpoint for changing user info
}

function App() {
  const [userInfo, setUserInfo] = useState({username: '', logged: false});

  const checkLogged = async() => {
    let res = await fetch(URIs.urlCheckLogin, {
        method: 'POST',
        credentials: 'include'
    });
    
    if(res.status==200){
        let data;
        data = await res.json();
        setUserInfo({username: data.username, logged: true});
    }
  }  

  useEffect(()=>{
      checkLogged();
  }, []);


  // TODO: prevent access to login page when user is logged in

  return (
    <div className="App">
      <UserContext.Provider value = {{userInfo: userInfo, setUserInfo: setUserInfo}} >
        <Header />

        <Routes>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/'/>
        </Routes>

        <Footer />
      </UserContext.Provider>
    </div>
  );
}

export default App;
