import type { Group, Task } from '@/model';
import router from '@/router';
import { doc, onSnapshot } from '@firebase/firestore';
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

let firebaseAdapter: FirebaseAdapter | undefined;
const tasksCollection = 'tasks';
const groupsCollection = 'groups';
let unwatchLocalStorage: WatchStopHandle;

export const destroyFirebaseAdapter = () => {
    if (firebaseAdapter) firebaseAdapter = undefined;
};

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
        getTaskOrderById: (state) => (groupId: string) =>
            state.groups.find((group) => group.uuid == groupId)?.taskOrder,
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
        // View Getters
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
            if (!firebaseAdapter) {
                firebaseAdapter = new FirebaseAdapter(userId);
                onSnapshot(
                    firebaseAdapter.collectionRef(tasksCollection),
                    (querySnapshot) => {
                        const result: Task[] = [];
                        querySnapshot.forEach((doc) =>
                            result.push(doc.data() as Task)
                        );
                        this.tasks = result;
                        useUserStore().setLoading(false);
                    }
                );
                onSnapshot(
                    firebaseAdapter.collectionRef(groupsCollection),
                    (querySnapshot) => {
                        const result: Group[] = [];
                        querySnapshot.forEach((doc) =>
                            result.push(doc.data() as Group)
                        );
                        this.groups = result;
                    }
                );
                onSnapshot(
                    doc(firebaseAdapter.db, groupsCollection, userId),
                    (querySnapshot) => {
                        this.groupOrder = querySnapshot?.data()
                            ? Object.values(querySnapshot.data() as {})
                            : [];
                    }
                );
            }
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
            this.watchLocalStorage();
        },
        watchLocalStorage() {
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
            if (unwatchLocalStorage) unwatchLocalStorage();
        },
        // Task Actions
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
                this.addToTaskOrder(task.groupId, task.uuid);
                if (firebaseAdapter) {
                    firebaseAdapter.updateDoc(
                        task.groupId,
                        {
                            taskOrder: this.getTaskOrderById(task.groupId),
                        },
                        'groups'
                    );
                }
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
            const task = this.getTaskById(taskId);
            if (task) {
                task.header = header;
                task.body = body;
                task.dueDate = dueDate || undefined;
                if (task.groupId != groupId) {
                    if (task.groupId) {
                        this.deleteFromTaskOrder(task.groupId, task.uuid);
                    }
                    if (groupId && !task.complete) {
                        this.addToTaskOrder(groupId, task.uuid);
                    }
                    task.groupId = groupId;
                }
            }
            if (firebaseAdapter) {
                firebaseAdapter.updateDoc(
                    taskId,
                    { header, body, groupId, dueDate },
                    'tasks'
                );
            }
        },
        toggleTask(taskId: string) {
            const task = this.getTaskById(taskId);
            if (task) {
                task.complete = !task.complete;
                task.dateCompleted = task.complete
                    ? new Date().getTime()
                    : undefined;

                if (task.groupId) {
                    task.complete
                        ? this.deleteFromTaskOrder(task.groupId, task.uuid)
                        : this.addToTaskOrder(task.groupId, task.uuid);
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
        },
        deleteTask(taskId: string) {
            const task = this.getTaskById(taskId);
            if (task!.groupId) {
                this.deleteFromTaskOrder(task!.groupId, taskId);
            }
            this.tasks = this.tasks.filter((task) => taskId !== task.uuid);

            if (firebaseAdapter) {
                firebaseAdapter.deleteDoc(taskId, 'tasks');
            }
        },
        addToTaskOrder(groupId: string, taskId: string) {
            const group = this.getGroupById(groupId);
            if (group) {
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
        },
        deleteFromTaskOrder(groupId: string, taskId: string) {
            const group = this.getGroupById(groupId);
            if (group) {
                group.taskOrder = group.taskOrder.filter((ti) => ti != taskId);
                if (firebaseAdapter)
                    firebaseAdapter.updateDoc(
                        groupId,
                        {
                            taskOrder: group.taskOrder,
                        },
                        'groups'
                    );
            }
        },
        // Group Actions
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
            const group = this.getGroupById(groupId);
            if (group) {
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
                        firebaseAdapter!.deleteDoc(task.uuid, tasksCollection)
                    );
            }
            this.tasks = this.tasks.filter((task) => task.groupId != groupId);
            router.push({ name: 'inbox' });
        },
        resetGroup(groupId: string) {
            const tasks = this.getGroupTasks(groupId);
            tasks.forEach((task) => {
                if (task.complete) {
                    task.complete = false;
                    task.dateCompleted = undefined;
                    this.addToTaskOrder(groupId, task.uuid);
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
        // Used for Draggable.Next
        setTaskOrder(groupId: string, order: string[]) {
            this.getGroupById(groupId)!.taskOrder = order;
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
