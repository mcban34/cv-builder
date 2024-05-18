import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Index from './Pages/Index';
import Login from './Pages/Login';
import EditCvDetail from './Pages/EditCvDetail';
import ShowCv from './Pages/ShowCv';
import { useEffect, useState } from 'react';
import useUserStore from './store/useUserStore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const auth = getAuth();
  const navigate = useNavigate();
  const setUser = useUserStore(state => state.setUser);
  const user = useUserStore(state => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        navigate('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, navigate, setUser]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Index /> : <Login />} />
        <Route
          path="/home"
          element={user ? <Index /> : <Login />}
        />
        <Route
          path="/editcvdetail/:id/:themeId"
          element={user ? <EditCvDetail /> : <Login />}
        />
        <Route
          path="/editcvdetail/:id/:themeId/showcv"
          element={user ? <ShowCv /> : <Login />}
        />
      </Routes>
    </>
  );
}

export default App;
