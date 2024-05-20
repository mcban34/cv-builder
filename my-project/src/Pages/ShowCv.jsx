import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import stores from '../store/useCvSrote';
import { getDoc, doc, getFirestore, setDoc } from '../firebaseConfig';
import useUserStore from '../store/useUserStore';
import Classic from '../Components/Themes/Classic';
import Modern from '../Components/Themes/Modern';

const themes = {
    classic: {
        name: "Modern",
        component: Classic,
        layout: "modern-layout.css"
    },
    modern: {
        name: "Classic",
        component: Modern,
        layout: "classic-layout.css"
    }
};

function ShowCv() {
    const db = getFirestore();
    const { id, themeId } = useParams()
    const { useCvThemeStore, useCvDataStore } = stores;
    const storeUserLogin = useUserStore(state => state.user);

    const [userData, setUserData] = useState({
        personalInfo: { firstName: '', lastName: '', email: '', phone: '' },
        summary: '',
        experience: [{ companyName: '', position: '', startDate: '', endDate: '', description: '' }],
        education: [{ schoolName: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }],
        skills: [''],
        languages: [''],
        projects: [{ projectName: '', description: '', url: '' }]
    });
    const [cvThemeData, setCvThemeData] = useState([])

    const storeUserData = useCvDataStore(state => state.cvData);
    const storeCvTheme = useCvThemeStore(state => state.cvTheme);

    const ThemeComponent = themes[themeId].component;


    useEffect(() => {
        if (storeCvTheme != null) {
            const findTheme = storeCvTheme.find(item => item.themeId == themeId)
            setCvThemeData(findTheme)
        }
        else {
            const fetchCvDetail = async () => {
                const docRef = doc(db, "cvThemes", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCvThemeData(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            };
            fetchCvDetail();
        }
    }, [])

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
                        setUserData(docSnap.data())
                    } else {
                        console.log("No CV details found!");
                    }
                } catch (error) {
                    console.error("Error fetching CV details:", error);
                }
            }
        };

        if (storeUserLogin && storeUserLogin.uid) {
            fetchCvDetails(storeUserLogin.uid);
        }
    }, [storeUserLogin]);

    return (
        <div>
            <div className='translate-y-[-10%]'>
                <ThemeComponent
                    userData={userData}
                    cvThemeData={cvThemeData}
                />
            </div>
            <div className='fixed right-10 bottom-10 bg-white p-5 shadow-lg rounded-md'>
                <Link
                    to={"/home"}
                    className='bg-themeColor75 py-2 text-[18px] px-3 mr-2 rounded-md text-white'
                >
                    Back
                </Link>

            </div>
        </div>
    )
}

export default ShowCv