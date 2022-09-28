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
        groups: [],
    }),
    getters: {
        getTaskById: (state) => (taskId: string) =>
            state.tasks.find((task) => task.uuid == taskId),
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
            state.groups.find((group) => group.uuid == groupId)
                ?.taskOrder as string[],
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
                        const tasksCollection = 'tasks';
                        const groupsCollection = 'groups';
                        firebaseAdapter = new FirebaseAdapter(user.uid);
                        this.sync(
                            tasksCollection,
                            firebaseAdapter.collectionRef(tasksCollection)
                        );
                        this.sync(
                            groupsCollection,
                            firebaseAdapter.collectionRef(groupsCollection)
                        );
                    }
                });
        },
        createTask(header: string, body?: string, groupId?: string | null) {
            const task = {
                uuid: uuidv4(),
                groupId: groupId || '',
                header: header,
                body: body || null,
                dateCreated: new Date().getTime(),
                complete: false,
                dateCompleted: null,
                dueDate: null,
            };
            this.tasks.push(task);
            if (task.groupId != '') {
                this.groups.map((group) => {
                    if (group.uuid == task.groupId) {
                        group.taskOrder.push(task.uuid);
                    }
                });
            }

            if (firebaseAdapter) {
                firebaseAdapter.setDoc(task, 'tasks');
                firebaseAdapter.updateDoc(
                    task.groupId,
                    { taskOrder: [task.uuid] },
                    'groups'
                );
            }
        },
        updateTask(
            taskId: string,
            header: string,
            body: string,
            groupId: string
        ) {
            this.tasks.map((task) => {
                if (task.uuid == taskId) {
                    task.header = header;
                    task.body = body;
                    // Checking if group ID changed
                    if (groupId != task.groupId) {
                        // Check if task had a group before and remove it from that group order
                        if (task.groupId) {
                            //console.log('task had a group', task.groupId);
                            this.removeFromGroupOrder(task.groupId, task.uuid);
                        }
                        // Check if task have a new group and add it to group order
                        if (groupId && !task.complete) {
                            //console.log('task has a new group', groupId);
                            this.addToGroupOrder(groupId, task.uuid);
                        }
                        // Setting new value
                        task.groupId = groupId;
                    }
                }
            });

            if (firebaseAdapter) {
                firebaseAdapter.updateDoc(
                    taskId,
                    { header, body, groupId },
                    'tasks'
                );
            }
        },
        toggleTask(taskId: string) {
            const groupId = this.getTaskGroupId(taskId);
            this.tasks.map((task) => {
                if (task.uuid == taskId) {
                    task.complete = !task.complete;
                    if (groupId) {
                        if (task.complete) {
                            this.removeFromGroupOrder(groupId, taskId);
                        } else {
                            this.addToGroupOrder(groupId, taskId);
                        }
                    }
                    if (firebaseAdapter) {
                        firebaseAdapter.updateDoc(
                            taskId,
                            {
                                complete: task.complete,
                            },
                            'tasks'
                        );
                    }
                }
            });
        },
        deleteTask(taskId: string) {
            const groupId = this.tasks.find(
                (task) => task.uuid == taskId
            )?.groupId;
            if (groupId) {
                this.groups.map((group) => {
                    if (group.uuid == groupId) {
                        group.taskOrder = group.taskOrder.filter(
                            (ti) => ti != taskId
                        );
                    }
                });
            }
            this.tasks = this.tasks.filter((task) => taskId !== task.uuid);

            if (firebaseAdapter) {
                firebaseAdapter.deleteDoc(taskId, 'tasks');
            }
        },

        getTaskGroupId(taskId: string): string {
            return this.tasks.find((task) => task.uuid == taskId)
                ?.groupId as string;
        },

        addToGroupOrder(groupId: string, taskId: string) {
            this.groups.map((group) => {
                if (group.uuid == groupId) {
                    group.taskOrder.push(taskId);
                }
            });
        },

        removeFromGroupOrder(groupId: string, taskId: string) {
            this.groups.map((group) => {
                if (group.uuid == groupId) {
                    group.taskOrder = group.taskOrder.filter(
                        (ti) => ti != taskId
                    );
                }
            });
        },

        createGroup(name: string, description: string) {
            const group = {
                uuid: uuidv4(),
                name,
                taskOrder: [],
                dateCreated: new Date().getTime(),
                description,
            };
            this.groups.push(group);
            router.push({ name: 'group', params: { id: group.uuid } });
            if (firebaseAdapter) {
                firebaseAdapter.setDoc(group, 'groups');
            }
        },
        updateGroup(groupId: string, name: string, description: string) {
            this.groups.map((group) => {
                if (group.uuid == groupId) {
                    group.name = name;
                    group.description = description;
                }
            });
            if (firebaseAdapter) {
                firebaseAdapter.updateDoc(
                    groupId,
                    { name, description },
                    'groups'
                );
            }
        },
        deleteGroup(groupId: string) {
            this.groups = this.groups.filter((group) => group.uuid != groupId);
            this.tasks = this.tasks.filter((task) => task.groupId != groupId);
            if (firebaseAdapter) {
                firebaseAdapter.deleteDoc(groupId, 'groups');
            }
            router.push({ name: 'inbox' });
        },
        setGroupOrder(groupId: string, order: string[]) {
            this.groups.map((group) => {
                if (group.uuid == groupId) group.taskOrder = order;
            });
            if (firebaseAdapter) {
                firebaseAdapter.updateDoc(
                    groupId,
                    { taskOrder: order },
                    'groups'
                );
            }
        },
    },
    persist: {
        storage: localStorage,
        paths: ['tasks', 'groups'],
    },
});
