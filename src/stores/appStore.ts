import type { Group, Task } from '@/model';
import router from '@/router';
import {
    collection,
    deleteDoc,
    doc,
    DocumentReference,
    updateDoc,
} from '@firebase/firestore';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import {
    ADD_TASK,
    CREATE_TASK,
    CREATE_GROUP,
    DELETE_GROUP,
    DELETE_TASK,
    RESET_GROUP,
    SET_GROUP_ORDER,
    UPDATE_GROUP,
    UPDATE_TASK,
    SET_STATE,
    RESET_STATE,
} from './actions';
import { db } from '@/includes/firebase';
import { useUserStore } from './userStore';
import * as date from '@/services/date.service';
import { useCollection, useDocument } from 'vuefire';
import { CollectionReference, setDoc } from 'firebase/firestore';

export interface AppStore {
    ready: boolean;
    user: any;
    tasks: Task[];
    groups: Group[];
    meta: any[];
    sharedGroups: Group[];
    sharedTasks: Task[];
    fb: {
        user: DocumentReference | null;
        tasks: CollectionReference | null;
        groups: CollectionReference | null;
        meta: CollectionReference | null;
    };
}

export const useAppStore = defineStore({
    id: 'appStore',
    state: (): AppStore => ({
        ready: false,
        user: null,
        tasks: [],
        groups: [],
        meta: [],
        sharedGroups: [],
        sharedTasks: [],
        fb: {
            user: null,
            tasks: null,
            groups: null,
            meta: null,
        },
    }),
    getters: {
        getTaskById: (state) => (taskId: string) =>
            [...state.tasks, ...state.sharedTasks].find(
                (task) => task.uuid == taskId
            ),
        getGroups: (state) => state.groups,
        getSharedGroups: (state) => state.sharedGroups,
        getGroupById: (state) => (parentId: string) =>
            [...state.groups, ...state.sharedGroups].find(
                (group) => group.uuid == parentId
            ),
        getGroupTasks: (state) => (parentId: string) => {
            return [...state.tasks, ...state.sharedTasks].filter(
                (task) => task.parentId == parentId
            );
        },
        getMeta: (state) => (uuid: string) => {
            return state.meta.find((meta) => meta.id == uuid);
        },
        getInboxTasks: (state) => () =>
            state.tasks.filter((task) => !task.parentId),
        getTodayTasks: (state) => () => {
            return state.tasks.filter((task) =>
                task.dueDate ? date.isToday(task.dueDate) : false
            );
        },
        // View Getters
        getUpcomingTasks: (state) => () => {
            return state.tasks
                .filter((task) => {
                    if (task.dueDate && date.isUpcomingDate(task.dueDate, 7))
                        return true;
                })
                .sort((a, b) => a.dueDate! - b.dueDate!);
        },
        getExpiredTasks: (state) => () => {
            return state.tasks.filter((task) => {
                if (task.dueDate) {
                    return date.isPastDate(task.dueDate) && !task.complete;
                }
            });
        },
    },
    actions: {
            const { uid } = storeToRefs(useUserStore());

            const { data: userData, promise: userPromise } = useDocument(
                this.fb.user
            );
            const { data: tasksData, promise: taskPromise } = useCollection(
                this.fb.tasks
            );
            const { data: groupData, promise: groupPromise } = useCollection(
                this.fb.groups
            );
            const { data: metaData, promise: metaPromise } = useCollection(
                this.fb.meta
            );

            Promise.allSettled([
                userPromise.value.then(() => (this.user = userData)),
                taskPromise.value.then(() => {
                    this.tasks = tasksData as unknown as Task[];
                }),
                groupPromise.value.then(
                    () => (this.groups = groupData as unknown as Group[])
                ),
                //TODO: finish typing for meta
                metaPromise.value.then(() => (this.meta = metaData as any)),
            ])
                .then(() => {
                    this.ready = true;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // Task Actions
        [CREATE_TASK](newTask: Partial<Task>) {
            const task: Task = {
                uuid: uuidv4(),
                parentId: newTask.parentId || '',
                header: newTask.header!,
                body: newTask.body || undefined,
                dateCreated: date.getToday(),
                complete: false,
                dateCompleted: undefined,
                dueDate: newTask.dueDate || undefined,
                createdBy: useUserStore().uid || 'localUser',
                taskOrder: [],
            };

            return task;
        },
        [ADD_TASK](newTask: Partial<Task>) {
            const task = this.createTask(newTask);
            const docRef = doc(this.fb.tasks as CollectionReference, task.uuid);
            setDoc(docRef, task);
            return task;
        },
        [UPDATE_TASK](updatedTask: Partial<Task>) {
            const taskRef = doc(
                this.fb.tasks as CollectionReference,
                updatedTask.uuid
            );
            updateDoc(taskRef, { ...updatedTask });
        },
        [DELETE_TASK](uuid: string) {
            const children = this.getGroupTasks(uuid);
            children.forEach((task) => {
                this.deleteTask(task.uuid);
            });
            const docRef = doc(this.fb.tasks as CollectionReference, uuid);
            deleteDoc(docRef);
        },
        // Group Actions
        async [CREATE_GROUP](newGroup: Partial<Group>) {
            const uuid = uuidv4();
            const group = {
                uuid,
                name: newGroup.name,
                taskOrder: [],
                dateCreated: new Date().getTime(),
                description: newGroup.description,
                sharedWith: newGroup.sharedWith,
                createdBy: useUserStore().uid || 'localUser',
            };
            const docRef = doc(this.fb.groups as CollectionReference, uuid);
            await setDoc(docRef, group);
            router.push({ name: 'group', params: { id: group.uuid } });

            return group;
        },
        [UPDATE_GROUP](updatedGroup: Partial<Group>) {
            const docRef = doc(
                this.fb.groups as CollectionReference,
                updatedGroup.uuid
            );
            updateDoc(docRef, { ...updatedGroup });
        },
        [DELETE_GROUP](uuid: string) {
            const tasks = this.getGroupTasks(uuid);
            tasks.forEach((task) => {
                this.deleteTask(task.uuid);
            });
            const docRef = doc(this.fb.groups as CollectionReference, uuid);
            deleteDoc(docRef);
        },
        [RESET_GROUP](uuid: string) {
            const tasks = this.getGroupTasks(uuid);
            tasks.forEach((task) => {
                const docRef = doc(
                    this.fb.tasks as CollectionReference,
                    task.uuid
                );
                updateDoc(docRef, { complete: false });
            });
        },
        setMeta(uuid: string, payload: any, update: boolean = true) {
            const metaRef = doc(this.fb.meta as CollectionReference, uuid);
            setDoc(metaRef, payload, { merge: update });
        },
        [SET_GROUP_ORDER](order: string[]) {
            setDoc(this.fb.user as DocumentReference, { order });
        },
        //TODO: 2 Bellow don't work :)
        [SET_STATE](state: Object) {
            this.$patch(state);
        },
        [RESET_STATE]() {
            this.$reset();
        },
    },
});
