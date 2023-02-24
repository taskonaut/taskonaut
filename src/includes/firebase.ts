import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import {
    getFirestore,
    initializeFirestore,
    enableIndexedDbPersistence,
} from '@firebase/firestore';
import { markRaw } from 'vue';

export const firebaseConfig = {
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

const app = initializeApp(firebaseConfig);

initializeFirestore(app, { ignoreUndefinedProperties: true });

const db = markRaw(getFirestore(app));
enableIndexedDbPersistence(db);
const auth = getAuth(app);

export { app, db, auth };
