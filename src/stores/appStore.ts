import { FirebaseCollections } from '@/firebaseConfig';
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
import {
    ADD_TO_TASK_ORDER,
    CREATE_GROUP,
    CREATE_TASK,
    DELETE_FROM_TASK_ORDER,
    DELETE_GROUP,
    DELETE_TASK,
    RESET_GROUP,
    SET_GROUP_ORDER,
    SET_TASK_ORDER,
    UPDATE_GROUP,
    UPDATE_TASK,
} from './actions';
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
                    firebaseAdapter.collectionRef(FirebaseCollections.Tasks),
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
                    firebaseAdapter.collectionRef(FirebaseCollections.Groups),
                    (querySnapshot) => {
                        const result: Group[] = [];
                        querySnapshot.forEach((doc) =>
                            result.push(doc.data() as Group)
                        );
                        this.groups = result;
                    }
                );
                onSnapshot(
                    doc(firebaseAdapter.db, FirebaseCollections.Groups, userId),
                    (querySnapshot) => {
                        this.groupOrder = querySnapshot?.data()
                            ? Object.values(querySnapshot.data() as {})
                            : [];
                    }
                );

                const sharedGroupsSnapshot = await getDocs(
                    collection(
                        firebaseAdapter.db,
                        FirebaseCollections.ShareRequests,
                        userEmail,
                        'items'
                    )
                );
                sharedGroupsSnapshot.forEach((doc) => {
                    const shareRequest = doc.data();

                    const sharedGroupsQuery = query(
                        collection(
                            firebaseAdapter?.db!,
                            FirebaseCollections.Groups,
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
                            FirebaseCollections.Tasks,
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
        [CREATE_TASK](newTask: Partial<Task>) {
            const task = {
                uuid: uuidv4(),
                groupId: newTask.groupId || '',
                header: newTask.header!,
                body: newTask.body || undefined,
                dateCreated: new Date().getTime(),
                complete: false,
                dateCompleted: undefined,
                dueDate: newTask.dueDate || undefined,
                createdBy: useUserStore().uid || 'localUser',
            };
            this.tasks.push(task);
            if (task.groupId) {
                this.addToTaskOrder(task.groupId, task.uuid);
            }
            return task;
        },
        [UPDATE_TASK](updatedTask: Partial<Task>) {
            const task = this.getTaskById(updatedTask.uuid!);
            if (task) {
                if (updatedTask.header) task.header = updatedTask.header;
                if (updatedTask.body) task.body = updatedTask.body;
                if (updatedTask.dueDate) task.dueDate = updatedTask.dueDate;
                if (updatedTask.complete != (null || undefined)) {
                    task.complete = updatedTask.complete;
                    task.complete
                        ? (task.dateCompleted = new Date().getTime())
                        : (task.dateCompleted = undefined);
                    if (task.groupId) {
                        task.complete
                            ? this.deleteFromTaskOrder(task.groupId, task.uuid)
                            : this.addToTaskOrder(task.groupId, task.uuid);
                    }
                }
                if (task.groupId != updatedTask.groupId) {
                    if (task.groupId) {
                        this.deleteFromTaskOrder(task.groupId, task.uuid);
                    }
                    if (updatedTask.groupId && !task.complete) {
                        this.addToTaskOrder(updatedTask.groupId, task.uuid);
                    }
                    task.groupId = updatedTask.groupId;
                }
            }
            return updatedTask;
        },
        [DELETE_TASK](taskId: string) {
            const task = this.getTaskById(taskId);
            if (task!.groupId) {
                this.deleteFromTaskOrder(task!.groupId, taskId);
            }
            this.tasks = this.tasks.filter((task) => taskId !== task.uuid);
            this.sharedTasks = this.sharedTasks.filter(
                (task) => taskId !== task.uuid
            );
            return task;
        },
        [ADD_TO_TASK_ORDER](groupId: string, taskId: string) {
            const group = this.getGroupById(groupId);
            if (group) {
                group.taskOrder.push(taskId);
            }
            return group;
        },
        [DELETE_FROM_TASK_ORDER](groupId: string, taskId: string) {
            const group = this.getGroupById(groupId);
            if (group) {
                group.taskOrder = group.taskOrder.filter((ti) => ti != taskId);
            }
            return group;
        },
        fixTasks(): number {
            let count = 0;
            this.tasks.forEach((task) => {
                if (task.groupId && !task.complete) {
                    const group = this.getGroupById(task.groupId);
                    if (group && !group.taskOrder.includes(task.uuid)) {
                        count++;
                        this[ADD_TO_TASK_ORDER](group.uuid, task.uuid);
                    }
                }
            });
            return count;
        },
        // Group Actions
        [CREATE_GROUP](name: string, description: string, sharedWith: string) {
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
            this.setGroupOrder([...this.groupOrder, group.uuid]);

            router.push({ name: 'group', params: { id: group.uuid } });

            return group;
        },
        async [UPDATE_GROUP](
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
        [DELETE_GROUP](groupId: string) {
            this.tasks.forEach((task) => {
                if (task.groupId === groupId) {
                    this.deleteTask(task.uuid);
                }
            });

            this.setGroupOrder(this.groupOrder.filter((id) => id != groupId));

            this.groups = this.groups.filter((group) => group.uuid != groupId);

            router.push({ name: 'inbox' });
            return groupId;
        },
        [RESET_GROUP](groupId: string) {
            const tasks = this.getGroupTasks(groupId);
            tasks.forEach((task) => {
                if (task.complete) {
                    task.complete = false;
                    task.dateCompleted = undefined;
                    this.addToTaskOrder(groupId, task.uuid);
                }
            });
        },
        // Used for Draggable.Next
        [SET_TASK_ORDER](groupId: string, order: string[]) {
            this.getGroupById(groupId)!.taskOrder = order;
        },
        [SET_GROUP_ORDER](groupIds: string[]) {
            this.groupOrder = groupIds;
        },
        addSubTask(parentTaskId: string, newTask: Task) {
            this.tasks = [
                ...this.tasks.map((task) => {
                    if (task.uuid === parentTaskId) {
                        return {
                            ...task,
                            subTasks: [
                                ...(task?.subTasks ? task.subTasks : []),
                                // TODO: extract task creation to own method
                                {
                                    uuid: uuidv4(),
                                    header: newTask.header,
                                    dateCreated: new Date().getTime(),
                                    complete: false,
                                    body: newTask.body,
                                    createdBy: 'localUser',
                                    groupId: undefined,
                                    dueDate: undefined,
                                    dateCompleted: undefined,
                                },
                            ],
                        };
                    }
                    return task;
                }),
            ];
            return parentTaskId;
        },
        deleteSubTask(taskId: string, parentTaskId: string) {
            this.tasks = [
                ...this.tasks.map((task) => {
                    if (task.uuid === parentTaskId) {
                        return {
                            ...task,
                            subTasks: [
                                ...task.subTasks!.filter(
                                    (st) => st.uuid !== taskId
                                ),
                            ],
                        };
                    }
                    return task;
                }),
            ];
            return parentTaskId;
        },
        updateSubTask(subTask: Task, parentTaskId: string) {
            this.tasks = [
                ...this.tasks.map((task) => {
                    if (task.uuid === parentTaskId) {
                        return {
                            ...task,
                            subTasks: task.subTasks!.map((st) => {
                                if (st.uuid === subTask.uuid) {
                                    return { ...st, ...subTask };
                                }
                                return st;
                            }),
                        };
                    }
                    return task;
                }),
            ];
            return parentTaskId;
        },
    },
});
