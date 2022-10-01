export interface Task {
    uuid: string;
    groupId: undefined | string;
    header: string;
    body: undefined | string;
    dateCreated: number;
    dueDate: undefined | number;
    complete: boolean;
    dateCompleted: undefined | number;
}

export interface Group {
    uuid: string;
    name: string;
    description: string;
    taskOrder: string[];
    dateCreated: number;
}
