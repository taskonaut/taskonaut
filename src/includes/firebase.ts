import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore, initializeFirestore } from '@firebase/firestore';

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

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
