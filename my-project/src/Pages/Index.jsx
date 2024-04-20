import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useUserStore from '../store/useUserStore';
import { collection, getDocs, getFirestore } from '../firebaseConfig';


function Index() {
  const [cvThemes, setCvThemes] = useState([]);
  const db = getFirestore();
  const logout = useUserStore(state => state.logoutUser);

  //!cvThemes koleksiyonu çekildi ve stateye kaydedildi
  useEffect(() => {
    const fetchCvThemes = async () => {
      const querySnapshot = await getDocs(collection(db, "cvThemes"));
      setCvThemes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchCvThemes();
  }, []);

  return (
    <div>
      <h2>Burası Ana Sayfa</h2>
      <button onClick={logout}>çıkış yap</button>
      <br /><br /><br />

      <h2>CV Themes</h2>


      <div className="container mx-auto">
        <div className='flex'>
          {cvThemes.map(theme => (
            <Link to={`/editcvdetail/${theme.id}/${theme.themeId}`} key={theme.id}>
              <div className='w-4/12'>
                <img src={theme.previewImage} alt="" />
                <p className='text-red-300'>
                  {theme.name} - {theme.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>


      <br /><br /><br />

      <Link to={"/"}>Go login</Link>
    </div>
  )
}

export default Index