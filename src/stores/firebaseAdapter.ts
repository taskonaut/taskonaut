import {
    collection,
    deleteDoc,
    doc,
    getFirestore,
    setDoc,
    updateDoc,
    type DocumentData,
    type Firestore,
} from '@firebase/firestore';

export class FirebaseAdapter {
    userId: string;
    db: Firestore;

    constructor(userId: string) {
        this.db = getFirestore();
        this.userId = userId;
    }

    async setDoc(document: DocumentData, collectionName: string) {
        return setDoc(
            doc(this.db, collectionName, this.userId, 'items', document.uuid),
            document
        );
    }

    async updateDoc(
        documentId: string,
        document: Partial<DocumentData>,
        collectionName: string
    ) {
        const documentRef = doc(
            this.db,
            collectionName,
            this.userId,
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

    collectionRef(collectionName: string) {
        return collection(this.db, collectionName, this.userId, 'items');
    }
}
