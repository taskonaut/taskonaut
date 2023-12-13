import type { Task } from '@/model';

export function sortArray<Type>(array: Type[], sortArray: string[]): Type[] {
    return [...array].sort(
        (a: any, b: any) =>
            sortArray.indexOf(a.uuid) - sortArray.indexOf(b.uuid)
    );
}

export function filterTaskArray(taskId: string, array: Task[]): Task[] {
    const filteredArray: Task[] = [];
    for (const task of array) {
        if (task.uuid === taskId) {
            continue;
        }
        if (task.subtasks.length) {
            const filteredSubtasks: Task[] = filterTaskArray(
                taskId,
                task.subtasks
            );
            filteredArray.push({ ...task, subtasks: filteredSubtasks });
        } else {
            filteredArray.push(task);
        }
    }
    return filteredArray;
}

export function resetTaskArray(array: Task[]): Task[] {
    const resetArray: Task[] = [];
    for (const task of array) {
        if (task.complete) {
            task.complete = false;
        }
        if (task.subtasks.length) {
            const resetSubtasks: Task[] = resetTaskArray(task.subtasks);
            resetArray.push({ ...task, subtasks: resetSubtasks });
        } else {
            resetArray.push(task);
        }
    }
    return resetArray;
}

export function updateArrayTask(updatedTask: Task, array: Task[]): Task[] {
    return array.map((task) => {
        if (task.uuid === updatedTask.uuid) {
            // If the task matches, return the updatedTask preserving reactivity
            return { ...task, ...updatedTask };
        } else if (task.subtasks.length) {
            // If the task has subtasks, recursively update them
            return {
                ...task,
                subtasks: updateArrayTask(updatedTask, task.subtasks),
            };
        } else {
            // If neither condition is met, return the original task
            return task;
        }
    });
}
