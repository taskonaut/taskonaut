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
    collectionName: string;
    db: Firestore;

    constructor(collectionName: string) {
        this.db = getFirestore();
        this.collectionName = collectionName;
    }

    async setDoc(document: DocumentData) {
        return setDoc(
            doc(this.db, this.collectionName, document.uuid),
            document
        );
    }

    async updateDoc(documentId: string, document: Partial<DocumentData>) {
        const documentRef = doc(this.db, this.collectionName, documentId);
        return await updateDoc(documentRef, document);
    }

    async deleteDoc(documentId: string) {
        return deleteDoc(doc(this.db, this.collectionName, documentId));
    }

    get collectionRef() {
        return collection(this.db, this.collectionName);
    }
}
