import { initializeApp, type FirebaseOptions } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import {
    persistentLocalCache,
    persistentSingleTabManager,
    getFirestore,
    initializeFirestore,
} from '@firebase/firestore';
export const firebaseConfig: FirebaseOptions = {
    apiKey: 'AIzaSyAii3SGdXCYvTLoaaF1uRRv4jdxMKEuo-Y',
    authDomain: 'taskominator.firebaseapp.com',
    projectId: 'taskominator',
    storageBucket: 'taskominator.appspot.com',
    messagingSenderId: '537013467227',
    appId: '1:537013467227:web:99513c35a81b8d8d85a77e',
};

export enum FirebaseCollections {
    Tasks = 'tasks',
    Groups = 'groups',
    ShareRequests = 'share-requests',
}

const firebaseApp = initializeApp(firebaseConfig);

initializeFirestore(firebaseApp, {
    ignoreUndefinedProperties: true,
    localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager({}),
    }),
});
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { firebaseApp, db, auth };
