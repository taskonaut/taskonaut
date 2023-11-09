import type { Group, Task } from '@/model';
import { ref } from 'vue';
import { db, auth } from '@/includes/firebase';
import {
    doc,
    getDoc,
    updateDoc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    collection,
    where,
    onSnapshot,
} from '@firebase/firestore';

const USERS = collection(db, 'users');
const GROUPS = collection(db, 'groups');

// User methods

export async function getInbox() {
    const userSnapshot = await getDoc(doc(USERS, auth.currentUser?.uid));

    const inbox = ref(userSnapshot.data()!.inbox || []);
    return { inbox };
}

export function onInbox() {
    const inbox = ref<Task[]>([]);
    const unsubscribe = onSnapshot(
        doc(USERS, auth.currentUser?.uid),
        (user) => {
            inbox.value = (user.data()!.inbox as Task[]) || [];
        }
    );
    return { inbox, unsubscribe };
}

export async function updateInbox(tasks: Task[]) {
    return await updateDoc(doc(USERS, auth.currentUser?.uid), {
        inbox: [...tasks],
    });
}

// Group Lists methods

export async function getGroupList() {
    const userSnapshot = await getDoc(doc(USERS, auth.currentUser?.uid));
    const groupList = ref(userSnapshot.data()!.groupList || []);
    return { groupList };
}

export function onGroupList() {
    const list = ref<any[]>([]);
    const unsubscribe = onSnapshot(
        doc(USERS, auth.currentUser?.uid),
        (user) => {
            list.value = user.data()!.groupList || [];
        }
    );
    return { groupList: list, unsubscribe };
}

export async function updateGroupList(list: any[]) {
    return await updateDoc(doc(USERS, auth.currentUser?.uid), {
        groupList: [...list],
    });
}

// Groups methods

export async function getGroups() {
    const groups = ref<Group[]>([]);
    const groupsQuery = query(
        GROUPS,
        where('ownerId', '==', auth.currentUser?.uid)
    );
    const groupsSnapshot = await getDocs(groupsQuery);
    groupsSnapshot.forEach((group) =>
        groups.value.push(group.data() as unknown as Group)
    );
    return { groups };
}

export function onGroups() {
    const groups = ref<Group[]>([]);
    const groupsQuery = query(
        GROUPS,
        where('ownerId', '==', auth.currentUser?.uid)
    );
    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
        groups.value = [];
        snapshot.docs.forEach((doc) =>
            groups.value.push(doc.data() as unknown as Group)
        );
    });
    return { groups, unsubscribe };
}

// Group methods

export async function getGroup(id: string) {
    const snapshot = await getDoc(doc(GROUPS, id));
    const group = snapshot.data();
    return { group };
}

export function onGroup(id: string) {
    const group = ref<Group>();
    const unsubscribe = onSnapshot(doc(GROUPS, id), async (doc) => {
        group.value = doc.data() as unknown as Group;
    });
    return { group, unsubscribe };
}

export async function updateGroup(group: Partial<Group>) {
    const docRef = doc(GROUPS, group.uuid);
    return await updateDoc(docRef, { ...group });
}

export async function setGroup(group: Group) {
    const docRef = doc(GROUPS, group.uuid);
    return await setDoc(docRef, group);
}

export async function deleteGroup(id: string) {
    const docRef = doc(GROUPS, id);
    return await deleteDoc(docRef);
}
