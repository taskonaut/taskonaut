import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    type User,
} from 'firebase/auth';
import { defineStore } from 'pinia';

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
    actions: {
        async login() {
            try {
                const provider = new GoogleAuthProvider();
                const { user } = await signInWithPopup(getAuth(), provider);

                this.photoURL = user?.photoURL;
                this.uid = user?.uid;
                this.displayName = user?.displayName;
            } catch (error) {
                console.log(error);
            }
        },
        async logout() {
            try {
                await signOut(getAuth());
                this.photoURL = null;
                this.uid = null;
                this.displayName = null;
            } catch (error) {
                console.log(error);
            }
        },
        currentUser() {
            return new Promise<User>((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(
                    getAuth(),
                    (user) => {
                        this.photoURL = user?.photoURL || null;
                        this.uid = user?.uid || null;
                        this.displayName = user?.displayName || null;
                        resolve(user as User);
                    },
                    (e) => reject(e)
                );
                unsubscribe();
            });
        },
    },
});
