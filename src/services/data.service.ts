import type { Group, Task } from '@/model';
import { useUserStore } from '@/stores/userStore';
import { v4 as uuidv4 } from 'uuid';

export async function createTask(newTask: Partial<Task>) {
    const task: Task = {
        uuid: uuidv4(),
        groupId: newTask.groupId!,
        name: newTask.name!,
        description: newTask.description || '',
        complete: false,
        dueDate: newTask.dueDate!,
        ownerUid: useUserStore().user!.uid,
        subtasks: [],
    };
    return task;
}

export async function createGroup(newGroup: Partial<Group>) {
    const uuid = uuidv4();
    const group: Group = {
        uuid,
        name: newGroup.name!,
        tasks: [],
        sharedWith: newGroup.sharedWith || [],
        ownerUid: useUserStore().user!.uid,
    };
    return group;
}
