import type { List, Task } from '@/model';
import { defineStore } from 'pinia';

export const useAppStore = defineStore({
    id: 'appStore',
    state: () => ({
        inbox: {
            taskOrder: [] as string[],
            tasks: [] as Task[],
        },
        lists: [
            {
                uuid: '1',
                name: 'Keep On Livin 🌭',
                taskOrder: [],
                tasks: [
                    {
                        uuid: '1',
                        header: 'Breathe',
                        body: 'this have no due date',
                        dateCreated: new Date(),
                        dateCompleted: null,
                        dueDate: null,
                    },
                    {
                        uuid: '2',
                        header: 'Sleep',
                        body: 'this is due on 29 of September',
                        dateCreated: new Date(),
                        dateCompleted: null,
                        dueDate: new Date(2022, 9, 29),
                    },
                    {
                        uuid: '3',
                        header: 'Wake Up',
                        body: 'this is due today',
                        dateCreated: new Date(),
                        dateCompleted: null,
                        dueDate: new Date(),
                    },
                ],
            },
            {
                uuid: '2',
                name: 'Empty List',
                taskOrder: [],
                tasks: [],
            },
        ] as List[],
    }),
    getters: {
        getLists: (state) => state.lists,
        getListById: (state) => (listId: string) =>
            state.lists.find((list) => list.uuid == listId),
    },
    actions: {},
});
