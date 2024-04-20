import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Index from './Pages/Index'
import Login from './Pages/Login'

import useUserStore from './store/useUserStore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import EditCvDetail from './Pages/EditCvDetail';


function App() {
  const auth = getAuth();
  const navigate = useNavigate()
  const setUser = useUserStore(state => state.setUser);

  //!giriş kontrolü sürekli sağlandı
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       navigate('/home');
  //       setUser(user)
  //     }
  //     else {
  //       navigate('/');
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [navigate]);

  return (
    <>
      <Routes>
        <Route path='/home' element={<Index />} />
        <Route path='' element={<Login />} />
        <Route path='/editcvdetail/:id' element={<EditCvDetail/>} />
      </Routes>
    </>
  )
}

export default App
