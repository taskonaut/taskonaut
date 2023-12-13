import { db, auth } from '@/includes/firebase';
import { getDoc, doc, setDoc } from '@firebase/firestore';
import router from '@/router';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    type User,
} from 'firebase/auth';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { onSnapshot } from 'firebase/firestore';
import type { Task } from '@/model';

export const useUserStore = defineStore('useUserStore', () => {
    const user = ref<User>();
    const loading = ref<boolean>(false);
    const inbox = ref<Task[]>([]);
    const groupList = ref<{ name: string; uuid: string }[]>([]);

    const isLoggedIn = computed(() => (user.value ? true : false));
    const isLoading = computed(() => loading.value);

    async function login() {
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);
        if (user) {
            return { user };
        } else {
            throw new Error('user is not defined');
        }
    }
    async function logout() {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
    async function getAuthState() {
        //TODO: Add try catch
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
                loading.value = true;
                if (fUser) {
                    user.value = fUser;
                    const userRef = doc(db, 'users', user.value.uid);
                    const userDoc = await getDoc(userRef);
                    if (!userDoc.exists()) {
                        await setDoc(userRef, {
                            inbox: [],
                            groupList: [],
                        });
                    }
                    onSnapshot(userRef, (userDoc) => {
                        inbox.value = userDoc.data()!.inbox || [];
                        groupList.value = userDoc.data()!.groupList || [];
                    });
                    unsubscribe();
                    loading.value = false;
                    resolve(fUser);
                } else {
                    loading.value = false;
                    resolve(null);
                }
            });
        });
    }

    return {
        user,
        loading,
        isLoggedIn,
        isLoading,
        inbox,
        groupList,
        login,
        logout,
        getAuthState,
    };
});
