import React, { useEffect, useState } from 'react'
import { getDoc, doc, getFirestore, setDoc, getStorage, ref, uploadBytes, getDownloadURL } from '../firebaseConfig';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
    const { localImage, updateLocalImage } = useUserStore();

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



    //!Eleman Add
    const addItem = (section) => {
        setUserData(prevState => ({
            ...prevState,
            [section]: [...prevState[section], (section === 'skills' || section === 'languages') ? '' : {}]
        }));
    };

    //!Eleman Delete
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
                    image: file,
                }
            }));
            updateLocalImage(file)
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
        const inputClasses = 'w-full p-2 mt-2 mb-2 border rounded-md';
        const labelClasses = 'block text-gray-700 font-semibold mt-4';

        switch (section) {
            case "personalInfo":
                return (
                    <div className='mb-8 p-6 border rounded-lg shadow-md '>
                        <h2 className='font-bold text-2xl text-blue-gray-700 mb-2'>Personal Information</h2>
                        <input className={inputClasses} onChange={handleFileChange} type="file" />
                        <img className='mt-4 mb-2 rounded-md' src={localImage ? URL.createObjectURL(localImage) : userData.personalInfo?.image} width={200} alt="" />
                        <input className={inputClasses} type="text" placeholder="Name" value={userData.personalInfo.firstName} onChange={(e) => updateItem('personalInfo', null, 'firstName', e.target.value)} />
                        <input className={inputClasses} type="text" placeholder="Last name" value={userData.personalInfo.lastName} onChange={(e) => updateItem('personalInfo', null, 'lastName', e.target.value)} />
                        <input className={inputClasses} type="email" placeholder="Email" value={userData.personalInfo.email} onChange={(e) => updateItem('personalInfo', null, 'email', e.target.value)} />
                        <input className={inputClasses} type="text" placeholder="Phone" value={userData.personalInfo.phone} onChange={(e) => updateItem('personalInfo', null, 'phone', e.target.value)} />
                    </div>
                );

            case "summary":
                return (
                    <div className='mb-8 p-6 border rounded-lg shadow-md'>
                        <h2 className='font-bold text-2xl text-blue-gray-700 mb-2'>Summary</h2>
                        <textarea className={`${inputClasses} h-32`} value={userData.summary} onChange={(e) => setUserData({ ...userData, summary: e.target.value })} />
                    </div>
                );

            case "experience":
                return (
                    <div className='mb-8 p-6 border rounded-lg shadow-md'>
                        <h2 className='font-bold text-2xl text-blue-gray-700 mb-2'>Experience</h2>
                        {userData.experience.map((item, index) => (
                            <div key={index} className='mb-6'>
                                <input className={inputClasses} type="text" placeholder="Company name" value={item.companyName} onChange={(e) => updateItem('experience', index, 'companyName', e.target.value)} />
                                <input className={inputClasses} type="text" placeholder="Position" value={item.position} onChange={(e) => updateItem('experience', index, 'position', e.target.value)} />
                                <input className={inputClasses} type="date" placeholder="Start date" value={item.startDate} onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)} />
                                <input className={inputClasses} type="date" placeholder="End date" value={item.endDate} onChange={(e) => updateItem('experience', index, 'endDate', e.target.value)} />
                                <textarea className={`${inputClasses} h-24`} placeholder="Explanation" value={item.description} onChange={(e) => updateItem('experience', index, 'description', e.target.value)} />
                                <button className='mt-2 bg-red-500 text-white p-2 rounded-md' onClick={() => removeItem('experience', index)}>Delete</button>
                            </div>
                        ))}
                        <button className='bg-green-500 text-white p-2 rounded-md' onClick={() => addItem('experience')}>Add</button>
                    </div>
                );

            case "education":
                return (
                    <div className='mb-8 p-6 border rounded-lg shadow-md'>
                        <h2 className='font-bold text-2xl text-blue-gray-700 mb-2'>Education</h2>
                        {userData.education.map((item, index) => (
                            <div key={index} className='mb-6'>
                                <input className={inputClasses} type="text" placeholder="School name" value={item.schoolName} onChange={(e) => updateItem('education', index, 'schoolName', e.target.value)} />
                                <input className={inputClasses} type="text" placeholder="Degree" value={item.degree} onChange={(e) => updateItem('education', index, 'degree', e.target.value)} />
                                <input className={inputClasses} type="text" placeholder="Section" value={item.fieldOfStudy} onChange={(e) => updateItem('education', index, 'fieldOfStudy', e.target.value)} />
                                <input className={inputClasses} type="date" placeholder="Start Date" value={item.startDate} onChange={(e) => updateItem('education', index, 'startDate', e.target.value)} />
                                <input className={inputClasses} type="date" placeholder="End Date" value={item.endDate} onChange={(e) => updateItem('education', index, 'endDate', e.target.value)} />
                                <button className='mt-2 bg-red-500 text-white p-2 rounded-md' onClick={() => removeItem('education', index)}>Delete</button>
                            </div>
                        ))}
                        <button className='bg-green-500 text-white p-2 rounded-md' onClick={() => addItem('education')}>Add</button>
                    </div>
                );

            case "skills":
                return (
                    <div className='mb-8 p-6 border rounded-lg shadow-md'>
                        <h2 className='font-bold text-2xl text-blue-gray-700 mb-2'>Skills</h2>
                        {userData.skills.map((skill, index) => (
                            <div key={index} className='mb-2 flex items-center'>
                                <input className={`${inputClasses} flex-1`} type="text" value={skill} onChange={(e) => updateItem('skills', index, '', e.target.value)} />
                                <button className='ml-2 bg-red-500 text-white p-2 rounded-md' onClick={() => removeItem('skills', index)}>Delete</button>
                            </div>
                        ))}
                        <button className='bg-green-500 text-white p-2 rounded-md' onClick={() => addItem('skills')}>Add</button>
                    </div>
                );

            case "languages":
                return (
                    <div className='mb-16 p-6 border rounded-lg shadow-md'>
                        <h2 className='font-bold text-2xl text-blue-gray-700 mb-2'>Languages</h2>
                        {userData.languages.map((language, index) => (
                            <div key={index} className='mb-2 flex items-center'>
                                <input className={`${inputClasses} flex-1`} type="text" value={language} onChange={(e) => updateItem('languages', index, '', e.target.value)} />
                                <button className='ml-2 bg-red-500 text-white p-2 rounded-md' onClick={() => removeItem('languages', index)}>Delete</button>
                            </div>
                        ))}
                        <button className='bg-green-500 text-white p-2 rounded-md' onClick={() => addItem('languages')}>Add</button>
                    </div>
                );

            case "projects":
                return (
                    <div className='mb-8 p-6 border rounded-lg shadow-md'>
                        <h2 className='font-bold text-2xl text-blue-gray-700 mb-2'>Projects</h2>
                        {userData.projects.map((project, index) => (
                            <div key={index} className='mb-6'>
                                <input className={inputClasses} type="text" placeholder="Project name" value={project.projectName} onChange={(e) => updateItem('projects', index, 'projectName', e.target.value)} />
                                <textarea className={`${inputClasses} h-24`} placeholder="explanation" value={project.description} onChange={(e) => updateItem('projects', index, 'description', e.target.value)} />
                                <input className={inputClasses} type="url" placeholder="URL" value={project.url} onChange={(e) => updateItem('projects', index, 'url', e.target.value)} />
                                <button className='mt-2 bg-red-500 text-white p-2 rounded-md' onClick={() => removeItem('projects', index)}>Delete</button>
                            </div>
                        ))}
                        <button className='bg-green-500 text-white p-2 rounded-md' onClick={() => addItem('projects')}>Add</button>
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
                        <div className='translate-y-[-10%] lg:translate-y-[-15%] bg-white rounded-md' key={section}>
                            {renderSection(section)}
                        </div>
                    ))
                ) : (
                    <p>Loading..</p>
                )
            }
            <div className='fixed right-10 bottom-10 bg-white p-5 shadow-lg rounded-md'>
                <Link
                    to={"/home"}
                    className='bg-themeColor75 py-2 text-[18px] px-3 mr-2 rounded-md text-white'
                >
                    Back
                </Link>
                <button
                    className='bg-themeColor75 text-[18px] py-1 px-3 rounded-md text-white'
                    onClick={() => saveCvDetails(storeUser.uid, userData)}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default EditCvDetail