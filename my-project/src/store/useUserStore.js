import create from 'zustand';
import { auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getFirestore, doc, setDoc } from '../firebaseConfig';

const db = getFirestore();

const useUserStore = create(set => ({
    user: null,
    setUser: (user) => set({ user }),
    loginUser: async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Giriş hatası: ", error.message);
            throw error;
        }
    },
    logoutUser: async () => {
        await signOut(auth);
        set({ user: null });
    },
    registerUser: async (email, password, additionalUserInfo) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //!kullanıcın uid'si ile db'ye bir adet koleksiyon oluşturduk
            await setDoc(doc(db, "users", user.uid), {
                ...additionalUserInfo,
                mail: user.email,
                selectedTheme: ""
            });
            set({ user });
            console.log("Kullanıcı kaydı ve profil oluşturma başarılı");
        } catch (error) {
            console.error("Kayıt hatası: ", error.message);
            throw error;
        }
    },
    loginWithGoogle: async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            set({ user: result.user });
            console.log("Google ile giriş başarılı!");
        } catch (error) {
            console.error("Google ile giriş hatası: ", error.message);
            throw error;
        }
    }
}));

export default useUserStore;
