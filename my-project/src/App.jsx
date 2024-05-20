import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Index from './Pages/Index';
import Login from './Pages/Login';
import EditCvDetail from './Pages/EditCvDetail';
import { doc, getFirestore, getDoc } from './firebaseConfig'
import ShowCv from './Pages/ShowCv';
import { useEffect, useState } from 'react';
import useUserStore from './store/useUserStore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './Components/Tools/Header';
import Loading from './Components/Tools/Loading';

function App() {
  const auth = getAuth();
  const navigate = useNavigate();
  const setUser = useUserStore(state => state.setUser);
  const logout = useUserStore(state => state.logoutUser);
  const user = useUserStore(state => state.user);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([])
  const db = getFirestore();


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

  useEffect(() => {

    console.log(user);
  }, [user])


  useEffect(() => {
    const fetchCvDetails = async (userId) => {
      if (!userId) return; // Eğer userId yoksa, fonksiyonu sonlandır.

      const docRef = doc(db, "users", userId, "cvDetails", "details");
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data())
        } else {
          console.log("No CV details found!");
        }
      } catch (error) {
        console.error("Error fetching CV details:", error);
      }
    };

    // user tanımlı ise fetchCvDetails fonksiyonunu çağır
    if (user && user.uid) {
      fetchCvDetails(user.uid);
    }
  }, [user]);




  if (loading) {
    return <div>
      <Loading/>
    </div>
  }

  console.log("user", user);

  return (
    <>
      {
        user && (
          <Header userData={userData} user={user} logout={logout} />
        )
      }
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
