import { auth } from '@/firebaseConfig';
import router from '@/router';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    type User,
} from 'firebase/auth';
import { defineStore } from 'pinia';
import { useAppStore } from './appStore';

interface UserStore {
    uid: string | null;
    photoURL: string | null;
    displayName: string | null;
}

export const useUserStore = defineStore({
    id: 'userStore',
    state: (): UserStore => ({
        uid: null,
        photoURL: null,
        displayName: null,
    }),
    getters: {
        isLoggedIn: (state) => state.uid !== null,
    },
    actions: {
        async login() {
            try {
                const provider = new GoogleAuthProvider();
                const { user } = await signInWithPopup(auth, provider);

                this.photoURL = user?.photoURL;
                this.uid = user?.uid;
                this.displayName = user?.displayName;
                useAppStore().$reset();
                router.push('/');
                useAppStore().syncFirebase(user.uid);
            } catch (error) {
                throw new Error((error as Error).message);
            }
        },
        async logout() {
            try {
                await signOut(auth);
                this.$reset();
                useAppStore().$reset();
                router.push('/');
            } catch (error) {
                throw new Error((error as Error).message);
            }
        },
        async getAuthState() {
            return new Promise<User>((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(
                    auth,
                    (user) => {
                        this.photoURL = user?.photoURL || null;
                        this.uid = user?.uid || null;
                        this.displayName = user?.displayName || null;
                        useAppStore().syncFirebase(user?.uid);
                        resolve(user as User);
                    },
                    (e) => {
                        reject(e);
                    }
                );
                unsubscribe();
            });
        },
    },
});
