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
                                'tasks',
                                store.getGroupById(result.groupId)?.createdBy
                            );
                        } else {
                            adapter.setDoc(result, 'tasks');
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
                            'tasks',
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
                        adapter.deleteDoc(args[0], 'tasks', group?.createdBy);
                        break;
                    case ADD_TO_TASK_ORDER:
                        adapter.updateDoc(
                            args[0],
                            {
                                taskOrder: (result as Group).taskOrder,
                            },
                            'groups',
                            (result as Group).createdBy
                        );
                        break;
                    case DELETE_FROM_TASK_ORDER:
                        adapter.updateDoc(
                            args[0],
                            {
                                taskOrder: (result as Group).taskOrder,
                            },
                            'groups',
                            (result as Group).createdBy
                        );
                        break;
                    case CREATE_GROUP:
                        break;
                    case UPDATE_GROUP:
                        break;
                    case RESET_GROUP:
                        break;
                    case DELETE_GROUP:
                        break;
                    case SET_TASK_ORDER:
                        break;
                    case SET_GROUP_ORDER:
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
