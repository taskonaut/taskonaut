export interface Task {
    uuid: string;
    createdBy: string;
    groupId: undefined | string;
    header: string;
    body: undefined | string;
    dateCreated: number;
    dueDate: undefined | number;
    complete: boolean;
    dateCompleted: undefined | null | number;
    subTasks?: Task[];
}

export interface Group {
    uuid: string;
    createdBy: string;
    name: string;
    description: string;
    taskOrder: string[];
    dateCreated: number;
    sharedWith: string[];
}

export interface ShareRequest {
    from: string;
    groupId: string;
    to: string;
}
