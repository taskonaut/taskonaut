import type { Group, Task } from '@/model';
import { ref } from 'vue';
import { usersRef, groupsRef, auth } from '@/includes/firebase';
import {
    doc,
    getDoc,
    updateDoc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
} from '@firebase/firestore';
import {
    filterTaskArray,
    resetTaskArray,
    updateArrayTask,
} from './utils.service';

// User methods

export async function getInbox() {
    const usersRefnapshot = await getDoc(doc(usersRef, auth.currentUser?.uid));

    const inbox: Task[] = usersRefnapshot.data()!.inbox || [];
    return inbox;
}

export function onInbox() {
    const inbox = ref<Task[]>([]);
    const unsubscribe = onSnapshot(
        doc(usersRef, auth.currentUser?.uid),
        (user) => {
            inbox.value = (user.data()!.inbox as Task[]) || [];
        }
    );
    return { inbox, unsubscribe };
}

export async function updateInbox(tasks: Task[]) {
    return await updateDoc(doc(usersRef, auth.currentUser?.uid), {
        inbox: [...tasks],
    });
}

// Group Lists methods

export async function getGroupList() {
    const usersRefnapshot = await getDoc(doc(usersRef, auth.currentUser?.uid));
    const groupList = ref<Group[]>(usersRefnapshot.data()!.groupList || []);
    return { groupList };
}

export function onGroupList() {
    const list = ref<any[]>([]);
    const unsubscribe = onSnapshot(
        doc(usersRef, auth.currentUser?.uid),
        (user) => {
            list.value = user.data()!.groupList;
        }
    );
    return { groupList: list, unsubscribe };
}

export async function updateGroupList(list: any[]) {
    return await updateDoc(doc(usersRef, auth.currentUser?.uid), {
        groupList: [...list],
    });
}

// Groups methods

export async function getGroups() {
    const groups = ref<Group[]>([]);
    const groupsQuery = query(
        groupsRef,
        where('ownerId', '==', auth.currentUser?.uid)
    );
    const groupsSnapshot = await getDocs(groupsQuery);
    groupsSnapshot.forEach((group) =>
        groups.value.push(group.data() as unknown as Group)
    );
    return { groups };
}

// Group methods

export async function getGroup(id: string): Promise<Group> {
    const snapshot = await getDoc(doc(groupsRef, id));
    const group = snapshot.data() as Group;
    return group;
}

export function onGroup(id: string) {
    const group = ref<Group>();
    const unsubscribe = onSnapshot(doc(groupsRef, id), async (doc) => {
        group.value = doc.data() as unknown as Group;
    });
    return { group, unsubscribe };
}

export async function updateGroup(group: Partial<Group>) {
    const docRef = doc(groupsRef, group.uuid);
    return await updateDoc(docRef, { ...group });
}

export async function resetGroup(groupId: string) {
    const docRef = doc(groupsRef, groupId);
    const group = await getGroup(groupId);
    const resetGroup = { ...group, tasks: resetTaskArray(group.tasks!) };
    return await updateDoc(docRef, { ...resetGroup });
}

export async function setGroup(group: Group) {
    const docRef = doc(groupsRef, group.uuid);
    return await setDoc(docRef, group);
}

export async function deleteGroup(id: string) {
    const docRef = doc(groupsRef, id);
    return await deleteDoc(docRef);
}

export async function deleteTask(task: Task) {
    let tasks: Task[];
    if (task.groupId) {
        const group = await getGroup(task.groupId);
        tasks = group.tasks;
        const filteredTasks = filterTaskArray(task.uuid, tasks);
        return await updateGroup({ ...group, tasks: filteredTasks });
    } else {
        tasks = await getInbox();
        const filteredTasks = filterTaskArray(task.uuid, tasks);
        return await updateInbox(filteredTasks);
    }
}

export async function updateTask(task: Task) {
    let tasks: Task[];
    if (task.groupId) {
        const group = await getGroup(task.groupId);
        tasks = group.tasks;
        const updatedTasks = updateArrayTask(task, tasks);
        return await updateGroup({ ...group, tasks: updatedTasks });
    } else {
        tasks = await getInbox();
        const updatedTasks = updateArrayTask(task, tasks);
        return await updateInbox(updatedTasks);
    }
}
