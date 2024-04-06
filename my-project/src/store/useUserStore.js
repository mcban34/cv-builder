import create from 'zustand';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
    registerUser: async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Kayıt başarılı!");
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
