import type { List, Task } from '@/model';
import { defineStore } from 'pinia';

export const useAppStore = defineStore({
    id: 'appStore',
    state: () => ({
        tasks: [
            {
                uuid: '1',
                projectId: '1',
                header: 'Breathe',
                body: 'this have no due date',
                dateCreated: new Date(),
                complete: true,
                dateCompleted: null,
                dueDate: null,
            },
            {
                uuid: '2',
                projectId: '1',
                header: 'Sleep',
                body: 'this is due on 29 of September',
                dateCreated: new Date(),
                complete: false,
                dateCompleted: null,
                dueDate: new Date(2022, 9, 29),
            },
            {
                uuid: '3',
                projectId: '1',
                header: 'Wake Up',
                body: 'this is due today',
                dateCreated: new Date(),
                complete: false,
                dateCompleted: null,
                dueDate: new Date(),
            },
            {
                uuid: '4',
                projectId: null,
                header: 'Inbox Task',
                body: 'should be in inbox and today',
                dateCreated: new Date(),
                complete: false,
                dateCompleted: null,
                dueDate: new Date(),
            },
            {
                uuid: '4',
                projectId: '3',
                header: 'Task',
                body: 'should be in 3rd group and today',
                dateCreated: new Date(),
                complete: false,
                dateCompleted: null,
                dueDate: new Date(),
            },
        ] as Task[],
        lists: [
            {
                uuid: '1',
                name: 'Keep On Livin 🌭',
                taskOrder: [],
            },
            {
                uuid: '2',
                name: 'Empty List',
                taskOrder: [],
            },
            {
                uuid: '3',
                name: '3rd Group',
                taskOrder: [],
            },
        ] as List[],
    }),
    getters: {
        getLists: (state) => state.lists,
        getListById: (state) => (listId: string) =>
            state.lists.find((list) => list.uuid == listId),
        getProjectTasks: (state) => (projectId: string) =>
            state.tasks.filter((task) => task.projectId == projectId),
    },
    actions: {
        toggleTask(taskId: string) {
            this.tasks.map((task) => {
                if (task.uuid == taskId) task.complete = !task.complete;
            });
        },
    },
});
