import type { Group, Task } from '@/model';
import {
    addDoc,
    collection,
    CollectionReference,
    Firestore,
    getFirestore,
} from '@firebase/firestore';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { useUserStore } from './userStore';

export interface AppStore {
    tasks: Task[];
    groups: Group[];
}

let firebaseStore: Firestore;
let collectionRef: CollectionReference;

export const useAppStore = defineStore({
    id: 'appStore',
    state: (): AppStore => ({
        tasks: [],
        groups: [
            {
                uuid: '1',
                name: 'Keep On Livin 🌭',
                taskOrder: [],
            },
            {
                uuid: '2',
                name: 'Empty List',
                taskOrder: [],
            },
            {
                uuid: '3',
                name: '3rd Group',
                taskOrder: [],
            },
        ],
    }),
    getters: {
        getGroups: (state) => state.groups,
        getGroupById: (state) => (groupId: string) =>
            state.groups.find((group) => group.uuid == groupId),
        getGroupTasks: (state) => (groupId: string) =>
            state.tasks.filter((task) => task.groupId == groupId),
        getInboxTasks: (state) => () =>
            state.tasks.filter((task) => !task.groupId),
        getTodayTasks: (state) => () => {
            const today = new Date().getUTCDate();
            return state.tasks.filter(
                (task) => new Date(task.dueDate as number).getUTCDate() == today
            );
        },
        getUpcomingTasks: (state) => () => {
            const date = new Date();
            date.setDate(date.getUTCDate() + 7);

            return state.tasks.filter((task) => {
                if (task.dueDate != null) {
                    return (
                        new Date(task.dueDate as number).getUTCDate() <=
                        date.getUTCDate()
                    );
                }
            });
        },
    },
    actions: {
        async setup() {
            useUserStore()
                .currentUser()
                .then((user) => {
                    if (user) {
                        console.log(user.uid);
                        firebaseStore = getFirestore();
                        collectionRef = collection(
                            firebaseStore,
                            `${user.uid}`
                        );
                        this.sync('tasks', collectionRef);
                    }
                });
        },
        createTask(header: string, body?: string, groupId?: string | null) {
            const task = {
                uuid: uuidv4(),
                groupId: groupId || null,
                header: header,
                body: body || null,
                dateCreated: new Date().getTime(),
                complete: false,
                dateCompleted: null,
                dueDate: null,
            };
            this.tasks.push(task);

            if (useUserStore().uid) {
                addDoc(collectionRef, task);
            }
        },
        updateTask(
            taskId: string,
            header: string,
            body: string,
            groupId?: string
        ) {
            this.tasks.map((task) => {
                if (task.uuid == taskId) {
                    task.header = header;
                    task.body = body;
                    groupId ? (task.groupId = groupId) : null;
                }
            });
        },
        toggleTask(taskId: string) {
            this.tasks.map((task) => {
                if (task.uuid == taskId) task.complete = !task.complete;
            });
        },
    },
    persist: {
        storage: localStorage,
        paths: ['tasks', 'groups'],
    },
});
