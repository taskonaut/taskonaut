import { auth } from '@/includes/firebase';
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
            try {
                this.loading = true;
                const provider = new GoogleAuthProvider();
                const { user } = await signInWithPopup(auth, provider);

                if (user) {
                    this.photoURL = user.photoURL;
                    this.uid = user.uid;
                    this.displayName = user.displayName;
                    router.push('/');
                    useAppStore().syncFirebase(user.uid);
                    this.loading = false;
                } else {
                    throw new Error('user is not defined');
                }
            } catch (error) {
                throw new Error((error as Error).message);
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
            return new Promise<User>((resolve, reject) => {
                this.loading = true;
                const unsubscribe = onAuthStateChanged(
                    auth,
                    async (user) => {
                        if (user) {
                            this.photoURL = user.photoURL;
                            this.uid = user.uid;
                            this.displayName = user.displayName;
                            useAppStore().syncFirebase(user.uid);
                            resolve(user as User);
                            this.loading = false;
                        } else {
                            resolve({
                                photoURL: null,
                                uid: undefined,
                                displayName: null,
                            } as unknown as User);
                            this.loading = false;
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                );
                unsubscribe();
            });
        },
        setLoading(value: boolean) {
            this.loading = value;
        },
    },
});
