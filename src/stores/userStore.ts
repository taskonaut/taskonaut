import { db, auth } from '@/includes/firebase';
import { getDoc, doc, setDoc } from '@firebase/firestore';
import router from '@/router';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { defineStore } from 'pinia';

interface UserStore {
    uid: string | undefined;
    photoURL: string | null;
    displayName: string | null;
    loading: boolean;
}

export const useUserStore = defineStore({
    id: 'userStore',
    state: (): UserStore => ({
        uid: undefined,
        photoURL: null,
        displayName: null,
        loading: false,
    }),
    getters: {
        isLoggedIn: (state) => (state.uid ? true : false),
        isLoading: (state) => state.loading,
    },
    actions: {
        async login() {
            this.loading = true;
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);
            if (user) {
                return { user };
            } else {
                throw new Error('user is not defined');
            }
        },
        async logout() {
            try {
                await signOut(auth);
                this.$reset();
                router.push('/');
            } catch (error) {
                throw new Error((error as Error).message);
            }
        },
        async getAuthState() {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    this.loading = true;
                    const userRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userRef);
                    if (!userDoc.exists()) {
                        await setDoc(userRef, {
                            inbox: [],
                            groupList: [],
                        });
                    }
                    this.photoURL = user.photoURL;
                    this.uid = user.uid;
                    this.displayName = user.displayName;

                    this.loading = false;
                    return user;
                }
            });
        },
    },
});
