import { db, FirebaseCollections } from '@/firebaseConfig';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    type DocumentData,
    type Firestore,
} from '@firebase/firestore';
import { registerFirestoreEffects } from './firebaseEffects';
import { useUserStore } from './userStore';

export class FirebaseAdapter {
    db: Firestore;
    userId: string;

    constructor(userId: string) {
        this.db = db;
        this.userId = userId;
        registerFirestoreEffects(this);
    }

    async setDoc(
        document: DocumentData,
        collectionName: string,
        userId?: string
    ) {
        return setDoc(
            doc(
                this.db,
                collectionName,
                userId ?? this.userId,
                'items',
                document.uuid
            ),
            document
        );
    }

    setStringArrayAsDoc(document: DocumentData, collectionName: string) {
        return setDoc(
            doc(this.db, collectionName, this.userId),
            Object.assign({}, document)
        );
    }

    async updateDoc(
        documentId: string,
        document: Partial<DocumentData>,
        collectionName: string,
        userId?: string
    ) {
        const documentRef = doc(
            this.db,
            collectionName,
            userId ?? this.userId,
            'items',
            documentId
        );
        return await updateDoc(documentRef, document);
    }

    async deleteDoc(
        documentId: string,
        collectionName: string,
        userId?: string
    ) {
        return deleteDoc(
            doc(
                this.db,
                collectionName,
                userId ?? this.userId,
                'items',
                documentId
            )
        );
    }

    async deleteShareRequest(email: string, groupId: string) {
        return deleteDoc(
            doc(
                this.db,
                FirebaseCollections.ShareRequests,
                email,
                'items',
                groupId
            )
        );
    }

    async createShareRequest(
        userId: string | undefined,
        email: string,
        groupId: string
    ) {
        await setDoc(doc(this.db, FirebaseCollections.ShareRequests, email), {
            displayName: useUserStore().displayName,
        });
        return setDoc(
            doc(
                this.db,
                FirebaseCollections.ShareRequests,
                email,
                'items',
                groupId
            ),
            {
                ownerId: userId,
            }
        );
    }

    collectionRef(collectionName: string) {
        return collection(this.db, collectionName, this.userId, 'items');
    }

    async getDocs(collectionName: string) {
        return (await getDocs(this.collectionRef(collectionName))).docs.map(
            (item) => item.data()
        );
    }
}
