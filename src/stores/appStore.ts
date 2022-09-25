import type { Group, Task } from '@/model';
import router from '@/router';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseAdapter } from './firebaseAdapter';
import { useUserStore } from './userStore';

export interface AppStore {
    tasks: Task[];
    groups: Group[];
}

let firebaseAdapter: FirebaseAdapter;

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
        getGroupOrder: (state) => (groupId: string) =>
            state.groups.find((group) => group.uuid == groupId)?.taskOrder,
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
        setup() {
            useUserStore()
                .currentUser()
                .then((user) => {
                    if (user) {
                        firebaseAdapter = new FirebaseAdapter(user.uid);
                        this.sync('tasks', firebaseAdapter.collectionRef);
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

            if (firebaseAdapter) {
                firebaseAdapter.setDoc(task);
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

            if (firebaseAdapter) {
                firebaseAdapter.updateDoc(taskId, { header, body, groupId });
            }
        },
        toggleTask(taskId: string) {
            this.tasks.map((task) => {
                if (task.uuid == taskId) {
                    task.complete = !task.complete;

                    if (firebaseAdapter) {
                        firebaseAdapter.updateDoc(taskId, {
                            complete: task.complete,
                        });
                    }
                }
            });
        },
        deleteTask(taskId: string) {
            this.tasks = this.tasks.filter((task) => taskId !== task.uuid);
            if (firebaseAdapter) {
                firebaseAdapter.deleteDoc(taskId);
            }
        },
        createGroup(name: string) {
            const group = {
                uuid: uuidv4(),
                name: name,
                taskOrder: [],
            };
            this.groups.push(group);
            router.push({ name: 'group', params: { id: group.uuid } });
        },
        updateGroup(groupId: string, name: string) {
            this.groups.map((group) => {
                if (group.uuid == groupId) {
                    group.name = name;
                }
            });
        },
        deleteGroup(groupId: string) {
            this.groups = this.groups.filter((group) => group.uuid != groupId);
            this.tasks = this.tasks.filter((task) => task.groupId != groupId);
        },
        setGroupOrder(groupId: string, order: string[]) {
            this.groups.map((group) => {
                if (group.uuid == groupId) group.taskOrder = order;
            });
        },
    },
    persist: {
        storage: localStorage,
        paths: ['tasks', 'groups'],
    },
});
