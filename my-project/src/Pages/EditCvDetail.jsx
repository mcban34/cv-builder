import React, { useEffect, useState } from 'react'
import { getDoc, doc, getFirestore, setDoc, getStorage, ref, uploadBytes, getDownloadURL } from '../firebaseConfig';
import { useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import stores from '../store/useCvSrote';

function EditCvDetail() {

    const { id, themeId } = useParams()
    const db = getFirestore();
    const navigate = useNavigate()
    const storeUser = useUserStore(state => state.user);
    const [isLoading, setIsLoading] = useState(true)
    const [cvThemeData, setCvThemeData] = useState([])
    const [userData, setUserData] = useState({
        personalInfo: { firstName: '', lastName: '', email: '', phone: '', image: null },
        summary: '',
        experience: [{ companyName: '', position: '', startDate: '', endDate: '', description: '' }],
        education: [{ schoolName: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }],
        skills: [''],
        languages: [''],
        projects: [{ projectName: '', description: '', url: '' }]
    });

    const { useCvThemeStore, useCvDataStore } = stores;
    const storeCvTheme = useCvThemeStore(state => state.cvTheme);
    const setStoreUserData = useCvDataStore(state => state.setCvData);
    const storeUserData = useCvDataStore(state => state.cvData);

    useEffect(() => {
        console.log(userData);
    }, [userData])
    //!id'ye göre istek atıldı cv tema dataları state'e aktarıldı
    useEffect(() => {
        if (storeCvTheme != null) {
            const findTheme = storeCvTheme.find(item => item.themeId == themeId)
            setCvThemeData(findTheme)
            setIsLoading(false)
        }
        else {
            const fetchCvDetail = async () => {
                const docRef = doc(db, "cvThemes", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCvThemeData(docSnap.data());
                    setIsLoading(false)
                } else {
                    console.log("No such document!");
                }
            };
            fetchCvDetail();
        }
    }, [id])

    //!eğer kullanıcın girdiği bilgiler varsa, initial state içerisi doldurulur
    useEffect(() => {
        const fetchCvDetails = async (userId) => {
            if (!userId) return; //?Eğer userId yoksa, fonksiyonu sonlandır.

            if (storeUserData != null) {
                setUserData(storeUserData)
            }
            else {
                const docRef = doc(db, "users", userId, "cvDetails", "details");
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                        setStoreUserData(docSnap.data())
                    } else {
                        console.log("No CV details found!");
                    }
                } catch (error) {
                    console.error("Error fetching CV details:", error);
                }
            }
        };

        if (storeUser && storeUser.uid) {
            fetchCvDetails(storeUser.uid);
        }
    }, [storeUser]);

    //!save button
    const saveCvDetails = async (userId, cvDetails) => {
        if (userData.personalInfo.image instanceof File) {
            try {
                const imageUrl = await uploadImageToStorage(userData.personalInfo.image, userId);
                const updatedUserData = {
                    ...cvDetails,
                    personalInfo: {
                        ...cvDetails.personalInfo,
                        image: imageUrl
                    }
                };
    
                const docRef = doc(db, "users", userId, "cvDetails", "details");
                await setDoc(docRef, updatedUserData, { merge: true });
                console.log("CV details saved successfully!");
                navigate(`/editcvdetail/${id}/${themeId}/showcv`);
                setStoreUserData(userData)
            } catch (error) {
                console.error("Error saving CV details:", error);
            }
        } else {
            const docRef = doc(db, "users", userId, "cvDetails", "details");
            try {
                await setDoc(docRef, cvDetails, { merge: true });
                console.log("CV details saved successfully!");
                navigate(`/editcvdetail/${id}/${themeId}/showcv`);
                setStoreUserData(userData)
            } catch (error) {
                console.error("Error saving CV details:", error);
            }
        }
    };

    

    //!Eleman Ekle
    const addItem = (section) => {
        setUserData(prevState => ({
            ...prevState,
            [section]: [...prevState[section], (section === 'skills' || section === 'languages') ? '' : {}]
        }));
    };

    //!Eleman Sil
    const removeItem = (section, index) => {
        setUserData(prevState => ({
            ...prevState,
            [section]: prevState[section].filter((_, i) => i !== index)
        }));
    };

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            setUserData(prev => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    image: file
                }
            }));
        }
    }

    async function uploadImageToStorage(file, userId) {
        const storage = getStorage();
        const storageRef = ref(storage, `userImages/${userId}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
    }


    //!Eleman Güncelle
    const updateItem = (section, index, field, value) => {
        setUserData(prevState => {
            if (Array.isArray(prevState[section]) && typeof prevState[section][0] === 'string') {
                //?Eğer bölüm basit bir dizi ise (yani içerik string)
                return {
                    ...prevState,
                    [section]: prevState[section].map((item, i) => i === index ? value : item)
                };
            } else if (Array.isArray(prevState[section])) {
                //?Eğer bölüm nesne içeren bir dizi ise
                return {
                    ...prevState,
                    [section]: prevState[section].map((item, i) => i === index ? { ...item, [field]: value } : item)
                };
            } else {
                //?Eğer bölüm bir obje ise
                return {
                    ...prevState,
                    [section]: {
                        ...prevState[section],
                        [field]: value
                    }
                };
            }
        });
    };


    //!cv için gerekli sectionların oluşturulduğu alan
    const renderSection = (section) => {
        switch (section) {
            case "personalInfo":
                return (
                    <div className='mb-5'>
                        <h2 className='font-bold text-lg text-red-400'>Kişisel Bilgiler</h2>
                        <input onChange={handleFileChange} type="file" /> <br />
                        <img src={userData.personalInfo?.image} width={300} alt="" />
                        <input type="text" placeholder="İsim" value={userData.personalInfo.firstName} onChange={(e) => updateItem('personalInfo', null, 'firstName', e.target.value)} />
                        <input type="text" placeholder="Soyisim" value={userData.personalInfo.lastName} onChange={(e) => updateItem('personalInfo', null, 'lastName', e.target.value)} />
                        <input type="email" placeholder="Email" value={userData.personalInfo.email} onChange={(e) => updateItem('personalInfo', null, 'email', e.target.value)} />
                        <input type="text" placeholder="Telefon" value={userData.personalInfo.phone} onChange={(e) => updateItem('personalInfo', null, 'phone', e.target.value)} />
                    </div>
                );

            case "summary":
                return (
                    <div className='mb-5'>
                        <h2 className='font-bold text-lg text-red-400'>Özet</h2>
                        <textarea value={userData.summary} onChange={(e) => setUserData({ ...userData, summary: e.target.value })} />
                    </div>
                );

            case "experience":
                return (
                    <div className='mb-5'>
                        <h2 className='font-bold text-lg text-red-400'>İş Deneyimi</h2>
                        {userData.experience.map((item, index) => (
                            <div key={index}>
                                <input type="text" placeholder="Şirket Adı" value={item.companyName} onChange={(e) => updateItem('experience', index, 'companyName', e.target.value)} />
                                <input type="text" placeholder="Pozisyon" value={item.position} onChange={(e) => updateItem('experience', index, 'position', e.target.value)} />
                                <input type="date" placeholder="Başlangıç Tarihi" value={item.startDate} onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)} />
                                <input type="date" placeholder="Bitiş Tarihi" value={item.endDate} onChange={(e) => updateItem('experience', index, 'endDate', e.target.value)} />
                                <textarea placeholder="Açıklama" value={item.description} onChange={(e) => updateItem('experience', index, 'description', e.target.value)} />
                                <button onClick={() => removeItem('experience', index)}>Sil</button>
                            </div>
                        ))}
                        <button onClick={() => addItem('experience')}>Ekle</button>
                    </div>
                );

            case "education":
                return (
                    <div className='mb-5'>
                        <h2 className='font-bold text-lg text-red-400'>Eğitim</h2>
                        {userData.education.map((item, index) => (
                            <div key={index}>
                                <input type="text" placeholder="Okul Adı" value={item.schoolName} onChange={(e) => updateItem('education', index, 'schoolName', e.target.value)} />
                                <input type="text" placeholder="Derece" value={item.degree} onChange={(e) => updateItem('education', index, 'degree', e.target.value)} />
                                <input type="text" placeholder="Bölüm" value={item.fieldOfStudy} onChange={(e) => updateItem('education', index, 'fieldOfStudy', e.target.value)} />
                                <input type="date" placeholder="Başlangıç Tarihi" value={item.startDate} onChange={(e) => updateItem('education', index, 'startDate', e.target.value)} />
                                <input type="date" placeholder="Bitiş Tarihi" value={item.endDate} onChange={(e) => updateItem('education', index, 'endDate', e.target.value)} />
                                <button onClick={() => removeItem('education', index)}>Sil</button>
                            </div>
                        ))}
                        <button onClick={() => addItem('education')}>Ekle</button>
                    </div>
                );

            case "skills":
                return (
                    <div className='mb-5'>
                        <h2 className='font-bold text-lg text-red-400'>Yetenekler</h2>
                        {userData.skills.map((skill, index) => (
                            <div key={index}>
                                <input type="text" value={skill} onChange={(e) => updateItem('skills', index, '', e.target.value)} />
                                <button onClick={() => removeItem('skills', index)}>Sil</button>
                            </div>
                        ))}
                        <button onClick={() => addItem('skills')}>Ekle</button>
                    </div>
                );

            case "languages":
                return (
                    <div className='mb-5'>
                        <h2 className='font-bold text-lg text-red-400'>Diller</h2>
                        {userData.languages.map((language, index) => (
                            <div key={index}>
                                <input type="text" value={language} onChange={(e) => updateItem('languages', index, '', e.target.value)} />
                                <button onClick={() => removeItem('languages', index)}>Sil</button>
                            </div>
                        ))}
                        <button onClick={() => addItem('languages')}>Ekle</button>
                    </div>
                );

            case "projects":
                return (
                    <div className='mb-5'>
                        <h2 className='font-bold text-lg text-red-400'>Projeler</h2>
                        {userData.projects.map((project, index) => (
                            <div key={index}>
                                <input type="text" placeholder="Proje Adı" value={project.projectName} onChange={(e) => updateItem('projects', index, 'projectName', e.target.value)} />
                                <textarea placeholder="Açıklama" value={project.description} onChange={(e) => updateItem('projects', index, 'description', e.target.value)} />
                                <input type="url" placeholder="URL" value={project.url} onChange={(e) => updateItem('projects', index, 'url', e.target.value)} />
                                <button onClick={() => removeItem('projects', index)}>Sil</button>
                            </div>
                        ))}
                        <button onClick={() => addItem('projects')}>Ekle</button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className='container mx-auto'>
            {
                !isLoading ? (
                    cvThemeData.sections.map(section => (
                        <div key={section}>
                            {renderSection(section)}
                        </div>
                    ))
                ) : (
                    <p>Loading..</p>
                )
            }
            <button
                className='bg-blue-800 text-white'
                onClick={() => saveCvDetails(storeUser.uid, userData)}
            >
                Next
            </button>
        </div>
    )
}

export default EditCvDetail