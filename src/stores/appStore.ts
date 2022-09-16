import type { List, Task } from '@/model';
import { defineStore } from 'pinia';

export const useAppStore = defineStore({
    id: 'appStore',
    state: () => ({
        lists: [
            {
                uuid: '1',
                name: 'various things',
                taskIds: ['1', '2'],
            },
            {
                uuid: '2',
                name: 'cool things',
                taskIds: ['1', '2'],
            },
        ] as List[],
        tasks: [
            {
                uuid: '1',
                header: 'this is sample task header',
                body: 'this have no due date',
                dateCreated: new Date(),
                dateCompleted: null,
                dueDate: null,
            },
            {
                uuid: '2',
                header: 'this is sample task header 2',
                body: 'this is due on 29 of September',
                dateCreated: new Date(),
                dateCompleted: null,
                dueDate: new Date(2022, 9, 29),
            },
            {
                uuid: '3',
                header: 'this is sample task header 2',
                body: 'this is due today',
                dateCreated: new Date(),
                dateCompleted: null,
                dueDate: new Date(),
            },
        ] as Task[],
    }),
    getters: {
        getLists: (state) => state.lists,
    },
    actions: {},
});
