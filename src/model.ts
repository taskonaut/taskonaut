export interface Task {
    uuid: string;
    groupId: string;
    header: string;
    body: null | string;
    dateCreated: number;
    dueDate: null | number;
    complete: boolean;
    dateCompleted: null | number;
}

export interface Group {
    uuid: string;
    name: string;
    description: string;
    taskOrder: string[];
    dateCreated: number;
}
