import type { Group, Task } from '@/model';
import router from '@/router';
import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    query,
    where,
} from '@firebase/firestore';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { watch, type WatchStopHandle } from 'vue';
import { FirebaseAdapter } from './firebaseAdapter';
import { useUserStore } from './userStore';

export interface AppStore {
    tasks: Task[];
    groups: Group[];
    groupOrder: string[];
    sharedGroups: Group[];
    sharedTasks: Task[];
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
        sharedGroups: [],
        sharedTasks: [],
    }),
    getters: {
        getTaskById: (state) => (taskId: string) =>
            [...state.tasks, ...state.sharedTasks].find(
                (task) => task.uuid == taskId
            ),
        getGroups: (state) => state.groups,
        getSharedGroups: (state) => state.sharedGroups,
        getGroupById: (state) => (groupId: string) =>
            [...state.groups, ...state.sharedGroups].find(
                (group) => group.uuid == groupId
            ),
        getGroupTasks: (state) => (groupId: string) =>
            [...state.tasks, ...state.sharedTasks].filter(
                (task) => task.groupId == groupId
            ),
        getTaskOrderById: (state) => (groupId: string) =>
            [...state.groups, ...state.sharedGroups].find(
                (group) => group.uuid == groupId
            )?.taskOrder,
        getInboxTasks: (state) => () =>
            state.tasks.filter((task) => !task.groupId),
        getTodayTasks: (state) => () => {
            const today = new Date().getUTCDate();
            return state.tasks.filter(
                (task) => new Date(task.dueDate as number).getUTCDate() == today
            );
        },
        getGroupOrder: (state) => (groupId: string) =>
            [...state.groups, ...state.sharedGroups].find(
                (group) => group.uuid == groupId
            )?.taskOrder as string[],
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
        async syncFirebase(userId: string, userEmail: string) {
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

                const sharedGroupsSnapshot = await getDocs(
                    collection(
                        firebaseAdapter.db,
                        'share-requests',
                        userEmail,
                        'items'
                    )
                );
                sharedGroupsSnapshot.forEach((doc) => {
                    const shareRequest = doc.data();

                    const sharedGroupsQuery = query(
                        collection(
                            firebaseAdapter?.db!,
                            'groups',
                            shareRequest.ownerId,
                            'items'
                        ),
                        where('sharedWith', 'array-contains', userEmail),
                        where('uuid', '==', doc.id)
                    );

                    onSnapshot(sharedGroupsQuery, (snapshot) => {
                        snapshot.forEach((group) => {
                            this.sharedGroups = this.sharedGroups.filter(
                                (item) => item.uuid !== group.data().uuid
                            );
                            this.sharedGroups.push(group.data() as Group);
                        });
                    });

                    const sharedTasksQuery = query(
                        collection(
                            firebaseAdapter?.db!,
                            'tasks',
                            shareRequest.ownerId,
                            'items'
                        ),
                        where('groupId', '==', doc.id)
                    );

                    onSnapshot(sharedTasksQuery, (snapshot) => {
                        snapshot.forEach((task) => {
                            this.sharedTasks = this.sharedTasks.filter(
                                (item) => item.uuid !== task.data().uuid
                            );
                            this.sharedTasks.push(task.data() as Task);
                        });
                    });
                });
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
            let group;
            if (groupId) {
                group = this.getGroupById(groupId);
            }
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
            }
            if (firebaseAdapter) {
                firebaseAdapter.setDoc(task, 'tasks', group?.createdBy);
            }
        },
        updateTask(
            taskId: string,
            header: string,
            body: string,
            groupId: string | undefined,
            dueDate?: number | undefined
        ) {
            let group;
            if (groupId) {
                group = this.getGroupById(groupId);
            }
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
                    'tasks',
                    group?.createdBy
                );
            }
        },
        toggleTask(taskId: string) {
            let group;
            const task = this.getTaskById(taskId);
            if (task) {
                if (task.groupId) group = this.getGroupById(task.groupId);

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
                        'tasks',
                        group?.createdBy
                    );
                }
            }
        },
        deleteTask(taskId: string) {
            const task = this.getTaskById(taskId);
            let group: Group | undefined;
            if (task?.groupId) {
                group = this.getGroupById(task?.groupId);
            }
            if (task!.groupId) {
                this.deleteFromTaskOrder(task!.groupId, taskId);
            }
            this.tasks = this.tasks.filter((task) => taskId !== task.uuid);
            this.sharedTasks = this.sharedTasks.filter(
                (task) => taskId !== task.uuid
            );

            if (firebaseAdapter) {
                firebaseAdapter.deleteDoc(taskId, 'tasks', group!.createdBy);
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
                        'groups',
                        group.createdBy
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
                        'groups',
                        group.createdBy
                    );
            }
        },
        // Group Actions
        createGroup(name: string, description: string, sharedWith: string) {
            const sharedArray = sharedWith
                ? sharedWith.replace(' ', '').split(',')
                : [];
            const group = {
                uuid: uuidv4(),
                name,
                taskOrder: [],
                dateCreated: new Date().getTime(),
                description,
                sharedWith: sharedArray,
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

                if (sharedWith) {
                    sharedArray.forEach((email) =>
                        firebaseAdapter!.createShareRequest(
                            useUserStore().uid,
                            email,
                            group.uuid
                        )
                    );
                }
            }
        },
        async updateGroup(
            groupId: string,
            name: string,
            description: string,
            sharedWith: string
        ) {
            const group = this.getGroupById(groupId);
            if (group) {
                const sharedArray = sharedWith
                    ? sharedWith.replace(' ', '').split(',')
                    : [];
                let shareRequestOperation;
                if (sharedArray.length > 0) {
                    shareRequestOperation = 'UPDATE';
                } else if (
                    sharedArray.length === 0 &&
                    group.sharedWith.length > 0
                ) {
                    shareRequestOperation = 'DELETE';
                    await firebaseAdapter?.deleteShareRequest(
                        group.sharedWith[0],
                        groupId
                    );
                }

                group.name = name;
                group.description = description;
                group.sharedWith = sharedArray;
                if (firebaseAdapter) {
                    firebaseAdapter.updateDoc(
                        groupId,
                        { name, description, sharedWith: sharedArray },
                        'groups'
                    );

                    if (shareRequestOperation === 'UPDATE') {
                        await firebaseAdapter.deleteShareRequest(
                            group.sharedWith[0],
                            groupId
                        );
                        await firebaseAdapter.createShareRequest(
                            useUserStore().uid,
                            sharedArray[0],
                            group.uuid
                        );
                    }
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
            const group = this.getGroupById(groupId);
            this.getGroupById(groupId)!.taskOrder = order;
            if (firebaseAdapter) {
                firebaseAdapter.updateDoc(
                    groupId,
                    { taskOrder: order },
                    'groups',
                    group?.createdBy
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
