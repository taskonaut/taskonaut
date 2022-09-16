import type { Group, Task } from '@/model';
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
        groups: [
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
        ] as Group[],
    }),
    getters: {
        getGroups: (state) => state.groups,
        getGroupById: (state) => (groupId: string) =>
            state.groups.find((group) => group.uuid == groupId),
        getGroupTasks: (state) => (groupId: string) =>
            state.tasks.filter((task) => task.projectId == groupId),
        getInboxTasks: (state) => () =>
            state.tasks.filter((task) => !task.projectId),
        getTodayTasks: (state) => () => {
            const today = new Date().getDate();
            return state.tasks.filter(
                (task) => task.dueDate?.getDate() == today
            );
        },
    },
    actions: {
        toggleTask(taskId: string) {
            this.tasks.map((task) => {
                if (task.uuid == taskId) task.complete = !task.complete;
            });
        },
    },
});
