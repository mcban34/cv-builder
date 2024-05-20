import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useUserStore from '../store/useUserStore';
import { collection, getDocs, getFirestore, doc, getDoc } from '../firebaseConfig';
import { useStore } from 'zustand';
import stores from '../store/useCvSrote';
import Loading from '../Components/Tools/Loading';


function Index() {
  const [cvThemes, setCvThemes] = useState([]);
  console.log(cvThemes, "cvThemes");
  const db = getFirestore();
  const logout = useUserStore(state => state.logoutUser);
  const { useCvThemeStore, useCvDataStore } = stores;
  const setStoreCvTheme = useCvThemeStore(state => state.setCvTheme);
  const setStoreCvData = useCvDataStore(state => state.setCvData);
  const [loading, setLoading] = useState(true)

  //!cvThemes koleksiyonu çekildi ve stateye kaydedildi
  useEffect(() => {
    const fetchCvThemes = async () => {
      const querySnapshot = await getDocs(collection(db, "cvThemes"));
      setLoading(false)
      setCvThemes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setStoreCvTheme(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    };
    fetchCvThemes();
  }, []);

  function generatePastelColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    r = Math.floor((r + 255) / 2);
    g = Math.floor((g + 255) / 2);
    b = Math.floor((b + 255) / 2);

    r = r.toString(16).padStart(2, '0');
    g = g.toString(16).padStart(2, '0');
    b = b.toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  }

  return (
    <div>
      {/* <button onClick={logout}>çıkış yap</button> */}


      <div className="container mx-auto">
        <div className=' bg-white rounded-md translate-y-[-10%] lg:translate-y-[-20%] border shadow-md p-4'>
          <h2 className='text-lg font-bold text-blue-gray-700'>Please Choose Theme</h2>
          <div className='block lg:flex'>
            {cvThemes.map((theme, index) => (
              <div className={`w-12/12 lg:w-3/12 p-2`} key={index}>
                <Link to={`/editcvdetail/${theme.id}/${theme.themeId}`} key={theme.id}>
                  <div className='w-full h-60 overflow-hidden flex justify-center rounded-xl' style={{ backgroundColor: generatePastelColor() }}>
                    <img src={theme.previewImage} alt="" className='translate-y-[10%]' />
                  </div>
                  <p className='text-blue-gray-700 mt-2 font-semibold'>
                    {theme.name}
                  </p>
                  <p className='text-gray-400'>
                    {theme.description}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>



    </div>
  )
}

export default Index