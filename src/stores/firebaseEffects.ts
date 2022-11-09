import { FirebaseCollections } from '@/firebaseConfig';
import type { Group, Task } from '@/model';
import {
    ADD_SUB_TASK,
    ADD_TO_TASK_ORDER,
    CREATE_GROUP,
    CREATE_TASK,
    DELETE_FROM_TASK_ORDER,
    DELETE_GROUP,
    DELETE_SUB_TASK,
    DELETE_TASK,
    RESET_GROUP,
    SET_GROUP_ORDER,
    SET_TASK_ORDER,
    UPDATE_GROUP,
    UPDATE_SUB_TASK,
    UPDATE_TASK,
    SET_STATE,
    RESET_STATE,
} from './actions';
import { useAppStore, type AppStore } from './appStore';
import type { FirebaseAdapter } from './firebaseAdapter';
import { useUserStore } from './userStore';

let ADAPTER: FirebaseAdapter;

export const updateTask = (taskId: string) => {
    const task = useAppStore().getTaskById(taskId);
    const group = useAppStore().getGroupById(task!.groupId!);
    ADAPTER.updateDoc(
        task?.uuid!,
        task!,
        FirebaseCollections.Tasks,
        group?.createdBy
    );
};

export const registerFirestoreEffects = (adapter: FirebaseAdapter) => {
    ADAPTER = adapter;
    useAppStore().$onAction(
        ({
            name,
            store,
            args, // array of parameters passed to the action
            after,
            onError,
        }) => {
            after((result) => {
                console.info(
                    `%cFirebase Effect: ${name} action triggered`,
                    'color:yellow'
                );
                let group;
                switch (name) {
                    case CREATE_TASK:
                        result = result as Task;
                        if (result.groupId) {
                            adapter.setDoc(
                                result,
                                FirebaseCollections.Tasks,
                                store.getGroupById(result.groupId)?.createdBy
                            );
                        } else {
                            adapter.setDoc(result, FirebaseCollections.Tasks);
                        }
                        break;
                    case UPDATE_TASK:
                        result = result as Task;
                        if (result.groupId) {
                            group = store.getGroupById(result.groupId!);
                        } else {
                            group = undefined;
                        }
                        adapter.updateDoc(
                            result.uuid!,
                            result,
                            FirebaseCollections.Tasks,
                            group?.createdBy
                        );
                        break;
                    case DELETE_TASK:
                        result = result as Task;
                        if (result.groupId) {
                            group = store.getGroupById(result.groupId);
                        } else {
                            group = undefined;
                        }
                        adapter.deleteDoc(
                            args[0],
                            FirebaseCollections.Tasks,
                            group?.createdBy
                        );
                        break;
                    case ADD_TO_TASK_ORDER:
                        adapter.updateDoc(
                            args[0],
                            {
                                taskOrder: (result as Group).taskOrder,
                            },
                            FirebaseCollections.Groups,
                            (result as Group).createdBy
                        );
                        break;
                    case DELETE_FROM_TASK_ORDER:
                        adapter.updateDoc(
                            args[0],
                            {
                                taskOrder: (result as Group).taskOrder,
                            },
                            FirebaseCollections.Groups,
                            (result as Group).createdBy
                        );
                        break;
                    case CREATE_GROUP:
                        result = result as Group;
                        adapter.setDoc(result, FirebaseCollections.Groups);

                        if ((result as Group).sharedWith) {
                            (result as Group).sharedWith.forEach((email) =>
                                adapter!.createShareRequest(
                                    useUserStore().uid,
                                    email,
                                    (result as Group).uuid!
                                )
                            );
                        }
                        break;
                    case UPDATE_GROUP:
                        // TODO
                        break;
                    case RESET_GROUP:
                        store.getGroupTasks(args[0]).forEach((task) => {
                            adapter.updateDoc(
                                task.uuid,
                                {
                                    complete: task.complete,
                                    dateCompleted: task.dateCompleted,
                                },
                                FirebaseCollections.Tasks
                            );
                        });
                        break;
                    case DELETE_GROUP:
                        adapter.deleteDoc(args[0], FirebaseCollections.Groups);
                        break;
                    case SET_TASK_ORDER:
                        adapter.updateDoc(
                            args[0],
                            { taskOrder: args[1] },
                            FirebaseCollections.Groups,
                            store.getGroupById(args[0])?.createdBy
                        );
                        break;
                    case SET_GROUP_ORDER:
                        adapter.setStringArrayAsDoc(
                            Object.assign({}, store.groupOrder),
                            FirebaseCollections.Groups
                        );
                        break;
                    case ADD_SUB_TASK:
                    case UPDATE_SUB_TASK:
                    case DELETE_SUB_TASK:
                        updateTask(result as string);
                        break;
                    case SET_STATE:
                        adapter.setStringArrayAsDoc(
                            Object.assign({}, store.groupOrder),
                            FirebaseCollections.Groups
                        );
                        (args[0] as AppStore).tasks.forEach((task) => {
                            if (task.groupId) {
                                adapter.setDoc(
                                    task,
                                    FirebaseCollections.Tasks,
                                    store.getGroupById(task.groupId)?.createdBy
                                );
                            } else {
                                adapter.setDoc(task, FirebaseCollections.Tasks);
                            }
                        });
                        (args[0] as AppStore).groups.forEach((result) => {
                            result = result as Group;
                            adapter.setDoc(result, FirebaseCollections.Groups);

                            if ((result as Group).sharedWith) {
                                (result as Group).sharedWith.forEach((email) =>
                                    adapter!.createShareRequest(
                                        useUserStore().uid,
                                        email,
                                        (result as Group).uuid!
                                    )
                                );
                            }
                        });
                        break;
                    case RESET_STATE:
                        adapter.getDocs('tasks').then((data) =>
                            data.forEach((task) => {
                                adapter.deleteDoc(
                                    task.uuid,
                                    FirebaseCollections.Tasks
                                );
                            })
                        );
                        adapter.setStringArrayAsDoc(
                            [],
                            FirebaseCollections.Groups
                        );
                        adapter.getDocs('groups').then((data) =>
                            data.forEach((task) => {
                                adapter.deleteDoc(
                                    task.uuid,
                                    FirebaseCollections.Groups
                                );
                            })
                        );
                        break;
                    default:
                        break;
                }
            });
            onError((error) => {
                console.error(error);
                throw new Error(
                    '[Firestore Effects] Error, something went wrong'
                );
            });
        }
    );
};
