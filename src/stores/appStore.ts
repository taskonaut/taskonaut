import type { Group, Task } from '@/model';
import router from '@/router';
import { doc, getDoc } from '@firebase/firestore';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { watch, type WatchStopHandle } from 'vue';
import { FirebaseAdapter } from './firebaseAdapter';
import { useUserStore } from './userStore';

export interface AppStore {
    tasks: Task[];
    groups: Group[];
    groupOrder: string[];
}

let firebaseAdapter: FirebaseAdapter;
const tasksCollection = 'tasks';
const groupsCollection = 'groups';
let unwatchLocalStorage: WatchStopHandle;

export const useAppStore = defineStore({
    id: 'appStore',
    state: (): AppStore => ({
        tasks: [],
        groups: [],
        groupOrder: [],
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
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            const date = new Date();
            date.setDate(date.getDate() + 7);
            date.setUTCHours(0, 0, 0, 0);

            return state.tasks
                .filter((task) => {
                    const dueDate = new Date(task.dueDate as number);
                    dueDate.setUTCHours(0, 0, 0, 0);
                    return dueDate <= date && dueDate >= today;
                })
                .sort((a, b) => a.dueDate! - b.dueDate!);
        },
        getExpiredTasks: (state) => () => {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            return state.tasks.filter((task) => {
                if (task.dueDate) {
                    const date = new Date(task.dueDate as number);
                    date.setUTCHours(0, 0, 0, 0);
                    return date < today;
                }
            });
        },
    },
    actions: {
        async syncFirebase(userId: string) {
            firebaseAdapter = new FirebaseAdapter(userId);

            this.tasks = (await firebaseAdapter.getDocs(
                tasksCollection
            )) as Task[];

            this.groups = (await firebaseAdapter.getDocs(
                groupsCollection
            )) as Group[];

            const groupOrder = await getDoc(
                doc(firebaseAdapter.db, groupsCollection, userId)
            );
            if (groupOrder.exists()) {
                this.groupOrder = Object.values(groupOrder.data());
            }
            useUserStore().setLoading(false);
        },
        syncLocalStorage() {
            const fromLocalStorage = localStorage.getItem(this.$id);
            if (fromLocalStorage) {
                const { tasks, groups, groupOrder } = JSON.parse(
                    fromLocalStorage
                ) as AppStore;
                this.tasks = tasks;
                this.groupOrder = groupOrder;
                this.groups = groups;
            }
            unwatchLocalStorage = watch(
                this.$state,
                (state) => {
                    localStorage.setItem(this.$id, JSON.stringify(state));
                },
                { deep: true }
            );
        },
        disableLocalStorageSync() {
            localStorage.clear();
            unwatchLocalStorage();
        },
        createTask(
            header: string,
            body?: string,
            groupId?: undefined | string,
            dueDate?: undefined | number
        ) {
            const task = {
                uuid: uuidv4(),
                groupId: groupId || '',
                header: header,
                body: body || undefined,
                dateCreated: new Date().getTime(),
                complete: false,
                dateCompleted: undefined,
                dueDate: dueDate || undefined,
                createdBy: useUserStore().uid || 'localUser',
            };
            this.tasks.push(task);
            if (task.groupId) {
                this.groups.map((group) => {
                    if (group.uuid == task.groupId) {
                        group.taskOrder.push(task.uuid);
                        if (firebaseAdapter) {
                            firebaseAdapter.updateDoc(
                                task.groupId,
                                { taskOrder: group.taskOrder },
                                'groups'
                            );
                        }
                    }
                    return group;
                });
            }

            if (firebaseAdapter) {
                firebaseAdapter.setDoc(task, 'tasks');
            }
        },
        updateTask(
            taskId: string,
            header: string,
            body: string,
            groupId: string | undefined,
            dueDate?: number | undefined
        ) {
            this.tasks.map((task) => {
                if (task.uuid == taskId) {
                    task.header = header;
                    task.body = body;
                    task.dueDate = dueDate || undefined;
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
                        task.groupId = groupId || '';
                    }
                }
            });

            if (firebaseAdapter) {
                firebaseAdapter.updateDoc(
                    taskId,
                    { header, body, groupId, dueDate },
                    'tasks'
                );
            }
        },
        toggleTask(taskId: string) {
            const groupId = this.getTaskGroupId(taskId);
            this.tasks.map((task) => {
                if (task.uuid == taskId) {
                    task.complete = !task.complete;
                    task.dateCompleted = task.complete
                        ? new Date().getTime()
                        : undefined;

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
                                dateCompleted: task.dateCompleted,
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
                    if (firebaseAdapter)
                        firebaseAdapter.updateDoc(
                            groupId,
                            {
                                taskOrder: group.taskOrder,
                            },
                            'groups'
                        );
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
                    if (firebaseAdapter)
                        firebaseAdapter.updateDoc(
                            groupId,
                            {
                                taskOrder: group.taskOrder,
                            },
                            'groups'
                        );
                }
            });
        },

        removeFromGroupOrder(groupId: string, taskId: string) {
            this.groups.map((group) => {
                if (group.uuid == groupId) {
                    group.taskOrder = group.taskOrder.filter(
                        (ti) => ti != taskId
                    );
                    if (firebaseAdapter)
                        firebaseAdapter.updateDoc(
                            groupId,
                            {
                                taskOrder: group.taskOrder,
                            },
                            'groups'
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
                sharedWith: [],
                createdBy: useUserStore().uid || 'localUser',
            };

            this.groups.push(group);
            this.groupOrder.push(group.uuid);
            router.push({ name: 'group', params: { id: group.uuid } });
            if (firebaseAdapter) {
                firebaseAdapter.setDoc(group, 'groups');
                firebaseAdapter.setStringArrayAsDoc(
                    Object.assign({}, this.groupOrder),
                    groupsCollection
                );
            }
        },
        updateGroup(groupId: string, name: string, description: string) {
            this.groups.map((group) => {
                if (group.uuid == groupId) {
                    group.name = name;
                    group.description = description;
                    if (firebaseAdapter) {
                        firebaseAdapter.updateDoc(
                            groupId,
                            { name, description },
                            'groups'
                        );
                    }
                }
            });
        },
        deleteGroup(groupId: string) {
            this.groupOrder = this.groupOrder.filter((id) => id != groupId);
            this.groups = this.groups.filter((group) => group.uuid != groupId);
            if (firebaseAdapter) {
                firebaseAdapter.deleteDoc(groupId, 'groups');
                firebaseAdapter.setStringArrayAsDoc(
                    Object.assign({}, this.groupOrder),
                    groupsCollection
                );
                this.tasks
                    .filter((task) => task.groupId === groupId)
                    .forEach((task) =>
                        firebaseAdapter.deleteDoc(task.uuid, tasksCollection)
                    );
            }
            this.tasks = this.tasks.filter((task) => task.groupId != groupId);
            router.push({ name: 'inbox' });
        },
        resetGroup(groupId: string) {
            this.tasks.map((task) => {
                if (task.groupId == groupId && task.complete) {
                    task.complete = false;
                    task.dateCompleted = undefined;
                    this.addToGroupOrder(groupId, task.uuid);
                    if (firebaseAdapter) {
                        firebaseAdapter.updateDoc(
                            task.uuid,
                            {
                                complete: task.complete,
                                dateCompleted: task.dateCompleted,
                            },
                            'tasks'
                        );
                    }
                }
            });
        },
        setTaskOrder(groupId: string, order: string[]) {
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
        setGroupOrder(groupIds: string[]) {
            this.groupOrder = groupIds;
            if (firebaseAdapter)
                firebaseAdapter.setStringArrayAsDoc(
                    Object.assign({}, this.groupOrder),
                    groupsCollection
                );
        },
    },
});
