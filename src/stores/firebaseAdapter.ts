import { db } from '@/firebaseConfig';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
    type DocumentData,
    type Firestore,
} from '@firebase/firestore';

const SHARE_REQUESTS_COLLECTION = 'share-requests';

export class FirebaseAdapter {
    userId: string;
    db: Firestore;

    constructor(userId: string) {
        this.db = db;
        this.userId = userId;
    }

    async setDoc(document: DocumentData, collectionName: string) {
        return setDoc(
            doc(this.db, collectionName, this.userId, 'items', document.uuid),
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

    async deleteDoc(documentId: string, collectionName: string) {
        return deleteDoc(
            doc(this.db, collectionName, this.userId, 'items', documentId)
        );
    }

    async deleteAllShareRequests(userId: string | undefined) {
        const q = query(
            collection(this.db, SHARE_REQUESTS_COLLECTION),
            where('from', '==', userId)
        );
        const docsToDelete = await getDocs(q);
        docsToDelete.forEach((doc) => {
            deleteDoc(doc.ref);
        });
    }

    async createShareRequest(
        userId: string | undefined,
        email: string,
        groupId: string
    ) {
        return setDoc(
            doc(this.db, SHARE_REQUESTS_COLLECTION, email + '_' + groupId),
            {
                from: userId,
                groupId: groupId,
                to: email,
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
