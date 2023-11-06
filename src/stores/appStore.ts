import type { Group, Task } from '@/model';
import router from '@/router';
import {
    collection,
    doc,
    DocumentReference,
    updateDoc,
    CollectionReference,
    setDoc,
    where,
    query,
    onSnapshot,
} from '@firebase/firestore';
import { defineStore, storeToRefs } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import {
    CREATE_TASK,
    CREATE_GROUP,
    DELETE_GROUP,
    RESET_GROUP,
    UPDATE_GROUP,
    SET_STATE,
    RESET_STATE,
} from './actions';
import { db } from '@/includes/firebase';
import { useUserStore } from './userStore';
import * as date from '@/services/date.service';

export interface AppStore {
    ready: boolean;
    user: any;
    inbox: Task[];
    groups: Group[];
    sharedGroups: Group[];
    fb: {
        user: DocumentReference | null;
        groups: CollectionReference | null;
    };
}

export const useAppStore = defineStore({
    id: 'appStore',
    state: (): AppStore => ({
        ready: false,
        user: null,
        inbox: [],
        groups: [],
        sharedGroups: [],
        //move to export in firebase file
        fb: {
            user: null,
            groups: null,
        },
    }),
    getters: {
        getInbox: (state) => () => state.inbox,
        getGroups: (state) => state.groups,
        getSharedGroups: (state) => state.sharedGroups,
        getGroupById: (state) => (parentId: string) =>
            [...state.groups, ...state.sharedGroups].find(
                (group) => group.uuid == parentId
            ),
    },
    actions: {
        async syncFirebase() {
            //TODO export this
            const { uid } = storeToRefs(useUserStore());
            this.fb.user = doc(db, 'users', uid.value!);
            this.fb.groups = collection(db, 'groups');
            const groupsQuery = query(
                this.fb.groups,
                where('ownerId', '==', uid.value)
            );

            // const snapshotInbox = new Promise<void>((resolve) => {
            //     onSnapshot(this.fb.user!, (userDoc) => {
            //         const inboxArray = userDoc.data()?.tasks || [];
            //         this.inbox = inboxArray;
            //         resolve();
            //     });
            // });

            const snapshotGroup = new Promise<void>((resolve) => {
                onSnapshot(groupsQuery, (snapshot) => {
                    this.$patch((state) => {
                        snapshot.docChanges().forEach((change) => {
                            if (change.type === 'added') {
                                // Add new groups to the state
                                state.groups.push(
                                    change.doc.data() as unknown as Group
                                );
                            } else if (change.type === 'modified') {
                                // Find the existing group and update it
                                const index = state.groups.findIndex(
                                    (group) => group.id === change.doc.id
                                );
                                if (index !== -1) {
                                    state.groups[index] =
                                        change.doc.data() as unknown as Group;
                                }
                            } else if (change.type === 'removed') {
                                // Find the existing group and remove it
                                const index = state.groups.findIndex(
                                    (group) => group.id === change.doc.id
                                );
                                if (index !== -1) {
                                    state.groups.splice(index, 1);
                                }
                            }
                        });
                    });
                    resolve();
                });
            });
            // await snapshotInbox;
            await snapshotGroup;

            this.ready = true;
        },
        // Task Actions
        [CREATE_TASK](newTask: Partial<Task>) {
            const { uid } = storeToRefs(useUserStore());
            const task: Task = {
                uuid: uuidv4(),
                parentId: newTask.parentId || '',
                header: newTask.header!,
                body: newTask.body || undefined,
                dateCreated: date.getToday(),
                complete: false,
                dateCompleted: undefined,
                dueDate: newTask.dueDate || undefined,
                createdBy: uid.value || 'localUser',
                subtasks: [],
            };

            return task;
        },
        updateInbox(tasks: Task[]) {
            updateDoc(this.fb.user!, { tasks: [...tasks] });
        },
        // Group Actions
        async [CREATE_GROUP](newGroup: Partial<Group>) {
            const uuid = uuidv4();
            const group: Group = {
                uuid,
                name: newGroup.name!,
                tasks: [],
                dateCreated: new Date().getTime(),
                description: newGroup.description || '',
                sharedWith: newGroup.sharedWith || [],
                ownerId: useUserStore().uid || 'localUser',
            };
            const docRef = doc(this.fb.groups as CollectionReference, uuid);
            await setDoc(docRef, group);
            router.push({ name: 'group', params: { id: group.uuid } });

            return group;
        },
        async [UPDATE_GROUP](updatedGroup: Partial<Group>) {
            const docRef = doc(
                this.fb.groups as CollectionReference,
                updatedGroup.uuid
            );
            return updateDoc(docRef, { ...updatedGroup });
        },
        [DELETE_GROUP](uuid: string) {
            //TODO: implement
            return uuid;
        },
        [RESET_GROUP](uuid: string) {
            //TODO: implement
            return uuid;
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
