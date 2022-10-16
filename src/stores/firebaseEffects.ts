import { FirebaseCollections } from '@/firebaseConfig';
import type { Group, Task } from '@/model';
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
import { useAppStore } from './appStore';
import type { FirebaseAdapter } from './firebaseAdapter';
import { useUserStore } from './userStore';

export const registerFirestoreEffects = (adapter: FirebaseAdapter) => {
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
