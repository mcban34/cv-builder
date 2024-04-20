import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Index from './Pages/Index'
import Login from './Pages/Login'

import useUserStore from './store/useUserStore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import EditCvDetail from './Pages/EditCvDetail';
import ShowCv from './Pages/ShowCv';


function App() {
  const auth = getAuth();
  const navigate = useNavigate()
  const setUser = useUserStore(state => state.setUser);
  const myUser = useUserStore(state => state.user);
  // const Loginuser = useUserStore(user);

  //!giriş kontrolü sürekli sağlandı
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // navigate('/home');
        setUser(user)
      }
      // else {
      //   navigate('/');
      // }
    });
    return () => unsubscribe();
  }, []);

 

  return (
    <>
      <Routes>
        <Route path='/home' element={<Index />} />
        <Route path='' element={<Login />} />
        <Route path='/editcvdetail/:id/:themeId' element={<EditCvDetail/>} />
        <Route path='/editcvdetail/:id/:themeId/showcv' element={<ShowCv/>} />
      </Routes>
    </>
  )
}

export default App
